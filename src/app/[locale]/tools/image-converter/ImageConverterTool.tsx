"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

type Format = "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "ico";

const formats: { label: string; value: Format }[] = [
  { label: "JPG", value: "image/jpeg" },
  { label: "PNG", value: "image/png" },
  { label: "WebP", value: "image/webp" },
  { label: "AVIF", value: "image/avif" },
  { label: "ICO", value: "ico" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function createIco(canvas: HTMLCanvasElement): Blob {
  const sizes = [32, 16];
  const images: ArrayBuffer[] = [];

  for (const size of sizes) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(canvas, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const bmp = new ArrayBuffer(40 + imageData.data.length);
    const view = new DataView(bmp);
    view.setUint32(0, 40, true); // header size
    view.setInt32(4, size, true); // width
    view.setInt32(8, size * 2, true); // height (double for ICO)
    view.setUint16(12, 1, true); // planes
    view.setUint16(14, 32, true); // bits per pixel
    view.setUint32(20, imageData.data.length, true); // image size
    // Write pixel data (bottom-up, BGRA)
    const pixels = new Uint8Array(bmp, 40);
    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const src = (y * size + x) * 4;
        const dst = ((size - 1 - y) * size + x) * 4;
        pixels[dst] = imageData.data[src + 2]; // B
        pixels[dst + 1] = imageData.data[src + 1]; // G
        pixels[dst + 2] = imageData.data[src]; // R
        pixels[dst + 3] = imageData.data[src + 3]; // A
      }
    }
    images.push(bmp);
  }

  const headerSize = 6 + sizes.length * 16;
  let totalSize = headerSize;
  images.forEach((img) => (totalSize += img.byteLength));

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, sizes.length, true); // count

  let offset = headerSize;
  sizes.forEach((size, i) => {
    const entryOffset = 6 + i * 16;
    view.setUint8(entryOffset, size < 256 ? size : 0);
    view.setUint8(entryOffset + 1, size < 256 ? size : 0);
    view.setUint8(entryOffset + 2, 0); // palette
    view.setUint8(entryOffset + 3, 0); // reserved
    view.setUint16(entryOffset + 4, 1, true); // planes
    view.setUint16(entryOffset + 6, 32, true); // bits
    view.setUint32(entryOffset + 8, images[i].byteLength, true); // size
    view.setUint32(entryOffset + 12, offset, true); // offset
    offset += images[i].byteLength;
  });

  const output = new Uint8Array(buffer);
  let pos = headerSize;
  images.forEach((img) => {
    output.set(new Uint8Array(img), pos);
    pos += img.byteLength;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}

export default function ImageConverterTool() {
  const t = useTranslations("tools.image-converter");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      let blob: Blob;

      if (format === "ico") {
        blob = createIco(canvas);
      } else {
        const hasQuality = format === "image/jpeg" || format === "image/webp" || format === "image/avif";
        blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b && b.size > 0) resolve(b);
              else reject(new Error("Conversion not supported"));
            },
            format,
            hasQuality ? quality / 100 : undefined
          );
        });

        if (format === "image/avif") setAvifSupported(true);
      }

      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      if (format === "image/avif") setAvifSupported(false);
    } finally {
      setProcessing(false);
    }
  }, [file, format, quality]);

  const download = () => {
    if (!result) return;
    const ext = format === "ico" ? "ico" : format.split("/")[1];
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `converted.${ext}`;
    a.click();
  };

  const showQuality = format === "image/jpeg" || format === "image/webp" || format === "image/avif";

  return (
    <ToolLayout toolSlug="image-converter">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={preview} />

        {file && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("select_format")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setFormat(f.value); setResult(null); setAvifSupported(null); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        format === f.value
                          ? "bg-teal text-white"
                          : "bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {showQuality && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("quality")} ({quality}%)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
              )}
            </div>

            {avifSupported === false && (
              <p className="text-sm text-warning">{t("unsupported_avif")}</p>
            )}

            <button
              onClick={convert}
              disabled={processing}
              className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {processing ? tc("processing") : t("convert")}
            </button>

            {result && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Original</p>
                    <p className="font-semibold">{formatSize(file.size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Converted</p>
                    <p className="font-semibold text-teal">{formatSize(result.blob.size)}</p>
                  </div>
                </div>
                <button
                  onClick={download}
                  className="w-full bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                >
                  {t("download")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

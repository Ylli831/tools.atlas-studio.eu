"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

export default function FaviconGeneratorTool() {
  const t = useTranslations("tools.favicon-generator");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{ size: number; url: string }[]>([]);

  const handleFile = useCallback((files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
    setGenerated([]);
  }, []);

  const generate = async () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => { img.onload = resolve; });

    const results: { size: number; url: string }[] = [];
    for (const size of SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, size, size);
      const url = canvas.toDataURL("image/png");
      results.push({ size, url });
    }
    setGenerated(results);
    URL.revokeObjectURL(img.src);
  };

  const downloadOne = (item: { size: number; url: string }) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.size === 180 ? "apple-touch-icon.png" : item.size === 192 ? "android-chrome-192x192.png" : item.size === 512 ? "android-chrome-512x512.png" : `favicon-${item.size}x${item.size}.png`;
    a.click();
  };

  const downloadIco = async () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => { img.onload = resolve; });

    const icoSizes = [16, 32, 48];
    const pngBuffers: ArrayBuffer[] = [];

    for (const size of icoSizes) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
      pngBuffers.push(await blob.arrayBuffer());
    }

    // ICO format: header + directory entries + image data
    const headerSize = 6;
    const dirEntrySize = 16;
    const dataOffset = headerSize + dirEntrySize * icoSizes.length;
    let totalSize = dataOffset;
    pngBuffers.forEach((buf) => { totalSize += buf.byteLength; });

    const ico = new ArrayBuffer(totalSize);
    const view = new DataView(ico);

    // Header
    view.setUint16(0, 0, true); // reserved
    view.setUint16(2, 1, true); // type: icon
    view.setUint16(4, icoSizes.length, true); // count

    let offset = dataOffset;
    icoSizes.forEach((size, i) => {
      const entryOffset = headerSize + i * dirEntrySize;
      view.setUint8(entryOffset, size < 256 ? size : 0); // width
      view.setUint8(entryOffset + 1, size < 256 ? size : 0); // height
      view.setUint8(entryOffset + 2, 0); // color count
      view.setUint8(entryOffset + 3, 0); // reserved
      view.setUint16(entryOffset + 4, 1, true); // planes
      view.setUint16(entryOffset + 6, 32, true); // bits per pixel
      view.setUint32(entryOffset + 8, pngBuffers[i].byteLength, true); // size
      view.setUint32(entryOffset + 12, offset, true); // offset
      new Uint8Array(ico, offset).set(new Uint8Array(pngBuffers[i]));
      offset += pngBuffers[i].byteLength;
    });

    const blob = new Blob([ico], { type: "image/x-icon" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon.ico";
    a.click();
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(img.src);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    generated.forEach((g) => URL.revokeObjectURL(g.url));
    setFile(null);
    setPreview(null);
    setGenerated([]);
  };

  return (
    <ToolLayout toolSlug="favicon-generator">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFile} preview={preview} />

        {file && generated.length === 0 && (
          <button
            onClick={generate}
            className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        )}

        {generated.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {generated.map((item) => (
                <div key={item.size} className="bg-card border border-border rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center h-20 mb-2">
                    <img src={item.url} alt="" style={{ width: Math.min(item.size, 64), height: Math.min(item.size, 64) }} className="image-rendering-pixelated" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.size}&times;{item.size}</p>
                  <button
                    onClick={() => downloadOne(item)}
                    className="text-xs text-teal hover:underline"
                  >
                    {tc("download")}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadIco}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download_ico")}
              </button>
              <button
                onClick={reset}
                className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {tc("reset")}
              </button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

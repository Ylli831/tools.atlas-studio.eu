"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import imageCompression from "browser-image-compression";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressorTool() {
  const t = useTranslations("tools.image-compressor");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: (file.size / (1024 * 1024)) * (quality / 100),
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality / 100,
      });
      const url = URL.createObjectURL(compressed);
      setResult({ blob: compressed, url });
    } catch {
      // Compression failed
    } finally {
      setProcessing(false);
    }
  }, [file, quality, maxWidth]);

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `compressed-${file?.name || "image.jpg"}`;
    a.click();
  };

  const savings = file && result
    ? Math.round((1 - result.blob.size / file.size) * 100)
    : 0;

  return (
    <ToolLayout toolSlug="image-compressor">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={preview} />

        {file && (
          <>
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("max_width")} (px)
                </label>
                <input
                  type="number"
                  min={100}
                  max={4096}
                  step={100}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            <button
              onClick={compress}
              disabled={processing}
              className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {processing ? tc("processing") : t("compress")}
            </button>

            {result && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("original_size")}</p>
                    <p className="text-lg font-semibold text-foreground">{formatSize(file.size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("compressed_size")}</p>
                    <p className="text-lg font-semibold text-teal">{formatSize(result.blob.size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("savings")}</p>
                    <p className={`text-lg font-semibold ${savings > 0 ? "text-success" : "text-warning"}`}>
                      {savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <img
                    src={result.url}
                    alt="Compressed"
                    className="max-h-64 rounded-lg object-contain"
                  />
                </div>

                <button
                  onClick={download}
                  className="w-full bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                >
                  {tc("download")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

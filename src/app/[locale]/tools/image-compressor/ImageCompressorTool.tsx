"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import imageCompression from "browser-image-compression";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface CompressedFile {
  original: File;
  originalUrl: string;
  blob: Blob;
  url: string;
}

export default function ImageCompressorTool() {
  const t = useTranslations("tools.image-compressor");
  const tc = useTranslations("common");
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processing, setProcessing] = useState(false);
  const [compareSlider, setCompareSlider] = useState(50);
  const [activeCompare, setActiveCompare] = useState<number | null>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setResults([]);
    if (selectedFiles.length === 1) {
      setPreview(URL.createObjectURL(selectedFiles[0]));
    } else {
      setPreview(null);
    }
  }, []);

  const compress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResults([]);

    const compressed: CompressedFile[] = [];
    for (const file of files) {
      try {
        const result = await imageCompression(file, {
          maxSizeMB: (file.size / (1024 * 1024)) * (quality / 100),
          maxWidthOrHeight: maxWidth,
          useWebWorker: true,
          initialQuality: quality / 100,
        });
        compressed.push({
          original: file,
          originalUrl: URL.createObjectURL(file),
          blob: result,
          url: URL.createObjectURL(result),
        });
      } catch {
        // Skip failed files
      }
    }
    setResults(compressed);
    setProcessing(false);
  }, [files, quality, maxWidth]);

  const downloadOne = (r: CompressedFile) => {
    const a = document.createElement("a");
    a.href = r.url;
    a.download = `compressed-${r.original.name}`;
    a.click();
  };

  const downloadAll = () => {
    results.forEach((r) => downloadOne(r));
  };

  const totalOriginal = results.reduce((sum, r) => sum + r.original.size, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.blob.size, 0);
  const totalSavings = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  const handleCompareMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setCompareSlider(x);
  };

  return (
    <ToolLayout toolSlug="image-compressor">
      <div className="space-y-6">
        <FileUpload
          accept="image/*"
          onFileSelect={handleFileSelect}
          preview={preview}
          multiple
        />

        {files.length > 0 && (
          <>
            {files.length > 1 && (
              <p className="text-sm text-muted-foreground">
                {files.length} {t("files_selected")}
              </p>
            )}

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
                  className="w-full accent-[var(--teal)]"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{t("smaller")}</span>
                  <span>{t("better_quality")}</span>
                </div>
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
              {processing ? tc("processing") : t("compress")}{files.length > 1 ? ` (${files.length})` : ""}
            </button>

            {results.length > 0 && (
              <div className="space-y-4">
                {/* Summary stats */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("original_size")}</p>
                      <p className="text-lg font-semibold text-foreground">{formatSize(totalOriginal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("compressed_size")}</p>
                      <p className="text-lg font-semibold text-teal">{formatSize(totalCompressed)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("savings")}</p>
                      <p className={`text-lg font-semibold ${totalSavings > 0 ? "text-success" : "text-warning"}`}>
                        {totalSavings > 0 ? `-${totalSavings}%` : `+${Math.abs(totalSavings)}%`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Before/After compare for single images */}
                {results.length === 1 && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">{t("compare")}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{t("original_label")}</span>
                        <span>{t("compressed_label")}</span>
                      </div>
                    </div>
                    <div
                      ref={compareRef}
                      className="relative overflow-hidden rounded-lg cursor-col-resize select-none"
                      onMouseMove={handleCompareMove}
                      style={{ aspectRatio: "auto" }}
                    >
                      {/* Compressed (bottom layer) */}
                      <img
                        src={results[0].url}
                        alt="Compressed"
                        className="w-full block"
                        draggable={false}
                      />
                      {/* Original (top layer, clipped) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${compareSlider}%` }}
                      >
                        <img
                          src={results[0].originalUrl}
                          alt="Original"
                          className="w-full block"
                          style={{ width: `${(100 / compareSlider) * 100}%`, maxWidth: "none" }}
                          draggable={false}
                        />
                      </div>
                      {/* Divider */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                        style={{ left: `${compareSlider}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Results list for batch */}
                {results.length > 1 && (
                  <div className="bg-card border border-border rounded-xl divide-y divide-border">
                    {results.map((r, i) => {
                      const savings = Math.round((1 - r.blob.size / r.original.size) * 100);
                      return (
                        <div key={i} className="flex items-center justify-between p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={r.url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-foreground truncate">{r.original.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatSize(r.original.size)} → {formatSize(r.blob.size)}
                                <span className={`ml-2 font-medium ${savings > 0 ? "text-success" : "text-warning"}`}>
                                  {savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (activeCompare === i) {
                                setActiveCompare(null);
                              } else {
                                setActiveCompare(i);
                                setCompareSlider(50);
                              }
                            }}
                            className="text-xs text-teal hover:underline flex-shrink-0"
                          >
                            {activeCompare === i ? t("hide_compare") : t("show_compare")}
                          </button>
                          <button
                            onClick={() => downloadOne(r)}
                            className="text-xs text-teal hover:underline flex-shrink-0"
                          >
                            {tc("download")}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Batch compare viewer */}
                {results.length > 1 && activeCompare !== null && results[activeCompare] && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div
                      ref={compareRef}
                      className="relative overflow-hidden rounded-lg cursor-col-resize select-none"
                      onMouseMove={handleCompareMove}
                    >
                      <img src={results[activeCompare].url} alt="Compressed" className="w-full block" draggable={false} />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: `${compareSlider}%` }}>
                        <img
                          src={results[activeCompare].originalUrl}
                          alt="Original"
                          className="w-full block"
                          style={{ width: `${(100 / compareSlider) * 100}%`, maxWidth: "none" }}
                          draggable={false}
                        />
                      </div>
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${compareSlider}%` }}>
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Download button */}
                <button
                  onClick={results.length === 1 ? () => downloadOne(results[0]) : downloadAll}
                  className="w-full bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                >
                  {results.length === 1 ? tc("download") : t("download_all")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function PdfCompressTool() {
  const t = useTranslations("tools.pdf-compress");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [scale, setScale] = useState(1.5);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    url: string;
  } | null>(null);

  const handleFileSelect = useCallback(
    (files: File[]) => {
      const selectedFile = files[0];
      if (!selectedFile) return;
      setError(null);
      setFile(selectedFile);
      setResult(null);
    },
    []
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const newPdf = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // Render each page to canvas at scaled resolution, then embed as JPEG
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(width * scale);
        canvas.height = Math.floor(height * scale);
        const ctx = canvas.getContext("2d")!;

        // Use pdf.js to render the page to canvas
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdfJsDoc = await loadingTask.promise;
        const pdfPage = await pdfJsDoc.getPage(i + 1);

        const viewport = pdfPage.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pdfPage.render({ canvasContext: ctx, viewport }).promise;

        // Convert canvas to JPEG blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b!),
            "image/jpeg",
            quality
          );
        });
        const jpegBytes = new Uint8Array(await blob.arrayBuffer());
        const jpegImage = await newPdf.embedJpg(jpegBytes);

        const newPage = newPdf.addPage([width, height]);
        newPage.drawImage(jpegImage, {
          x: 0,
          y: 0,
          width,
          height,
        });

        pdfJsDoc.destroy();
      }

      const compressedBytes = await newPdf.save();
      const compressedBlob = new Blob([new Uint8Array(compressedBytes) as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(compressedBlob);

      setResult({
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        url,
      });
    } catch {
      setError(tc("error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `compressed-${file.name}`;
    a.click();
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError(null);
    setQuality(0.7);
    setScale(1.5);
  };

  const savings = result
    ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))
    : 0;

  return (
    <ToolLayout toolSlug="pdf-compress">
      <div className="space-y-6">
        <FileUpload accept="application/pdf" onFileSelect={handleFileSelect} />

        {error && <p className="text-sm text-danger">{error}</p>}

        {file && !result && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatSize(file.size)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("quality")} — {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-teal"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{t("smaller_file")}</span>
                <span>{t("better_quality")}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("resolution")} — {scale}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-teal"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{t("low_res")}</span>
                <span>{t("high_res")}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCompress}
                disabled={processing}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {processing ? tc("processing") : t("compress")}
              </button>
              <button
                onClick={handleReset}
                className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {tc("reset")}
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("original_size")}</p>
                <p className="text-sm font-semibold text-foreground">{formatSize(result.originalSize)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("compressed_size")}</p>
                <p className="text-sm font-semibold text-foreground">{formatSize(result.compressedSize)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("savings")}</p>
                <p className={`text-sm font-semibold ${savings > 0 ? "text-success" : "text-foreground"}`}>
                  {savings > 0 ? `-${savings}%` : t("no_savings")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {tc("download")}
              </button>
              <button
                onClick={handleReset}
                className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {tc("reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

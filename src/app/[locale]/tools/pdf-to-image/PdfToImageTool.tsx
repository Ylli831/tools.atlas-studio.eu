"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function PdfToImageTool() {
  const t = useTranslations("tools.pdf-to-image");
  const tc = useTranslations("common");
  const [images, setImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");

  const handleFile = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setProcessing(true);
    setImages([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const results: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        results.push(canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.92 : undefined));
      }

      setImages(results);
    } catch {
      // Error processing PDF
    } finally {
      setProcessing(false);
    }
  }, [scale, format]);

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `page-${index + 1}.${format}`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => downloadImage(img, i));
  };

  return (
    <ToolLayout toolSlug="pdf-to-image">
      <div className="space-y-6">
        <FileUpload
          accept="application/pdf"
          onFileSelect={handleFile}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("scale")}
            </label>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value={1}>1x (72 DPI)</option>
              <option value={2}>2x (144 DPI)</option>
              <option value={3}>3x (216 DPI)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("format")}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>
        </div>

        {processing && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">{tc("processing")}</p>
          </div>
        )}

        {images.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("pages_converted", { count: images.length })}
              </p>
              <button
                onClick={downloadAll}
                className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download_all")}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="bg-card border border-border rounded-lg overflow-hidden group">
                  <img src={img} alt={`Page ${index + 1}`} className="w-full" />
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("page")} {index + 1}
                    </span>
                    <button
                      onClick={() => downloadImage(img, index)}
                      className="text-xs text-teal hover:underline"
                    >
                      {tc("download")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

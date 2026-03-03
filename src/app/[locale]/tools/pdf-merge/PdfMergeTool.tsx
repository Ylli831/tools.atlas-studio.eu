"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

interface PdfItem {
  file: File;
  name: string;
  id: string;
}

export default function PdfMergeTool() {
  const t = useTranslations("tools.pdf-merge");
  const tc = useTranslations("common");
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const newPdfs = files.map((file) => ({
      file,
      name: file.name,
      id: crypto.randomUUID(),
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
  }, []);

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setPdfs((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, item);
      return copy;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const mergePdfs = async () => {
    if (pdfs.length < 2) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfs) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Error merging
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout toolSlug="pdf-merge">
      <div className="space-y-6">
        <FileUpload
          accept="application/pdf"
          multiple
          onFileSelect={handleFiles}
        />

        {pdfs.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">{t("drag_to_reorder")}</p>
            <div className="space-y-2">
              {pdfs.map((pdf, index) => (
                <div
                  key={pdf.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 cursor-move group ${dragIndex === index ? "opacity-50" : ""}`}
                >
                  <span className="text-sm font-mono text-muted-foreground w-6">{index + 1}.</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 flex-shrink-0">
                    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-sm text-foreground flex-1 truncate">{pdf.name}</span>
                  <span className="text-xs text-muted-foreground">{formatSize(pdf.file.size)}</span>
                  <button
                    onClick={() => removePdf(pdf.id)}
                    className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={mergePdfs}
                disabled={processing || pdfs.length < 2}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {processing ? tc("processing") : t("merge")}
              </button>
              <button
                onClick={() => setPdfs([])}
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

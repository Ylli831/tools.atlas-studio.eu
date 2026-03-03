"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

function parsePageRanges(input: string, max: number): number[] | null {
  const pages = new Set<number>();
  const parts = input.split(",").map((s) => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b > max || a > b) return null;
      for (let i = a; i <= b; i++) pages.add(i);
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > max) return null;
      pages.add(n);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

export default function PdfPageExtractorTool() {
  const t = useTranslations("tools.pdf-page-extractor");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { trackOutput } = useToolAnalytics("pdf-page-extractor");

  const handleFile = async ([f]: File[]) => {
    setError("");
    setFile(f);
    setPageCount(0);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
    } catch {
      setError(t("load_error"));
    }
  };

  const extract = async () => {
    if (!file || !pageRange.trim()) return;
    setError("");
    const pages = parsePageRanges(pageRange, pageCount);
    if (!pages || pages.length === 0) {
      setError(t("invalid_range", { max: pageCount }));
      return;
    }
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, pages.map((p) => p - 1));
      copied.forEach((page) => newDoc.addPage(page));
      const bytes = await newDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `extracted-pages-${pages.join(",")}.pdf`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
      trackOutput("pdf");
    } catch {
      setError(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolSlug="pdf-page-extractor">
      <div className="space-y-5">
        <FileUpload
          accept=".pdf"
          onFileSelect={handleFile}
        />

        {file && pageCount > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-xl px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="font-medium text-foreground">{file.name}</span>
              <span>— {t("page_count", { count: pageCount })}</span>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("range_label")}</label>
              <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)}
                placeholder={t("range_placeholder")}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
              <p className="text-xs text-muted-foreground mt-1">{t("range_hint")}</p>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button onClick={extract} disabled={!pageRange.trim() || loading}
              className="flex items-center gap-2 bg-teal text-white font-medium px-6 py-2.5 rounded-xl hover:bg-teal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />{tc("processing")}</>
              ) : (
                <>{t("extract_download")}</>
              )}
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

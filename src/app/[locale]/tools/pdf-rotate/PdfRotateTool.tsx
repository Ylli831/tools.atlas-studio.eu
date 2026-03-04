"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

type RotationDegree = 0 | 90 | 180 | 270;

interface PageRotation {
  pageIndex: number;
  rotation: RotationDegree;
}

export default function PdfRotateTool() {
  const t = useTranslations("tools.pdf-rotate");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"all" | "individual">("all");
  const [globalRotation, setGlobalRotation] = useState<RotationDegree>(90);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);
    setPageRotations([]);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();
      setPageCount(count);
      setPageRotations(
        Array.from({ length: count }, (_, i) => ({
          pageIndex: i,
          rotation: 90 as RotationDegree,
        }))
      );
    } catch {
      setError(t("load_error"));
      setFile(null);
      setPageCount(0);
    }
  }, [t]);

  const updatePageRotation = (pageIndex: number, rotation: RotationDegree) => {
    setPageRotations((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, rotation } : p))
    );
  };

  const handleRotate = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();

      pages.forEach((page, index) => {
        const deg =
          mode === "all"
            ? globalRotation
            : pageRotations[index]?.rotation ?? 0;
        if (deg !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + deg));
        }
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rotated-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(tc("error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPageRotations([]);
    setError(null);
    setMode("all");
    setGlobalRotation(90);
  };

  const rotationOptions: RotationDegree[] = [90, 180, 270];

  return (
    <ToolLayout toolSlug="pdf-rotate">
      <div className="space-y-6">
        <FileUpload accept="application/pdf" onFileSelect={handleFileSelect} />

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {file && pageCount > 0 && (
          <>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">{file.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("page_count", { count: pageCount })}
                </span>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMode("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === "all"
                      ? "bg-teal text-white"
                      : "bg-surface text-foreground hover:bg-border"
                  }`}
                >
                  {t("apply_to_all")}
                </button>
                <button
                  onClick={() => setMode("individual")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === "individual"
                      ? "bg-teal text-white"
                      : "bg-surface text-foreground hover:bg-border"
                  }`}
                >
                  {t("apply_individually")}
                </button>
              </div>

              {mode === "all" ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("rotation")}
                  </label>
                  <div className="flex gap-2">
                    {rotationOptions.map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setGlobalRotation(deg)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          globalRotation === deg
                            ? "bg-teal text-white"
                            : "bg-surface text-foreground hover:bg-border"
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pageRotations.map((pr) => (
                    <div
                      key={pr.pageIndex}
                      className="flex items-center justify-between bg-surface rounded-lg px-4 py-2"
                    >
                      <span className="text-sm text-foreground">
                        {t("page", { num: pr.pageIndex + 1 })}
                      </span>
                      <div className="flex gap-1.5">
                        {([0, ...rotationOptions] as RotationDegree[]).map((deg) => (
                          <button
                            key={deg}
                            onClick={() => updatePageRotation(pr.pageIndex, deg)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              pr.rotation === deg
                                ? "bg-teal text-white"
                                : "bg-card text-foreground hover:bg-border"
                            }`}
                          >
                            {deg === 0 ? "0°" : `${deg}°`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRotate}
                disabled={processing}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {processing ? tc("processing") : t("rotate_download")}
              </button>
              <button
                onClick={handleReset}
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

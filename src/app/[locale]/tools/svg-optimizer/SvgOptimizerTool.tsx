"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function optimizeSvg(svgString: string): string {
  let result = svgString;

  // Remove XML declaration
  result = result.replace(/<\?xml[^?]*\?>\s*/gi, "");

  // Remove comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Remove DOCTYPE
  result = result.replace(/<!DOCTYPE[^>]*>/gi, "");

  // Remove editor metadata (Inkscape, Illustrator, Sketch, etc.)
  result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  result = result.replace(/<sodipodi:[^>]*\/>/gi, "");
  result = result.replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/gi, "");
  result = result.replace(/<inkscape:[^>]*\/>/gi, "");
  result = result.replace(/<inkscape:[^>]*>[\s\S]*?<\/inkscape:[^>]*>/gi, "");

  // Remove editor-specific namespaces and attributes
  result = result.replace(/\s+xmlns:inkscape="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:sodipodi="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:dc="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:cc="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:rdf="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:svg="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:sketch="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:i="[^"]*"/gi, "");
  result = result.replace(/\s+xmlns:serif="[^"]*"/gi, "");

  // Remove editor-specific attributes
  result = result.replace(/\s+inkscape:[a-z-]+="[^"]*"/gi, "");
  result = result.replace(/\s+sodipodi:[a-z-]+="[^"]*"/gi, "");
  result = result.replace(/\s+sketch:[a-z-]+="[^"]*"/gi, "");
  result = result.replace(/\s+serif:[a-z-]+="[^"]*"/gi, "");

  // Remove data-name attributes
  result = result.replace(/\s+data-name="[^"]*"/gi, "");

  // Remove empty id attributes
  result = result.replace(/\s+id=""/g, "");

  // Remove unnecessary attributes
  result = result.replace(/\s+version="[^"]*"/gi, "");
  result = result.replace(/\s+xml:space="[^"]*"/gi, "");

  // Remove xmlns:xlink if xlink: is not used in the rest of the document
  const hasXlinkUsage = /xlink:(?!xmlns)/.test(result.replace(/xmlns:xlink="[^"]*"/g, ""));
  if (!hasXlinkUsage) {
    result = result.replace(/\s+xmlns:xlink="[^"]*"/gi, "");
  }

  // Remove empty groups: <g></g>
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(/<g\s*>\s*<\/g>/gi, "");
    result = result.replace(/<g>\s*<\/g>/gi, "");
  }

  // Collapse groups with no attributes that have a single child
  prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(/<g\s*>\s*(<(?!g[\s>])[^]*?)\s*<\/g>/gi, "$1");
  }

  // Remove empty defs
  result = result.replace(/<defs\s*>\s*<\/defs>/gi, "");
  result = result.replace(/<defs\/>/gi, "");

  // Remove title and desc elements (editor metadata)
  result = result.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");
  result = result.replace(/<desc[^>]*>[\s\S]*?<\/desc>/gi, "");

  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, "><");

  // Clean up multiple spaces in attributes
  result = result.replace(/\s{2,}/g, " ");

  // Trim
  result = result.trim();

  return result;
}

export default function SvgOptimizerTool() {
  const t = useTranslations("tools.svg-optimizer");
  const tc = useTranslations("common");
  const [originalSvg, setOriginalSvg] = useState("");
  const [optimizedSvg, setOptimizedSvg] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setError("Please upload an SVG file");
      return;
    }
    setFileName(file.name);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setOriginalSvg(content);
      setOriginalSize(new Blob([content]).size);
      setOptimizedSvg("");
      setOptimizedSize(0);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setError("Please upload an SVG file");
      return;
    }
    setFileName(file.name);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setOriginalSvg(content);
      setOriginalSize(new Blob([content]).size);
      setOptimizedSvg("");
      setOptimizedSize(0);
    };
    reader.readAsText(file);
  }, []);

  const handleOptimize = useCallback(() => {
    if (!originalSvg) return;
    try {
      const optimized = optimizeSvg(originalSvg);
      setOptimizedSvg(optimized);
      setOptimizedSize(new Blob([optimized]).size);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Optimization error");
    }
  }, [originalSvg]);

  const handleDownload = useCallback(() => {
    if (!optimizedSvg) return;
    const blob = new Blob([optimizedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName ? `optimized-${fileName}` : "optimized.svg";
    link.click();
    URL.revokeObjectURL(url);
  }, [optimizedSvg, fileName]);

  const handleClear = useCallback(() => {
    setOriginalSvg("");
    setOptimizedSvg("");
    setOriginalSize(0);
    setOptimizedSize(0);
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const savingsPercent = originalSize > 0 && optimizedSize > 0
    ? ((1 - optimizedSize / originalSize) * 100).toFixed(1)
    : null;

  return (
    <ToolLayout toolSlug="svg-optimizer">
      <div className="space-y-4">
        <div
          className="drop-zone rounded-xl p-8 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm font-medium text-foreground">
              {fileName || tc("upload")}
            </p>
            <p className="text-xs text-muted-foreground">{tc("upload_hint")}</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {error && (
          <p className="text-sm text-danger font-medium">{error}</p>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleOptimize}
            disabled={!originalSvg}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("optimize")}
          </button>
          {optimizedSvg && (
            <button
              onClick={handleDownload}
              className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {t("download")}
            </button>
          )}
          <button
            onClick={handleClear}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {tc("clear")}
          </button>
        </div>

        {optimizedSvg && (
          <>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">{t("original_size")}</div>
                  <div className="text-lg font-semibold text-foreground">{formatBytes(originalSize)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("optimized_size")}</div>
                  <div className="text-lg font-semibold text-foreground">{formatBytes(optimizedSize)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("savings")}</div>
                  <div className="text-lg font-semibold text-success">{savingsPercent}%</div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  {t("description")}
                </label>
                <CopyButton text={optimizedSvg} />
              </div>
              <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap break-all">
                {optimizedSvg}
              </pre>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

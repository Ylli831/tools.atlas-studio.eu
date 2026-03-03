"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

const FORMATS = [
  { value: "code128", label: "Code 128" },
  { value: "code39", label: "Code 39" },
  { value: "ean13", label: "EAN-13" },
  { value: "ean8", label: "EAN-8" },
  { value: "upca", label: "UPC-A" },
  { value: "qrcode", label: "QR Code" },
  { value: "datamatrix", label: "Data Matrix" },
  { value: "pdf417", label: "PDF 417" },
];

export default function BarcodeGeneratorTool() {
  const t = useTranslations("tools.barcode-generator");
  const tc = useTranslations("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("12345678");
  const [format, setFormat] = useState("code128");
  const [scale, setScale] = useState(3);
  const [error, setError] = useState("");
  const { trackOutput } = useToolAnalytics("barcode-generator");

  const generate = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;
    setError("");
    try {
      const bwipjs = (await import("bwip-js")).default;
      bwipjs.toCanvas(canvasRef.current, {
        bcid: format,
        text: text.trim(),
        scale,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
      trackOutput(format);
    } catch (e) {
      setError(e instanceof Error ? e.message : tc("error"));
    }
  }, [text, format, scale, trackOutput, tc]);

  useEffect(() => { generate(); }, [generate]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `barcode-${format}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <ToolLayout toolSlug="barcode-generator">
      <div className="space-y-5">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t("input_label")}</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)}
            placeholder={t("input_placeholder")}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
        </div>

        {/* Format selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{t("format")}</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button key={f.value} onClick={() => setFormat(f.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${format === f.value ? "bg-teal text-white" : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">{t("scale")}</label>
          <input type="range" min="1" max="6" value={scale} onChange={(e) => setScale(parseInt(e.target.value))}
            className="flex-1 accent-teal"
          />
          <span className="text-sm text-muted-foreground w-6">{scale}x</span>
        </div>

        {/* Canvas */}
        <div className="bg-white border border-border rounded-xl p-6 flex items-center justify-center min-h-[120px]">
          {error ? (
            <p className="text-sm text-red-500 text-center">{error}</p>
          ) : (
            <canvas ref={canvasRef} className="max-w-full" />
          )}
        </div>

        {!error && (
          <button onClick={download}
            className="flex items-center gap-2 bg-teal text-white font-medium px-6 py-2.5 rounded-xl hover:bg-teal-hover transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t("download_png")}
          </button>
        )}
      </div>
    </ToolLayout>
  );
}

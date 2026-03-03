"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import ToolLayout from "@/components/ToolLayout";

export default function QrCodeTool() {
  const t = useTranslations("tools.qr-code-generator");
  const tc = useTranslations("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#37474b");
  const [bgColor, setBgColor] = useState("#ffffff");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const generateQR = useCallback(async () => {
    if (!canvasRef.current || !text.trim()) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: { dark: fgColor, light: bgColor },
      });
    } catch {
      // Invalid input, skip
    }
  }, [text, size, errorCorrection, fgColor, bgColor]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(generateQR, 300);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [generateQR]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const downloadSVG = async () => {
    if (!text.trim()) return;
    try {
      const svg = await QRCode.toString(text, {
        type: "svg",
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: { dark: fgColor, light: bgColor },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Invalid input
    }
  };

  return (
    <ToolLayout toolSlug="qr-code-generator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("input_label")}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("input_placeholder")}
              rows={4}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("size")} (px)
              </label>
              <input
                type="number"
                min={128}
                max={1024}
                step={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("error_correction")}
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("fg_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("bg_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center min-h-[280px]">
            {text.trim() ? (
              <canvas ref={canvasRef} className="max-w-full" />
            ) : (
              <p className="text-muted-foreground text-sm">{t("input_label")}</p>
            )}
          </div>

          {text.trim() && (
            <div className="flex gap-2">
              <button
                onClick={downloadPNG}
                className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download_png")}
              </button>
              <button
                onClick={downloadSVG}
                className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("download_svg")}
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

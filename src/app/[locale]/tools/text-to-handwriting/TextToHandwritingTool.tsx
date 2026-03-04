"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type PaperStyle = "white" | "lined" | "grid";

export default function TextToHandwritingTool() {
  const t = useTranslations("tools.text-to-handwriting");
  const tc = useTranslations("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [inkColor, setInkColor] = useState("#1a237e");
  const [paperStyle, setPaperStyle] = useState<PaperStyle>("lined");

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Draw paper background
    ctx.fillStyle = "#fffef9";
    ctx.fillRect(0, 0, width, height);

    const lineHeight = 36;
    const marginLeft = 60;
    const marginTop = 50;
    const marginRight = 40;

    // Draw paper style
    if (paperStyle === "lined" || paperStyle === "grid") {
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 0.5;

      // Horizontal lines
      for (let y = marginTop; y < height - 20; y += lineHeight) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      if (paperStyle === "grid") {
        // Vertical lines
        for (let x = 20; x < width - 20; x += lineHeight) {
          ctx.beginPath();
          ctx.moveTo(x, 20);
          ctx.lineTo(x, height - 20);
          ctx.stroke();
        }
      }

      // Red margin line for lined paper
      if (paperStyle === "lined") {
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(marginLeft - 10, 20);
        ctx.lineTo(marginLeft - 10, height - 20);
        ctx.stroke();
      }
    }

    // Draw text with word wrap
    if (!text.trim()) return;

    ctx.fillStyle = inkColor;
    ctx.font = "24px 'Segoe Script', cursive, 'Comic Sans MS'";
    ctx.textBaseline = "bottom";

    const maxWidth = width - marginLeft - marginRight;
    const words = text.split(/\n/);
    let y = marginTop;

    for (const line of words) {
      if (line === "") {
        y += lineHeight;
        continue;
      }
      const lineWords = line.split(" ");
      let currentLine = "";

      for (let i = 0; i < lineWords.length; i++) {
        const testLine = currentLine ? currentLine + " " + lineWords[i] : lineWords[i];
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          // Add slight randomness for handwriting effect
          const offsetX = (Math.random() - 0.5) * 2;
          const offsetY = (Math.random() - 0.5) * 1.5;
          ctx.fillText(currentLine, marginLeft + offsetX, y + offsetY);
          currentLine = lineWords[i];
          y += lineHeight;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 1.5;
        ctx.fillText(currentLine, marginLeft + offsetX, y + offsetY);
        y += lineHeight;
      }
    }
  }, [text, inkColor, paperStyle]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "handwriting.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout toolSlug="text-to-handwriting">
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("text_label")}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("text_placeholder")}
            rows={5}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal resize-y"
          />
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("ink_color")}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={inkColor}
                onChange={(e) => setInkColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <div className="flex gap-2">
                {["#1a237e", "#000000", "#b71c1c", "#1b5e20"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setInkColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      inkColor === color ? "border-teal" : "border-border"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("paper")}
            </label>
            <div className="flex gap-2">
              {(["white", "lined", "grid"] as PaperStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setPaperStyle(style)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    paperStyle === style
                      ? "bg-teal text-white"
                      : "bg-card border border-border text-foreground hover:border-teal"
                  }`}
                >
                  {t(style)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: "450px" }}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!text.trim()}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t("download_png")}
        </button>
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const PRESETS = [
  { label: "150x150", w: 150, h: 150 },
  { label: "300x200", w: 300, h: 200 },
  { label: "800x600", w: 800, h: 600 },
  { label: "1200x630", w: 1200, h: 630 },
  { label: "1920x1080", w: 1920, h: 1080 },
];

export default function PlaceholderImageGeneratorTool() {
  const t = useTranslations("tools.placeholder-image-generator");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [customText, setCustomText] = useState("");

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const text = customText || `${width}x${height}`;
    const fontSize = Math.max(12, Math.min(width, height) / 8);
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }, [width, height, bgColor, textColor, customText]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `placeholder-${width}x${height}.png`;
    a.click();
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };

  // Calculate preview dimensions that fit in the container
  const maxPreviewWidth = 600;
  const maxPreviewHeight = 400;
  const scale = Math.min(maxPreviewWidth / width, maxPreviewHeight / height, 1);
  const previewWidth = Math.round(width * scale);
  const previewHeight = Math.round(height * scale);

  return (
    <ToolLayout toolSlug="placeholder-image-generator">
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("width")}
              </label>
              <input
                type="number"
                min={1}
                max={4096}
                value={width}
                onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("height")}
              </label>
              <input
                type="number"
                min={1}
                max={4096}
                value={height}
                onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("bg_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("text_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("custom_text")}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={t("custom_text_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("presets")}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.w, preset.h)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  width === preset.w && height === preset.h
                    ? "bg-teal text-white"
                    : "bg-surface text-foreground hover:bg-border"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            {t("preview")}
          </h3>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              style={{ width: previewWidth, height: previewHeight }}
              className="rounded-lg border border-border"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {width} x {height} px
          </p>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
        >
          {t("download_png")}
        </button>
      </div>
    </ToolLayout>
  );
}

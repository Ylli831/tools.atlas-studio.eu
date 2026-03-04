"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Mode = "draw" | "type";

export default function SignatureGeneratorTool() {
  const t = useTranslations("tools.signature-generator");
  const tc = useTranslations("common");
  const [mode, setMode] = useState<Mode>("draw");
  const [inkColor, setInkColor] = useState("#1a1a2e");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState("'Dancing Script', cursive");
  const [typedFontSize, setTypedFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const fonts = [
    { name: "Dancing Script", value: "'Dancing Script', cursive" },
    { name: "Great Vibes", value: "'Great Vibes', cursive" },
    { name: "Pacifico", value: "'Pacifico', cursive" },
    { name: "Caveat", value: "'Caveat', cursive" },
    { name: "Sacramento", value: "'Sacramento', cursive" },
    { name: "Satisfy", value: "'Satisfy', cursive" },
  ];

  const colorPresets = [
    "#1a1a2e",
    "#0d47a1",
    "#1b5e20",
    "#b71c1c",
    "#4a148c",
    "#37474b",
  ];

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@700&family=Sacramento&family=Satisfy&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 300;
    ctx.scale(2, 1);
    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  useEffect(() => {
    if (mode === "draw") {
      initCanvas();
    }
  }, [mode, initCanvas]);

  const getCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const coords = getCoords(e);
    lastPoint.current = coords;
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint.current || !canvasRef.current) return;

    const coords = getCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPoint.current = coords;
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleDownload = () => {
    let canvas: HTMLCanvasElement;

    if (mode === "draw") {
      if (!canvasRef.current || !hasDrawn) return;
      canvas = canvasRef.current;
    } else {
      // Render typed signature to canvas
      canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      ctx.font = `${typedFontSize}px ${selectedFont}`;
      const metrics = ctx.measureText(typedText || "Signature");
      const padding = 40;
      canvas.width = metrics.width + padding * 2;
      canvas.height = typedFontSize * 1.5 + padding * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${typedFontSize}px ${selectedFont}`;
      ctx.fillStyle = inkColor;
      ctx.textBaseline = "middle";
      ctx.fillText(typedText || "Signature", padding, canvas.height / 2);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "signature.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <ToolLayout toolSlug="signature-generator">
      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("draw")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "draw"
                ? "bg-teal text-white"
                : "bg-surface text-foreground hover:bg-border"
            }`}
          >
            {t("draw_tab")}
          </button>
          <button
            onClick={() => setMode("type")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "type"
                ? "bg-teal text-white"
                : "bg-surface text-foreground hover:bg-border"
            }`}
          >
            {t("type_tab")}
          </button>
        </div>

        {/* Color & stroke controls */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("color")}
            </label>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => setInkColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    inkColor === c ? "border-teal" : "border-border"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={inkColor}
                onChange={(e) => setInkColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          </div>

          {mode === "draw" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("stroke_width")} — {strokeWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>
          )}

          {mode === "type" && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("your_name")}
                </label>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder={t("text_placeholder")}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("font")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setSelectedFont(f.value)}
                      className={`px-3 py-3 rounded-lg text-lg transition-colors ${
                        selectedFont === f.value
                          ? "bg-teal text-white"
                          : "bg-surface text-foreground hover:bg-border"
                      }`}
                      style={{ fontFamily: f.value }}
                    >
                      {typedText || f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("font_size")} — {typedFontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={typedFontSize}
                  onChange={(e) => setTypedFontSize(Number(e.target.value))}
                  className="w-full accent-teal"
                />
              </div>
            </>
          )}
        </div>

        {/* Drawing / Preview area */}
        {mode === "draw" ? (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="border-2 border-dashed border-border rounded-lg bg-white relative">
              <canvas
                ref={canvasRef}
                className="w-full touch-none"
                style={{ height: "200px" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <p className="absolute bottom-2 right-3 text-xs text-muted-foreground pointer-events-none">
                {t("draw_hint")}
              </p>
            </div>
            <button
              onClick={clearCanvas}
              className="mt-2 text-xs text-teal hover:text-teal-hover transition-colors"
            >
              {t("clear")}
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="border-2 border-dashed border-border rounded-lg bg-white flex items-center justify-center py-12 px-8">
              <p
                style={{
                  fontFamily: selectedFont,
                  fontSize: `${typedFontSize}px`,
                  color: inkColor,
                }}
                className="whitespace-nowrap"
              >
                {typedText || t("text_placeholder")}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={mode === "draw" && !hasDrawn}
            className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("download_png")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}

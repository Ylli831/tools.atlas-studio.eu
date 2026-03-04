"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

type WatermarkPosition = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";

export default function ImageWatermarkTool() {
  const t = useTranslations("tools.image-watermark");
  const tc = useTranslations("common");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [watermarkText, setWatermarkText] = useState("Sample Watermark");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const [color, setColor] = useState("#ffffff");
  const [rotation, setRotation] = useState(-30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const positions: { key: WatermarkPosition; label: string }[] = [
    { key: "center", label: t("pos_center") },
    { key: "top-left", label: t("pos_top_left") },
    { key: "top-right", label: t("pos_top_right") },
    { key: "bottom-left", label: t("pos_bottom_left") },
    { key: "bottom-right", label: t("pos_bottom_right") },
    { key: "tile", label: t("pos_tile") },
  ];

  const handleFileSelect = useCallback((files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => setImageEl(img);
      img.src = src;
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const drawWatermark = useCallback(() => {
    if (!imageEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    canvas.width = imageEl.width;
    canvas.height = imageEl.height;
    ctx.drawImage(imageEl, 0, 0);

    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;

    const metrics = ctx.measureText(watermarkText);
    const textH = fontSize;
    const textW = metrics.width;
    const padding = 20;

    if (position === "tile") {
      ctx.save();
      const spacingX = textW + 100;
      const spacingY = textH + 100;
      for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    } else {
      let x: number, y: number;
      ctx.textBaseline = "middle";

      switch (position) {
        case "top-left":
          x = padding;
          y = padding + textH / 2;
          ctx.textAlign = "left";
          break;
        case "top-right":
          x = canvas.width - padding;
          y = padding + textH / 2;
          ctx.textAlign = "right";
          break;
        case "bottom-left":
          x = padding;
          y = canvas.height - padding - textH / 2;
          ctx.textAlign = "left";
          break;
        case "bottom-right":
          x = canvas.width - padding;
          y = canvas.height - padding - textH / 2;
          ctx.textAlign = "right";
          break;
        case "center":
        default:
          x = canvas.width / 2;
          y = canvas.height / 2;
          ctx.textAlign = "center";
          break;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }, [imageEl, watermarkText, fontSize, opacity, position, color, rotation]);

  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleReset = () => {
    setImageSrc(null);
    setImageEl(null);
    setWatermarkText("Sample Watermark");
    setFontSize(48);
    setOpacity(50);
    setPosition("center");
    setColor("#ffffff");
    setRotation(-30);
  };

  return (
    <ToolLayout toolSlug="image-watermark">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={imageSrc} />

        {imageEl && (
          <>
            {/* Controls */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("watermark_text")}
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("font_size")} — {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("opacity")} — {opacity}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("color")}
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("rotation")} — {rotation}&deg;
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("position")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPosition(p.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        position === p.key
                          ? "bg-teal text-white"
                          : "bg-surface text-foreground hover:bg-border"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-card border border-border rounded-xl p-4 flex justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] object-contain"
                style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "500px" }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {tc("download")}
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

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function ImageFlipTool() {
  const t = useTranslations("tools.image-flip");
  const tc = useTranslations("common");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const drawCanvas = useCallback(() => {
    if (!imageEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const isRotated90or270 = rotation === 90 || rotation === 270;
    const w = isRotated90or270 ? imageEl.height : imageEl.width;
    const h = isRotated90or270 ? imageEl.width : imageEl.height;

    canvas.width = w;
    canvas.height = h;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imageEl, -imageEl.width / 2, -imageEl.height / 2);
    ctx.restore();
  }, [imageEl, flipH, flipV, rotation]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFlipHorizontal = () => setFlipH((prev) => !prev);
  const handleFlipVertical = () => setFlipV((prev) => !prev);
  const handleRotate = (deg: number) => setRotation((prev) => (prev + deg) % 360);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flipped-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleReset = () => {
    setImageSrc(null);
    setImageEl(null);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
  };

  return (
    <ToolLayout toolSlug="image-flip">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={imageSrc} />

        {imageEl && (
          <>
            {/* Transform controls */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              {/* Flip controls */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("flip")}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleFlipHorizontal}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      flipH
                        ? "bg-teal text-white"
                        : "bg-surface text-foreground hover:bg-border"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h3" />
                      <path d="M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                    </svg>
                    {t("flip_horizontal")}
                  </button>
                  <button
                    onClick={handleFlipVertical}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      flipV
                        ? "bg-teal text-white"
                        : "bg-surface text-foreground hover:bg-border"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v3" />
                      <path d="M3 16v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                    </svg>
                    {t("flip_vertical")}
                  </button>
                </div>
              </div>

              {/* Rotation controls */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("rotate")} — {rotation}&deg;
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRotate(90)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6" />
                      <path d="M21.34 15.57a10 10 0 11-.57-8.38L21.5 8" />
                    </svg>
                    +90&deg;
                  </button>
                  <button
                    onClick={() => handleRotate(180)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    180&deg;
                  </button>
                  <button
                    onClick={() => handleRotate(270)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 2v6h6" />
                      <path d="M2.66 15.57a10 10 0 10.57-8.38L2.5 8" />
                    </svg>
                    -90&deg;
                  </button>
                  <button
                    onClick={() => setRotation(0)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    0&deg;
                  </button>
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

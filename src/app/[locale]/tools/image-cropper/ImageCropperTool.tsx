"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatio = "free" | "1:1" | "16:9" | "9:16" | "4:5" | "4:3" | "3:2";

export default function ImageCropperTool() {
  const t = useTranslations("tools.image-cropper");
  const tc = useTranslations("common");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"move" | "create" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatios: { key: AspectRatio; label: string }[] = [
    { key: "free", label: t("free") },
    { key: "1:1", label: "1:1" },
    { key: "16:9", label: "16:9" },
    { key: "9:16", label: "9:16" },
    { key: "4:5", label: "4:5" },
    { key: "4:3", label: "4:3" },
    { key: "3:2", label: "3:2" },
  ];

  const getAspectValue = (ratio: AspectRatio): number | null => {
    const map: Record<string, number> = {
      "1:1": 1,
      "16:9": 16 / 9,
      "9:16": 9 / 16,
      "4:5": 4 / 5,
      "4:3": 4 / 3,
      "3:2": 3 / 2,
    };
    return map[ratio] ?? null;
  };

  const handleFileSelect = useCallback((files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setImageEl(img);
        setCrop({ x: 0, y: 0, width: img.width, height: img.height });
      };
      img.src = src;
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  useEffect(() => {
    if (!imageEl || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const maxW = container.clientWidth;
    const maxH = 500;
    const scale = Math.min(maxW / imageEl.width, maxH / imageEl.height, 1);
    setDisplayScale(scale);

    const canvas = canvasRef.current;
    canvas.width = imageEl.width * scale;
    canvas.height = imageEl.height * scale;
    const ctx = canvas.getContext("2d")!;

    // Draw image
    ctx.drawImage(imageEl, 0, 0, canvas.width, canvas.height);

    // Draw overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw crop area (clear overlay)
    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.width * scale;
    const sh = crop.height * scale;

    ctx.clearRect(sx, sy, sw, sh);
    ctx.drawImage(
      imageEl,
      crop.x, crop.y, crop.width, crop.height,
      sx, sy, sw, sh
    );

    // Draw crop border
    ctx.strokeStyle = "#487877";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);

    // Draw grid lines (rule of thirds)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(sx + (sw * i) / 3, sy);
      ctx.lineTo(sx + (sw * i) / 3, sy + sh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx, sy + (sh * i) / 3);
      ctx.lineTo(sx + sw, sy + (sh * i) / 3);
      ctx.stroke();
    }

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = "#487877";
    const corners = [
      [sx, sy],
      [sx + sw, sy],
      [sx, sy + sh],
      [sx + sw, sy + sh],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
    });
  }, [imageEl, crop, displayScale]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / displayScale,
      y: (e.clientY - rect.top) / displayScale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const inCrop =
      coords.x >= crop.x &&
      coords.x <= crop.x + crop.width &&
      coords.y >= crop.y &&
      coords.y <= crop.y + crop.height;

    if (inCrop) {
      setDragMode("move");
    } else {
      setDragMode("create");
      setCrop({ x: coords.x, y: coords.y, width: 0, height: 0 });
    }
    setDragStart(coords);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageEl) return;
    const coords = getCanvasCoords(e);

    if (dragMode === "move") {
      const dx = coords.x - dragStart.x;
      const dy = coords.y - dragStart.y;
      setCrop((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(imageEl.width - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(imageEl.height - prev.height, prev.y + dy)),
      }));
      setDragStart(coords);
    } else if (dragMode === "create") {
      let w = coords.x - dragStart.x;
      let h = coords.y - dragStart.y;

      const aspectValue = getAspectValue(aspectRatio);
      if (aspectValue) {
        h = Math.abs(w) / aspectValue * Math.sign(h || 1);
      }

      const x = w >= 0 ? dragStart.x : dragStart.x + w;
      const y = h >= 0 ? dragStart.y : dragStart.y + h;

      setCrop({
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(Math.abs(w), imageEl.width - Math.max(0, x)),
        height: Math.min(Math.abs(h), imageEl.height - Math.max(0, y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleCrop = () => {
    if (!imageEl || crop.width <= 0 || crop.height <= 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.width);
    canvas.height = Math.round(crop.height);
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      imageEl,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, canvas.width, canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cropped-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleReset = () => {
    setImageSrc(null);
    setImageEl(null);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setAspectRatio("free");
  };

  return (
    <ToolLayout toolSlug="image-cropper">
      <div className="space-y-6">
        <FileUpload
          accept="image/*"
          onFileSelect={handleFileSelect}
          preview={imageSrc}
        />

        {imageEl && (
          <>
            {/* Aspect ratio selector */}
            <div className="bg-card border border-border rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("aspect_ratio")}
              </label>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.key}
                    onClick={() => setAspectRatio(ar.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      aspectRatio === ar.key
                        ? "bg-teal text-white"
                        : "bg-surface text-foreground hover:bg-border"
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop canvas */}
            <div
              ref={containerRef}
              className="bg-card border border-border rounded-xl p-4 flex justify-center"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-crosshair max-w-full"
              />
            </div>

            {/* Crop dimensions */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                {t("dimensions")}: {Math.round(crop.width)} x {Math.round(crop.height)} px
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCrop}
                disabled={crop.width <= 0 || crop.height <= 0}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {t("crop_download")}
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

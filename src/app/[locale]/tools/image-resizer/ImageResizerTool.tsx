"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function ImageResizerTool() {
  const t = useTranslations("tools.image-resizer");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(92);

  const handleFile = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOriginalDims({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  }, []);

  const updateWidth = (w: number) => {
    setWidth(w);
    if (lockAspect && originalDims.width > 0) {
      setHeight(Math.round((w / originalDims.width) * originalDims.height));
    }
  };

  const updateHeight = (h: number) => {
    setHeight(h);
    if (lockAspect && originalDims.height > 0) {
      setWidth(Math.round((h / originalDims.height) * originalDims.width));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setLockAspect(false);
  };

  const resize = () => {
    if (!file || width <= 0 || height <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `resized-${width}x${height}.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        },
        `image/${format}`,
        format === "png" ? undefined : quality / 100
      );
    };
    img.src = URL.createObjectURL(file);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setOriginalDims({ width: 0, height: 0 });
    setWidth(0);
    setHeight(0);
  };

  const presets = [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Instagram Story", w: 1080, h: 1920 },
    { label: "Twitter Header", w: 1500, h: 500 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "YouTube Thumbnail", w: 1280, h: 720 },
    { label: "LinkedIn Banner", w: 1584, h: 396 },
  ];

  return (
    <ToolLayout toolSlug="image-resizer">
      <div className="space-y-6">
        {!file ? (
          <FileUpload accept="image/*" onFileSelect={handleFile} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <img src={preview!} alt="" className="max-w-full max-h-64 mx-auto rounded" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {t("original")}: {originalDims.width} &times; {originalDims.height}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("width")} (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => updateWidth(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("height")} (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => updateHeight(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockAspect}
                    onChange={(e) => setLockAspect(e.target.checked)}
                    className="rounded border-border text-teal focus:ring-teal"
                  />
                  <span className="text-sm text-foreground">{t("lock_aspect")}</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("format")}
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as "png" | "jpeg" | "webp")}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                  {format !== "png" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("quality")} ({quality}%)
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full mt-2"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">{t("presets")}</p>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p.w, p.h)}
                        className="text-xs bg-surface border border-border px-2.5 py-1.5 rounded-lg hover:border-teal hover:text-teal transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resize}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("resize_download")}
              </button>
              <button
                onClick={reset}
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

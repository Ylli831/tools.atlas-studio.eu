"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  blur: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
}

const defaultFilters: Filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  blur: 0,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
};

export default function ImageFilterTool() {
  const t = useTranslations("tools.image-filter");
  const tc = useTranslations("common");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filterControls: {
    key: keyof Filters;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
  }[] = [
    { key: "brightness", label: t("brightness"), min: 0, max: 300, step: 1, unit: "%" },
    { key: "contrast", label: t("contrast"), min: 0, max: 300, step: 1, unit: "%" },
    { key: "saturate", label: t("saturate"), min: 0, max: 300, step: 1, unit: "%" },
    { key: "sepia", label: t("sepia"), min: 0, max: 100, step: 1, unit: "%" },
    { key: "blur", label: t("blur"), min: 0, max: 20, step: 0.5, unit: "px" },
    { key: "grayscale", label: t("grayscale"), min: 0, max: 100, step: 1, unit: "%" },
    { key: "hueRotate", label: t("hue_rotate"), min: 0, max: 360, step: 1, unit: "deg" },
    { key: "invert", label: t("invert"), min: 0, max: 100, step: 1, unit: "%" },
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

  const getFilterString = useCallback(() => {
    return [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturate}%)`,
      `sepia(${filters.sepia}%)`,
      `blur(${filters.blur}px)`,
      `grayscale(${filters.grayscale}%)`,
      `hue-rotate(${filters.hueRotate}deg)`,
      `invert(${filters.invert}%)`,
    ].join(" ");
  }, [filters]);

  const drawCanvas = useCallback(() => {
    if (!imageEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    canvas.width = imageEl.width;
    canvas.height = imageEl.height;

    ctx.filter = getFilterString();
    ctx.drawImage(imageEl, 0, 0);
    ctx.filter = "none";
  }, [imageEl, getFilterString]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "filtered-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleReset = () => {
    setImageSrc(null);
    setImageEl(null);
    setFilters({ ...defaultFilters });
  };

  const presets = [
    { name: t("preset_none"), filters: { ...defaultFilters } },
    { name: t("preset_vintage"), filters: { ...defaultFilters, sepia: 60, contrast: 120, brightness: 110, saturate: 80 } },
    { name: t("preset_dramatic"), filters: { ...defaultFilters, contrast: 150, brightness: 90, saturate: 130 } },
    { name: t("preset_bw"), filters: { ...defaultFilters, grayscale: 100, contrast: 120 } },
    { name: t("preset_warm"), filters: { ...defaultFilters, sepia: 20, saturate: 130, brightness: 105 } },
    { name: t("preset_cool"), filters: { ...defaultFilters, hueRotate: 180, saturate: 80, brightness: 105 } },
  ];

  return (
    <ToolLayout toolSlug="image-filter">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={imageSrc} />

        {imageEl && (
          <>
            {/* Presets */}
            <div className="bg-card border border-border rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("presets")}
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setFilters(preset.filters)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter sliders */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              {filterControls.map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-foreground">
                      {ctrl.label}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {filters[ctrl.key]}{ctrl.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={filters[ctrl.key]}
                    onChange={(e) => updateFilter(ctrl.key, parseFloat(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-xs text-teal hover:text-teal-hover transition-colors"
              >
                {t("reset_filters")}
              </button>
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

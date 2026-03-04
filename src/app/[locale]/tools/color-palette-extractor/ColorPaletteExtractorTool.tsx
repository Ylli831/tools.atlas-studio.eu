"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

interface ExtractedColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  count: number;
  percentage: number;
}

export default function ColorPaletteExtractorTool() {
  const t = useTranslations("tools.color-palette-extractor");
  const tc = useTranslations("common");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [colorCount, setColorCount] = useState(8);
  const [processing, setProcessing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
  };

  // Simple median cut color quantization
  const medianCut = (pixels: number[][], depth: number): number[][] => {
    if (depth === 0 || pixels.length === 0) {
      const avg = [0, 0, 0];
      pixels.forEach((p) => {
        avg[0] += p[0];
        avg[1] += p[1];
        avg[2] += p[2];
      });
      if (pixels.length > 0) {
        avg[0] = Math.round(avg[0] / pixels.length);
        avg[1] = Math.round(avg[1] / pixels.length);
        avg[2] = Math.round(avg[2] / pixels.length);
      }
      return [avg];
    }

    // Find channel with greatest range
    let maxRange = 0;
    let maxChannel = 0;
    for (let ch = 0; ch < 3; ch++) {
      const values = pixels.map((p) => p[ch]);
      const range = Math.max(...values) - Math.min(...values);
      if (range > maxRange) {
        maxRange = range;
        maxChannel = ch;
      }
    }

    pixels.sort((a, b) => a[maxChannel] - b[maxChannel]);
    const mid = Math.floor(pixels.length / 2);

    return [
      ...medianCut(pixels.slice(0, mid), depth - 1),
      ...medianCut(pixels.slice(mid), depth - 1),
    ];
  };

  const extractColors = useCallback(
    (img: HTMLImageElement) => {
      setProcessing(true);

      const canvas = document.createElement("canvas");
      const maxDim = 200; // Sample at low resolution for speed
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const pixels: number[][] = [];
      for (let i = 0; i < data.length; i += 4) {
        // Skip very transparent pixels
        if (data[i + 3] < 128) continue;
        pixels.push([data[i], data[i + 1], data[i + 2]]);
      }

      // Depth for median cut: log2(colorCount)
      const depth = Math.ceil(Math.log2(colorCount));
      const quantized = medianCut([...pixels], depth).slice(0, colorCount);

      // Count pixels closest to each quantized color
      const counts = new Array(quantized.length).fill(0);
      pixels.forEach((pixel) => {
        let minDist = Infinity;
        let closest = 0;
        quantized.forEach((q, qi) => {
          const dist =
            (pixel[0] - q[0]) ** 2 + (pixel[1] - q[1]) ** 2 + (pixel[2] - q[2]) ** 2;
          if (dist < minDist) {
            minDist = dist;
            closest = qi;
          }
        });
        counts[closest]++;
      });

      const totalPixels = pixels.length;
      const extracted: ExtractedColor[] = quantized
        .map((q, i) => ({
          r: q[0],
          g: q[1],
          b: q[2],
          hex: rgbToHex(q[0], q[1], q[2]),
          count: counts[i],
          percentage: Math.round((counts[i] / totalPixels) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      setColors(extracted);
      setProcessing(false);
    },
    [colorCount]
  );

  const handleFileSelect = useCallback(
    (files: File[]) => {
      const selectedFile = files[0];
      if (!selectedFile) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);
        const img = new Image();
        img.onload = () => extractColors(img);
        img.src = src;
      };
      reader.readAsDataURL(selectedFile);
    },
    [extractColors]
  );

  const copyColor = async (hex: string, index: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setImageSrc(null);
    setColors([]);
    setColorCount(8);
  };

  return (
    <ToolLayout toolSlug="color-palette-extractor">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} preview={imageSrc} />

        {processing && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">{tc("processing")}</p>
          </div>
        )}

        {imageSrc && colors.length > 0 && (
          <>
            {/* Color count selector */}
            <div className="bg-card border border-border rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("num_colors")}: {colorCount}
              </label>
              <input
                type="range"
                min="4"
                max="16"
                value={colorCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setColorCount(val);
                  // Re-extract with new count
                  if (imageSrc) {
                    const img = new Image();
                    img.onload = () => extractColors(img);
                    img.src = imageSrc;
                  }
                }}
                className="w-full accent-teal"
              />
            </div>

            {/* Color palette display */}
            <div className="bg-card border border-border rounded-xl p-4">
              {/* Palette bar */}
              <div className="flex h-16 rounded-lg overflow-hidden mb-4">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: c.hex,
                      flex: c.percentage || 1,
                    }}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => copyColor(c.hex, i)}
                    title={c.hex}
                  />
                ))}
              </div>

              {/* Color details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copyColor(c.hex, i)}
                    className="flex items-center gap-2 bg-surface rounded-lg p-2 hover:bg-border transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-md border border-border shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-mono font-medium text-foreground uppercase">
                        {copiedIndex === i ? tc("copied") : c.hex}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.percentage}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RGB values */}
            <div className="bg-card border border-border rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("css_colors")}
              </label>
              <pre className="bg-surface rounded-lg p-3 text-xs text-foreground font-mono overflow-x-auto">
                {colors
                  .map(
                    (c, i) =>
                      `--color-${i + 1}: ${c.hex}; /* rgb(${c.r}, ${c.g}, ${c.b}) */`
                  )
                  .join("\n")}
              </pre>
            </div>

            <button
              onClick={handleReset}
              className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {tc("reset")}
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

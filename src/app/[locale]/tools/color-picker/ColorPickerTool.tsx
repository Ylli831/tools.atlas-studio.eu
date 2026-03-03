"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

type PaletteType = "complementary" | "analogous" | "triadic" | "split_complementary" | "monochromatic";

function generatePalette(hex: string, type: PaletteType): string[] {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);

  switch (type) {
    case "complementary":
      return [hex, hslToHex((h + 180) % 360, s, l)];
    case "analogous":
      return [hslToHex((h + 330) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)];
    case "triadic":
      return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case "split_complementary":
      return [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    case "monochromatic":
      return [
        hslToHex(h, s, Math.max(l - 30, 10)),
        hslToHex(h, s, Math.max(l - 15, 10)),
        hex,
        hslToHex(h, s, Math.min(l + 15, 90)),
        hslToHex(h, s, Math.min(l + 30, 90)),
      ];
    default:
      return [hex];
  }
}

export default function ColorPickerTool() {
  const t = useTranslations("tools.color-picker");
  const [color, setColor] = useState("#487877");
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");

  const [r, g, b] = useMemo(() => hexToRgb(color), [color]);
  const [h, s, l] = useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const palette = useMemo(() => generatePalette(color, paletteType), [color, paletteType]);

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
  ];

  const paletteTypes: PaletteType[] = ["complementary", "analogous", "triadic", "split_complementary", "monochromatic"];

  const cssVars = palette.map((c, i) => `--color-${i + 1}: ${c};`).join("\n");

  return (
    <ToolLayout toolSlug="color-picker">
      <div className="space-y-8">
        {/* Color Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("pick_color")}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer border border-border"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v);
                }}
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
            </div>
            <div
              className="w-full h-24 rounded-xl mt-4 border border-border"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="space-y-3">
            {formats.map((f) => (
              <div key={f.label} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                  <p className="text-sm font-mono">{f.value}</p>
                </div>
                <CopyButton text={f.value} />
              </div>
            ))}
          </div>
        </div>

        {/* Palette Generator */}
        <div>
          <h2 className="text-lg font-semibold text-slate mb-4">{t("palette")}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {paletteTypes.map((pt) => (
              <button
                key={pt}
                onClick={() => setPaletteType(pt)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  paletteType === pt
                    ? "bg-teal text-white"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(pt)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {palette.map((c, i) => (
              <div key={i} className="flex-1 text-center">
                <div
                  className="h-20 rounded-lg border border-border mb-2 cursor-pointer"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
                <CopyButton text={c} className="text-xs" />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <CopyButton text={cssVars} className="text-xs" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

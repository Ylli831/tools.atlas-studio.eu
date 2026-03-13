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

// Relative luminance per WCAG 2.1
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(...hexToRgb(hex1));
  const l2 = relativeLuminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type WcagLevel = "fail" | "AA_large" | "AA" | "AAA";

function getWcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA_large";
  return "fail";
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

const WCAG_COLORS: Record<WcagLevel, string> = {
  fail: "text-red-500",
  AA_large: "text-yellow-600",
  AA: "text-teal",
  AAA: "text-green-600",
};

const WCAG_BG: Record<WcagLevel, string> = {
  fail: "bg-red-50 border-red-200",
  AA_large: "bg-yellow-50 border-yellow-200",
  AA: "bg-teal/5 border-teal/20",
  AAA: "bg-green-50 border-green-200",
};

export default function ColorPickerTool() {
  const t = useTranslations("tools.color-picker");
  const [color, setColor] = useState("#487877");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");

  const [r, g, b] = useMemo(() => hexToRgb(color), [color]);
  const [h, s, l] = useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const palette = useMemo(() => generatePalette(color, paletteType), [color, paletteType]);

  const ratio = useMemo(() => contrastRatio(color, bgColor), [color, bgColor]);
  const wcagLevel = useMemo(() => getWcagLevel(ratio), [ratio]);

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

        {/* Contrast Checker */}
        <div>
          <h2 className="text-lg font-semibold text-slate mb-4">{t("contrast_checker")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t("foreground")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor(e.target.value);
                  }}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t("background")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBgColor(e.target.value);
                  }}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
                <button
                  onClick={() => { const tmp = color; setColor(bgColor); setBgColor(tmp); }}
                  className="text-muted-foreground hover:text-teal transition-colors p-2"
                  title={t("swap")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" />
                    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Preview + Result */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl border border-border p-6 text-center"
              style={{ backgroundColor: bgColor, color: color }}
            >
              <p className="text-2xl font-bold mb-1">{t("preview_text")}</p>
              <p className="text-sm">{t("preview_small")}</p>
            </div>
            <div className={`rounded-xl border p-6 flex flex-col items-center justify-center ${WCAG_BG[wcagLevel]}`}>
              <p className="text-3xl font-bold font-mono mb-1">{ratio.toFixed(2)}:1</p>
              <p className={`text-sm font-semibold ${WCAG_COLORS[wcagLevel]}`}>
                {t(`wcag_${wcagLevel}`)}
              </p>
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span>{t("normal_text")}: {ratio >= 4.5 ? "Pass" : "Fail"}</span>
                <span>{t("large_text")}: {ratio >= 3 ? "Pass" : "Fail"}</span>
              </div>
            </div>
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

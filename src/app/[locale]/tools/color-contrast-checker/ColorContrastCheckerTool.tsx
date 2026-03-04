"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length !== 6) return null;
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) return null;
  const L1 = relativeLuminance(...fgRgb);
  const L2 = relativeLuminance(...bgRgb);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorContrastCheckerTool() {
  const t = useTranslations("tools.color-contrast-checker");
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const ratioStr = ratio ? ratio.toFixed(2) : "-";

  const aa_normal = ratio ? ratio >= 4.5 : false;
  const aa_large = ratio ? ratio >= 3 : false;
  const aaa_normal = ratio ? ratio >= 7 : false;
  const aaa_large = ratio ? ratio >= 4.5 : false;

  const Badge = ({ pass }: { pass: boolean }) => (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
      {pass ? t("pass") : t("fail")}
    </span>
  );

  return (
    <ToolLayout toolSlug="color-contrast-checker">
      <div className="space-y-6">
        {/* Preview */}
        <div className="rounded-xl overflow-hidden border border-border h-32 flex items-center justify-center" style={{ backgroundColor: bg }}>
          <p className="text-2xl font-bold px-8" style={{ color: fg }}>
            {t("preview_text")}
          </p>
        </div>

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{t("foreground")}</label>
            <div className="flex gap-2">
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
              />
              <input type="text" value={fg} onChange={(e) => setFg(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal uppercase"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{t("background")}</label>
            <div className="flex gap-2">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
              />
              <input type="text" value={bg} onChange={(e) => setBg(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal uppercase"
              />
            </div>
          </div>
        </div>

        {/* Ratio */}
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t("contrast_ratio")}</p>
          <p className="text-5xl font-bold text-slate">{ratioStr}<span className="text-2xl text-muted-foreground">:1</span></p>
        </div>

        {/* WCAG results */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { label: t("wcag_aa_normal"), desc: t("wcag_aa_normal_desc"), pass: aa_normal },
            { label: t("wcag_aa_large"), desc: t("wcag_aa_large_desc"), pass: aa_large },
            { label: t("wcag_aaa_normal"), desc: t("wcag_aaa_normal_desc"), pass: aaa_normal },
            { label: t("wcag_aaa_large"), desc: t("wcag_aaa_large_desc"), pass: aaa_large },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Badge pass={item.pass} />
            </div>
          ))}
        </div>

        {/* Swap button */}
        <button onClick={() => { const tmp = fg; setFg(bg); setBg(tmp); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-4 py-2.5 hover:border-teal transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4" /><path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {t("swap_colors")}
        </button>
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

const PRESETS = [
  { label: "16:9", w: 1920, h: 1080 },
  { label: "4:3", w: 1024, h: 768 },
  { label: "1:1", w: 1080, h: 1080 },
  { label: "9:16", w: 1080, h: 1920 },
  { label: "21:9", w: 2560, h: 1080 },
  { label: "3:2", w: 1500, h: 1000 },
  { label: "2:3", w: 1000, h: 1500 },
  { label: "5:4", w: 1280, h: 1024 },
];

const SOCIAL_SIZES = [
  { platform: "Instagram Post", w: 1080, h: 1080, ratio: "1:1" },
  { platform: "Instagram Story", w: 1080, h: 1920, ratio: "9:16" },
  { platform: "Instagram Reel", w: 1080, h: 1920, ratio: "9:16" },
  { platform: "Facebook Post", w: 1200, h: 630, ratio: "1.91:1" },
  { platform: "Facebook Cover", w: 820, h: 312, ratio: "2.63:1" },
  { platform: "X/Twitter Post", w: 1200, h: 675, ratio: "16:9" },
  { platform: "X/Twitter Header", w: 1500, h: 500, ratio: "3:1" },
  { platform: "YouTube Thumbnail", w: 1280, h: 720, ratio: "16:9" },
  { platform: "LinkedIn Post", w: 1200, h: 627, ratio: "1.91:1" },
  { platform: "LinkedIn Banner", w: 1584, h: 396, ratio: "4:1" },
  { platform: "Pinterest Pin", w: 1000, h: 1500, ratio: "2:3" },
  { platform: "TikTok Video", w: 1080, h: 1920, ratio: "9:16" },
];

export default function AspectRatioCalculatorTool() {
  const t = useTranslations("tools.aspect-ratio-calculator");
  const tc = useTranslations("common");

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [newWidth, setNewWidth] = useState<string>("");
  const [newHeight, setNewHeight] = useState<string>("");

  const ratio = useMemo(() => {
    if (!width || !height) return "N/A";
    const g = gcd(width, height);
    return `${width / g}:${height / g}`;
  }, [width, height]);

  const decimalRatio = useMemo(() => {
    if (!width || !height) return 0;
    return width / height;
  }, [width, height]);

  const handleNewWidthChange = (val: string) => {
    setNewWidth(val);
    const w = Number(val);
    if (w && width && height) {
      setNewHeight(String(Math.round(w / (width / height))));
    }
  };

  const handleNewHeightChange = (val: string) => {
    setNewHeight(val);
    const h = Number(val);
    if (h && width && height) {
      setNewWidth(String(Math.round(h * (width / height))));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setNewWidth("");
    setNewHeight("");
  };

  return (
    <ToolLayout toolSlug="aspect-ratio-calculator">
      <div className="space-y-6">
        {/* Calculator */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("width")}</label>
              <input
                type="number"
                min="1"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("height")}</label>
              <input
                type="number"
                min="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 px-4 bg-surface rounded-lg">
            <div>
              <span className="text-xs text-muted-foreground">{t("ratio")}</span>
              <p className="text-lg font-bold text-teal font-mono">{ratio}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Decimal</span>
              <p className="text-lg font-bold text-foreground font-mono">{decimalRatio.toFixed(4)}</p>
            </div>
            <CopyButton text={ratio} />
          </div>
        </div>

        {/* Resize proportionally */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm font-medium text-foreground block mb-3">Resize Proportionally</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">New {t("width")}</label>
              <input
                type="number"
                min="1"
                value={newWidth}
                onChange={(e) => handleNewWidthChange(e.target.value)}
                placeholder="Enter width"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">New {t("height")}</label>
              <input
                type="number"
                min="1"
                value={newHeight}
                onChange={(e) => handleNewHeightChange(e.target.value)}
                placeholder="Enter height"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm font-medium text-foreground block mb-3">{t("presets")}</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.w, p.h)}
                className="bg-surface text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {p.label}
                <span className="text-xs text-muted-foreground ml-1">({p.w}x{p.h})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Social media sizes */}
        <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto">
          <label className="text-sm font-medium text-foreground block mb-3">{t("social_media")}</label>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Platform</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t("width")} x {t("height")}</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t("ratio")}</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {SOCIAL_SIZES.map((s) => (
                <tr key={s.platform} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-2 px-2 font-medium text-foreground">{s.platform}</td>
                  <td className="py-2 px-2 font-mono text-muted-foreground">{s.w} x {s.h}</td>
                  <td className="py-2 px-2 font-mono text-muted-foreground">{s.ratio}</td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => applyPreset(s.w, s.h)}
                      className="text-teal hover:text-teal-hover text-xs font-medium"
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}

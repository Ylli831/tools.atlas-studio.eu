"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ColorStop {
  color: string;
  position: number;
}

export default function CssGradientTool() {
  const t = useTranslations("tools.css-gradient-generator");
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [colors, setColors] = useState<ColorStop[]>([
    { color: "#487877", position: 0 },
    { color: "#cb6a3f", position: 100 },
  ]);

  const cssValue = useMemo(() => {
    const stops = colors.map((c) => `${c.color} ${c.position}%`).join(", ");
    switch (type) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stops})`;
      case "radial":
        return `radial-gradient(circle, ${stops})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stops})`;
    }
  }, [type, angle, colors]);

  const cssRule = `background: ${cssValue};`;

  function updateColor(index: number, field: keyof ColorStop, value: string | number) {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function addColor() {
    if (colors.length >= 6) return;
    const lastPos = colors[colors.length - 1]?.position ?? 0;
    setColors((prev) => [
      ...prev,
      { color: "#37474b", position: Math.min(100, lastPos + 20) },
    ]);
  }

  function removeColor(index: number) {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <ToolLayout toolSlug="css-gradient-generator">
      <div className="space-y-6">
        {/* Preview */}
        <div
          className="w-full h-48 rounded-xl border border-border"
          style={{ background: cssValue }}
        />

        {/* Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "linear" | "radial" | "conic")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="linear">{t("linear")}</option>
              <option value="radial">{t("radial")}</option>
              <option value="conic">{t("conic")}</option>
            </select>
          </div>

          {(type === "linear" || type === "conic") && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("angle")}
                </label>
                <span className="text-sm font-mono text-teal">{angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>
          )}
        </div>

        {/* Color stops */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">
              {t("colors")}
            </label>
            {colors.length < 6 && (
              <button
                onClick={addColor}
                className="text-xs text-teal hover:underline"
              >
                + {t("add_color")}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {colors.map((stop, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColor(i, "color", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColor(i, "color", e.target.value)}
                  className="w-24 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateColor(i, "position", Number(e.target.value))}
                    className="flex-1 accent-teal"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {stop.position}%
                  </span>
                </div>
                {colors.length > 2 && (
                  <button
                    onClick={() => removeColor(i)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Remove color"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("css_output")}
            </label>
            <CopyButton text={cssRule} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-x-auto">
            {cssRule}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

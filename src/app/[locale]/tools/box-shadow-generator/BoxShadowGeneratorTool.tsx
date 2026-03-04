"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function createDefaultShadow(id: number): Shadow {
  return {
    id,
    offsetX: 5,
    offsetY: 5,
    blur: 15,
    spread: 0,
    color: "#000000",
    opacity: 0.2,
    inset: false,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function shadowToCss(shadow: Shadow): string {
  const color = hexToRgba(shadow.color, shadow.opacity);
  const inset = shadow.inset ? "inset " : "";
  return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${color}`;
}

export default function BoxShadowGeneratorTool() {
  const t = useTranslations("tools.box-shadow-generator");
  const tc = useTranslations("common");

  const [shadows, setShadows] = useState<Shadow[]>([createDefaultShadow(1)]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  let nextId = shadows.length > 0 ? Math.max(...shadows.map((s) => s.id)) + 1 : 1;

  const cssValue = useMemo(() => {
    return shadows.map(shadowToCss).join(",\n    ");
  }, [shadows]);

  const fullCss = `box-shadow: ${cssValue};`;

  const active = shadows[activeIdx] || shadows[0];

  const updateShadow = (field: keyof Shadow, value: number | string | boolean) => {
    setShadows((prev) =>
      prev.map((s, i) => (i === activeIdx ? { ...s, [field]: value } : s))
    );
  };

  const addShadow = () => {
    const newShadow = createDefaultShadow(nextId);
    setShadows((prev) => [...prev, newShadow]);
    setActiveIdx(shadows.length);
  };

  const removeShadow = (idx: number) => {
    if (shadows.length <= 1) return;
    setShadows((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => (prev >= idx && prev > 0 ? prev - 1 : prev));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolSlug="box-shadow-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Shadow tabs */}
            <div className="flex flex-wrap gap-2 items-center">
              {shadows.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <button
                    onClick={() => setActiveIdx(i)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                      activeIdx === i
                        ? "bg-teal text-white"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("shadow")} {i + 1}
                  </button>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(i)}
                      className={`px-2 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                        activeIdx === i
                          ? "bg-teal/80 text-white hover:bg-red-500"
                          : "bg-card border border-border border-l-0 text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addShadow}
                className="border border-border text-foreground font-medium px-3 py-1.5 rounded-lg hover:border-teal hover:text-teal transition-colors text-sm"
              >
                + {t("add_shadow")}
              </button>
            </div>

            {active && (
              <div className="space-y-4">
                {/* Offset X */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">{t("offset_x")}</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={active.offsetX}
                    onChange={(e) => updateShadow("offsetX", parseInt(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>

                {/* Offset Y */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">{t("offset_y")}</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={active.offsetY}
                    onChange={(e) => updateShadow("offsetY", parseInt(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">{t("blur")}</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={active.blur}
                    onChange={(e) => updateShadow("blur", parseInt(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>

                {/* Spread */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">{t("spread")}</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.spread}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={active.spread}
                    onChange={(e) => updateShadow("spread", parseInt(e.target.value))}
                    className="w-full accent-teal"
                  />
                </div>

                {/* Color + Opacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t("color")}</label>
                    <input
                      type="color"
                      value={active.color}
                      onChange={(e) => updateShadow("color", e.target.value)}
                      className="w-full h-10 rounded-lg border border-border cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-foreground">{t("opacity")}</label>
                      <span className="text-sm text-muted-foreground font-mono">{active.opacity.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={active.opacity}
                      onChange={(e) => updateShadow("opacity", parseFloat(e.target.value))}
                      className="w-full accent-teal"
                    />
                  </div>
                </div>

                {/* Inset */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active.inset}
                    onChange={(e) => updateShadow("inset", e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-teal"
                  />
                  <span className="text-sm font-medium text-foreground">{t("inset")}</span>
                </label>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center min-h-[300px] bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-xl border border-border p-8">
            <div
              className="w-48 h-48 bg-white dark:bg-card rounded-2xl"
              style={{ boxShadow: shadows.map(shadowToCss).join(", ") }}
            />
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">{t("css_code")}</span>
            <button
              onClick={handleCopy}
              className="bg-teal text-white font-medium px-4 py-1.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              {copied ? tc("copied") : tc("copy")}
            </button>
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-foreground overflow-x-auto">
            {fullCss}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

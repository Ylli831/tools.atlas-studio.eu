"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface TextShadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function shadowToCss(s: TextShadow): string {
  const color = hexToRgba(s.color, s.opacity);
  return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${color}`;
}

let nextShadowId = 2;

export default function TextShadowGeneratorTool() {
  const t = useTranslations("tools.text-shadow-generator");
  const tc = useTranslations("common");

  const [shadows, setShadows] = useState<TextShadow[]>([
    { id: 1, offsetX: 2, offsetY: 2, blur: 4, color: "#000000", opacity: 0.3 },
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewText, setPreviewText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#37474b");

  const cssValue = useMemo(() => shadows.map(shadowToCss).join(", "), [shadows]);
  const fullCss = `text-shadow: ${shadows.map(shadowToCss).join(",\n    ")};`;

  const active = shadows[activeIdx] || shadows[0];

  const updateShadow = (field: keyof TextShadow, value: number | string) => {
    setShadows((prev) =>
      prev.map((s, i) => (i === activeIdx ? { ...s, [field]: value } : s))
    );
  };

  const addShadow = () => {
    const id = nextShadowId++;
    setShadows((prev) => [...prev, { id, offsetX: 2, offsetY: 2, blur: 4, color: "#000000", opacity: 0.3 }]);
    setActiveIdx(shadows.length);
  };

  const removeShadow = (idx: number) => {
    if (shadows.length <= 1) return;
    setShadows((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => (prev >= idx && prev > 0 ? prev - 1 : prev));
  };

  return (
    <ToolLayout toolSlug="text-shadow-generator">
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
                    Shadow {i + 1}
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
                + Add Shadow
              </button>
            </div>

            {active && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">X Offset</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.offsetX}px</span>
                  </div>
                  <input type="range" min="-50" max="50" value={active.offsetX} onChange={(e) => updateShadow("offsetX", parseInt(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Y Offset</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.offsetY}px</span>
                  </div>
                  <input type="range" min="-50" max="50" value={active.offsetY} onChange={(e) => updateShadow("offsetY", parseInt(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Blur</label>
                    <span className="text-sm text-muted-foreground font-mono">{active.blur}px</span>
                  </div>
                  <input type="range" min="0" max="50" value={active.blur} onChange={(e) => updateShadow("blur", parseInt(e.target.value))} className="w-full accent-teal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Color</label>
                    <input type="color" value={active.color} onChange={(e) => updateShadow("color", e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-foreground">Opacity</label>
                      <span className="text-sm text-muted-foreground font-mono">{active.opacity.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value={active.opacity} onChange={(e) => updateShadow("opacity", parseFloat(e.target.value))} className="w-full accent-teal" />
                  </div>
                </div>
              </div>
            )}

            {/* Preview settings */}
            <div className="border-t border-border pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Preview Text</label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Font Size</label>
                    <span className="text-sm text-muted-foreground font-mono">{fontSize}px</span>
                  </div>
                  <input type="range" min="16" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Text Color</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center min-h-[300px] bg-white rounded-xl border border-border p-8">
            <span
              style={{
                fontSize: `${fontSize}px`,
                color: textColor,
                textShadow: cssValue,
                fontWeight: "bold",
              }}
            >
              {previewText}
            </span>
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">CSS</span>
            <CopyButton text={fullCss} />
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-foreground overflow-x-auto whitespace-pre">
            {fullCss}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

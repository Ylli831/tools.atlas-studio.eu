"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function GlassmorphismGeneratorTool() {
  const t = useTranslations("tools.glassmorphism-generator");
  const tc = useTranslations("common");

  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [shadowOpacity, setShadowOpacity] = useState(0.1);

  const cssOutput = useMemo(() => {
    const bg = hexToRgba(bgColor, transparency);
    const border = hexToRgba(bgColor, borderOpacity);
    return [
      `background: ${bg};`,
      `backdrop-filter: blur(${blur}px);`,
      `-webkit-backdrop-filter: blur(${blur}px);`,
      `border: 1px solid ${border};`,
      `border-radius: 16px;`,
      `box-shadow: 0 4px 30px rgba(0, 0, 0, ${shadowOpacity});`,
    ].join("\n");
  }, [blur, transparency, borderOpacity, bgColor, shadowOpacity]);

  return (
    <ToolLayout toolSlug="glassmorphism-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">{t("blur")}</label>
                <span className="text-sm text-muted-foreground font-mono">{blur}px</span>
              </div>
              <input type="range" min="0" max="20" step="0.5" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-teal" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">{t("transparency")}</label>
                <span className="text-sm text-muted-foreground font-mono">{transparency.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={transparency} onChange={(e) => setTransparency(Number(e.target.value))} className="w-full accent-teal" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">{t("border")} Opacity</label>
                <span className="text-sm text-muted-foreground font-mono">{borderOpacity.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full accent-teal" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">Shadow Opacity</label>
                <span className="text-sm text-muted-foreground font-mono">{shadowOpacity.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="0.5" step="0.01" value={shadowOpacity} onChange={(e) => setShadowOpacity(Number(e.target.value))} className="w-full accent-teal" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("bg_color")}</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center justify-center min-h-[350px] rounded-xl p-8"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            }}
          >
            <div className="relative">
              {/* Decorative shapes behind the glass */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-yellow-400 rounded-full opacity-80" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-pink-400 rounded-full opacity-80" />
              <div className="absolute top-1/2 -right-12 w-16 h-16 bg-blue-400 rounded-lg rotate-45 opacity-80" />

              <div
                className="relative z-10 w-64 h-48 flex flex-col items-center justify-center p-6"
                style={{
                  background: hexToRgba(bgColor, transparency),
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  border: `1px solid ${hexToRgba(bgColor, borderOpacity)}`,
                  borderRadius: "16px",
                  boxShadow: `0 4px 30px rgba(0, 0, 0, ${shadowOpacity})`,
                }}
              >
                <p className="text-white text-lg font-semibold mb-1">Glassmorphism</p>
                <p className="text-white/70 text-sm text-center">Frosted glass effect</p>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">{t("output_label")}</span>
            <CopyButton text={cssOutput} />
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
            {cssOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

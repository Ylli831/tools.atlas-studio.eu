"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const directionOptions = [
  { value: "to right", label: "Left to Right" },
  { value: "to left", label: "Right to Left" },
  { value: "to bottom", label: "Top to Bottom" },
  { value: "to top", label: "Bottom to Top" },
  { value: "to bottom right", label: "Diagonal (TL to BR)" },
  { value: "to bottom left", label: "Diagonal (TR to BL)" },
  { value: "to top right", label: "Diagonal (BL to TR)" },
  { value: "to top left", label: "Diagonal (BR to TL)" },
];

const presets = [
  { name: "Ocean", colors: ["#667eea", "#764ba2"] },
  { name: "Sunset", colors: ["#f093fb", "#f5576c"] },
  { name: "Forest", colors: ["#11998e", "#38ef7d"] },
  { name: "Fire", colors: ["#f12711", "#f5af19"] },
  { name: "Sky", colors: ["#a1c4fd", "#c2e9fb"] },
  { name: "Teal", colors: ["#487877", "#89b4b3"] },
  { name: "Rainbow", colors: ["#ff0000", "#ff8800", "#00cc00", "#0044ff"] },
  { name: "Gold", colors: ["#f7971e", "#ffd200"] },
];

export default function GradientTextGeneratorTool() {
  const t = useTranslations("tools.gradient-text-generator");
  const tc = useTranslations("common");

  const [colors, setColors] = useState(["#487877", "#cb6a3f"]);
  const [direction, setDirection] = useState("to right");
  const [text, setText] = useState("Gradient Text");
  const [fontSize, setFontSize] = useState(64);
  const [fontWeight, setFontWeight] = useState("bold");

  const gradientCss = useMemo(
    () => `linear-gradient(${direction}, ${colors.join(", ")})`,
    [direction, colors]
  );

  const fullCss = `background: ${gradientCss};\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;`;

  const updateColor = (index: number, value: string) => {
    setColors((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const addColor = () => {
    if (colors.length < 4) {
      setColors((prev) => [...prev, "#888888"]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <ToolLayout toolSlug="gradient-text-generator">
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex items-center justify-center min-h-[200px] bg-white rounded-xl border border-border p-8">
          <span
            style={{
              fontSize: `${fontSize}px`,
              fontWeight,
              background: gradientCss,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {text}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Text input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Preview Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>

            {/* Font size + weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-foreground">Font Size</label>
                  <span className="text-sm text-muted-foreground font-mono">{fontSize}px</span>
                </div>
                <input type="range" min="16" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-teal" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Weight</label>
                <select
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="900">Black (900)</option>
                  <option value="300">Light (300)</option>
                </select>
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                {directionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Color Stops</label>
                {colors.length < 4 && (
                  <button
                    onClick={addColor}
                    className="text-xs text-teal hover:underline"
                  >
                    + Add Color
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(i, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateColor(i, e.target.value)}
                      className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                    />
                    {colors.length > 2 && (
                      <button
                        onClick={() => removeColor(i)}
                        className="text-muted-foreground hover:text-red-500 transition-colors px-2"
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setColors([...preset.colors])}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-teal transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(to right, ${preset.colors.join(", ")})`,
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
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

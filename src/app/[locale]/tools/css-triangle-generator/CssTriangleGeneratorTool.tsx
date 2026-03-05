"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Direction = "up" | "down" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

function generateTriangleCss(direction: Direction, width: number, height: number, color: string): { css: string; style: React.CSSProperties } {
  const base: React.CSSProperties = {
    width: 0,
    height: 0,
  };

  let css = `width: 0;\nheight: 0;\n`;

  switch (direction) {
    case "up":
      base.borderLeft = `${width / 2}px solid transparent`;
      base.borderRight = `${width / 2}px solid transparent`;
      base.borderBottom = `${height}px solid ${color}`;
      css += `border-left: ${width / 2}px solid transparent;\nborder-right: ${width / 2}px solid transparent;\nborder-bottom: ${height}px solid ${color};`;
      break;
    case "down":
      base.borderLeft = `${width / 2}px solid transparent`;
      base.borderRight = `${width / 2}px solid transparent`;
      base.borderTop = `${height}px solid ${color}`;
      css += `border-left: ${width / 2}px solid transparent;\nborder-right: ${width / 2}px solid transparent;\nborder-top: ${height}px solid ${color};`;
      break;
    case "left":
      base.borderTop = `${height / 2}px solid transparent`;
      base.borderBottom = `${height / 2}px solid transparent`;
      base.borderRight = `${width}px solid ${color}`;
      css += `border-top: ${height / 2}px solid transparent;\nborder-bottom: ${height / 2}px solid transparent;\nborder-right: ${width}px solid ${color};`;
      break;
    case "right":
      base.borderTop = `${height / 2}px solid transparent`;
      base.borderBottom = `${height / 2}px solid transparent`;
      base.borderLeft = `${width}px solid ${color}`;
      css += `border-top: ${height / 2}px solid transparent;\nborder-bottom: ${height / 2}px solid transparent;\nborder-left: ${width}px solid ${color};`;
      break;
    case "top-left":
      base.borderTop = `${height}px solid ${color}`;
      base.borderRight = `${width}px solid transparent`;
      css += `border-top: ${height}px solid ${color};\nborder-right: ${width}px solid transparent;`;
      break;
    case "top-right":
      base.borderTop = `${height}px solid ${color}`;
      base.borderLeft = `${width}px solid transparent`;
      css += `border-top: ${height}px solid ${color};\nborder-left: ${width}px solid transparent;`;
      break;
    case "bottom-left":
      base.borderBottom = `${height}px solid ${color}`;
      base.borderRight = `${width}px solid transparent`;
      css += `border-bottom: ${height}px solid ${color};\nborder-right: ${width}px solid transparent;`;
      break;
    case "bottom-right":
      base.borderBottom = `${height}px solid ${color}`;
      base.borderLeft = `${width}px solid transparent`;
      css += `border-bottom: ${height}px solid ${color};\nborder-left: ${width}px solid transparent;`;
      break;
  }

  return { css, style: base };
}

const directions: { value: Direction; label: string; arrow: string }[] = [
  { value: "up", label: "Up", arrow: "\u25B2" },
  { value: "down", label: "Down", arrow: "\u25BC" },
  { value: "left", label: "Left", arrow: "\u25C0" },
  { value: "right", label: "Right", arrow: "\u25B6" },
  { value: "top-left", label: "Top Left", arrow: "\u25E4" },
  { value: "top-right", label: "Top Right", arrow: "\u25E5" },
  { value: "bottom-left", label: "Bottom Left", arrow: "\u25E3" },
  { value: "bottom-right", label: "Bottom Right", arrow: "\u25E2" },
];

export default function CssTriangleGeneratorTool() {
  const t = useTranslations("tools.css-triangle-generator");
  const tc = useTranslations("common");

  const [direction, setDirection] = useState<Direction>("up");
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState("#487877");

  const { css, style } = useMemo(
    () => generateTriangleCss(direction, width, height, color),
    [direction, width, height, color]
  );

  const fullCss = `.triangle {\n  ${css.split("\n").join("\n  ")}\n}`;

  return (
    <ToolLayout toolSlug="css-triangle-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Direction */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Direction</label>
              <div className="grid grid-cols-4 gap-2">
                {directions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDirection(d.value)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      direction === d.value
                        ? "bg-teal text-white"
                        : "bg-surface text-foreground hover:bg-border"
                    }`}
                  >
                    <span className="text-lg">{d.arrow}</span>
                    <span className="text-xs">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Width */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">Width</label>
                <span className="text-sm text-muted-foreground font-mono">{width}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full accent-teal"
              />
            </div>

            {/* Height */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-foreground">Height</label>
                <span className="text-sm text-muted-foreground font-mono">{height}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full accent-teal"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center min-h-[300px] bg-[#f0f0f0] rounded-xl border border-border p-8">
            <div style={style} />
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

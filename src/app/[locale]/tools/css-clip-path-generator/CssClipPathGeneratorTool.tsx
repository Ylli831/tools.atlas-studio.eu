"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type ShapeType = "circle" | "ellipse" | "polygon" | "inset";

interface PolygonPoint {
  x: number;
  y: number;
}

const PRESETS: Record<string, { shape: ShapeType; points?: PolygonPoint[]; circle?: { r: number; cx: number; cy: number }; ellipse?: { rx: number; ry: number; cx: number; cy: number }; inset?: { top: number; right: number; bottom: number; left: number; round: number } }> = {
  triangle: { shape: "polygon", points: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] },
  rhombus: { shape: "polygon", points: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }] },
  pentagon: { shape: "polygon", points: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }] },
  hexagon: { shape: "polygon", points: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }] },
  star: { shape: "polygon", points: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }] },
  arrow_right: { shape: "polygon", points: [{ x: 0, y: 25 }, { x: 60, y: 25 }, { x: 60, y: 0 }, { x: 100, y: 50 }, { x: 60, y: 100 }, { x: 60, y: 75 }, { x: 0, y: 75 }] },
  circle: { shape: "circle", circle: { r: 50, cx: 50, cy: 50 } },
  ellipse: { shape: "ellipse", ellipse: { rx: 50, ry: 35, cx: 50, cy: 50 } },
  inset_rect: { shape: "inset", inset: { top: 10, right: 10, bottom: 10, left: 10, round: 10 } },
};

export default function CssClipPathGeneratorTool() {
  const t = useTranslations("tools.css-clip-path-generator");
  const tc = useTranslations("common");

  const [shape, setShape] = useState<ShapeType>("polygon");
  const [points, setPoints] = useState<PolygonPoint[]>(PRESETS.triangle.points!);
  const [circleR, setCircleR] = useState(50);
  const [circleCx, setCircleCx] = useState(50);
  const [circleCy, setCircleCy] = useState(50);
  const [ellipseRx, setEllipseRx] = useState(50);
  const [ellipseRy, setEllipseRy] = useState(35);
  const [ellipseCx, setEllipseCx] = useState(50);
  const [ellipseCy, setEllipseCy] = useState(50);
  const [insetTop, setInsetTop] = useState(10);
  const [insetRight, setInsetRight] = useState(10);
  const [insetBottom, setInsetBottom] = useState(10);
  const [insetLeft, setInsetLeft] = useState(10);
  const [insetRound, setInsetRound] = useState(0);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const clipPath = useMemo(() => {
    switch (shape) {
      case "circle":
        return `circle(${circleR}% at ${circleCx}% ${circleCy}%)`;
      case "ellipse":
        return `ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseCx}% ${ellipseCy}%)`;
      case "inset":
        return `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%${insetRound > 0 ? ` round ${insetRound}px` : ""})`;
      case "polygon":
      default:
        return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
    }
  }, [shape, points, circleR, circleCx, circleCy, ellipseRx, ellipseRy, ellipseCx, ellipseCy, insetTop, insetRight, insetBottom, insetLeft, insetRound]);

  const cssOutput = `clip-path: ${clipPath};`;

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    setShape(preset.shape);
    if (preset.points) setPoints([...preset.points]);
    if (preset.circle) {
      setCircleR(preset.circle.r);
      setCircleCx(preset.circle.cx);
      setCircleCy(preset.circle.cy);
    }
    if (preset.ellipse) {
      setEllipseRx(preset.ellipse.rx);
      setEllipseRy(preset.ellipse.ry);
      setEllipseCx(preset.ellipse.cx);
      setEllipseCy(preset.ellipse.cy);
    }
    if (preset.inset) {
      setInsetTop(preset.inset.top);
      setInsetRight(preset.inset.right);
      setInsetBottom(preset.inset.bottom);
      setInsetLeft(preset.inset.left);
      setInsetRound(preset.inset.round);
    }
  };

  const handleSvgMouseDown = useCallback((idx: number) => {
    setDraggingIdx(idx);
  }, []);

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (draggingIdx === null || shape !== "polygon") return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
      const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
      setPoints((prev) => prev.map((p, i) => (i === draggingIdx ? { x, y } : p)));
    },
    [draggingIdx, shape]
  );

  const handleSvgMouseUp = useCallback(() => {
    setDraggingIdx(null);
  }, []);

  const addPoint = () => {
    setPoints((prev) => [...prev, { x: 50, y: 50 }]);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 3) return;
    setPoints((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <ToolLayout toolSlug="css-clip-path-generator">
      <div className="space-y-6">
        {/* Shape selector */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm font-medium text-foreground mb-3 block">{t("shape")}</label>
          <div className="flex flex-wrap gap-2">
            {(["circle", "ellipse", "polygon", "inset"] as ShapeType[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setShape(s);
                  if (s === "polygon" && points.length < 3) setPoints(PRESETS.triangle.points!);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  shape === s ? "bg-teal text-white" : "bg-surface text-foreground hover:bg-border"
                }`}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm font-medium text-foreground mb-3 block">Presets</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="bg-surface text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border transition-colors text-sm capitalize"
              >
                {key.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive preview */}
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="text-sm font-medium text-foreground mb-3 block">{t("shape")} Editor</label>
            <div className="relative aspect-square bg-[#e8e8e8] dark:bg-[#2a2a2a] rounded-lg overflow-hidden">
              {/* Clipped element */}
              <div
                className="absolute inset-0 bg-teal"
                style={{ clipPath }}
              />
              {/* SVG overlay for handles */}
              {shape === "polygon" && (
                <svg
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  viewBox="0 0 100 100"
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={handleSvgMouseUp}
                  onMouseLeave={handleSvgMouseUp}
                >
                  {/* Outline */}
                  <polygon
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                  {/* Handles */}
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="2.5"
                      fill="white"
                      stroke="#487877"
                      strokeWidth="0.8"
                      className="cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleSvgMouseDown(i);
                      }}
                    />
                  ))}
                </svg>
              )}
            </div>
            {shape === "polygon" && (
              <div className="flex gap-2 mt-3">
                <button onClick={addPoint} className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm">
                  + Add Point
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {shape === "circle" && (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Radius</label>
                    <span className="text-sm text-muted-foreground font-mono">{circleR}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={circleR} onChange={(e) => setCircleR(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Center X</label>
                    <span className="text-sm text-muted-foreground font-mono">{circleCx}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={circleCx} onChange={(e) => setCircleCx(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Center Y</label>
                    <span className="text-sm text-muted-foreground font-mono">{circleCy}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={circleCy} onChange={(e) => setCircleCy(Number(e.target.value))} className="w-full accent-teal" />
                </div>
              </>
            )}

            {shape === "ellipse" && (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Radius X</label>
                    <span className="text-sm text-muted-foreground font-mono">{ellipseRx}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={ellipseRx} onChange={(e) => setEllipseRx(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Radius Y</label>
                    <span className="text-sm text-muted-foreground font-mono">{ellipseRy}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={ellipseRy} onChange={(e) => setEllipseRy(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Center X</label>
                    <span className="text-sm text-muted-foreground font-mono">{ellipseCx}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={ellipseCx} onChange={(e) => setEllipseCx(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Center Y</label>
                    <span className="text-sm text-muted-foreground font-mono">{ellipseCy}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={ellipseCy} onChange={(e) => setEllipseCy(Number(e.target.value))} className="w-full accent-teal" />
                </div>
              </>
            )}

            {shape === "inset" && (
              <>
                {[
                  { label: "Top", value: insetTop, set: setInsetTop },
                  { label: "Right", value: insetRight, set: setInsetRight },
                  { label: "Bottom", value: insetBottom, set: setInsetBottom },
                  { label: "Left", value: insetLeft, set: setInsetLeft },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-foreground">{label}</label>
                      <span className="text-sm text-muted-foreground font-mono">{value}%</span>
                    </div>
                    <input type="range" min="0" max="50" value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-teal" />
                  </div>
                ))}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Border Radius</label>
                    <span className="text-sm text-muted-foreground font-mono">{insetRound}px</span>
                  </div>
                  <input type="range" min="0" max="100" value={insetRound} onChange={(e) => setInsetRound(Number(e.target.value))} className="w-full accent-teal" />
                </div>
              </>
            )}

            {shape === "polygon" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Points</label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {points.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={p.x}
                        onChange={(e) => setPoints((prev) => prev.map((pt, j) => (j === i ? { ...pt, x: Number(e.target.value) } : pt)))}
                        className="w-20 bg-card border border-border rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:border-teal"
                      />
                      <span className="text-xs text-muted-foreground">,</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={p.y}
                        onChange={(e) => setPoints((prev) => prev.map((pt, j) => (j === i ? { ...pt, y: Number(e.target.value) } : pt)))}
                        className="w-20 bg-card border border-border rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:border-teal"
                      />
                      {points.length > 3 && (
                        <button onClick={() => removePoint(i)} className="text-muted-foreground hover:text-red-500 text-sm">
                          x
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">{t("output_label")}</span>
            <CopyButton text={cssOutput} />
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-foreground overflow-x-auto">
            {cssOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function BorderRadiusGeneratorTool() {
  const t = useTranslations("tools.border-radius-generator");
  const tc = useTranslations("common");

  const [linked, setLinked] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  // Simple mode: 4 corners
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);

  // Advanced mode: 8 values (horizontal / vertical per corner)
  const [tlH, setTlH] = useState(16);
  const [tlV, setTlV] = useState(16);
  const [trH, setTrH] = useState(16);
  const [trV, setTrV] = useState(16);
  const [brH, setBrH] = useState(16);
  const [brV, setBrV] = useState(16);
  const [blH, setBlH] = useState(16);
  const [blV, setBlV] = useState(16);

  const [unit, setUnit] = useState<"px" | "%">("px");

  const handleLinkedChange = (value: number) => {
    setTl(value); setTr(value); setBr(value); setBl(value);
  };

  const borderRadius = useMemo(() => {
    if (advanced) {
      const h = `${tlH}${unit} ${trH}${unit} ${brH}${unit} ${blH}${unit}`;
      const v = `${tlV}${unit} ${trV}${unit} ${brV}${unit} ${blV}${unit}`;
      if (h === v) return h;
      return `${h} / ${v}`;
    }
    if (tl === tr && tr === br && br === bl) return `${tl}${unit}`;
    return `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
  }, [advanced, tl, tr, br, bl, tlH, tlV, trH, trV, brH, brV, blH, blV, unit]);

  const cssOutput = `border-radius: ${borderRadius};`;

  const PRESETS = [
    { label: "None", values: [0, 0, 0, 0] },
    { label: "Subtle", values: [4, 4, 4, 4] },
    { label: "Rounded", values: [16, 16, 16, 16] },
    { label: "Pill", values: [9999, 9999, 9999, 9999] },
    { label: "Top only", values: [16, 16, 0, 0] },
    { label: "Left only", values: [16, 0, 0, 16] },
    { label: "Diagonal", values: [16, 0, 16, 0] },
    { label: "Blob", values: [30, 70, 70, 30] },
  ];

  const applyPreset = (values: number[]) => {
    setAdvanced(false);
    setTl(values[0]); setTr(values[1]); setBr(values[2]); setBl(values[3]);
  };

  return (
    <ToolLayout toolSlug="border-radius-generator">
      <div className="space-y-6">
        {/* Mode toggle + unit */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAdvanced(false)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${!advanced ? "bg-teal text-white" : "bg-surface text-foreground hover:bg-border"}`}
          >
            Simple
          </button>
          <button
            onClick={() => {
              setAdvanced(true);
              setTlH(tl); setTlV(tl); setTrH(tr); setTrV(tr);
              setBrH(br); setBrV(br); setBlH(bl); setBlV(bl);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${advanced ? "bg-teal text-white" : "bg-surface text-foreground hover:bg-border"}`}
          >
            Advanced (8 values)
          </button>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "px" | "%")} className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal">
            <option value="px">px</option>
            <option value="%">%</option>
          </select>
        </div>

        {/* Presets */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm font-medium text-foreground mb-3 block">Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p.values)} className="bg-surface text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border transition-colors text-sm">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {!advanced ? (
              <>
                {linked && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-foreground">All Corners</label>
                      <span className="text-sm text-muted-foreground font-mono">{tl}{unit}</span>
                    </div>
                    <input type="range" min="0" max={unit === "px" ? 200 : 50} value={tl} onChange={(e) => handleLinkedChange(Number(e.target.value))} className="w-full accent-teal" />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="w-4 h-4 rounded border-border accent-teal" />
                  <span className="text-sm font-medium text-foreground">{t("link_corners")}</span>
                </label>
                {!linked && (
                  <>
                    {[
                      { label: t("top_left"), value: tl, set: setTl },
                      { label: t("top_right"), value: tr, set: setTr },
                      { label: t("bottom_right"), value: br, set: setBr },
                      { label: t("bottom_left"), value: bl, set: setBl },
                    ].map(({ label, value, set }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-foreground">{label}</label>
                          <span className="text-sm text-muted-foreground font-mono">{value}{unit}</span>
                        </div>
                        <input type="range" min="0" max={unit === "px" ? 200 : 50} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-teal" />
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <div className="space-y-3">
                {[
                  { label: `${t("top_left")} H`, value: tlH, set: setTlH },
                  { label: `${t("top_left")} V`, value: tlV, set: setTlV },
                  { label: `${t("top_right")} H`, value: trH, set: setTrH },
                  { label: `${t("top_right")} V`, value: trV, set: setTrV },
                  { label: `${t("bottom_right")} H`, value: brH, set: setBrH },
                  { label: `${t("bottom_right")} V`, value: brV, set: setBrV },
                  { label: `${t("bottom_left")} H`, value: blH, set: setBlH },
                  { label: `${t("bottom_left")} V`, value: blV, set: setBlV },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-foreground">{label}</label>
                      <span className="text-sm text-muted-foreground font-mono">{value}{unit}</span>
                    </div>
                    <input type="range" min="0" max={unit === "px" ? 200 : 50} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-teal" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center min-h-[300px] bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-xl border border-border p-8">
            <div
              className="w-48 h-48 bg-teal"
              style={{ borderRadius }}
            />
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

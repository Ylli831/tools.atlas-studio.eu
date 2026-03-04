"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ITEM_COLORS = [
  "#487877", "#cb6a3f", "#5b8a72", "#8b5e3c", "#6a7b8b",
  "#9c6b8a", "#7a8a5e", "#b07d4f", "#5c7a9a", "#8a6a5e",
];

type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type JustifyContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type AlignItems = "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export default function FlexboxPlaygroundTool() {
  const t = useTranslations("tools.flexbox-playground");
  const [direction, setDirection] = useState<FlexDirection>("row");
  const [justify, setJustify] = useState<JustifyContent>("flex-start");
  const [alignItems, setAlignItems] = useState<AlignItems>("stretch");
  const [wrap, setWrap] = useState<FlexWrap>("nowrap");
  const [gap, setGap] = useState(8);
  const [itemCount, setItemCount] = useState(3);

  const addItem = () => setItemCount((c) => Math.min(c + 1, 12));
  const removeItem = () => setItemCount((c) => Math.max(c - 1, 1));

  const cssOutput = useMemo(() => {
    const lines = [
      ".container {",
      "  display: flex;",
      `  flex-direction: ${direction};`,
      `  justify-content: ${justify};`,
      `  align-items: ${alignItems};`,
      `  flex-wrap: ${wrap};`,
      `  gap: ${gap}px;`,
      "}",
    ];
    return lines.join("\n");
  }, [direction, justify, alignItems, wrap, gap]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    justifyContent: justify,
    alignItems: alignItems,
    flexWrap: wrap,
    gap: `${gap}px`,
    minHeight: "200px",
    padding: "16px",
  };

  return (
    <ToolLayout toolSlug="flexbox-playground">
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t("container")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("direction")}
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as FlexDirection)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="row">row</option>
                <option value="column">column</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("justify")}
              </label>
              <select
                value={justify}
                onChange={(e) => setJustify(e.target.value as JustifyContent)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("align_items")}
              </label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value as AlignItems)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="stretch">stretch</option>
                <option value="baseline">baseline</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("wrap")}
              </label>
              <select
                value={wrap}
                onChange={(e) => setWrap(e.target.value as FlexWrap)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {t("gap")} ({gap}px)
              </label>
              <input
                type="range"
                min={0}
                max={40}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{t("items")}: {itemCount}</span>
          <button
            onClick={addItem}
            className="bg-teal text-white font-medium px-3 py-1 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("add_item")}
          </button>
          <button
            onClick={removeItem}
            className="bg-surface text-foreground font-medium px-3 py-1 rounded-lg hover:bg-border transition-colors text-sm"
          >
            -
          </button>
        </div>

        <div className="bg-card border-2 border-dashed border-border rounded-xl overflow-hidden">
          <div style={containerStyle}>
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg text-white font-bold text-lg select-none"
                style={{
                  backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                  minWidth: "60px",
                  minHeight: "60px",
                  padding: "12px 20px",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">{t("css_output")}</label>
            <CopyButton text={cssOutput} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto whitespace-pre-wrap">
            {cssOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

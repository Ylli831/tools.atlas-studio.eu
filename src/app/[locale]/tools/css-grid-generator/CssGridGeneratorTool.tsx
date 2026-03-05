"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface GridItem {
  id: number;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  color: string;
}

const itemColors = [
  "#487877", "#cb6a3f", "#667eea", "#38ef7d", "#f5576c",
  "#f7971e", "#764ba2", "#11998e", "#a1c4fd", "#f093fb",
];

let nextItemId = 1;

export default function CssGridGeneratorTool() {
  const t = useTranslations("tools.css-grid-generator");
  const tc = useTranslations("common");

  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [colSizes, setColSizes] = useState<string[]>(["1fr", "1fr", "1fr"]);
  const [rowSizes, setRowSizes] = useState<string[]>(["1fr", "1fr", "1fr"]);
  const [gap, setGap] = useState(10);
  const [items, setItems] = useState<GridItem[]>([]);
  const [selecting, setSelecting] = useState<{ startCol: number; startRow: number } | null>(null);

  const updateColumns = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(12, n));
    setColumns(clamped);
    setColSizes((prev) => {
      const newSizes = [...prev];
      while (newSizes.length < clamped) newSizes.push("1fr");
      return newSizes.slice(0, clamped);
    });
    setItems((prev) => prev.filter((item) => item.colStart <= clamped && item.colEnd <= clamped + 1));
  }, []);

  const updateRows = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(12, n));
    setRows(clamped);
    setRowSizes((prev) => {
      const newSizes = [...prev];
      while (newSizes.length < clamped) newSizes.push("1fr");
      return newSizes.slice(0, clamped);
    });
    setItems((prev) => prev.filter((item) => item.rowStart <= clamped && item.rowEnd <= clamped + 1));
  }, []);

  const updateColSize = (i: number, val: string) => {
    setColSizes((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  };

  const updateRowSize = (i: number, val: string) => {
    setRowSizes((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  };

  const handleCellClick = (col: number, row: number) => {
    if (!selecting) {
      setSelecting({ startCol: col, startRow: row });
    } else {
      const colStart = Math.min(selecting.startCol, col);
      const colEnd = Math.max(selecting.startCol, col) + 1;
      const rowStart = Math.min(selecting.startRow, row);
      const rowEnd = Math.max(selecting.startRow, row) + 1;

      const newItem: GridItem = {
        id: nextItemId++,
        colStart,
        colEnd,
        rowStart,
        rowEnd,
        color: itemColors[(items.length) % itemColors.length],
      };
      setItems((prev) => [...prev, newItem]);
      setSelecting(null);
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearItems = () => {
    setItems([]);
    setSelecting(null);
  };

  const gridTemplateCols = colSizes.join(" ");
  const gridTemplateRows = rowSizes.join(" ");

  const containerCss = useMemo(() => {
    return `.grid-container {\n  display: grid;\n  grid-template-columns: ${gridTemplateCols};\n  grid-template-rows: ${gridTemplateRows};\n  gap: ${gap}px;\n}`;
  }, [gridTemplateCols, gridTemplateRows, gap]);

  const itemsCss = useMemo(() => {
    return items
      .map(
        (item, i) =>
          `.item-${i + 1} {\n  grid-column: ${item.colStart} / ${item.colEnd};\n  grid-row: ${item.rowStart} / ${item.rowEnd};\n}`
      )
      .join("\n\n");
  }, [items]);

  const fullCss = itemsCss ? `${containerCss}\n\n${itemsCss}` : containerCss;

  const isCellOccupied = (col: number, row: number) => {
    return items.some(
      (item) =>
        col >= item.colStart && col < item.colEnd && row >= item.rowStart && row < item.rowEnd
    );
  };

  const getItemAtCell = (col: number, row: number) => {
    return items.find(
      (item) =>
        col >= item.colStart && col < item.colEnd && row >= item.rowStart && row < item.rowEnd
    );
  };

  return (
    <ToolLayout toolSlug="css-grid-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={columns}
                  onChange={(e) => updateColumns(parseInt(e.target.value) || 1)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={rows}
                  onChange={(e) => updateRows(parseInt(e.target.value) || 1)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Gap</label>
                  <span className="text-sm text-muted-foreground font-mono">{gap}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={gap}
                  onChange={(e) => setGap(parseInt(e.target.value))}
                  className="w-full accent-teal mt-1"
                />
              </div>
            </div>

            {/* Column Sizes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Column Sizes</label>
              <div className="flex flex-wrap gap-2">
                {colSizes.map((size, i) => (
                  <input
                    key={i}
                    type="text"
                    value={size}
                    onChange={(e) => updateColSize(i, e.target.value)}
                    className="w-20 bg-card border border-border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-teal text-center"
                    placeholder="1fr"
                  />
                ))}
              </div>
            </div>

            {/* Row Sizes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Row Sizes</label>
              <div className="flex flex-wrap gap-2">
                {rowSizes.map((size, i) => (
                  <input
                    key={i}
                    type="text"
                    value={size}
                    onChange={(e) => updateRowSize(i, e.target.value)}
                    className="w-20 bg-card border border-border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-teal text-center"
                    placeholder="1fr"
                  />
                ))}
              </div>
            </div>

            {/* Items list */}
            {items.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Items ({items.length})</label>
                  <button onClick={clearItems} className="text-xs text-red-500 hover:underline">
                    Clear All
                  </button>
                </div>
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between bg-surface rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                        <span className="text-xs font-mono text-foreground">
                          Item {i + 1}: col {item.colStart}/{item.colEnd}, row {item.rowStart}/{item.rowEnd}
                        </span>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-muted-foreground hover:text-red-500">
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {selecting
                ? "Click another cell to complete the selection area"
                : "Click a cell to start placing an item, then click another to define the area"}
            </p>
          </div>

          {/* Grid Preview */}
          <div className="bg-[#f0f0f0] rounded-xl border border-border p-4 min-h-[300px]">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: gridTemplateCols,
                gridTemplateRows: gridTemplateRows,
                gap: `${gap}px`,
                minHeight: "280px",
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: columns }).map((_, c) => {
                  const col = c + 1;
                  const row = r + 1;
                  const item = getItemAtCell(col, row);
                  const isOrigin = item && item.colStart === col && item.rowStart === row;
                  const occupied = isCellOccupied(col, row);
                  const isStart = selecting?.startCol === col && selecting?.startRow === row;

                  if (occupied && !isOrigin) return null;

                  if (isOrigin && item) {
                    return (
                      <div
                        key={`${col}-${row}`}
                        className="rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          gridColumn: `${item.colStart} / ${item.colEnd}`,
                          gridRow: `${item.rowStart} / ${item.rowEnd}`,
                          background: item.color,
                        }}
                        onClick={() => removeItem(item.id)}
                        title="Click to remove"
                      >
                        {items.indexOf(item) + 1}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${col}-${row}`}
                      className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground cursor-pointer transition-colors ${
                        isStart
                          ? "border-teal bg-teal/10"
                          : "border-border/50 hover:border-teal/50 hover:bg-teal/5"
                      }`}
                      onClick={() => handleCellClick(col, row)}
                    >
                      {col},{row}
                    </div>
                  );
                })
              )}
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

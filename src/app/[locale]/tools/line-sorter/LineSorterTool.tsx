"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type SortMode = "az" | "za" | "len-asc" | "len-desc" | "reverse" | "shuffle" | "dedup";

function processLines(text: string, mode: SortMode, caseSensitive: boolean, trimLines: boolean): string {
  let lines = text.split("\n");
  if (trimLines) lines = lines.map((l) => l.trim());

  switch (mode) {
    case "az":
      return [...lines].sort((a, b) => caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase())).join("\n");
    case "za":
      return [...lines].sort((a, b) => caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase())).join("\n");
    case "len-asc":
      return [...lines].sort((a, b) => a.length - b.length).join("\n");
    case "len-desc":
      return [...lines].sort((a, b) => b.length - a.length).join("\n");
    case "reverse":
      return [...lines].reverse().join("\n");
    case "shuffle":
      return [...lines].sort(() => Math.random() - 0.5).join("\n");
    case "dedup": {
      const seen = new Set<string>();
      return lines.filter((l) => {
        const key = caseSensitive ? l : l.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).join("\n");
    }
  }
}

export default function LineSorterTool() {
  const t = useTranslations("tools.line-sorter");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<SortMode>("az");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);

  const output = input ? processLines(input, mode, caseSensitive, trimLines) : "";
  const lineCount = input ? input.split("\n").length : 0;

  const MODES: { key: SortMode; label: string }[] = [
    { key: "az", label: t("az") },
    { key: "za", label: t("za") },
    { key: "len-asc", label: t("len_asc") },
    { key: "len-desc", label: t("len_desc") },
    { key: "reverse", label: t("reverse") },
    { key: "shuffle", label: t("shuffle") },
    { key: "dedup", label: t("dedup") },
  ];

  return (
    <ToolLayout toolSlug="line-sorter">
      <div className="space-y-4">
        {/* Mode selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{t("sort_mode")}</label>
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === m.key ? "bg-teal text-white" : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded border-border" />
            <span className="text-foreground">{t("case_sensitive")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="rounded border-border" />
            <span className="text-foreground">{t("trim_lines")}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{t("input_label")}</label>
              <span className="text-xs text-muted-foreground">{lineCount} {t("lines")}</span>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={t("input_placeholder")} rows={12}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
              {output && <CopyButton text={output} />}
            </div>
            <pre className="w-full h-[300px] rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground overflow-auto whitespace-pre-wrap">
              {output || <span className="text-muted-foreground">{t("output_placeholder")}</span>}
            </pre>
          </div>
        </div>

        {output && (
          <button onClick={() => setInput(output)}
            className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-4 py-2 hover:border-teal transition-colors"
          >
            {t("use_as_input")}
          </button>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function beautifyCss(css: string, indentSize: number, useTabs: boolean): string {
  const indent = useTabs ? "\t" : " ".repeat(indentSize);
  let result = css;

  // Remove existing excess whitespace
  result = result.replace(/\s+/g, " ").trim();

  // Add newline after opening brace
  result = result.replace(/\{/g, " {\n");

  // Add newline before closing brace
  result = result.replace(/\}/g, "\n}\n\n");

  // Add newline after semicolons (inside rules)
  result = result.replace(/;/g, ";\n");

  // Add newline after commas in selectors
  result = result.replace(/,\s*(?=[^}]*\{)/g, ",\n");

  // Now apply indentation
  const lines = result.split("\n");
  let depth = 0;
  const formatted: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Decrease depth before closing brace
    if (line.startsWith("}")) {
      depth = Math.max(0, depth - 1);
    }

    formatted.push(indent.repeat(depth) + line);

    // Increase depth after opening brace
    if (line.endsWith("{")) {
      depth++;
    }
  }

  // Clean up: ensure blank line between rule blocks
  let output = formatted.join("\n");
  output = output.replace(/\}\n(?!\n)/g, "}\n\n");
  // Remove trailing blank lines at end
  output = output.replace(/\n{3,}/g, "\n\n").trim();

  return output;
}

export default function CssBeautifierTool() {
  const t = useTranslations("tools.css-beautifier");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);

  const handleBeautify = useCallback(() => {
    if (!input.trim()) return;
    const beautified = beautifyCss(input, indentSize, useTabs);
    setOutput(beautified);
  }, [input, indentSize, useTabs]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  return (
    <ToolLayout toolSlug="css-beautifier">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("input_label")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("input_placeholder")}
            rows={10}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-medium text-foreground mb-3">{t("options")}</div>
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-foreground">
              {t("indent_size")}
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
                disabled={useTabs}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={useTabs}
                onChange={(e) => setUseTabs(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal"
              />
              {t("use_tabs")}
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleBeautify}
            disabled={!input.trim()}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("beautify")}
          </button>
          <button
            onClick={handleClear}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {tc("clear")}
          </button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

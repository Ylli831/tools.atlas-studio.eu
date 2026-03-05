"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function minifyCss(css: string): string {
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove whitespace around selectors and braces
  result = result.replace(/\s*([{}:;,>~+])\s*/g, "$1");
  // Remove last semicolons before closing braces
  result = result.replace(/;}/g, "}");
  // Remove newlines and tabs
  result = result.replace(/[\n\r\t]/g, "");
  // Collapse multiple spaces
  result = result.replace(/\s{2,}/g, " ");
  // Remove leading/trailing whitespace
  result = result.trim();
  // Remove spaces around !important
  result = result.replace(/\s*!\s*important/gi, "!important");
  // Shorten 0px to 0
  result = result.replace(/(:|\s)0(px|em|rem|%|vh|vw|pt|cm|mm|in|pc|ex|ch)/gi, "$10");
  // Remove units from 0 values in shorthand
  result = result.replace(/:0 0 0 0(;|})/g, ":0$1");
  // Shorten hex colors #aabbcc -> #abc
  result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, "#$1$2$3");

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

export default function CssMinifierTool() {
  const t = useTranslations("tools.css-minifier");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const minified = minifyCss(input);
    setOutput(minified);
    setStats({
      original: new Blob([input]).size,
      minified: new Blob([minified]).size,
    });
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStats(null);
  }, []);

  const savingsPercent = stats
    ? ((1 - stats.minified / stats.original) * 100).toFixed(1)
    : null;

  return (
    <ToolLayout toolSlug="css-minifier">
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

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleMinify}
            disabled={!input.trim()}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("minify")}
          </button>
          <button
            onClick={handleClear}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {tc("clear")}
          </button>
        </div>

        {stats && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">{t("original_size")}</div>
                <div className="text-lg font-semibold text-foreground">{formatBytes(stats.original)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("minified_size")}</div>
                <div className="text-lg font-semibold text-foreground">{formatBytes(stats.minified)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("savings")}</div>
                <div className="text-lg font-semibold text-success">{savingsPercent}%</div>
              </div>
            </div>
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

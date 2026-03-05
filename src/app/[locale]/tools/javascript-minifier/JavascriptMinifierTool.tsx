"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function minifyJs(js: string): string {
  let result = js;

  // Remove single-line comments (but not URLs like http://)
  result = result.replace(/([^:\/])\/\/.*$/gm, "$1");

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  // Preserve string literals by replacing them with placeholders
  const strings: string[] = [];
  result = result.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, (match) => {
    strings.push(match);
    return `__STR_${strings.length - 1}__`;
  });

  // Remove leading/trailing whitespace on each line
  result = result
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  // Remove newlines where safe (not after certain keywords)
  result = result.replace(/\n/g, " ");

  // Collapse multiple spaces into one
  result = result.replace(/\s{2,}/g, " ");

  // Remove spaces around operators
  result = result.replace(/\s*([=+\-*/<>!&|^~?:,;{}()[\]])\s*/g, "$1");

  // Add back necessary spaces after keywords
  result = result.replace(
    /\b(var|let|const|return|typeof|instanceof|new|delete|throw|in|of|case|void|else|if|for|while|do|switch|try|catch|finally|class|extends|import|export|from|default|function|async|await|yield)\b(?=[^\s;,)}])/g,
    "$1 "
  );

  // Add back space after closing brace before keywords
  result = result.replace(/}(else|catch|finally|while)/g, "} $1");

  // Restore string literals
  result = result.replace(/__STR_(\d+)__/g, (_, i) => strings[parseInt(i)]);

  return result.trim();
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

export default function JavascriptMinifierTool() {
  const t = useTranslations("tools.javascript-minifier");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);
  const [error, setError] = useState("");

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const minified = minifyJs(input);
      setOutput(minified);
      setStats({
        original: new Blob([input]).size,
        minified: new Blob([minified]).size,
      });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Minification error");
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStats(null);
    setError("");
  }, []);

  const savingsPercent = stats
    ? ((1 - stats.minified / stats.original) * 100).toFixed(1)
    : null;

  return (
    <ToolLayout toolSlug="javascript-minifier">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("input_label")}
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
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

          {error && (
            <span className="text-sm text-danger font-medium">{error}</span>
          )}
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

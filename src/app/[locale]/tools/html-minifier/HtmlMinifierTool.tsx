"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface MinifyOptions {
  removeComments: boolean;
  removeWhitespace: boolean;
  removeOptionalTags: boolean;
  removeAttributeQuotes: boolean;
}

function minifyHtml(html: string, options: MinifyOptions): string {
  let result = html;

  if (options.removeComments) {
    // Remove HTML comments (but keep conditional comments)
    result = result.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");
  }

  if (options.removeWhitespace) {
    // Remove whitespace between tags
    result = result.replace(/>\s+</g, "><");
    // Collapse multiple spaces within text
    result = result.replace(/\s{2,}/g, " ");
    // Remove leading/trailing whitespace
    result = result.trim();
  }

  if (options.removeOptionalTags) {
    // Remove optional closing tags
    result = result.replace(/<\/(li|dt|dd|p|tr|td|th|option|thead|tbody|tfoot|colgroup)>/gi, "");
  }

  if (options.removeAttributeQuotes) {
    // Remove quotes from simple attribute values (single word, no special chars)
    result = result.replace(/=["']([a-zA-Z0-9_-]+)["']/g, "=$1");
  }

  // Remove type="text/javascript" and type="text/css"
  result = result.replace(/\s*type=["']text\/(javascript|css)["']/gi, "");

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

export default function HtmlMinifierTool() {
  const t = useTranslations("tools.html-minifier");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);
  const [options, setOptions] = useState<MinifyOptions>({
    removeComments: true,
    removeWhitespace: true,
    removeOptionalTags: false,
    removeAttributeQuotes: false,
  });

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const minified = minifyHtml(input, options);
    setOutput(minified);
    setStats({
      original: new Blob([input]).size,
      minified: new Blob([minified]).size,
    });
  }, [input, options]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStats(null);
  }, []);

  const savingsPercent = stats
    ? ((1 - stats.minified / stats.original) * 100).toFixed(1)
    : null;

  const toggleOption = (key: keyof MinifyOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ToolLayout toolSlug="html-minifier">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(options) as (keyof MinifyOptions)[]).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => toggleOption(key)}
                  className="rounded border-border text-teal focus:ring-teal"
                />
                {t(`option_${key}`)}
              </label>
            ))}
          </div>
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

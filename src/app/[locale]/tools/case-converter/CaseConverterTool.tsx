"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "dot" | "constant" | "alternating" | "inverse";

export default function CaseConverterTool() {
  const t = useTranslations("tools.case-converter");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const conversions: { key: CaseType; label: string; fn: (s: string) => string }[] = [
    { key: "upper", label: t("uppercase"), fn: (s) => s.toUpperCase() },
    { key: "lower", label: t("lowercase"), fn: (s) => s.toLowerCase() },
    { key: "title", label: t("title_case"), fn: (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()) },
    { key: "sentence", label: t("sentence_case"), fn: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase()) },
    { key: "camel", label: "camelCase", fn: (s) => toWords(s).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") },
    { key: "pascal", label: "PascalCase", fn: (s) => toWords(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") },
    { key: "snake", label: "snake_case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("_") },
    { key: "kebab", label: "kebab-case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("-") },
    { key: "dot", label: "dot.case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join(".") },
    { key: "constant", label: "CONSTANT_CASE", fn: (s) => toWords(s).map((w) => w.toUpperCase()).join("_") },
    { key: "alternating", label: t("alternating"), fn: (s) => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
    { key: "inverse", label: t("inverse"), fn: (s) => s.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("") },
  ];

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout toolSlug="case-converter">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("input_label")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("input_placeholder")}
            rows={4}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
          />
        </div>

        {input.trim() && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conversions.map(({ key, label, fn }) => {
              const result = fn(input);
              return (
                <div key={key} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <button
                      onClick={() => copy(result, key)}
                      className="text-xs text-teal hover:underline"
                    >
                      {copied === key ? tc("copied") : tc("copy")}
                    </button>
                  </div>
                  <p className="text-sm text-foreground font-mono break-all line-clamp-3">{result}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-./]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

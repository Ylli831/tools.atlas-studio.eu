"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\u00A0": "&nbsp;",
  "\u00A9": "&copy;",
  "\u00AE": "&reg;",
  "\u2122": "&trade;",
  "\u20AC": "&euro;",
  "\u00A3": "&pound;",
  "\u00A5": "&yen;",
  "\u00B1": "&plusmn;",
  "\u00D7": "&times;",
  "\u00F7": "&divide;",
};

function encodeEntities(str: string): string {
  return str.replace(/[&<>"'\u00A0\u00A9\u00AE\u2122\u20AC\u00A3\u00A5\u00B1\u00D7\u00F7]/g, (ch) => ENTITY_MAP[ch] || ch);
}

function decodeEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

export default function HtmlEntityEncoderTool() {
  const t = useTranslations("tools.html-entity-encoder");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeEntities(input) : decodeEntities(input);
    } catch {
      return "";
    }
  }, [input, mode]);

  return (
    <ToolLayout toolSlug="html-entity-encoder">
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "encode"
                ? "bg-teal text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "decode"
                ? "bg-teal text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("decode")}
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("input_label")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? t("input_placeholder_encode") : t("input_placeholder_decode")}
            rows={6}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-foreground">
              {t("output_label")}
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            rows={6}
            placeholder={t("output_placeholder")}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
          />
        </div>

        {/* Reference Table */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">{t("reference")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(ENTITY_MAP).map(([char, entity]) => (
              <div
                key={entity}
                className="flex items-center justify-between bg-background rounded-lg px-3 py-2 text-xs"
              >
                <span className="font-mono text-teal">{entity}</span>
                <span className="text-muted-foreground">{char === "\u00A0" ? "nbsp" : char}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

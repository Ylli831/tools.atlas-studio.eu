"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&copy;": "\u00A9",
  "&reg;": "\u00AE",
  "&trade;": "\u2122",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&laquo;": "\u00AB",
  "&raquo;": "\u00BB",
  "&bull;": "\u2022",
  "&hellip;": "\u2026",
  "&euro;": "\u20AC",
  "&pound;": "\u00A3",
  "&yen;": "\u00A5",
  "&cent;": "\u00A2",
  "&times;": "\u00D7",
  "&divide;": "\u00F7",
  "&plusmn;": "\u00B1",
  "&deg;": "\u00B0",
  "&micro;": "\u00B5",
  "&para;": "\u00B6",
  "&sect;": "\u00A7",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
};

function decodeEntities(text: string): string {
  let result = text;

  // Named entities
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }

  // Numeric entities (decimal)
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );

  // Numeric entities (hex)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  return result;
}

function htmlToPlainText(html: string): string {
  let text = html;

  // Remove script and style blocks entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Add newlines before block elements
  const blockTags =
    /(<\/?(div|p|h[1-6]|ul|ol|li|tr|table|blockquote|section|article|header|footer|main|nav|aside|pre|hr|br)\b[^>]*\/?>)/gi;
  text = text.replace(blockTags, (match, _tag, tagName) => {
    const tn = tagName.toLowerCase();
    if (tn === "br" || tn === "hr") return "\n";
    if (match.startsWith("</")) return "\n";
    return "\n";
  });

  // Handle list items with bullet
  text = text.replace(/<li\b[^>]*>/gi, "\n  - ");

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = decodeEntities(text);

  // Clean up excessive whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

export default function HtmlToTextTool() {
  const t = useTranslations("tools.html-to-text");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    setOutput(htmlToPlainText(input));
  }, [input]);

  return (
    <ToolLayout toolSlug="html-to-text">
      <div className="space-y-4">
        {/* Input */}
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

        {/* Convert button */}
        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("convert")}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

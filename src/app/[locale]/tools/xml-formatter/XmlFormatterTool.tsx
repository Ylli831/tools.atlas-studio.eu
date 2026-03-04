"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatXml(xml: string, indentStr: string): { result: string; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return { result: "", error: errorNode.textContent || "Invalid XML" };
    }

    let formatted = "";
    let indent = 0;

    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(doc);

    // Split into tags and content
    const lines = raw.replace(/(>)\s*(<)/g, "$1\n$2").split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Closing tag
      if (trimmed.startsWith("</")) {
        indent = Math.max(0, indent - 1);
        formatted += indentStr.repeat(indent) + trimmed + "\n";
      }
      // Self-closing tag or processing instruction
      else if (trimmed.endsWith("/>") || trimmed.startsWith("<?")) {
        formatted += indentStr.repeat(indent) + trimmed + "\n";
      }
      // Opening tag
      else if (trimmed.startsWith("<") && !trimmed.startsWith("</")) {
        formatted += indentStr.repeat(indent) + trimmed + "\n";
        // Only increase indent if this is not a tag with content on same line that also closes
        if (!trimmed.includes("</")) {
          indent++;
        }
      }
      // Content
      else {
        formatted += indentStr.repeat(indent) + trimmed + "\n";
      }
    }

    return { result: formatted.trimEnd(), error: null };
  } catch {
    return { result: "", error: "Failed to parse XML" };
  }
}

function minifyXml(xml: string): { result: string; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return { result: "", error: errorNode.textContent || "Invalid XML" };
    }

    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(doc);
    const minified = raw.replace(/>\s+</g, "><").trim();
    return { result: minified, error: null };
  } catch {
    return { result: "", error: "Failed to parse XML" };
  }
}

export default function XmlFormatterTool() {
  const t = useTranslations("tools.xml-formatter");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [indentType, setIndentType] = useState<"2" | "4" | "tab">("2");

  const indentStr = indentType === "tab" ? "\t" : " ".repeat(Number(indentType));

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: "", error: null };
    return mode === "format" ? formatXml(input, indentStr) : minifyXml(input);
  }, [input, mode, indentStr]);

  const loadSample = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Thinking, Fast and Slow</title>
    <author>Daniel Kahneman</author>
    <year>2011</year>
    <price>14.99</price>
  </book>
</bookstore>`);
  };

  return (
    <ToolLayout toolSlug="xml-formatter">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setMode("format")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "format"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("format")}
            </button>
            <button
              onClick={() => setMode("minify")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "minify"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("minify")}
            </button>
          </div>

          {mode === "format" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">{t("indent")}:</label>
              <select
                value={indentType}
                onChange={(e) => setIndentType(e.target.value as "2" | "4" | "tab")}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="2">{t("spaces_2")}</option>
                <option value="4">{t("spaces_4")}</option>
                <option value="tab">{t("tabs")}</option>
              </select>
            </div>
          )}

          <button
            onClick={loadSample}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("load_sample")}
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
            placeholder={t("input_placeholder")}
            rows={8}
            spellCheck={false}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600 font-medium">{t("error")}</p>
            <p className="text-xs text-red-500 mt-1 font-mono">{error}</p>
          </div>
        )}

        {/* Output */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={result} />
            </div>
            <textarea
              value={result}
              readOnly
              rows={12}
              spellCheck={false}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

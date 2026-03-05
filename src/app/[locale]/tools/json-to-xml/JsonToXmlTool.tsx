"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function jsonToXml(obj: unknown, rootName: string, indent: string = "", indentStr: string = "  "): string {
  if (obj === null || obj === undefined) {
    return `${indent}<${rootName}/>\n`;
  }

  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return `${indent}<${rootName}>${escapeXml(String(obj))}</${rootName}>\n`;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((item) => jsonToXml(item, rootName, indent, indentStr))
      .join("");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) {
      return `${indent}<${rootName}/>\n`;
    }

    let xml = `${indent}<${rootName}>\n`;
    for (const [key, value] of entries) {
      // Sanitize key for valid XML tag name
      const tagName = key.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^(\d)/, "_$1");
      xml += jsonToXml(value, tagName, indent + indentStr, indentStr);
    }
    xml += `${indent}</${rootName}>\n`;
    return xml;
  }

  return `${indent}<${rootName}>${escapeXml(String(obj))}</${rootName}>\n`;
}

function convertJsonToXml(json: string, rootTag: string, includeDeclaration: boolean): string {
  const parsed = JSON.parse(json);
  let xml = "";
  if (includeDeclaration) {
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
  }
  xml += jsonToXml(parsed, rootTag);
  return xml.trimEnd();
}

export default function JsonToXmlTool() {
  const t = useTranslations("tools.json-to-xml");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [rootTag, setRootTag] = useState("root");
  const [includeDeclaration, setIncludeDeclaration] = useState(true);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const xml = convertJsonToXml(input, rootTag || "root", includeDeclaration);
      setOutput(xml);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
      setOutput("");
    }
  }, [input, rootTag, includeDeclaration]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  return (
    <ToolLayout toolSlug="json-to-xml">
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

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-foreground">
              {t("root_tag")}
              <input
                type="text"
                value={rootTag}
                onChange={(e) => setRootTag(e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-teal w-32"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={includeDeclaration}
                onChange={(e) => setIncludeDeclaration(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal"
              />
              {t("include_declaration")}
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("convert")}
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

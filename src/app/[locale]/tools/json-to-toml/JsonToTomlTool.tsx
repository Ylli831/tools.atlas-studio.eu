"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function tomlValueToString(value: unknown): string {
  if (typeof value === "string") {
    // Escape special characters
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t");
    return `"${escaped}"`;
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) return String(value);
    return String(value);
  }
  if (typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return '""';
  return String(value);
}

function isSimpleValue(value: unknown): boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}

function isSimpleArray(arr: unknown[]): boolean {
  return arr.every((item) => isSimpleValue(item));
}

function jsonToToml(obj: unknown, path: string[] = []): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("Top-level value must be a JSON object");
  }

  const entries = Object.entries(obj as Record<string, unknown>);
  const lines: string[] = [];

  // First pass: simple key-value pairs
  for (const [key, value] of entries) {
    if (isSimpleValue(value)) {
      lines.push(`${key} = ${tomlValueToString(value)}`);
    } else if (Array.isArray(value) && isSimpleArray(value)) {
      const items = value.map((v) => tomlValueToString(v)).join(", ");
      lines.push(`${key} = [${items}]`);
    }
  }

  // Second pass: tables (nested objects)
  for (const [key, value] of entries) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const sectionPath = [...path, key];
      if (lines.length > 0) lines.push("");
      lines.push(`[${sectionPath.join(".")}]`);
      const nested = jsonToToml(value, sectionPath);
      // Remove nested section headers that already include our path
      const nestedLines = nested.split("\n");
      lines.push(...nestedLines);
    }
  }

  // Third pass: arrays of tables
  for (const [key, value] of entries) {
    if (Array.isArray(value) && !isSimpleArray(value)) {
      const sectionPath = [...path, key];
      for (const item of value) {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          if (lines.length > 0) lines.push("");
          lines.push(`[[${sectionPath.join(".")}]]`);
          const nested = jsonToToml(item, sectionPath);
          const nestedLines = nested.split("\n");
          lines.push(...nestedLines);
        } else {
          // Simple values in mixed arrays - stringify
          lines.push(`${key} = ${tomlValueToString(item)}`);
        }
      }
    }
  }

  return lines.join("\n");
}

export default function JsonToTomlTool() {
  const t = useTranslations("tools.json-to-toml");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const toml = jsonToToml(parsed);
      setOutput(toml);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
      setOutput("");
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  return (
    <ToolLayout toolSlug="json-to-toml">
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

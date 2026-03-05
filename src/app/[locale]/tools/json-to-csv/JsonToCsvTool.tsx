"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value === null || value === undefined ? "" : String(value);
    }
  }
  return result;
}

function escapeCsvField(field: string, delimiter: string): string {
  if (field.includes(delimiter) || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function jsonToCsv(json: string, delimiter: string, includeHeaders: boolean): string {
  const parsed = JSON.parse(json);

  let data: Record<string, unknown>[];
  if (Array.isArray(parsed)) {
    data = parsed;
  } else if (typeof parsed === "object" && parsed !== null) {
    data = [parsed];
  } else {
    throw new Error("Input must be a JSON array or object");
  }

  if (data.length === 0) {
    throw new Error("Input array is empty");
  }

  // Flatten all objects
  const flattened = data.map((item) => {
    if (typeof item !== "object" || item === null) {
      return { value: String(item) };
    }
    return flattenObject(item as Record<string, unknown>);
  });

  // Collect all headers
  const headerSet = new Set<string>();
  for (const row of flattened) {
    for (const key of Object.keys(row)) {
      headerSet.add(key);
    }
  }
  const headers = Array.from(headerSet);

  // Build CSV
  const lines: string[] = [];

  if (includeHeaders) {
    lines.push(headers.map((h) => escapeCsvField(h, delimiter)).join(delimiter));
  }

  for (const row of flattened) {
    const values = headers.map((h) => escapeCsvField(row[h] || "", delimiter));
    lines.push(values.join(delimiter));
  }

  return lines.join("\n");
}

export default function JsonToCsvTool() {
  const t = useTranslations("tools.json-to-csv");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const csv = jsonToCsv(input, delimiter, includeHeaders);
      setOutput(csv);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
      setOutput("");
    }
  }, [input, delimiter, includeHeaders]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [output]);

  return (
    <ToolLayout toolSlug="json-to-csv">
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
              {t("delimiter")}
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
              >
                <option value=",">{t("comma")} (,)</option>
                <option value=";">{t("semicolon")} (;)</option>
                <option value={"\t"}>Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal"
              />
              {t("include_headers")}
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
          {output && (
            <button
              onClick={handleDownload}
              className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {t("download_csv")}
            </button>
          )}
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

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function csvToJson(csv: string, delimiter: string): string {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return "[]";
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const result = lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ""));
    return Object.fromEntries(headers.map((h, i) => {
      const val = values[i] ?? "";
      const num = Number(val);
      return [h, val === "" ? null : isNaN(num) ? val : num];
    }));
  });
  return JSON.stringify(result, null, 2);
}

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) throw new Error("Expected non-empty JSON array");
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const v = String(row[h] ?? "");
      return v.includes(delimiter) || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(delimiter)
  );
  return [headers.join(delimiter), ...rows].join("\n");
}

const SAMPLE_CSV = `name,age,city
Alice,30,New York
Bob,25,London
Carol,35,Paris`;

const SAMPLE_JSON = JSON.stringify([
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "London" },
], null, 2);

export default function CsvJsonConverterTool() {
  const t = useTranslations("tools.csv-json-converter");
  const tc = useTranslations("common");
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      if (mode === "csv-to-json") {
        setOutput(csvToJson(input, delimiter));
      } else {
        setOutput(jsonToCsv(input, delimiter));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : tc("error"));
    }
  };

  return (
    <ToolLayout toolSlug="csv-json-converter">
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => { setMode("csv-to-json"); setInput(""); setOutput(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "csv-to-json" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("csv_to_json")}
          </button>
          <button
            onClick={() => { setMode("json-to-csv"); setInput(""); setOutput(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "json-to-csv" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("json_to_csv")}
          </button>
        </div>

        {/* Delimiter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">{t("delimiter")}</label>
          <div className="flex gap-2">
            {[",", ";", "\t", "|"].map((d) => (
              <button key={d} onClick={() => setDelimiter(d)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${delimiter === d ? "border-teal bg-teal/10 text-teal" : "border-border text-muted-foreground hover:border-teal"}`}
              >
                {d === "\t" ? "Tab" : d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{mode === "csv-to-json" ? "CSV" : "JSON"}</label>
              <button onClick={() => setInput(mode === "csv-to-json" ? SAMPLE_CSV : SAMPLE_JSON)} className="text-xs text-teal hover:underline">{t("load_sample")}</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "csv-to-json" ? t("csv_placeholder") : t("json_placeholder")}
              rows={10}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{mode === "csv-to-json" ? "JSON" : "CSV"}</label>
              {output && <CopyButton text={output} />}
            </div>
            <pre className="w-full h-[248px] rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground overflow-auto whitespace-pre-wrap">
              {output || <span className="text-muted-foreground">{t("output_placeholder")}</span>}
            </pre>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button onClick={convert} disabled={!input.trim()}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-xl hover:bg-teal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("convert")}
        </button>
      </div>
    </ToolLayout>
  );
}

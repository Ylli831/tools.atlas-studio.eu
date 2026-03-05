"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function parseTomlValue(value: string): unknown {
  const trimmed = value.trim();

  // Boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // String (quoted)
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  // Multi-line basic string
  if (trimmed.startsWith('"""') && trimmed.endsWith('"""')) {
    return trimmed.slice(3, -3).trim();
  }

  // Array
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (inner === "") return [];
    // Split by commas, respecting nested arrays and strings
    const items: string[] = [];
    let depth = 0;
    let current = "";
    let inString = false;
    let stringChar = "";
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (inString) {
        current += ch;
        if (ch === stringChar && inner[i - 1] !== "\\") {
          inString = false;
        }
        continue;
      }
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        current += ch;
      } else if (ch === "[") {
        depth++;
        current += ch;
      } else if (ch === "]") {
        depth--;
        current += ch;
      } else if (ch === "," && depth === 0) {
        items.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) items.push(current.trim());
    return items.map((item) => parseTomlValue(item));
  }

  // Datetime (basic detection)
  if (/^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/.test(trimmed)) {
    return trimmed;
  }

  // Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Float
  if (/^[+-]?\d+\.\d+$/.test(trimmed) || trimmed === "inf" || trimmed === "+inf" || trimmed === "-inf" || trimmed === "nan") {
    return parseFloat(trimmed);
  }

  // Integer (including hex, oct, bin)
  if (/^0x[0-9a-fA-F_]+$/.test(trimmed)) return parseInt(trimmed.replace(/_/g, ""), 16);
  if (/^0o[0-7_]+$/.test(trimmed)) return parseInt(trimmed.replace(/_/g, "").replace("0o", ""), 8);
  if (/^0b[01_]+$/.test(trimmed)) return parseInt(trimmed.replace(/_/g, "").replace("0b", ""), 2);
  if (/^[+-]?\d[\d_]*$/.test(trimmed)) return parseInt(trimmed.replace(/_/g, ""), 10);

  // Return as string if nothing matches
  return trimmed;
}

function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

function parseToml(toml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentSection: string[] = [];
  let currentArraySection: string[] | null = null;

  const lines = toml.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith("#")) continue;

    // Remove inline comments (not inside strings)
    const commentIdx = line.indexOf(" #");
    if (commentIdx > 0) {
      // Check if it's inside a string
      const beforeComment = line.substring(0, commentIdx);
      const quoteCount = (beforeComment.match(/"/g) || []).length;
      if (quoteCount % 2 === 0) {
        line = beforeComment.trimEnd();
      }
    }

    // Array of tables: [[section]]
    const arrayTableMatch = line.match(/^\[\[([^\]]+)\]\]\s*$/);
    if (arrayTableMatch) {
      currentArraySection = arrayTableMatch[1].split(".").map((s) => s.trim());
      currentSection = currentArraySection;
      // Initialize array if needed
      let target = result;
      for (let j = 0; j < currentArraySection.length - 1; j++) {
        const key = currentArraySection[j];
        if (!(key in target)) target[key] = {};
        target = target[key] as Record<string, unknown>;
      }
      const lastKey = currentArraySection[currentArraySection.length - 1];
      if (!(lastKey in target)) {
        target[lastKey] = [];
      }
      (target[lastKey] as unknown[]).push({});
      continue;
    }

    // Table: [section]
    const tableMatch = line.match(/^\[([^\]]+)\]\s*$/);
    if (tableMatch) {
      currentSection = tableMatch[1].split(".").map((s) => s.trim());
      currentArraySection = null;
      // Initialize section
      let target = result;
      for (const key of currentSection) {
        if (!(key in target)) target[key] = {};
        target = target[key] as Record<string, unknown>;
      }
      continue;
    }

    // Key = Value
    const kvMatch = line.match(/^([^=]+?)\s*=\s*(.+)$/);
    if (kvMatch) {
      const keyParts = kvMatch[1].split(".").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      const value = parseTomlValue(kvMatch[2]);

      if (currentArraySection) {
        // Add to last element of array
        let target = result;
        for (let j = 0; j < currentArraySection.length - 1; j++) {
          target = target[currentArraySection[j]] as Record<string, unknown>;
        }
        const arr = target[currentArraySection[currentArraySection.length - 1]] as Record<string, unknown>[];
        const lastItem = arr[arr.length - 1];
        setNestedValue(lastItem, keyParts, value);
      } else {
        const fullPath = [...currentSection, ...keyParts];
        setNestedValue(result, fullPath, value);
      }
    }
  }

  return result;
}

export default function TomlToJsonTool() {
  const t = useTranslations("tools.toml-to-json");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSpaces, setIndentSpaces] = useState(2);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = parseToml(input);
      setOutput(JSON.stringify(parsed, null, indentSpaces));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse error");
      setOutput("");
    }
  }, [input, indentSpaces]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  return (
    <ToolLayout toolSlug="toml-to-json">
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
              {t("indent_spaces")}
              <select
                value={indentSpaces}
                onChange={(e) => setIndentSpaces(Number(e.target.value))}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
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

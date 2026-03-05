"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue };

function parseYamlValue(raw: string): YamlValue {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "~" || trimmed === "null" || trimmed === "Null" || trimmed === "NULL") return null;
  if (trimmed === "true" || trimmed === "True" || trimmed === "TRUE") return true;
  if (trimmed === "false" || trimmed === "False" || trimmed === "FALSE") return false;

  // Quoted strings
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  // Numbers
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  if (/^-?\d+\.?\d*e[+-]?\d+$/i.test(trimmed)) return parseFloat(trimmed);

  // Inline arrays [a, b, c]
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (inner === "") return [];
    return splitComma(inner).map((v) => parseYamlValue(v));
  }

  // Inline objects {a: 1, b: 2}
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const inner = trimmed.slice(1, -1).trim();
    if (inner === "") return {};
    const obj: Record<string, YamlValue> = {};
    const parts = splitComma(inner);
    for (const part of parts) {
      const colonIdx = part.indexOf(":");
      if (colonIdx === -1) continue;
      const key = part.slice(0, colonIdx).trim();
      const val = part.slice(colonIdx + 1).trim();
      obj[key] = parseYamlValue(val);
    }
    return obj;
  }

  return trimmed;
}

function splitComma(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of s) {
    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

interface ParsedLine {
  indent: number;
  key: string;
  value: string;
  isArrayItem: boolean;
  rawContent: string;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function findInlineComment(line: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    if (ch === "#" && !inSingle && !inDouble && i > 0 && line[i - 1] === " ") {
      return i;
    }
  }
  return -1;
}

function tokenize(yaml: string): ParsedLine[] {
  const lines = yaml.split("\n");
  const result: ParsedLine[] = [];
  for (const line of lines) {
    const stripped = line.replace(/\s+$/, "");
    if (stripped.trim() === "" || stripped.trim().startsWith("#")) continue;

    // Skip document markers
    if (stripped.trim() === "---" || stripped.trim() === "...") continue;

    const indent = getIndent(stripped);
    let content = stripped.trim();

    // Remove inline comments
    const commentIdx = findInlineComment(content);
    if (commentIdx !== -1) {
      content = content.slice(0, commentIdx).trim();
    }

    const isArrayItem = content.startsWith("- ");
    if (isArrayItem) {
      content = content.slice(2);
    }

    const colonIdx = content.indexOf(":");
    if (colonIdx !== -1 && !content.startsWith("{") && !content.startsWith("[")) {
      const key = content.slice(0, colonIdx).trim();
      const value = content.slice(colonIdx + 1).trim();
      result.push({ indent, key, value, isArrayItem, rawContent: content });
    } else {
      result.push({ indent, key: "", value: content, isArrayItem, rawContent: content });
    }
  }
  return result;
}

function parseBlock(lines: ParsedLine[], start: number, baseIndent: number): { value: YamlValue; end: number } {
  if (start >= lines.length) return { value: null, end: start };

  const firstLine = lines[start];

  // Check if this is an array
  if (firstLine.isArrayItem && firstLine.indent === baseIndent) {
    const arr: YamlValue[] = [];
    let i = start;
    while (i < lines.length && lines[i].indent >= baseIndent) {
      const line = lines[i];
      if (line.indent < baseIndent) break;
      if (line.indent === baseIndent && !line.isArrayItem && i > start) break;

      if (line.isArrayItem && line.indent === baseIndent) {
        if (line.key && line.value) {
          // - key: value (start of inline object in array)
          const obj: Record<string, YamlValue> = {};
          obj[line.key] = parseYamlValue(line.value);
          i++;
          while (i < lines.length && lines[i].indent > baseIndent && !lines[i].isArrayItem) {
            const sub = lines[i];
            if (sub.key && sub.value === "") {
              const nested = parseBlock(lines, i + 1, (i + 1 < lines.length ? lines[i + 1].indent : sub.indent + 2));
              obj[sub.key] = nested.value;
              i = nested.end;
            } else if (sub.key) {
              obj[sub.key] = parseYamlValue(sub.value);
              i++;
            } else {
              i++;
            }
          }
          arr.push(obj);
        } else if (line.key && line.value === "") {
          // - key: (nested value)
          const obj: Record<string, YamlValue> = {};
          if (i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
            const nested = parseBlock(lines, i + 1, lines[i + 1].indent);
            obj[line.key] = nested.value;
            i = nested.end;
          } else {
            obj[line.key] = null;
            i++;
          }
          // Continue collecting keys at same deeper indent
          while (i < lines.length && lines[i].indent > baseIndent && !lines[i].isArrayItem) {
            const sub = lines[i];
            if (sub.key && sub.value === "") {
              const nested = parseBlock(lines, i + 1, (i + 1 < lines.length ? lines[i + 1].indent : sub.indent + 2));
              obj[sub.key] = nested.value;
              i = nested.end;
            } else if (sub.key) {
              obj[sub.key] = parseYamlValue(sub.value);
              i++;
            } else {
              i++;
            }
          }
          arr.push(obj);
        } else {
          // - value (simple array item)
          arr.push(parseYamlValue(line.value));
          i++;
        }
      } else {
        i++;
      }
    }
    return { value: arr, end: i };
  }

  // Otherwise it's an object
  const obj: Record<string, YamlValue> = {};
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < baseIndent) break;
    if (line.indent > baseIndent) { i++; continue; }

    if (line.key) {
      if (line.value === "" || line.value === "|" || line.value === ">") {
        if (i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
          if (line.value === "|" || line.value === ">") {
            // Multiline string
            const isLiteral = line.value === "|";
            const multiLines: string[] = [];
            let j = i + 1;
            while (j < lines.length && lines[j].indent > baseIndent) {
              multiLines.push(lines[j].rawContent);
              j++;
            }
            obj[line.key] = isLiteral ? multiLines.join("\n") : multiLines.join(" ");
            i = j;
          } else {
            const nested = parseBlock(lines, i + 1, lines[i + 1].indent);
            obj[line.key] = nested.value;
            i = nested.end;
          }
        } else {
          obj[line.key] = null;
          i++;
        }
      } else {
        obj[line.key] = parseYamlValue(line.value);
        i++;
      }
    } else {
      i++;
    }
  }
  return { value: obj, end: i };
}

function parseYaml(yaml: string): YamlValue {
  const trimmed = yaml.trim();
  if (!trimmed) return null;

  const lines = tokenize(trimmed);
  if (lines.length === 0) return null;

  const { value } = parseBlock(lines, 0, lines[0].indent);
  return value;
}

const sampleYaml = `# Server Configuration
server:
  host: localhost
  port: 8080
  debug: true

database:
  driver: postgres
  host: db.example.com
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret123

features:
  - authentication
  - logging
  - monitoring

environments:
  - name: development
    url: http://localhost:3000
  - name: production
    url: https://app.example.com`;

export default function YamlToJsonTool() {
  const t = useTranslations("tools.yaml-to-json");
  const tc = useTranslations("common");

  const [yaml, setYaml] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const convert = useCallback(() => {
    setError("");
    setJson("");
    if (!yaml.trim()) return;
    try {
      const parsed = parseYaml(yaml);
      setJson(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
    }
  }, [yaml, indent]);

  const loadSample = () => {
    setYaml(sampleYaml);
    setError("");
    setJson("");
  };

  return (
    <ToolLayout toolSlug="yaml-to-json">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={convert}
              disabled={!yaml.trim()}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {t("convert")}
            </button>
            <button
              onClick={loadSample}
              className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {tc("load_sample")}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="bg-card border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-danger bg-danger/10 px-4 py-2 rounded-lg flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* YAML Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("input_label")}
              </label>
              <span className="text-xs text-muted-foreground">
                {yaml.split("\n").length} lines
              </span>
            </div>
            <textarea
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
              placeholder={t("input_placeholder")}
              rows={20}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>

          {/* JSON Output */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              {json && <CopyButton text={json} />}
            </div>
            <textarea
              value={json}
              readOnly
              placeholder={t("input_placeholder")}
              rows={20}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

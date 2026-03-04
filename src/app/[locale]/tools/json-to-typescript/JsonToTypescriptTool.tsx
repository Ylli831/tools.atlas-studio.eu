"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_JSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "country": "US",
    "zip": "62701"
  },
  "roles": ["admin", "editor"],
  "projects": [
    {
      "id": 101,
      "title": "Website Redesign",
      "tags": ["design", "frontend"],
      "completed": false,
      "budget": 15000.50
    },
    {
      "id": 102,
      "title": "API Migration",
      "tags": ["backend"],
      "completed": true,
      "budget": 8000
    }
  ],
  "metadata": null
}`;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toInterfaceName(key: string): string {
  return capitalize(key.replace(/[^a-zA-Z0-9]/g, ""));
}

function inferType(
  value: unknown,
  key: string,
  interfaces: Map<string, string>,
  optional: boolean
): string {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const first = value[0];
    if (typeof first === "object" && first !== null && !Array.isArray(first)) {
      const itemName = toInterfaceName(key) + "Item";
      generateInterface(first as Record<string, unknown>, itemName, interfaces, optional);
      return `${itemName}[]`;
    }
    const itemType = inferType(first, key, interfaces, optional);
    return `${itemType}[]`;
  }

  if (typeof value === "object") {
    const name = toInterfaceName(key);
    generateInterface(value as Record<string, unknown>, name, interfaces, optional);
    return name;
  }

  return "unknown";
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>,
  optional: boolean
): void {
  const lines: string[] = [];
  lines.push(`export interface ${name} {`);

  for (const [key, value] of Object.entries(obj)) {
    const type = inferType(value, key, interfaces, optional);
    const opt = optional ? "?" : "";
    lines.push(`  ${key}${opt}: ${type};`);
  }

  lines.push("}");
  interfaces.set(name, lines.join("\n"));
}

function jsonToTypeScript(json: string, rootName: string, optional: boolean): string {
  const parsed = JSON.parse(json);
  const interfaces = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
      generateInterface(parsed[0] as Record<string, unknown>, rootName, interfaces, optional);
    } else {
      const itemType = parsed.length > 0 ? typeof parsed[0] : "unknown";
      return `export type ${rootName} = ${itemType}[];`;
    }
    const result = Array.from(interfaces.values()).join("\n\n");
    return result + `\n\nexport type ${rootName}Array = ${rootName}[];`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    generateInterface(parsed as Record<string, unknown>, rootName, interfaces, optional);
    return Array.from(interfaces.values()).join("\n\n");
  }

  return `export type ${rootName} = ${typeof parsed};`;
}

export default function JsonToTypescriptTool() {
  const t = useTranslations("tools.json-to-typescript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [rootName, setRootName] = useState("RootObject");
  const [optional, setOptional] = useState(false);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const result = jsonToTypeScript(input, rootName || "RootObject", optional);
      setOutput(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse error");
      setOutput("");
    }
  }, [input, rootName, optional]);

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setError("");
  };

  return (
    <ToolLayout toolSlug="json-to-typescript">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("root_name")}
            </label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder={t("root_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={optional}
              onChange={(e) => setOptional(e.target.checked)}
              className="accent-teal w-4 h-4"
            />
            {t("optional_props")}
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">{t("json_label")}</label>
            <button
              onClick={loadSample}
              className="text-xs text-teal hover:text-teal-hover transition-colors"
            >
              {t("load_sample")}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder={t("json_placeholder")}
            rows={12}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={convert}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("name")}
          </button>
          {error && (
            <span className="text-sm text-danger font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {error}
            </span>
          )}
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

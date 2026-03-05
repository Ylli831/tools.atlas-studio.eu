"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function xmlNodeToJson(node: Element): unknown {
  // If element has no children and no attributes, return text content
  const children = Array.from(node.children);
  const textContent = Array.from(node.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent?.trim())
    .filter(Boolean)
    .join("");

  if (children.length === 0) {
    // Leaf node: return text content, try to parse numbers/booleans
    const text = textContent;
    if (text === "true") return true;
    if (text === "false") return false;
    if (text === "null") return null;
    if (text !== "" && !isNaN(Number(text))) return Number(text);
    return text;
  }

  const result: Record<string, unknown> = {};

  // Group children by tag name
  const childMap = new Map<string, Element[]>();
  for (const child of children) {
    const tag = child.tagName;
    if (!childMap.has(tag)) {
      childMap.set(tag, []);
    }
    childMap.get(tag)!.push(child);
  }

  for (const [tag, elements] of childMap) {
    if (elements.length === 1) {
      result[tag] = xmlNodeToJson(elements[0]);
    } else {
      result[tag] = elements.map((el) => xmlNodeToJson(el));
    }
  }

  // Add text content if present alongside children
  if (textContent) {
    result["#text"] = textContent;
  }

  // Add attributes
  for (const attr of Array.from(node.attributes)) {
    result[`@${attr.name}`] = attr.value;
  }

  return result;
}

function convertXmlToJson(xml: string, indentSpaces: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  // Check for parsing errors
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + (errorNode.textContent?.substring(0, 200) || "Parse error"));
  }

  const root = doc.documentElement;
  const result: Record<string, unknown> = {};
  result[root.tagName] = xmlNodeToJson(root);

  return JSON.stringify(result, null, indentSpaces);
}

export default function XmlToJsonTool() {
  const t = useTranslations("tools.xml-to-json");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSpaces, setIndentSpaces] = useState(2);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    try {
      const json = convertXmlToJson(input, indentSpaces);
      setOutput(json);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
      setOutput("");
    }
  }, [input, indentSpaces]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  return (
    <ToolLayout toolSlug="xml-to-json">
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

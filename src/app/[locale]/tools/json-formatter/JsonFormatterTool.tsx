"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatterTool() {
  const t = useTranslations("tools.json-formatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [view, setView] = useState<"raw" | "tree">("raw");
  const [indent, setIndent] = useState(2);
  const [jsonPath, setJsonPath] = useState("");
  const [pathResult, setPathResult] = useState<string | null>(null);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus("valid");
      setErrorMsg("");
    } catch (e) {
      setStatus("invalid");
      setErrorMsg(e instanceof Error ? e.message : "Parse error");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus("valid");
      setErrorMsg("");
    } catch (e) {
      setStatus("invalid");
      setErrorMsg(e instanceof Error ? e.message : "Parse error");
    }
  }, [input]);

  const validate = useCallback(() => {
    try {
      JSON.parse(input);
      setStatus("valid");
      setErrorMsg("");
    } catch (e) {
      setStatus("invalid");
      setErrorMsg(e instanceof Error ? e.message : "Parse error");
    }
  }, [input]);

  const queryPath = useCallback(() => {
    if (!jsonPath.trim() || !output) {
      setPathResult(null);
      return;
    }
    try {
      const parsed = JSON.parse(output);
      const segments = jsonPath
        .replace(/^\$\.?/, "")
        .split(/\.|\[(\d+)\]/)
        .filter(Boolean);

      let current: unknown = parsed;
      for (const seg of segments) {
        if (current == null || typeof current !== "object") {
          setPathResult("undefined");
          return;
        }
        current = (current as Record<string, unknown>)[seg];
      }
      setPathResult(
        typeof current === "object" ? JSON.stringify(current, null, 2) : String(current ?? "undefined")
      );
    } catch {
      setPathResult("Invalid path");
    }
  }, [jsonPath, output]);

  const lineCount = useMemo(() => output.split("\n").length, [output]);

  const sampleJson = '{\n  "name": "Atlas Studio",\n  "tools": 113,\n  "categories": ["pdf", "image", "developer"],\n  "config": {\n    "theme": "teal",\n    "i18n": true\n  }\n}';

  return (
    <ToolLayout toolSlug="json-formatter">
      <div className="space-y-4">
        {/* Input area */}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setStatus("idle"); setPathResult(null); }}
            placeholder={t("input_placeholder")}
            rows={12}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal leading-relaxed"
            spellCheck={false}
          />
          {!input && (
            <button
              onClick={() => { setInput(sampleJson); setStatus("idle"); }}
              className="absolute bottom-3 right-3 text-xs text-teal hover:underline"
            >
              {t("load_sample")}
            </button>
          )}
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={format}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("format")}
          </button>
          <button
            onClick={minify}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {t("minify")}
          </button>
          <button
            onClick={validate}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {t("validate")}
          </button>

          {/* Indent selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-muted-foreground">{t("indent")}:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  indent === n ? "bg-teal text-white" : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        {status === "valid" && (
          <div className="flex items-center gap-2 text-sm text-success font-medium bg-success/5 border border-success/20 rounded-lg px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t("valid")}
            {output && <span className="text-muted-foreground font-normal ml-auto text-xs">{lineCount} lines</span>}
          </div>
        )}
        {status === "invalid" && (
          <div className="flex items-start gap-2 text-sm text-danger font-medium bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>{t("invalid")}: <span className="font-mono font-normal">{errorMsg}</span></span>
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setView("raw")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    view === "raw" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("raw_view")}
                </button>
                <button
                  onClick={() => setView("tree")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    view === "tree" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("tree_view")}
                </button>
              </div>
              <CopyButton text={output} />
            </div>

            {view === "raw" ? (
              <div className="bg-card border border-border rounded-xl overflow-auto max-h-[32rem]">
                <SyntaxHighlightedJson json={output} />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-4 overflow-auto max-h-[32rem]">
                <JsonTree data={JSON.parse(output)} />
              </div>
            )}
          </div>
        )}

        {/* JSON Path query */}
        {output && (
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t("json_path")}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={jsonPath}
                onChange={(e) => setJsonPath(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && queryPath()}
                placeholder="$.config.theme"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
              />
              <button
                onClick={queryPath}
                className="bg-surface text-foreground font-medium px-3 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("query")}
              </button>
            </div>
            {pathResult !== null && (
              <pre className="mt-2 bg-background rounded-lg p-3 text-sm font-mono text-foreground whitespace-pre-wrap max-h-32 overflow-auto">
                {pathResult}
              </pre>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

// Syntax highlighted JSON output with line numbers
function SyntaxHighlightedJson({ json }: { json: string }) {
  const lines = json.split("\n");

  return (
    <div className="flex text-sm font-mono leading-relaxed">
      {/* Line numbers */}
      <div className="flex-shrink-0 py-4 pl-3 pr-2 text-right select-none border-r border-border">
        {lines.map((_, i) => (
          <div key={i} className="text-xs text-muted leading-relaxed">{i + 1}</div>
        ))}
      </div>
      {/* Code */}
      <pre className="flex-1 p-4 overflow-x-auto whitespace-pre">
        {lines.map((line, i) => (
          <div key={i}>
            {highlightLine(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}

function highlightLine(line: string) {
  // Simple JSON syntax highlighting via regex
  const parts: { text: string; cls: string }[] = [];
  let remaining = line;
  let match: RegExpExecArray | null;

  while (remaining.length > 0) {
    // Key (quoted string followed by colon)
    if ((match = /^(\s*)"([^"\\]*(?:\\.[^"\\]*)*)"(\s*:)/.exec(remaining))) {
      parts.push({ text: match[1], cls: "" });
      parts.push({ text: `"${match[2]}"`, cls: "text-foreground font-medium" });
      parts.push({ text: match[3], cls: "text-muted-foreground" });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // String value
    if ((match = /^"([^"\\]*(?:\\.[^"\\]*)*)"/.exec(remaining))) {
      parts.push({ text: `"${match[1]}"`, cls: "text-success" });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Number
    if ((match = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(remaining))) {
      parts.push({ text: match[0], cls: "text-teal" });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Boolean/null
    if ((match = /^(true|false|null)/.exec(remaining))) {
      parts.push({ text: match[0], cls: "text-terracotta" });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Braces/brackets
    if ((match = /^[{}\[\]]/.exec(remaining))) {
      parts.push({ text: match[0], cls: "text-muted-foreground" });
      remaining = remaining.slice(1);
      continue;
    }

    // Whitespace and punctuation
    if ((match = /^[\s,:]+/.exec(remaining))) {
      parts.push({ text: match[0], cls: "text-muted-foreground" });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Fallback
    parts.push({ text: remaining[0], cls: "" });
    remaining = remaining.slice(1);
  }

  return parts.map((p, i) => (
    <span key={i} className={p.cls}>{p.text}</span>
  ));
}

// Collapsible tree view
function JsonTree({ data, depth = 0, keyName }: { data: unknown; depth?: number; keyName?: string }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const prefix = keyName !== undefined ? (
    <span className="text-foreground font-medium">{keyName}: </span>
  ) : null;

  if (data === null) return <div style={{ paddingLeft: depth > 0 ? 20 : 0 }}>{prefix}<span className="text-terracotta">null</span></div>;
  if (typeof data === "boolean") return <div style={{ paddingLeft: depth > 0 ? 20 : 0 }}>{prefix}<span className="text-terracotta">{String(data)}</span></div>;
  if (typeof data === "number") return <div style={{ paddingLeft: depth > 0 ? 20 : 0 }}>{prefix}<span className="text-teal">{data}</span></div>;
  if (typeof data === "string") return <div style={{ paddingLeft: depth > 0 ? 20 : 0 }}>{prefix}<span className="text-success">&quot;{data}&quot;</span></div>;

  const isArray = Array.isArray(data);
  const entries = isArray ? (data as unknown[]).map((v, i) => [String(i), v] as const) : Object.entries(data as Record<string, unknown>);
  const count = entries.length;
  const openBrace = isArray ? "[" : "{";
  const closeBrace = isArray ? "]" : "}";

  if (count === 0) {
    return (
      <div style={{ paddingLeft: depth > 0 ? 20 : 0 }} className="text-sm font-mono">
        {prefix}<span className="text-muted-foreground">{openBrace}{closeBrace}</span>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: depth > 0 ? 20 : 0 }} className="text-sm font-mono">
      <div
        className="cursor-pointer hover:bg-teal/5 rounded -ml-1 pl-1 inline-flex items-center gap-1"
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg
          width="10" height="10" viewBox="0 0 10 10"
          className={`text-muted-foreground transition-transform flex-shrink-0 ${collapsed ? "" : "rotate-90"}`}
        >
          <path d="M3 1 L7 5 L3 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {prefix}
        <span className="text-muted-foreground">{openBrace}</span>
        {collapsed && (
          <span className="text-muted text-xs ml-1">{count} {isArray ? "items" : "keys"}... {closeBrace}</span>
        )}
      </div>
      {!collapsed && (
        <>
          {entries.map(([key, value]) => (
            <JsonTree key={key} data={value} depth={depth + 1} keyName={key} />
          ))}
          <div style={{ paddingLeft: 0 }} className="text-muted-foreground">{closeBrace}</div>
        </>
      )}
    </div>
  );
}

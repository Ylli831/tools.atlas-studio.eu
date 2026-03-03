"use client";

import { useState, useCallback } from "react";
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

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setStatus("valid");
      setErrorMsg("");
    } catch (e) {
      setStatus("invalid");
      setErrorMsg(e instanceof Error ? e.message : "Parse error");
    }
  }, [input]);

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

  return (
    <ToolLayout toolSlug="json-formatter">
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setStatus("idle"); }}
          placeholder={t("input_placeholder")}
          rows={10}
          className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
          spellCheck={false}
        />

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

          {status === "valid" && (
            <span className="text-sm text-success font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t("valid")}
            </span>
          )}
          {status === "invalid" && (
            <span className="text-sm text-danger font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {t("invalid")}: {errorMsg}
            </span>
          )}
        </div>

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
              <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="bg-card border border-border rounded-xl p-4 overflow-auto max-h-96">
                <JsonTree data={JSON.parse(output)} />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  if (data === null) return <span className="text-muted">null</span>;
  if (typeof data === "boolean") return <span className="text-terracotta">{String(data)}</span>;
  if (typeof data === "number") return <span className="text-teal">{data}</span>;
  if (typeof data === "string") return <span className="text-success">&quot;{data}&quot;</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted font-mono text-sm">[]</span>;
    return (
      <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
        {data.map((item, i) => (
          <div key={i} className="text-sm font-mono">
            <span className="text-muted-foreground">{i}: </span>
            <JsonTree data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-muted font-mono text-sm">{"{}"}</span>;
    return (
      <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
        {entries.map(([key, value]) => (
          <div key={key} className="text-sm font-mono">
            <span className="text-foreground font-medium">{key}: </span>
            <JsonTree data={value} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

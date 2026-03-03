"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export default function HashGeneratorTool() {
  const t = useTranslations("tools.hash-generator");
  const tc = useTranslations("common");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({} as Record<Algorithm, string>);
  const [copied, setCopied] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const algorithms: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

  const hashText = useCallback(async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const results: Record<string, string> = {};
    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    setHashes(results as Record<Algorithm, string>);
  }, []);

  const handleTextInput = (text: string) => {
    setInput(text);
    if (text) hashText(text);
    else setHashes({} as Record<Algorithm, string>);
  };

  const handleFile = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const buffer = await files[0].arrayBuffer();
      const results: Record<string, string> = {};
      for (const algo of algorithms) {
        const hashBuffer = await crypto.subtle.digest(algo, buffer);
        results[algo] = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
      setHashes(results as Record<Algorithm, string>);
    } catch {
      // Error hashing
    } finally {
      setProcessing(false);
    }
  }, []);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout toolSlug="hash-generator">
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("text"); setHashes({} as Record<Algorithm, string>); }}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${mode === "text" ? "bg-teal text-white" : "bg-surface text-foreground hover:bg-border"}`}
          >
            {t("text_mode")}
          </button>
          <button
            onClick={() => { setMode("file"); setHashes({} as Record<Algorithm, string>); setInput(""); }}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${mode === "file" ? "bg-teal text-white" : "bg-surface text-foreground hover:bg-border"}`}
          >
            {t("file_mode")}
          </button>
        </div>

        {mode === "text" ? (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("input_label")}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleTextInput(e.target.value)}
              placeholder={t("input_placeholder")}
              rows={4}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
            />
          </div>
        ) : (
          <FileUpload accept="*/*" onFileSelect={handleFile} />
        )}

        {processing && (
          <p className="text-sm text-muted-foreground">{tc("processing")}</p>
        )}

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {algorithms.map((algo) => (
              <div key={algo} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{algo}</span>
                  <button
                    onClick={() => copy(hashes[algo], algo)}
                    className="text-xs text-teal hover:underline"
                  >
                    {copied === algo ? tc("copied") : tc("copy")}
                  </button>
                </div>
                <code className="text-xs font-mono text-foreground break-all">{hashes[algo]}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

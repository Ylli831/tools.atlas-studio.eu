"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import FileUpload from "@/components/FileUpload";

export default function Base64Tool() {
  const t = useTranslations("tools.base64-encoder");
  const tc = useTranslations("common");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const encode = useCallback(() => {
    try {
      setError(null);
      if (mode === "text") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      }
    } catch {
      setError(tc("error"));
    }
  }, [input, mode, tc]);

  const decode = useCallback(() => {
    try {
      setError(null);
      if (mode === "text") {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(tc("error"));
    }
  }, [input, mode, tc]);

  const handleFileSelect = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || result;
      setOutput(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDecodeFile = useCallback(() => {
    try {
      setError(null);
      const binary = atob(input);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decoded-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(tc("error"));
    }
  }, [input, tc]);

  return (
    <ToolLayout toolSlug="base64-encoder">
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("text"); setOutput(""); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "text" ? "bg-teal text-white" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("text_mode")}
          </button>
          <button
            onClick={() => { setMode("file"); setOutput(""); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "file" ? "bg-teal text-white" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("file_mode")}
          </button>
        </div>

        {mode === "text" ? (
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("input_placeholder")}
              rows={6}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            />

            <div className="flex gap-2">
              <button
                onClick={encode}
                className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("encode")}
              </button>
              <button
                onClick={decode}
                className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("decode")}
              </button>
            </div>

            {output && (
              <div className="relative">
                <div className="absolute top-3 right-3">
                  <CopyButton text={output} />
                </div>
                <textarea
                  readOnly
                  value={output}
                  rows={6}
                  className="w-full bg-card border border-border rounded-xl p-4 pr-24 text-sm font-mono resize-y focus:outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{t("output_label")}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <FileUpload accept="*/*" onFileSelect={handleFileSelect} />

            {output && (
              <div className="relative">
                <div className="absolute top-3 right-3">
                  <CopyButton text={output} />
                </div>
                <textarea
                  readOnly
                  value={output}
                  rows={6}
                  className="w-full bg-card border border-border rounded-xl p-4 pr-24 text-sm font-mono resize-y focus:outline-none"
                />
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-foreground mb-2">{t("decode")}</p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste Base64 to decode..."
                rows={4}
                className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal mb-2"
              />
              <button
                onClick={handleDecodeFile}
                className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("decode")} & {tc("download")}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    </ToolLayout>
  );
}

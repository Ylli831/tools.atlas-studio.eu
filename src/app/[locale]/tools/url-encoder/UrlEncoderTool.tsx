"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function UrlEncoderTool() {
  const t = useTranslations("tools.url-encoder");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const process = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(
          encodeType === "component"
            ? encodeURIComponent(input)
            : encodeURI(input)
        );
      } else {
        setOutput(
          encodeType === "component"
            ? decodeURIComponent(input)
            : decodeURI(input)
        );
      }
    } catch {
      setError("Invalid input for decoding");
      setOutput("");
    }
  }, [mode, encodeType, input]);

  // Real-time processing
  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
    try {
      if (mode === "encode") {
        setOutput(
          encodeType === "component"
            ? encodeURIComponent(value)
            : encodeURI(value)
        );
      } else {
        setOutput(
          encodeType === "component"
            ? decodeURIComponent(value)
            : decodeURI(value)
        );
      }
    } catch {
      setOutput("");
    }
  };

  return (
    <ToolLayout toolSlug="url-encoder">
      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-surface rounded-lg p-1">
            <button
              onClick={() => {
                setMode("encode");
                setInput("");
                setOutput("");
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === "encode"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("encode")}
            </button>
            <button
              onClick={() => {
                setMode("decode");
                setInput("");
                setOutput("");
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === "decode"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("decode")}
            </button>
          </div>
          <div className="inline-flex bg-surface rounded-lg p-1">
            <button
              onClick={() => {
                setEncodeType("component");
                handleInputChange(input);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                encodeType === "component"
                  ? "bg-card border border-border text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("encode_component")}
            </button>
            <button
              onClick={() => {
                setEncodeType("full");
                handleInputChange(input);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                encodeType === "full"
                  ? "bg-card border border-border text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("full_url")}
            </button>
          </div>
        </div>

        {/* Input */}
        <div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("input_placeholder")}
            rows={5}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const newMode = mode === "encode" ? "decode" : "encode";
              setMode(newMode as "encode" | "decode");
              setInput(output);
              setError("");
              try {
                if (newMode === "encode") {
                  setOutput(
                    encodeType === "component"
                      ? encodeURIComponent(output)
                      : encodeURI(output)
                  );
                } else {
                  setOutput(
                    encodeType === "component"
                      ? decodeURIComponent(output)
                      : decodeURI(output)
                  );
                }
              } catch {
                setOutput("");
              }
            }}
            className="p-2 rounded-full border border-border hover:border-teal text-muted-foreground hover:text-teal transition-colors"
            aria-label="Swap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="7 16 3 12 7 8" />
              <polyline points="17 8 21 12 17 16" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </button>
        </div>

        {/* Output */}
        <div className="relative">
          {output && (
            <div className="absolute top-3 right-3">
              <CopyButton text={output} />
            </div>
          )}
          <textarea
            readOnly
            value={error || output}
            rows={5}
            className={`w-full bg-card border rounded-xl p-4 pr-20 text-sm font-mono leading-relaxed resize-y focus:outline-none ${
              error ? "border-red-400 text-red-500" : "border-border"
            }`}
            placeholder={t("output_label")}
          />
        </div>
      </div>
    </ToolLayout>
  );
}

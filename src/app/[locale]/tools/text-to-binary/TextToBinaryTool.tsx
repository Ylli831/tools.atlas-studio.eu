"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function textToBinary(text: string): string {
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/[^01\s]/g, "").trim();
  if (!cleaned) return "";
  const bytes = cleaned.split(/\s+/);
  return bytes
    .map((byte) => {
      if (byte.length > 8 || byte.length === 0) return "?";
      const code = parseInt(byte, 2);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}

export default function TextToBinaryTool() {
  const t = useTranslations("tools.text-to-binary");
  const [mode, setMode] = useState<"to_binary" | "to_text">("to_binary");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "to_binary" ? textToBinary(input) : binaryToText(input);
  }, [input, mode]);

  return (
    <ToolLayout toolSlug="text-to-binary">
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => {
              setMode("to_binary");
              setInput("");
            }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "to_binary"
                ? "bg-teal text-white"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("to_binary")}
          </button>
          <button
            onClick={() => {
              setMode("to_text");
              setInput("");
            }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "to_text"
                ? "bg-teal text-white"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("to_text")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              {mode === "to_binary" ? t("text_input") : t("binary_input")}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "to_binary"
                  ? t("text_placeholder")
                  : t("binary_placeholder")
              }
              rows={6}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">
                {mode === "to_binary" ? t("binary_output") : t("text_output")}
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <div className="w-full min-h-[148px] rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground overflow-auto break-all leading-relaxed">
              {output ? (
                <span className="tracking-wider">{output}</span>
              ) : (
                <span className="text-muted-foreground">
                  {mode === "to_binary"
                    ? t("binary_placeholder")
                    : t("text_placeholder")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Visual binary display */}
        {mode === "to_binary" && output && (
          <div className="flex flex-wrap gap-2 p-4 bg-card border border-border rounded-xl">
            {output.split(" ").map((byte, i) => (
              <div
                key={i}
                className="bg-surface rounded-lg px-3 py-2 text-center"
              >
                <div className="font-mono text-sm font-bold text-teal">
                  {byte}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {String.fromCharCode(parseInt(byte, 2))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

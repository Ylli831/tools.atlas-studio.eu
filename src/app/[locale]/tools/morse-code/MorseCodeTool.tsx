"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const MORSE: Record<string, string> = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",
  ".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--","/":"-..-.","(":"-.--.",
  ")":"-.--.-","&":".-...","=":"-...-","+":".-.-.","_":"..--.-","-":"-....-",
  ":":"---...",";":"-.-.-.","@":".--.-.","\"":".-..-.","'":".----."
};

const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function encode(text: string): string {
  return text.toUpperCase().split("").map((ch) => {
    if (ch === " ") return "/";
    return MORSE[ch] ?? "?";
  }).join(" ");
}

function decode(morse: string): string {
  return morse.trim().split(" / ").map((word) =>
    word.split(" ").map((code) => MORSE_REVERSE[code] ?? "?").join("")
  ).join(" ");
}

export default function MorseCodeTool() {
  const t = useTranslations("tools.morse-code");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "encode" ? encode(input) : decode(input);
  }, [input, mode]);

  return (
    <ToolLayout toolSlug="morse-code">
      <div className="space-y-4">
        {/* Mode */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button onClick={() => { setMode("encode"); setInput(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "encode" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("text_to_morse")}
          </button>
          <button onClick={() => { setMode("decode"); setInput(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "decode" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("morse_to_text")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              {mode === "encode" ? t("text_input") : t("morse_input")}
            </label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? t("text_placeholder") : t("morse_placeholder")}
              rows={6}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">
                {mode === "encode" ? t("morse_output") : t("text_output")}
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <div className="w-full h-[148px] rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground overflow-auto break-all leading-relaxed">
              {output ? (
                <span className="tracking-wider">{output}</span>
              ) : (
                <span className="text-muted-foreground">{t("output_placeholder")}</span>
              )}
            </div>
          </div>
        </div>

        {/* Visual display for morse output */}
        {mode === "encode" && output && (
          <div className="flex flex-wrap gap-2 p-4 bg-card border border-border rounded-xl">
            {output.split(" ").map((symbol, i) => (
              <span key={i} className={`font-mono text-lg font-bold ${symbol === "/" ? "text-muted-foreground mx-1" : "text-teal"}`}>
                {symbol}
              </span>
            ))}
          </div>
        )}

        {/* Legend */}
        <details className="bg-card border border-border rounded-xl">
          <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:text-teal">{t("reference_table")}</summary>
          <div className="px-4 pb-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 text-xs font-mono">
            {Object.entries(MORSE).slice(0, 36).map(([ch, code]) => (
              <div key={ch} className="bg-surface rounded p-1.5 text-center">
                <div className="font-bold text-teal">{ch}</div>
                <div className="text-muted-foreground">{code}</div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}

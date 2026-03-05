"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const NATO: Record<string, string> = {
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliet",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
};

const NUMBERS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

interface NatoEntry {
  char: string;
  word: string;
}

function convertToNato(text: string): NatoEntry[] {
  const entries: NatoEntry[] = [];
  for (const ch of text) {
    const upper = ch.toUpperCase();
    if (NATO[upper]) {
      entries.push({ char: upper, word: NATO[upper] });
    } else if (NUMBERS[ch]) {
      entries.push({ char: ch, word: NUMBERS[ch] });
    } else if (ch === " ") {
      entries.push({ char: "(space)", word: "---" });
    }
  }
  return entries;
}

function natoToString(entries: NatoEntry[]): string {
  return entries
    .map((e) => (e.word === "---" ? " / " : e.word))
    .join(" ");
}

const NATO_ENTRIES = Object.entries(NATO);
const NUMBER_ENTRIES = Object.entries(NUMBERS);

export default function TextToNatoAlphabetTool() {
  const t = useTranslations("tools.text-to-nato-alphabet");
  const [input, setInput] = useState("");

  const entries = useMemo(() => {
    if (!input.trim()) return [];
    return convertToNato(input);
  }, [input]);

  const lineOutput = useMemo(() => {
    if (entries.length === 0) return "";
    return natoToString(entries);
  }, [entries]);

  return (
    <ToolLayout toolSlug="text-to-nato-alphabet">
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("input_label")}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("input_placeholder")}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
          />
        </div>

        {/* Output as line */}
        {lineOutput && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={lineOutput} />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-sm font-mono break-all leading-relaxed">
              {lineOutput}
            </div>
          </div>
        )}

        {/* Output as table */}
        {entries.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-2 text-left font-medium text-foreground w-24">
                      Char
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-foreground">
                      NATO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-mono font-bold text-teal">
                        {entry.char}
                      </td>
                      <td className="px-4 py-2 text-foreground">
                        {entry.word}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NATO reference table */}
        <details className="bg-card border border-border rounded-xl">
          <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:text-teal">
            {t("reference")}
          </summary>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono mb-4">
              {NATO_ENTRIES.map(([letter, word]) => (
                <div
                  key={letter}
                  className="bg-surface rounded-lg p-2 text-center"
                >
                  <div className="font-bold text-teal text-sm">{letter}</div>
                  <div className="text-muted-foreground mt-0.5">{word}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-mono">
              {NUMBER_ENTRIES.map(([num, word]) => (
                <div
                  key={num}
                  className="bg-surface rounded-lg p-2 text-center"
                >
                  <div className="font-bold text-teal text-sm">{num}</div>
                  <div className="text-muted-foreground mt-0.5">{word}</div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}

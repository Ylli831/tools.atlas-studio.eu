"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const BASES = [
  { label: "Binary", short: "BIN", base: 2, prefix: "0b" },
  { label: "Octal", short: "OCT", base: 8, prefix: "0o" },
  { label: "Decimal", short: "DEC", base: 10, prefix: "" },
  { label: "Hexadecimal", short: "HEX", base: 16, prefix: "0x" },
];

export default function NumberBaseConverterTool() {
  const t = useTranslations("tools.number-base-converter");
  const [inputBase, setInputBase] = useState(10);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (val: string) => {
    setValue(val);
    setError("");
    if (val.trim()) {
      const n = parseInt(val.trim().replace(/^0[bBxXoO]/, ""), inputBase);
      if (isNaN(n)) setError(t("invalid_number"));
    }
  };

  const getConverted = (toBase: number): string => {
    if (!value.trim()) return "";
    const n = parseInt(value.trim().replace(/^0[bBxXoO]/, ""), inputBase);
    if (isNaN(n)) return "-";
    return n.toString(toBase).toUpperCase();
  };

  return (
    <ToolLayout toolSlug="number-base-converter">
      <div className="space-y-6">
        {/* Input base selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{t("from_base")}</label>
          <div className="flex flex-wrap gap-2">
            {BASES.map((b) => (
              <button key={b.base} onClick={() => { setInputBase(b.base); setValue(""); setError(""); }}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${inputBase === b.base ? "bg-teal text-white border-teal" : "border-border bg-card text-muted-foreground hover:border-teal hover:text-teal"}`}
              >
                {b.short} ({b.base})
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t("input_label")}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("input_placeholder")}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BASES.map((b) => {
            const result = getConverted(b.base);
            return (
              <div key={b.base} className={`bg-card border rounded-xl p-4 ${inputBase === b.base ? "border-teal" : "border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{b.label} ({b.base})</span>
                  {result && result !== "-" && <CopyButton text={result} />}
                </div>
                <p className="font-mono text-lg font-semibold text-slate break-all">
                  {result ? (b.prefix ? <><span className="text-muted-foreground text-sm">{b.prefix}</span>{result}</> : result) : <span className="text-muted-foreground text-sm">-</span>}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bit info */}
        {value && !error && (() => {
          const n = parseInt(value.trim().replace(/^0[bBxXoO]/, ""), inputBase);
          if (!isNaN(n) && n >= 0) {
            return (
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-card border border-border rounded-xl px-4 py-3">
                <span><strong className="text-foreground">{t("bits")}:</strong> {n === 0 ? 1 : Math.floor(Math.log2(n)) + 1}</span>
                <span><strong className="text-foreground">{t("bytes")}:</strong> {Math.ceil((n === 0 ? 1 : Math.floor(Math.log2(n)) + 1) / 8)}</span>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </ToolLayout>
  );
}

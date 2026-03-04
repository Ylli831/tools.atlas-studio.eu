"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Mode = "what_is" | "is_what" | "change";

export default function PercentageCalculatorTool() {
  const t = useTranslations("tools.percentage-calculator");
  const tc = useTranslations("common");

  const [mode, setMode] = useState<Mode>("what_is");

  // Mode 1: What is X% of Y?
  const [percentOf, setPercentOf] = useState("25");
  const [ofValue, setOfValue] = useState("200");

  // Mode 2: X is what % of Y?
  const [partValue, setPartValue] = useState("50");
  const [wholeValue, setWholeValue] = useState("200");

  // Mode 3: % change from X to Y
  const [fromValue, setFromValue] = useState("100");
  const [toValue, setToValue] = useState("150");

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === "what_is") {
      const p = parseFloat(percentOf);
      const v = parseFloat(ofValue);
      if (isNaN(p) || isNaN(v)) return null;
      return { value: (p / 100) * v, label: "" };
    }
    if (mode === "is_what") {
      const part = parseFloat(partValue);
      const whole = parseFloat(wholeValue);
      if (isNaN(part) || isNaN(whole) || whole === 0) return null;
      return { value: (part / whole) * 100, label: "%" };
    }
    if (mode === "change") {
      const from = parseFloat(fromValue);
      const to = parseFloat(toValue);
      if (isNaN(from) || isNaN(to) || from === 0) return null;
      const change = ((to - from) / Math.abs(from)) * 100;
      return { value: change, label: "%", isIncrease: change >= 0 };
    }
    return null;
  }, [mode, percentOf, ofValue, partValue, wholeValue, fromValue, toValue]);

  const formattedResult = result
    ? `${result.value % 1 === 0 ? result.value.toString() : result.value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}${result.label}`
    : "";

  const handleCopy = async () => {
    if (!formattedResult) return;
    await navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (mode === "what_is") { setPercentOf(""); setOfValue(""); }
    if (mode === "is_what") { setPartValue(""); setWholeValue(""); }
    if (mode === "change") { setFromValue(""); setToValue(""); }
  };

  const modes: { key: Mode; label: string }[] = [
    { key: "what_is", label: t("tab_what_is") },
    { key: "is_what", label: t("tab_is_what") },
    { key: "change", label: t("tab_change") },
  ];

  return (
    <ToolLayout toolSlug="percentage-calculator">
      <div className="space-y-6">
        {/* Mode tabs */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                mode === m.key
                  ? "bg-teal text-white"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {mode === "what_is" && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">{t("what_is")}</span>
              <input
                type="number"
                value={percentOf}
                onChange={(e) => setPercentOf(e.target.value)}
                className="w-28 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="25"
              />
              <span className="text-sm text-muted-foreground">% {t("of")}</span>
              <input
                type="number"
                value={ofValue}
                onChange={(e) => setOfValue(e.target.value)}
                className="w-36 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="200"
              />
              <span className="text-sm text-muted-foreground">?</span>
            </div>
          )}

          {mode === "is_what" && (
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="number"
                value={partValue}
                onChange={(e) => setPartValue(e.target.value)}
                className="w-28 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="50"
              />
              <span className="text-sm text-muted-foreground">{t("is_what_pct_of")}</span>
              <input
                type="number"
                value={wholeValue}
                onChange={(e) => setWholeValue(e.target.value)}
                className="w-36 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="200"
              />
              <span className="text-sm text-muted-foreground">?</span>
            </div>
          )}

          {mode === "change" && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">{t("change_from")}</span>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-32 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="100"
              />
              <span className="text-sm text-muted-foreground">{t("change_to")}</span>
              <input
                type="number"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                className="w-32 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal text-center"
                placeholder="150"
              />
              <span className="text-sm text-muted-foreground">?</span>
            </div>
          )}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">{t("result")}</p>
            <p className="text-4xl font-bold text-teal">
              {mode === "change" && result.value >= 0 && "+"}
              {formattedResult}
            </p>
            {mode === "change" && (
              <p className={`text-sm mt-2 font-medium ${result.value >= 0 ? "text-green-600" : "text-red-500"}`}>
                {result.value >= 0 ? t("increase") : t("decrease")}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="border border-border text-foreground font-medium px-4 py-2 rounded-lg hover:border-teal hover:text-teal transition-colors text-sm"
          >
            {t("clear")}
          </button>
          {result !== null && (
            <button
              onClick={handleCopy}
              className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              {copied ? tc("copied") : t("copy_result")}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

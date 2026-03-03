"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const VAT_PRESETS = [5, 7, 10, 15, 20, 21, 25];

function fmt(n: number): string {
  return n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function VatCalculatorTool() {
  const t = useTranslations("tools.vat-calculator");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState(20);
  const [customRate, setCustomRate] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const effectiveRate = customRate !== "" ? parseFloat(customRate) : rate;

  const result = useMemo(() => {
    const price = parseFloat(amount);
    if (isNaN(price) || isNaN(effectiveRate) || effectiveRate < 0 || effectiveRate > 100) return null;
    if (mode === "add") {
      const vatAmount = price * (effectiveRate / 100);
      return { net: price, vat: vatAmount, gross: price + vatAmount };
    } else {
      const net = price / (1 + effectiveRate / 100);
      const vatAmount = price - net;
      return { net, vat: vatAmount, gross: price };
    }
  }, [amount, effectiveRate, mode]);

  return (
    <ToolLayout toolSlug="vat-calculator">
      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button onClick={() => setMode("add")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "add" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("add_vat")}
          </button>
          <button onClick={() => setMode("remove")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "remove" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t("remove_vat")}
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{mode === "add" ? t("net_price") : t("gross_price")}</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
        </div>

        {/* VAT rate */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{t("vat_rate")}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {VAT_PRESETS.map((r) => (
              <button key={r} onClick={() => { setRate(r); setCustomRate(""); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${rate === r && customRate === "" ? "bg-teal text-white" : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"}`}
              >
                {r}%
              </button>
            ))}
            <input type="number" placeholder={t("custom")} value={customRate} onChange={(e) => setCustomRate(e.target.value)}
              className="w-20 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-center"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {[
              { label: t("net_amount"), value: fmt(result.net), key: "net" },
              { label: `${t("vat_amount")} (${effectiveRate}%)`, value: fmt(result.vat), key: "vat", accent: true },
              { label: t("gross_amount"), value: fmt(result.gross), key: "gross", bold: true },
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between px-5 py-3.5">
                <span className={`text-sm ${row.bold ? "font-semibold text-slate" : "text-muted-foreground"}`}>{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-semibold ${row.accent ? "text-teal" : row.bold ? "text-slate text-lg" : "text-foreground"}`}>{row.value}</span>
                  <CopyButton text={row.value} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

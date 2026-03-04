"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const TIP_PRESETS = [10, 15, 18, 20, 25];

function fmt(n: number): string {
  return n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TipCalculatorTool() {
  const t = useTranslations("tools.tip-calculator");

  const [billAmount, setBillAmount] = useState("50");
  const [tipPercent, setTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");

  const effectiveTip = customTip !== "" ? parseFloat(customTip) : tipPercent;

  const result = useMemo(() => {
    const bill = parseFloat(billAmount);
    const numPeople = parseInt(people, 10);
    if (isNaN(bill) || bill <= 0 || isNaN(effectiveTip) || effectiveTip < 0 || isNaN(numPeople) || numPeople < 1)
      return null;
    const tipAmount = bill * (effectiveTip / 100);
    const totalWithTip = bill + tipAmount;
    const perPerson = totalWithTip / numPeople;
    const tipPerPerson = tipAmount / numPeople;
    return { tipAmount, totalWithTip, perPerson, tipPerPerson };
  }, [billAmount, effectiveTip, people]);

  return (
    <ToolLayout toolSlug="tip-calculator">
      <div className="space-y-6">
        {/* Bill amount */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("bill_amount")}</label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            min="0"
            step="0.01"
            placeholder="50.00"
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-lg font-mono text-foreground focus:outline-none focus:border-teal"
          />
        </div>

        {/* Tip percentage */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("tip_percentage")}</label>
          <div className="flex flex-wrap gap-2">
            {TIP_PRESETS.map((pct) => (
              <button
                key={pct}
                onClick={() => { setTipPercent(pct); setCustomTip(""); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tipPercent === pct && customTip === ""
                    ? "bg-teal text-white"
                    : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"
                }`}
              >
                {pct}%
              </button>
            ))}
            <input
              type="number"
              placeholder={t("custom")}
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              min="0"
              max="100"
              className="w-24 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-teal text-center"
            />
          </div>
        </div>

        {/* Number of people */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("number_of_people")}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople(String(Math.max(1, parseInt(people || "1", 10) - 1)))}
              className="border border-border text-foreground font-medium w-10 h-10 rounded-lg hover:border-teal hover:text-teal transition-colors text-lg"
            >
              -
            </button>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              min="1"
              className="w-20 bg-card border border-border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-teal"
            />
            <button
              onClick={() => setPeople(String(parseInt(people || "1", 10) + 1))}
              className="border border-border text-foreground font-medium w-10 h-10 rounded-lg hover:border-teal hover:text-teal transition-colors text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{t("tip_amount")}</span>
              <span className="font-mono font-semibold text-teal">{fmt(result.tipAmount)}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{t("total_with_tip")}</span>
              <span className="font-mono font-semibold text-foreground text-lg">{fmt(result.totalWithTip)}</span>
            </div>
            {parseInt(people, 10) > 1 && (
              <>
                <div className="flex items-center justify-between px-5 py-3.5 bg-teal/5">
                  <span className="text-sm font-medium text-slate">{t("per_person")}</span>
                  <span className="font-mono font-bold text-teal text-lg">{fmt(result.perPerson)}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-muted-foreground">{t("tip_per_person")}</span>
                  <span className="font-mono font-semibold text-muted-foreground">{fmt(result.tipPerPerson)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

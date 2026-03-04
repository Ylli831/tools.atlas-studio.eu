"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Unit = "metric" | "imperial";

interface BmiResult {
  bmi: number;
  category: string;
  colorClass: string;
}

function calculateBmi(weight: number, height: number, unit: Unit): number | null {
  if (weight <= 0 || height <= 0) return null;
  if (unit === "metric") {
    const heightM = height / 100;
    return weight / (heightM * heightM);
  } else {
    // Imperial: weight in lbs, height in inches
    return (weight / (height * height)) * 703;
  }
}

export default function BmiCalculatorTool() {
  const t = useTranslations("tools.bmi-calculator");

  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);

  const getCategory = (bmi: number): { category: string; colorClass: string } => {
    if (bmi < 18.5) return { category: t("underweight"), colorClass: "text-blue-500" };
    if (bmi < 25) return { category: t("normal"), colorClass: "text-green-600" };
    if (bmi < 30) return { category: t("overweight"), colorClass: "text-yellow-600" };
    return { category: t("obese"), colorClass: "text-red-500" };
  };

  const getBgClass = (bmi: number): string => {
    if (bmi < 18.5) return "bg-blue-500/10 border-blue-500/20";
    if (bmi < 25) return "bg-green-500/10 border-green-500/20";
    if (bmi < 30) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const bmi = calculateBmi(w, h, unit);
    if (bmi === null) return;
    const { category, colorClass } = getCategory(bmi);
    setResult({ bmi, category, colorClass });
  };

  return (
    <ToolLayout toolSlug="bmi-calculator">
      <div className="space-y-6">
        {/* Unit toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => { setUnit("metric"); setResult(null); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              unit === "metric" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("metric")}
          </button>
          <button
            onClick={() => { setUnit("imperial"); setResult(null); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              unit === "imperial" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("imperial")}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("weight")} ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              min="0"
              step="0.1"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("height")} ({unit === "metric" ? "cm" : "in"})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "175" : "69"}
              min="0"
              step="0.1"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          disabled={!weight || !height}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("calculate")}
        </button>

        {/* Result */}
        {result && (
          <div className={`border rounded-xl p-6 text-center ${getBgClass(result.bmi)}`}>
            <p className="text-sm text-muted-foreground mb-2">{t("your_bmi")}</p>
            <p className={`text-5xl font-bold ${result.colorClass}`}>
              {result.bmi.toFixed(1)}
            </p>
            <p className={`text-lg font-semibold mt-2 ${result.colorClass}`}>
              {result.category}
            </p>
          </div>
        )}

        {/* BMI ranges reference */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-medium text-foreground mb-3">{t("bmi_ranges")}</p>
          <div className="space-y-2">
            {[
              { label: t("underweight"), range: "< 18.5", color: "bg-blue-500" },
              { label: t("normal"), range: "18.5 - 24.9", color: "bg-green-500" },
              { label: t("overweight"), range: "25 - 29.9", color: "bg-yellow-500" },
              { label: t("obese"), range: "30+", color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-foreground flex-1">{item.label}</span>
                <span className="text-sm text-muted-foreground font-mono">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

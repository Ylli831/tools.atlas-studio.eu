"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RandomNumberGeneratorTool() {
  const t = useTranslations("tools.random-number-generator");
  const tc = useTranslations("common");

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [unique, setUnique] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  // Coin flip
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);

  // Dice roll
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);

  const handleGenerate = useCallback(() => {
    const minVal = Math.min(min, max);
    const maxVal = Math.max(min, max);
    const range = maxVal - minVal + 1;
    const qty = Math.min(quantity, 1000);

    if (unique && qty > range) {
      // Can't generate more unique numbers than the range allows
      const nums: number[] = [];
      for (let i = minVal; i <= maxVal; i++) {
        nums.push(i);
      }
      // Shuffle using Fisher-Yates
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      const result = sorted ? nums.sort((a, b) => a - b) : nums;
      setResults(result);
      return;
    }

    if (unique) {
      const set = new Set<number>();
      while (set.size < qty) {
        set.add(Math.floor(Math.random() * range) + minVal);
      }
      const nums = Array.from(set);
      setResults(sorted ? nums.sort((a, b) => a - b) : nums);
    } else {
      const nums: number[] = [];
      for (let i = 0; i < qty; i++) {
        nums.push(Math.floor(Math.random() * range) + minVal);
      }
      setResults(sorted ? nums.sort((a, b) => a - b) : nums);
    }
  }, [min, max, quantity, unique, sorted]);

  const handleCoinFlip = useCallback(() => {
    setCoinFlipping(true);
    setCoinResult(null);
    let flips = 0;
    const interval = setInterval(() => {
      setCoinResult(Math.random() < 0.5 ? "Heads" : "Tails");
      flips++;
      if (flips >= 8) {
        clearInterval(interval);
        setCoinResult(Math.random() < 0.5 ? "Heads" : "Tails");
        setCoinFlipping(false);
      }
    }, 80);
  }, []);

  const handleDiceRoll = useCallback(() => {
    setDiceRolling(true);
    setDiceResult(null);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls >= 8) {
        clearInterval(interval);
        setDiceResult(Math.floor(Math.random() * 6) + 1);
        setDiceRolling(false);
      }
    }, 80);
  }, []);

  const diceFaces: Record<number, string> = {
    1: "\u2680",
    2: "\u2681",
    3: "\u2682",
    4: "\u2683",
    5: "\u2684",
    6: "\u2685",
  };

  return (
    <ToolLayout toolSlug="random-number-generator">
      <div className="space-y-6">
        {/* Number Generator */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("min")}
              </label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("max")}
              </label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("quantity")}
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value))))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unique}
                onChange={(e) => setUnique(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-teal"
              />
              <span className="text-sm text-foreground">{t("unique")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sorted}
                onChange={(e) => setSorted(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-teal"
              />
              <span className="text-sm text-foreground">{t("sorted")}</span>
            </label>
          </div>

          <button
            onClick={handleGenerate}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>

          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  {t("results")} ({results.length})
                </label>
                <CopyButton text={results.join(", ")} />
              </div>
              <div className="bg-card border border-border rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {results.map((num, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1.5 bg-surface text-foreground text-sm font-mono rounded-lg border border-border"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Coin Flip */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t("coin_flip")}
            </h3>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-2 transition-all ${
              coinResult === "Heads"
                ? "bg-teal/10 border-teal text-teal"
                : coinResult === "Tails"
                  ? "bg-orange-50 border-orange-400 text-orange-600"
                  : "bg-surface border-border text-muted-foreground"
            } ${coinFlipping ? "animate-pulse" : ""}`}>
              {coinResult ? coinResult[0] : "?"}
            </div>
            {coinResult && !coinFlipping && (
              <span className="text-sm font-medium text-foreground">{coinResult}</span>
            )}
            <button
              onClick={handleCoinFlip}
              disabled={coinFlipping}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {t("coin_flip")}
            </button>
          </div>

          {/* Dice Roll */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t("dice_roll")}
            </h3>
            <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-5xl border-2 transition-all ${
              diceResult
                ? "bg-teal/10 border-teal"
                : "bg-surface border-border"
            } ${diceRolling ? "animate-pulse" : ""}`}>
              {diceResult ? diceFaces[diceResult] : "?"}
            </div>
            {diceResult && !diceRolling && (
              <span className="text-sm font-medium text-foreground">{diceResult}</span>
            )}
            <button
              onClick={handleDiceRoll}
              disabled={diceRolling}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {t("dice_roll")}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

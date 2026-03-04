"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  barColor: string;
  entropy: number;
  crackTime: string;
  checks: { key: string; label: string; passed: boolean }[];
}

function calcCharsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33;
  return size;
}

function calcEntropy(password: string): number {
  const charsetSize = calcCharsetSize(password);
  if (charsetSize === 0 || password.length === 0) return 0;
  return password.length * Math.log2(charsetSize);
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)}k years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)}M years`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)}B years`;
  return `${(years / 1e12).toFixed(1)}T+ years`;
}

function estimateCrackTime(password: string): string {
  const charsetSize = calcCharsetSize(password);
  if (charsetSize === 0 || password.length === 0) return "-";
  // Assume 10 billion guesses/second (modern GPU)
  const combinations = Math.pow(charsetSize, password.length);
  const seconds = combinations / 10e9 / 2; // average case
  return formatCrackTime(seconds);
}

export default function PasswordStrengthCheckerTool() {
  const t = useTranslations("tools.password-strength-checker");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo((): StrengthResult | null => {
    if (!password) return null;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    const len = password.length;

    const checks = [
      { key: "length_8", label: t("check_length_8"), passed: len >= 8 },
      { key: "length_12", label: t("check_length_12"), passed: len >= 12 },
      { key: "length_16", label: t("check_length_16"), passed: len >= 16 },
      { key: "lowercase", label: t("check_lowercase"), passed: hasLower },
      { key: "uppercase", label: t("check_uppercase"), passed: hasUpper },
      { key: "numbers", label: t("check_numbers"), passed: hasNumbers },
      { key: "symbols", label: t("check_symbols"), passed: hasSymbols },
    ];

    const entropy = calcEntropy(password);
    const crackTime = estimateCrackTime(password);

    // Score based on entropy
    let score = 0;
    if (entropy >= 25) score = 1; // Fair
    if (entropy >= 40) score = 2; // Good
    if (entropy >= 60) score = 3; // Strong
    if (entropy >= 80) score = 4; // Very Strong

    // Penalize short passwords regardless of entropy
    if (len < 6) score = Math.min(score, 0);
    else if (len < 8) score = Math.min(score, 1);

    const labels = [t("weak"), t("fair"), t("good"), t("strong"), t("very_strong")];
    const colors = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600", "text-green-500"];
    const barColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-600", "bg-green-500"];

    return {
      score,
      label: labels[score],
      color: colors[score],
      barColor: barColors[score],
      entropy,
      crackTime,
      checks,
    };
  }, [password, t]);

  return (
    <ToolLayout toolSlug="password-strength-checker">
      <div className="space-y-6">
        {/* Password input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("password_label")}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal pr-20 font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
            >
              {showPassword ? t("hide") : t("show")}
            </button>
          </div>
        </div>

        {analysis && (
          <>
            {/* Strength bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${analysis.color}`}>{analysis.label}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {analysis.entropy.toFixed(1)} {t("bits_entropy")}
                </span>
              </div>
              <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${analysis.barColor}`}
                  style={{ width: `${Math.min(100, (analysis.score + 1) * 20)}%` }}
                />
              </div>
            </div>

            {/* Crack time */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("estimated_crack_time")}</span>
              <span className="text-sm font-semibold text-foreground font-mono">{analysis.crackTime}</span>
            </div>

            {/* Checklist */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm font-medium text-foreground mb-3">{t("criteria")}</p>
              <div className="space-y-2">
                {analysis.checks.map((check) => (
                  <div key={check.key} className="flex items-center gap-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      check.passed
                        ? "bg-green-500/15 text-green-600"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {check.passed ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-sm ${check.passed ? "text-foreground" : "text-muted-foreground"}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

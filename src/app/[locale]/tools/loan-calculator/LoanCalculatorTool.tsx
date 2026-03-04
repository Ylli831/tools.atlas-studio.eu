"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calculateLoan(principal: number, annualRate: number, totalMonths: number) {
  if (principal <= 0 || annualRate < 0 || totalMonths <= 0) return null;

  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  // Amortization schedule (first 12 months)
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  const months = Math.min(totalMonths, 12);

  for (let i = 1; i <= months; i++) {
    const interestPart = balance * monthlyRate;
    const principalPart = monthlyPayment - interestPart;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPart,
      interest: interestPart,
      balance,
    });
  }

  return { monthlyPayment, totalPayment, totalInterest, schedule };
}

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LoanCalculatorTool() {
  const t = useTranslations("tools.loan-calculator");
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("5");
  const [term, setTerm] = useState("20");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");

  const totalMonths = termUnit === "years" ? Number(term) * 12 : Number(term);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const m = totalMonths;
    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r < 0 || m <= 0) return null;
    return calculateLoan(p, r, m);
  }, [principal, rate, totalMonths]);

  return (
    <ToolLayout toolSlug="loan-calculator">
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("principal")}
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              min="0"
              step="1000"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("interest_rate")}
            </label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("loan_term")}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                min="1"
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
              <select
                value={termUnit}
                onChange={(e) => setTermUnit(e.target.value as "years" | "months")}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="years">{t("years")}</option>
                <option value="months">{t("months")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-teal/5 border border-teal/20 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("monthly_payment")}</p>
                <p className="text-2xl font-bold text-teal">{formatCurrency(result.monthlyPayment)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("total_payment")}</p>
                <p className="text-2xl font-bold text-slate">{formatCurrency(result.totalPayment)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("total_interest")}</p>
                <p className="text-2xl font-bold text-slate">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Cost Breakdown Bar */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{t("principal_label")}</span>
                <span>{t("interest_label")}</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden flex bg-background">
                <div
                  className="bg-teal h-full transition-all"
                  style={{ width: `${(parseFloat(principal) / result.totalPayment) * 100}%` }}
                />
                <div
                  className="bg-terracotta/60 h-full transition-all"
                  style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                  {formatCurrency(parseFloat(principal))}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta/60" />
                  {formatCurrency(result.totalInterest)}
                </span>
              </div>
            </div>

            {/* Amortization Table */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                {t("amortization_title")}
              </h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">{t("col_month")}</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("col_payment")}</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("col_principal")}</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("col_interest")}</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("col_balance")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-mono">{row.month}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-teal">{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalMonths > 12 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t("showing_first_12", { total: totalMonths })}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

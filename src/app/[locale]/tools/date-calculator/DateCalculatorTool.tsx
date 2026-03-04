"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Mode = "between" | "add_subtract";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateDiff(start: Date, end: Date) {
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Calculate years, months, days
  let d1 = start < end ? new Date(start) : new Date(end);
  let d2 = start < end ? new Date(end) : new Date(start);

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { totalDays, totalWeeks, remainingDays, years, months, days };
}

export default function DateCalculatorTool() {
  const t = useTranslations("tools.date-calculator");

  const today = new Date().toISOString().split("T")[0];
  const [mode, setMode] = useState<Mode>("between");

  // Between mode
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Add/Subtract mode
  const [baseDate, setBaseDate] = useState(today);
  const [daysToAdd, setDaysToAdd] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const betweenResult = useMemo(() => {
    if (mode !== "between" || !startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diff = dateDiff(start, end);
    const startDay = DAYS_OF_WEEK[start.getDay()];
    const endDay = DAYS_OF_WEEK[end.getDay()];
    return { ...diff, startDay, endDay };
  }, [mode, startDate, endDate]);

  const addSubResult = useMemo(() => {
    if (mode !== "add_subtract" || !baseDate || !daysToAdd) return null;
    const base = new Date(baseDate);
    const numDays = parseInt(daysToAdd, 10);
    if (isNaN(base.getTime()) || isNaN(numDays)) return null;
    const result = new Date(base);
    result.setDate(result.getDate() + (operation === "add" ? numDays : -numDays));
    const dayOfWeek = DAYS_OF_WEEK[result.getDay()];
    const formatted = result.toISOString().split("T")[0];
    return { date: result, formatted, dayOfWeek };
  }, [mode, baseDate, daysToAdd, operation]);

  return (
    <ToolLayout toolSlug="date-calculator">
      <div className="space-y-6">
        {/* Mode tabs */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setMode("between")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "between" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("days_between")}
          </button>
          <button
            onClick={() => setMode("add_subtract")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "add_subtract" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("add_subtract_days")}
          </button>
        </div>

        {/* Between dates mode */}
        {mode === "between" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("start_date")}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("end_date")}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            {betweenResult && (
              <div className="space-y-4">
                {/* Main result */}
                <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t("difference")}</p>
                  <p className="text-4xl font-bold text-teal">
                    {betweenResult.totalDays} <span className="text-xl text-muted-foreground font-normal">{t("days")}</span>
                  </p>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate">{betweenResult.years}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("years")}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate">{betweenResult.months}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("months")}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate">{betweenResult.days}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("days")}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate">
                      {betweenResult.totalWeeks}<span className="text-sm text-muted-foreground font-normal"> w {betweenResult.remainingDays}d</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("weeks")}</p>
                  </div>
                </div>

                {/* Day info */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("start_date")}</span>
                    <span className="font-medium text-foreground">{betweenResult.startDay}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">{t("end_date")}</span>
                    <span className="font-medium text-foreground">{betweenResult.endDay}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add/Subtract mode */}
        {mode === "add_subtract" && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("from_date")}</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-end gap-3">
                {/* Add/Subtract toggle */}
                <div className="flex rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOperation("add")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      operation === "add" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    + {t("add")}
                  </button>
                  <button
                    onClick={() => setOperation("subtract")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      operation === "subtract" ? "bg-teal text-white" : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    - {t("subtract")}
                  </button>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("number_of_days")}</label>
                  <input
                    type="number"
                    value={daysToAdd}
                    onChange={(e) => setDaysToAdd(e.target.value)}
                    min="0"
                    placeholder="30"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                  />
                </div>
              </div>
            </div>

            {addSubResult && (
              <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">{t("result_date")}</p>
                <p className="text-3xl font-bold text-teal">{addSubResult.formatted}</p>
                <p className="text-sm text-muted-foreground mt-2">{addSubResult.dayOfWeek}</p>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function calcAge(dob: Date, ref: Date) {
  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  let days = ref.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((ref.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  const nextBirthday = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= ref) nextBirthday.setFullYear(ref.getFullYear() + 1);
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
  const isToday = dob.getMonth() === ref.getMonth() && dob.getDate() === ref.getDate();

  return { years, months, days, totalDays, totalWeeks, totalMonths, daysUntilBirthday, isToday };
}

export default function AgeCalculatorTool() {
  const t = useTranslations("tools.age-calculator");
  const today = new Date().toISOString().split("T")[0];
  const [dob, setDob] = useState("1990-01-01");
  const [refDate, setRefDate] = useState(today);

  const result = useMemo(() => {
    if (!dob || !refDate) return null;
    const dobDate = new Date(dob);
    const refDateObj = new Date(refDate);
    if (dobDate > refDateObj) return null;
    return calcAge(dobDate, refDateObj);
  }, [dob, refDate]);

  return (
    <ToolLayout toolSlug="age-calculator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("date_of_birth")}</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={today}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("as_of_date")}</label>
            <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            {/* Main result */}
            <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{t("age_label")}</p>
              <p className="text-4xl font-bold text-teal">
                {result.years} <span className="text-xl text-muted-foreground font-normal">{t("years")}</span>{" "}
                {result.months} <span className="text-xl text-muted-foreground font-normal">{t("months")}</span>{" "}
                {result.days} <span className="text-xl text-muted-foreground font-normal">{t("days")}</span>
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t("total_days"), value: result.totalDays.toLocaleString() },
                { label: t("total_weeks"), value: result.totalWeeks.toLocaleString() },
                { label: t("total_months"), value: result.totalMonths.toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Birthday countdown */}
            <div className={`rounded-xl p-4 flex items-center gap-3 ${result.isToday ? "bg-terracotta/10 border border-terracotta/20" : "bg-card border border-border"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={result.isToday ? "text-terracotta" : "text-teal"}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p className="text-sm font-medium text-foreground">
                {result.isToday ? t("happy_birthday") : t("next_birthday", { days: result.daysUntilBirthday })}
              </p>
            </div>
          </div>
        )}

        {dob && refDate && new Date(dob) > new Date(refDate) && (
          <p className="text-sm text-red-500">{t("dob_after_ref")}</p>
        )}
      </div>
    </ToolLayout>
  );
}

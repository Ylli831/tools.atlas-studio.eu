"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import cronstrue from "cronstrue";

interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export default function CronExpressionGeneratorTool() {
  const t = useTranslations("tools.cron-expression-generator");
  const tc = useTranslations("common");
  const [fields, setFields] = useState<CronFields>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });
  const [copiedExpression, setCopiedExpression] = useState(false);

  const expression = useMemo(
    () =>
      `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`,
    [fields]
  );

  const humanReadable = useMemo(() => {
    try {
      return cronstrue.toString(expression, { use24HourTimeFormat: true });
    } catch {
      return t("invalid_expression");
    }
  }, [expression, t]);

  const isValid = useMemo(() => {
    try {
      cronstrue.toString(expression);
      return true;
    } catch {
      return false;
    }
  }, [expression]);

  // Calculate next N scheduled runs
  const getNextRuns = useCallback(
    (count: number): Date[] => {
      if (!isValid) return [];
      const runs: Date[] = [];
      const now = new Date();
      let check = new Date(now);
      check.setSeconds(0, 0);
      check.setMinutes(check.getMinutes() + 1);

      const matchField = (value: string, current: number, max: number): boolean => {
        if (value === "*") return true;
        // Handle lists
        const parts = value.split(",");
        for (const part of parts) {
          // Handle ranges
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(Number);
            if (current >= start && current <= end) return true;
            continue;
          }
          // Handle steps
          if (part.includes("/")) {
            const [base, step] = part.split("/");
            const stepNum = Number(step);
            const baseNum = base === "*" ? 0 : Number(base);
            if ((current - baseNum) % stepNum === 0 && current >= baseNum) return true;
            continue;
          }
          if (Number(part) === current) return true;
        }
        return false;
      };

      let iterations = 0;
      const maxIterations = 525960; // ~1 year in minutes

      while (runs.length < count && iterations < maxIterations) {
        const min = check.getMinutes();
        const hr = check.getHours();
        const dom = check.getDate();
        const mon = check.getMonth() + 1;
        const dow = check.getDay();

        if (
          matchField(fields.minute, min, 59) &&
          matchField(fields.hour, hr, 23) &&
          matchField(fields.dayOfMonth, dom, 31) &&
          matchField(fields.month, mon, 12) &&
          matchField(fields.dayOfWeek, dow, 6)
        ) {
          runs.push(new Date(check));
        }

        check.setMinutes(check.getMinutes() + 1);
        iterations++;
      }

      return runs;
    },
    [fields, isValid]
  );

  const nextRuns = useMemo(() => getNextRuns(5), [getNextRuns]);

  const updateField = (key: keyof CronFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const presets: { name: string; fields: CronFields }[] = [
    {
      name: t("every_minute"),
      fields: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
    },
    {
      name: t("every_hour"),
      fields: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
    },
    {
      name: t("every_day"),
      fields: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
    },
    {
      name: t("every_week"),
      fields: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" },
    },
    {
      name: t("every_month"),
      fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*" },
    },
    {
      name: t("every_5_min"),
      fields: { minute: "*/5", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
    },
    {
      name: t("weekdays_9am"),
      fields: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" },
    },
  ];

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expression);
    setCopiedExpression(true);
    setTimeout(() => setCopiedExpression(false), 2000);
  };

  const fieldLabels: { key: keyof CronFields; label: string; hint: string }[] = [
    { key: "minute", label: t("minute"), hint: "0-59" },
    { key: "hour", label: t("hour"), hint: "0-23" },
    { key: "dayOfMonth", label: t("day_month"), hint: "1-31" },
    { key: "month", label: t("month"), hint: "1-12" },
    { key: "dayOfWeek", label: t("day_week"), hint: "0-6 (0=Sun)" },
  ];

  return (
    <ToolLayout toolSlug="cron-expression-generator">
      <div className="space-y-6">
        {/* Presets */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("presets")}
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setFields(preset.fields)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Field inputs */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-5 gap-3">
            {fieldLabels.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={fields[f.key]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-sm text-foreground text-center font-mono"
                />
                <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                  {f.hint}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expression output */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("expression")}
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-surface rounded-lg px-4 py-2.5 text-lg font-mono text-foreground text-center">
                {expression}
              </code>
              <button
                onClick={copyExpression}
                className="bg-teal text-white px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm font-medium shrink-0"
              >
                {copiedExpression ? tc("copied") : tc("copy")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("description_label")}
            </label>
            <p
              className={`text-sm ${
                isValid ? "text-foreground" : "text-danger"
              }`}
            >
              {humanReadable}
            </p>
          </div>
        </div>

        {/* Next runs */}
        {isValid && nextRuns.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("next_runs")}
            </label>
            <div className="space-y-1.5">
              {nextRuns.map((run, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-foreground bg-surface rounded-lg px-3 py-1.5"
                >
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <span className="font-mono">
                    {run.toLocaleString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Syntax help */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("syntax_help")}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-surface rounded-lg px-3 py-2">
              <code className="text-teal">*</code>{" "}
              <span className="text-muted-foreground">{t("help_any")}</span>
            </div>
            <div className="bg-surface rounded-lg px-3 py-2">
              <code className="text-teal">*/5</code>{" "}
              <span className="text-muted-foreground">{t("help_every_n")}</span>
            </div>
            <div className="bg-surface rounded-lg px-3 py-2">
              <code className="text-teal">1,15</code>{" "}
              <span className="text-muted-foreground">{t("help_list")}</span>
            </div>
            <div className="bg-surface rounded-lg px-3 py-2">
              <code className="text-teal">1-5</code>{" "}
              <span className="text-muted-foreground">{t("help_range")}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

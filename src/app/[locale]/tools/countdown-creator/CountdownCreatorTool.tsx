"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

function getDefaultDateTime(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(12, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function CountdownCreatorTool() {
  const t = useTranslations("tools.countdown-creator");
  const tc = useTranslations("common");

  const [eventName, setEventName] = useState("");
  const [targetDate, setTargetDate] = useState(getDefaultDateTime());
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const updateCountdown = useCallback(() => {
    if (!targetDate) return;
    const target = new Date(targetDate);
    setTimeLeft(calcTimeLeft(target));
  }, [targetDate]);

  // Tick every second
  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <ToolLayout toolSlug="countdown-creator">
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("event_name")}
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder={t("event_placeholder")}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("target_date")}
            </label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Countdown display */}
        {timeLeft && (
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            {/* Event name */}
            {eventName && (
              <h2 className="text-lg md:text-xl font-semibold text-foreground text-center mb-6">
                {eventName}
              </h2>
            )}

            {timeLeft.expired ? (
              <div className="text-center py-8">
                <div className="text-3xl md:text-5xl font-bold text-terracotta mb-2">
                  {t("expired")}
                </div>
                <p className="text-muted-foreground text-sm">
                  {new Date(targetDate).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                {[
                  { value: timeLeft.days, label: t("days") },
                  { value: timeLeft.hours, label: t("hours") },
                  { value: timeLeft.minutes, label: t("minutes") },
                  { value: timeLeft.seconds, label: t("seconds") },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="bg-surface rounded-xl p-3 md:p-5 mb-2">
                      <span
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-teal font-mono"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {pad(value)}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Target date info */}
            {!timeLeft.expired && (
              <p className="text-center text-xs text-muted-foreground mt-6">
                {new Date(targetDate).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatDate(date: Date) {
  return {
    unix: Math.floor(date.getTime() / 1000).toString(),
    iso: date.toISOString(),
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    dateLocal: date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    timeLocal: date.toLocaleTimeString(),
  };
}

export default function TimestampConverterTool() {
  const t = useTranslations("tools.timestamp-converter");
  const [now, setNow] = useState(new Date());
  const [unixInput, setUnixInput] = useState("");
  const [isoInput, setIsoInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof formatDate> | null>(null);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const convertFromUnix = useCallback(() => {
    const ts = Number(unixInput);
    if (isNaN(ts)) return;
    // Support both seconds and milliseconds
    const date = new Date(ts > 1e12 ? ts : ts * 1000);
    if (isNaN(date.getTime())) return;
    setResult(formatDate(date));
    setIsoInput(date.toISOString());
  }, [unixInput]);

  const convertFromIso = useCallback(() => {
    const date = new Date(isoInput);
    if (isNaN(date.getTime())) return;
    setResult(formatDate(date));
    setUnixInput(Math.floor(date.getTime() / 1000).toString());
  }, [isoInput]);

  const setToNow = () => {
    const date = new Date();
    setUnixInput(Math.floor(date.getTime() / 1000).toString());
    setIsoInput(date.toISOString());
    setResult(formatDate(date));
  };

  const nowFormatted = formatDate(now);

  return (
    <ToolLayout toolSlug="timestamp-converter">
      <div className="space-y-6">
        {/* Current time display */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-foreground">
              {t("current_time")}
            </h3>
            <button
              onClick={setToNow}
              className="text-xs text-teal hover:underline"
            >
              {t("now")}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between bg-surface rounded-lg p-3">
              <span className="text-muted-foreground">Unix</span>
              <span className="font-mono text-foreground">
                {nowFormatted.unix}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface rounded-lg p-3">
              <span className="text-muted-foreground">ISO</span>
              <span className="font-mono text-foreground text-xs">
                {nowFormatted.iso}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface rounded-lg p-3">
              <span className="text-muted-foreground">{t("local_time")}</span>
              <span className="font-mono text-foreground">
                {nowFormatted.timeLocal}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface rounded-lg p-3">
              <span className="text-muted-foreground">{t("utc_time")}</span>
              <span className="font-mono text-foreground text-xs">
                {nowFormatted.utc}
              </span>
            </div>
          </div>
        </div>

        {/* Conversion inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("unix_timestamp")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                placeholder="1709472000"
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
              <button
                onClick={convertFromUnix}
                className="bg-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-hover transition-colors"
              >
                {t("convert")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("iso_format")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={isoInput}
                onChange={(e) => setIsoInput(e.target.value)}
                placeholder="2024-03-03T12:00:00Z"
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
              <button
                onClick={convertFromIso}
                className="bg-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-hover transition-colors"
              >
                {t("convert")}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {t("human_readable")}
            </h3>
            {[
              { label: t("unix_timestamp"), value: result.unix },
              { label: t("iso_format"), value: result.iso },
              { label: t("local_time"), value: result.local },
              { label: t("utc_time"), value: result.utc },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between bg-surface rounded-lg p-3"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">
                    {value}
                  </span>
                  <CopyButton text={value} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

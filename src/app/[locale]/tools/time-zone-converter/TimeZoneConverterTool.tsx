"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function getTimezones(): string[] {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Anchorage",
      "Pacific/Honolulu",
      "America/Toronto",
      "America/Vancouver",
      "America/Mexico_City",
      "America/Sao_Paulo",
      "America/Argentina/Buenos_Aires",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Madrid",
      "Europe/Rome",
      "Europe/Amsterdam",
      "Europe/Brussels",
      "Europe/Vienna",
      "Europe/Zurich",
      "Europe/Stockholm",
      "Europe/Oslo",
      "Europe/Copenhagen",
      "Europe/Warsaw",
      "Europe/Athens",
      "Europe/Istanbul",
      "Europe/Moscow",
      "Europe/Tirane",
      "Africa/Cairo",
      "Africa/Lagos",
      "Africa/Johannesburg",
      "Asia/Dubai",
      "Asia/Riyadh",
      "Asia/Kolkata",
      "Asia/Shanghai",
      "Asia/Tokyo",
      "Asia/Seoul",
      "Asia/Singapore",
      "Asia/Hong_Kong",
      "Asia/Bangkok",
      "Asia/Jakarta",
      "Australia/Sydney",
      "Australia/Melbourne",
      "Pacific/Auckland",
      "Pacific/Fiji",
      "UTC",
    ];
  }
}

function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function formatInTimezone(date: Date, timezone: string): string {
  try {
    return date.toLocaleString("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid timezone";
  }
}

function getTimeInTimezone(date: Date, timezone: string): string {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--:--";
  }
}

function getDateInTimezone(date: Date, timezone: string): string {
  try {
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "---";
  }
}

function getOffsetLabel(timezone: string): string {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || "";
  } catch {
    return "";
  }
}

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
    const tzStr = date.toLocaleString("en-US", { timeZone: timezone });
    const utcDate = new Date(utcStr);
    const tzDate = new Date(tzStr);
    return (utcDate.getTime() - tzDate.getTime()) / 60000;
  } catch {
    return 0;
  }
}

export default function TimeZoneConverterTool() {
  const t = useTranslations("tools.time-zone-converter");
  const tc = useTranslations("common");

  const timezones = useMemo(() => getTimezones(), []);
  const userTz = useMemo(() => getUserTimezone(), []);

  const [fromZone, setFromZone] = useState(userTz);
  const [toZone, setToZone] = useState("UTC");
  const [dateTime, setDateTime] = useState(getCurrentDateTimeLocal());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertedTime = useMemo(() => {
    if (!dateTime || !fromZone || !toZone) return null;

    try {
      const [datePart, timePart] = dateTime.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);

      // Create a UTC date from the input
      const tempDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      // Get offset of "from" timezone and adjust
      const fromOffset = getTimezoneOffset(fromZone, tempDate);
      const utcTime = new Date(tempDate.getTime() + fromOffset * 60000);

      return formatInTimezone(utcTime, toZone);
    } catch {
      return null;
    }
  }, [dateTime, fromZone, toZone]);

  const handleSwap = () => {
    setFromZone(toZone);
    setToZone(fromZone);
  };

  const filteredFromZones = useMemo(() => {
    if (!fromSearch) return timezones;
    const lower = fromSearch.toLowerCase();
    return timezones.filter((tz) => tz.toLowerCase().includes(lower));
  }, [timezones, fromSearch]);

  const filteredToZones = useMemo(() => {
    if (!toSearch) return timezones;
    const lower = toSearch.toLowerCase();
    return timezones.filter((tz) => tz.toLowerCase().includes(lower));
  }, [timezones, toSearch]);

  return (
    <ToolLayout toolSlug="time-zone-converter">
      <div className="space-y-6">
        {/* Timezone selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From zone */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("from_zone")}
            </label>
            <input
              type="text"
              value={fromSearch}
              onChange={(e) => setFromSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs mb-1 focus:outline-none focus:border-teal"
            />
            <select
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            >
              {filteredFromZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")} ({getOffsetLabel(tz)})
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center pb-2">
            <button
              onClick={handleSwap}
              className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              title={t("swap")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To zone */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("to_zone")}
            </label>
            <input
              type="text"
              value={toSearch}
              onChange={(e) => setToSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs mb-1 focus:outline-none focus:border-teal"
            />
            <select
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            >
              {filteredToZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")} ({getOffsetLabel(tz)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date/time input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("date")} & {t("time")}
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
          />
        </div>

        {/* Converted result */}
        {convertedTime && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("convert")}
              </h3>
              <CopyButton text={convertedTime} />
            </div>
            <p className="text-lg md:text-xl font-semibold text-foreground">
              {convertedTime}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {toZone.replace(/_/g, " ")} ({getOffsetLabel(toZone)})
            </p>
          </div>
        )}

        {/* Current time in both zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              {t("current_time")} - {fromZone.replace(/_/g, " ")}
            </h3>
            <p
              className="text-xl font-mono font-bold text-teal"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {getTimeInTimezone(currentTime, fromZone)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateInTimezone(currentTime, fromZone)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              {t("current_time")} - {toZone.replace(/_/g, " ")}
            </h3>
            <p
              className="text-xl font-mono font-bold text-teal"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {getTimeInTimezone(currentTime, toZone)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateInTimezone(currentTime, toZone)}
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

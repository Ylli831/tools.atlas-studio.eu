"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Mode = "work" | "break" | "longBreak";

export default function PomodoroTimerTool() {
  const t = useTranslations("tools.pomodoro-timer");
  const tc = useTranslations("common");

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timeLeftRef = useRef(timeLeft);
  const modeRef = useRef(mode);
  const sessionsRef = useRef(sessions);

  // Keep refs in sync
  timeLeftRef.current = timeLeft;
  modeRef.current = mode;
  sessionsRef.current = sessions;

  const getDuration = useCallback(
    (m: Mode) => {
      switch (m) {
        case "work":
          return workMinutes * 60;
        case "break":
          return breakMinutes * 60;
        case "longBreak":
          return longBreakMinutes * 60;
      }
    },
    [workMinutes, breakMinutes, longBreakMinutes]
  );

  const switchMode = useCallback(() => {
    const currentMode = modeRef.current;
    const currentSessions = sessionsRef.current;

    if (currentMode === "work") {
      const newSessions = currentSessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(longBreakMinutes * 60);
      } else {
        setMode("break");
        setTimeLeft(breakMinutes * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(workMinutes * 60);
    }
  }, [workMinutes, breakMinutes, longBreakMinutes]);

  const tick = useCallback(() => {
    const current = timeLeftRef.current;
    if (current <= 1) {
      switchMode();
    } else {
      setTimeLeft(current - 1);
    }
  }, [switchMode]);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [isRunning, tick]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setMode("work");
    setTimeLeft(workMinutes * 60);
    setSessions(0);
  }, [workMinutes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update timeLeft when duration settings change and timer is not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDuration(mode));
    }
  }, [workMinutes, breakMinutes, longBreakMinutes, isRunning, getDuration, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = getDuration(mode);
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const modeColor = mode === "work" ? "text-teal" : "text-green-600";
  const modeBg = mode === "work" ? "bg-teal" : "bg-green-600";
  const modeRing = mode === "work" ? "stroke-teal" : "stroke-green-600";

  const modeLabel =
    mode === "work"
      ? t("work")
      : mode === "break"
        ? t("break")
        : t("long_break");

  return (
    <ToolLayout toolSlug="pomodoro-timer">
      <div className="space-y-6">
        {/* Settings */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("work")} ({t("minutes")})
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
                disabled={isRunning}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("break")} ({t("minutes")})
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(1, Math.min(60, Number(e.target.value))))}
                disabled={isRunning}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("long_break")} ({t("minutes")})
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Math.max(1, Math.min(60, Number(e.target.value))))}
                disabled={isRunning}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-6">
          <div className={`text-sm font-semibold uppercase tracking-wide ${modeColor}`}>
            {modeLabel}
          </div>

          {/* Circular timer */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="116"
                fill="none"
                strokeWidth="8"
                className="stroke-border"
              />
              <circle
                cx="128"
                cy="128"
                r="116"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={modeRing}
                strokeDasharray={`${2 * Math.PI * 116}`}
                strokeDashoffset={`${2 * Math.PI * 116 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="text-center z-10">
              <div className="text-5xl font-bold text-foreground font-mono tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Session counter */}
          <div className="text-sm text-muted-foreground">
            {t("sessions")}: {sessions}
          </div>

          {/* Session dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < (sessions % 4) ? modeBg : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("start")}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("pause")}
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {t("reset")}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

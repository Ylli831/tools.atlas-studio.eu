"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type Tab = "stopwatch" | "timer";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
}

function formatTimerDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function StopwatchTimerTool() {
  const t = useTranslations("tools.stopwatch-timer");
  const tc = useTranslations("common");

  const [activeTab, setActiveTab] = useState<Tab>("stopwatch");

  // Stopwatch state
  const [swElapsed, setSwElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const swStartRef = useRef(0);
  const swBaseRef = useRef(0);

  // Timer state
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timerEndRef = useRef(0);

  // Stopwatch functions
  const swStart = useCallback(() => {
    if (swRunning) return;
    setSwRunning(true);
    swStartRef.current = Date.now();
    swBaseRef.current = swElapsed;
    swIntervalRef.current = setInterval(() => {
      setSwElapsed(swBaseRef.current + (Date.now() - swStartRef.current));
    }, 10);
  }, [swRunning, swElapsed]);

  const swStop = useCallback(() => {
    setSwRunning(false);
    if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
      swIntervalRef.current = undefined;
    }
  }, []);

  const swReset = useCallback(() => {
    swStop();
    setSwElapsed(0);
    swBaseRef.current = 0;
    setLaps([]);
  }, [swStop]);

  const swLap = useCallback(() => {
    if (swRunning) {
      setLaps((prev) => [swElapsed, ...prev]);
    }
  }, [swRunning, swElapsed]);

  // Timer functions
  const timerStart = useCallback(() => {
    if (timerRunning) return;
    const totalSeconds = timerRemaining > 0
      ? timerRemaining
      : timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    if (totalSeconds <= 0) return;

    setTimerDone(false);
    setTimerRunning(true);
    setTimerRemaining(totalSeconds);
    timerEndRef.current = Date.now() + totalSeconds * 1000;

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.ceil((timerEndRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimerRemaining(0);
        setTimerRunning(false);
        setTimerDone(true);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = undefined;
        }
      } else {
        setTimerRemaining(remaining);
      }
    }, 100);
  }, [timerRunning, timerRemaining, timerHours, timerMinutes, timerSeconds]);

  const timerStop = useCallback(() => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = undefined;
    }
  }, []);

  const timerReset = useCallback(() => {
    timerStop();
    setTimerRemaining(0);
    setTimerDone(false);
  }, [timerStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <ToolLayout toolSlug="stopwatch-timer">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "stopwatch"
                ? "border-teal text-teal"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("stopwatch")}
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "timer"
                ? "border-teal text-teal"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("timer")}
          </button>
        </div>

        {/* Stopwatch */}
        {activeTab === "stopwatch" && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-6xl font-bold font-mono tabular-nums text-foreground">
              {formatTime(swElapsed)}
            </div>

            <div className="flex items-center gap-3">
              {!swRunning ? (
                <button
                  onClick={swStart}
                  className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                >
                  {t("start")}
                </button>
              ) : (
                <>
                  <button
                    onClick={swStop}
                    className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
                  >
                    {t("stop")}
                  </button>
                  <button
                    onClick={swLap}
                    className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                  >
                    {t("lap")}
                  </button>
                </>
              )}
              <button
                onClick={swReset}
                className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("reset")}
              </button>
            </div>

            {/* Laps */}
            {laps.length > 0 && (
              <div className="w-full max-w-md">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  {t("laps")}
                </h3>
                <div className="bg-card border border-border rounded-xl divide-y divide-border max-h-64 overflow-y-auto">
                  {laps.map((lap, i) => {
                    const lapNum = laps.length - i;
                    const prevLap = i < laps.length - 1 ? laps[i + 1] : 0;
                    const lapDiff = lap - prevLap;
                    return (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground font-medium">
                          {t("lap")} {lapNum}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground font-mono text-xs">
                            +{formatTime(lapDiff)}
                          </span>
                          <span className="font-mono font-medium text-foreground">
                            {formatTime(lap)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer */}
        {activeTab === "timer" && (
          <div className="flex flex-col items-center gap-6">
            {/* Time input */}
            {!timerRunning && timerRemaining === 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  {t("set_time")}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {t("hours")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={timerHours}
                      onChange={(e) => setTimerHours(Math.max(0, Math.min(99, Number(e.target.value))))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {t("minutes")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {t("seconds")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Timer display */}
            <div className={`text-6xl font-bold font-mono tabular-nums ${timerDone ? "text-red-500 animate-pulse" : "text-foreground"}`}>
              {timerRemaining > 0 || timerRunning
                ? formatTimerDisplay(timerRemaining)
                : formatTimerDisplay(timerHours * 3600 + timerMinutes * 60 + timerSeconds)}
            </div>

            {timerDone && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                Time is up!
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3">
              {!timerRunning ? (
                <button
                  onClick={timerStart}
                  disabled={timerRemaining === 0 && timerHours === 0 && timerMinutes === 0 && timerSeconds === 0}
                  className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
                >
                  {t("start")}
                </button>
              ) : (
                <button
                  onClick={timerStop}
                  className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
                >
                  {t("stop")}
                </button>
              )}
              <button
                onClick={timerReset}
                className="bg-surface text-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

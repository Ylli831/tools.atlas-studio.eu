"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "atlas-tools-usage";

function getUsageCounts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function getServerSnapshot() {
  return 0;
}

export function useUsageCounter(toolSlug: string) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const counts = getUsageCounts();
    return counts[toolSlug] || 0;
  }, [toolSlug]);

  const count = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    getSnapshot,
    getServerSnapshot
  );

  const increment = useCallback(() => {
    const counts = getUsageCounts();
    counts[toolSlug] = (counts[toolSlug] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  }, [toolSlug]);

  return { count, increment };
}

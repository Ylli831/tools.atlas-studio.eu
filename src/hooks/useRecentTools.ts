"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "recent_tools";
const MAX_RECENT = 6;

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentTools(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecentTool = useCallback((slug: string) => {
    setRecentTools((prev) => {
      const updated = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return { recentTools, addRecentTool };
}

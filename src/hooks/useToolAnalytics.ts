"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useToolAnalytics(toolSlug: string) {
  const trackUsed = useCallback(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "tool_used", {
        tool_name: toolSlug,
        event_category: "Tools",
      });
    }
  }, [toolSlug]);

  const trackOutput = useCallback((outputType?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "tool_output_generated", {
        tool_name: toolSlug,
        output_type: outputType ?? "result",
        event_category: "Tools",
      });
    }
  }, [toolSlug]);

  return { trackUsed, trackOutput };
}

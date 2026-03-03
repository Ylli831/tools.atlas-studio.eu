"use client";

import { useEffect } from "react";

export function useScrollReveal(selector = ".reveal", key?: string) {
  useEffect(() => {
    // Small delay to let React finish painting the new DOM
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(selector);
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      els.forEach((el) => {
        // Reset visibility for newly rendered elements that aren't yet visible
        if (!el.classList.contains("visible")) {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 30);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, key]);
}

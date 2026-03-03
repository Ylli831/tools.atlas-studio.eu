"use client";

import { useEffect } from "react";
import { getConsentStatus } from "./CookieConsent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    function updateConsent() {
      const status = getConsentStatus();
      if (status === "accepted" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    }

    updateConsent();
    window.addEventListener("cookie-consent-change", updateConsent);
    return () =>
      window.removeEventListener("cookie-consent-change", updateConsent);
  }, []);

  return null;
}

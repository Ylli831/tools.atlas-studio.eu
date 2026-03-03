"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

export function getConsentStatus(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((c) => c.startsWith("cookie-consent="))
    ?.split("=")[1];
  return value === "accepted" || value === "declined" ? value : null;
}

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookie-consent="));
    if (!existing) setVisible(true);
  }, []);

  function handleChoice(choice: "accepted" | "declined") {
    setCookie("cookie-consent", choice, 365);
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-change"));
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {t("message")}{" "}
          <a
            href="https://atlas-studio.eu/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-teal transition-colors"
          >
            {t("learnMore")}
          </a>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleChoice("accepted")}
            className="rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-hover transition-colors"
          >
            {t("accept")}
          </button>
          <button
            onClick={() => handleChoice("declined")}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

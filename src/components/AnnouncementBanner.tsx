"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const BANNER_KEY = "banner_v1_dismissed";

export default function AnnouncementBanner() {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(BANNER_KEY)) setVisible(true);
    } catch {}
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(BANNER_KEY, "1"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-teal/10 border-b border-teal/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-teal font-medium flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse flex-shrink-0" />
          {t("announcement")}
          <Link href={"/tools?category=new" as never} className="underline hover:no-underline ml-1">
            {t("announcement_cta")}
          </Link>
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-teal/60 hover:text-teal transition-colors flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

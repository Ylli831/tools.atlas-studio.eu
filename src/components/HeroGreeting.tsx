"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function HeroGreeting() {
  const t = useTranslations("home");
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    let timeKey: string;
    if (hour >= 5 && hour < 12) timeKey = "greeting_morning";
    else if (hour >= 12 && hour < 18) timeKey = "greeting_afternoon";
    else if (hour >= 18 && hour < 22) timeKey = "greeting_evening";
    else timeKey = "greeting_night";

    const isReturning = !!localStorage.getItem("visited");
    if (!isReturning) localStorage.setItem("visited", "1");

    const line = isReturning
      ? `${t(timeKey as never)} ${t("greeting_returning")}`
      : `${t(timeKey as never)} ${t("greeting_subtitle")}`;

    setGreeting(line);
  }, [t]);

  if (!greeting) return null;

  return (
    <p className="text-sm text-muted-foreground mb-3 animate-fade-in">
      {greeting}
    </p>
  );
}

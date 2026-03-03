"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tools } from "@/lib/tools-registry";
import ToolIcon from "./ToolIcon";

export default function ToolOfTheDay() {
  const t = useTranslations("home");
  const [tool, setTool] = useState<(typeof tools)[0] | null>(null);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % tools.length;
    setTool(tools[dayIndex]);
  }, []);

  if (!tool) return null;

  const tt = (key: string) =>
    // We can't call hooks conditionally, so we read from the tool slug namespace directly
    key;

  return (
    <section className="pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-5">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <ToolIcon icon={tool.icon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-terracotta uppercase tracking-wide">
                {t("tool_of_day")}
              </span>
            </div>
            <ToolName slug={tool.slug} />
          </div>
          <Link
            href={`/tools/${tool.slug}` as never}
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-hover transition-colors"
          >
            {t("tool_of_day_cta")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Separate component to safely call useTranslations with the tool slug
function ToolName({ slug }: { slug: string }) {
  const t = useTranslations(`tools.${slug}`);
  return (
    <p className="text-sm font-semibold text-slate truncate">
      {t("name")} — <span className="font-normal text-muted-foreground">{t("description")}</span>
    </p>
  );
}

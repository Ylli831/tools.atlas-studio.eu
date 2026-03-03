"use client";

import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-registry";
import ToolCard from "./ToolCard";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useFavorites } from "@/hooks/useFavorites";

export function RecentToolsSection() {
  const { recentTools } = useRecentTools();
  const t = useTranslations("home");

  if (recentTools.length === 0) return null;

  const recentToolDefs = recentTools
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as typeof tools;

  return (
    <section className="pb-10 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-lg font-semibold text-slate mb-4">{t("recent_tools")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentToolDefs.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FavoriteToolsSection() {
  const { favorites } = useFavorites();
  const t = useTranslations("home");

  if (favorites.length === 0) return null;

  const favToolDefs = favorites
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as typeof tools;

  return (
    <section className="pb-10 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-lg font-semibold text-slate mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {t("favorite_tools")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {favToolDefs.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

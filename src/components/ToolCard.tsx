"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ToolDefinition } from "@/lib/tools-registry";
import ToolIcon from "./ToolIcon";
import { useFavorites } from "@/hooks/useFavorites";

const categoryColors: Record<string, { bg: string; text: string }> = {
  pdf:       { bg: "bg-terracotta/10", text: "text-terracotta" },
  image:     { bg: "bg-purple-100",    text: "text-purple-600" },
  generator: { bg: "bg-teal/10",       text: "text-teal" },
  text:      { bg: "bg-blue-100",      text: "text-blue-600" },
  developer: { bg: "bg-amber-100",     text: "text-amber-600" },
  business:  { bg: "bg-green-100",     text: "text-green-700" },
  design:    { bg: "bg-pink-100",      text: "text-pink-600" },
  security:  { bg: "bg-red-100",       text: "text-red-600" },
};

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const t = useTranslations(`tools.${tool.slug}`);
  const tc = useTranslations("categories");
  const { isFavorite, toggleFavorite } = useFavorites();
  const colors = categoryColors[tool.category] ?? { bg: "bg-teal/10", text: "text-teal" };
  const fav = isFavorite(tool.slug);

  return (
    <div className="relative h-full">
      <Link
        href={`/tools/${tool.slug}` as never}
        className="tool-card h-full block rounded-xl bg-card p-6 flex flex-col gap-3"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
            <ToolIcon icon={tool.icon} />
          </div>
          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <span className="text-xs font-semibold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                New
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded-full">
              {tc(tool.category)}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-slate relative z-10">{t("name")}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed relative z-10 flex-1">
          {t("description")}
        </p>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.slug); }}
        className="absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-surface transition-colors"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={fav ? "text-terracotta" : "text-muted-foreground/40 hover:text-muted-foreground"}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>
    </div>
  );
}

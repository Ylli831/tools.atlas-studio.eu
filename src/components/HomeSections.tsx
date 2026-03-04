"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tools } from "@/lib/tools-registry";
import ToolCard from "./ToolCard";
import { useRecentTools } from "@/hooks/useRecentTools";

export function NewToolsSection() {
  const t = useTranslations("home");
  const newTools = tools.filter((tool) => tool.isNew);

  if (newTools.length === 0) return null;

  return (
    <section className="pb-10 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            {t("new_tools")}
          </h2>
          <Link
            href={"/tools?category=new" as never}
            className="text-sm text-teal hover:underline"
          >
            {t("view_all")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {newTools.slice(0, 8).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {recentToolDefs.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}


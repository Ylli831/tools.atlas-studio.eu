"use client";

import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";

export default function ToolsGrid() {
  const t = useTranslations("tools");

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

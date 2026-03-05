"use client";

import { useTranslations } from "next-intl";
import { getChainNext } from "@/lib/related-tools";
import ToolCard from "./ToolCard";

export default function ToolChainSection({ toolSlug }: { toolSlug: string }) {
  const tc = useTranslations("common");
  const chainTools = getChainNext(toolSlug);

  if (chainTools.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-base font-semibold text-slate mb-4">{tc("continue_workflow")}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {chainTools.map((tool) => (
          <div key={tool.slug} className="min-w-[200px] flex-shrink-0 sm:min-w-0 sm:flex-shrink sm:flex-1">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
}

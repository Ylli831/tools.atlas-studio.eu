"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tools } from "@/lib/tools-registry";
import ToolCard from "./ToolCard";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { toast } from "sonner";

export default function ToolLayout({
  toolSlug,
  children,
}: {
  toolSlug: string;
  children: React.ReactNode;
}) {
  const t = useTranslations(`tools.${toolSlug}`);
  const tc = useTranslations("common");
  const tcat = useTranslations("categories");
  const { addRecentTool } = useRecentTools();
  const { trackUsed } = useToolAnalytics(toolSlug);

  useEffect(() => {
    addRecentTool(toolSlug);
    trackUsed();
  }, [toolSlug, addRecentTool, trackUsed]);

  const currentTool = tools.find((t) => t.slug === toolSlug);
  const relatedTools = currentTool
    ? tools.filter((t) => t.category === currentTool.category && t.slug !== toolSlug).slice(0, 3)
    : [];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: t("name"), text: t("description"), url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(tc("link_copied"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/tools" className="hover:text-foreground transition-colors">
            {tc("back_to_tools")}
          </Link>
          {currentTool && (
            <>
              <span>/</span>
              <Link
                href={`/tools?category=${currentTool.category}` as never}
                className="hover:text-foreground transition-colors"
              >
                {tcat(currentTool.category)}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{t("name")}</span>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-teal"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {tc("share")}
        </button>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate mb-2">
          {t("name")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {children}

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {tc("privacy_note")}
        </p>
      </div>

      {relatedTools.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-semibold text-slate mb-4">{tc("related_tools")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

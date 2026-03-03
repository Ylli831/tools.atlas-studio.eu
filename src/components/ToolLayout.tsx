"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ToolLayout({
  toolSlug,
  children,
}: {
  toolSlug: string;
  children: React.ReactNode;
}) {
  const t = useTranslations(`tools.${toolSlug}`);
  const tc = useTranslations("common");

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground transition-colors">
          {tc("back_to_tools")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("name")}</span>
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {tc("privacy_note")}
        </p>
      </div>
    </div>
  );
}

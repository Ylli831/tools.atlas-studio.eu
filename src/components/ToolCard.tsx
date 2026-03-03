import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ToolDefinition } from "@/lib/tools-registry";
import ToolIcon from "./ToolIcon";

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const t = useTranslations(`tools.${tool.slug}`);
  const tc = useTranslations("categories");

  return (
    <Link
      href={`/tools/${tool.slug}` as never}
      className="tool-card rounded-xl bg-card p-6 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
          <ToolIcon icon={tool.icon} />
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded-full">
          {tc(tool.category)}
        </span>
      </div>
      <h3 className="font-semibold text-slate">{t("name")}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("description")}
      </p>
    </Link>
  );
}

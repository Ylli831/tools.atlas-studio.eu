import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-muted-foreground mb-8">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-slate mb-4">404</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
        {t("title")}
      </h2>
      <p className="text-muted-foreground max-w-md mb-10">{t("description")}</p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal text-white font-medium px-6 py-3 rounded-full hover:bg-teal-hover transition-colors"
        >
          {t("back_home")}
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full hover:border-teal hover:text-teal transition-colors"
        >
          {t("back_tools")}
        </Link>
      </div>
    </section>
  );
}

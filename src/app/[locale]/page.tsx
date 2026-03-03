import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tools } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import { RecentToolsSection, FavoriteToolsSection } from "@/components/HomeSections";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const tc = useTranslations("categories");

  const categoryIcons: Record<string, string> = {
    pdf: "file-image",
    image: "image",
    generator: "qr",
    text: "text",
    developer: "code",
    business: "receipt",
  };

  const categories = [
    { key: "pdf", count: tools.filter((t) => t.category === "pdf").length },
    { key: "image", count: tools.filter((t) => t.category === "image").length },
    { key: "generator", count: tools.filter((t) => t.category === "generator").length },
    { key: "text", count: tools.filter((t) => t.category === "text").length },
    { key: "developer", count: tools.filter((t) => t.category === "developer").length },
    { key: "business", count: tools.filter((t) => t.category === "business").length },
  ];

  const popularTools = tools.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block text-sm font-medium text-teal bg-teal/10 px-4 py-1.5 rounded-full mb-6">
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate tracking-tight mb-5 leading-tight">
            {t("hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-teal text-white font-medium px-8 py-3.5 rounded-full hover:bg-teal-hover transition-colors"
            >
              {t("explore_tools")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-8 py-3.5 rounded-full hover:border-teal hover:text-teal transition-colors"
            >
              {t("contact_us")}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/tools?category=${cat.key}` as never}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-teal transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center text-teal flex-shrink-0">
                  <ToolIcon icon={categoryIcons[cat.key]} size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tc(cat.key)}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} {t("tools_count")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently used (client, localStorage) */}
      <RecentToolsSection />

      {/* Favorites (client, localStorage) */}
      <FavoriteToolsSection />

      {/* Popular Tools */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate">{t("popular_tools")}</h2>
            <Link href="/tools" className="text-sm text-teal hover:underline">
              {t("view_all")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Badge */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate mb-1">{t("privacy_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacy_description")}</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate mb-1">{t("no_signup_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("no_signup_description")}</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate mb-1">{t("instant_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("instant_description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-teal rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("cta_title")}
            </h2>
            <p className="text-teal-100 mb-8 max-w-lg mx-auto opacity-90">{t("cta_description")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://atlas-studio.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-teal font-medium px-6 py-3 rounded-full hover:bg-cream transition-colors"
              >
                {t("cta_button")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                {t("contact_us")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

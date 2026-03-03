import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <a
              href="https://atlas-studio.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-3"
            >
              <Image
                src="/Images/atlas-studio-png.png"
                alt="Atlas Studio"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-semibold text-slate">Atlas Studio</span>
            </a>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          <div className="flex gap-4 md:justify-end items-start">
            <a
              href="https://www.instagram.com/atlasstudio.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-teal transition-colors"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@atlasstudio.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-teal transition-colors"
              aria-label="TikTok"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/atlas-studio-eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-teal transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <div className="section-line mt-8 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Atlas Studio. {t("built_by")}{" "}
            <a
              href="https://atlas-studio.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline"
            >
              Atlas Studio
            </a>
          </p>
          <div className="flex gap-4">
            <a
              href="https://atlas-studio.eu/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t("privacy")}
            </a>
            <a
              href="https://atlas-studio.eu/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

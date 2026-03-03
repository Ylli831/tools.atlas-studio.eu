import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import BackToTop from "@/components/BackToTop";
import Script from "next/script";
import { Toaster } from "sonner";
import "../globals.css";

const inter = localFont({
  src: [
    {
      path: "../../../public/Fonts/Inter-font/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../../public/Fonts/Inter-font/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  weight: "400 700",
});

const garamond = localFont({
  src: [
    {
      path: "../../../public/Fonts/EB_Garamond/EBGaramond-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../../public/Fonts/EB_Garamond/EBGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
  weight: "400 600",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const baseUrl = "https://tools.atlas-studio.eu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: {
      default: t("title"),
      template: t("template"),
    },
    description: t("description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}${localePath}`,
      languages: {
        en: baseUrl,
        sq: `${baseUrl}/sq`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}${localePath}`,
      siteName: "Atlas Studio Tools",
      locale: locale === "en" ? "en_US" : "sq_AL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-941JC17CBG"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
            gtag('config', 'G-941JC17CBG');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${garamond.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <CookieConsent />
          <Toaster position="bottom-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

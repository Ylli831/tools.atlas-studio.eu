import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import BackgroundRemoverTool from "./BackgroundRemoverTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.background-remover" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "sq" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/background-remover`,
      languages: {
        sq: `${baseUrl}/tools/background-remover`,
        en: `${baseUrl}/en/tools/background-remover`,
      },
    },
  };
}

export default async function BackgroundRemoverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Background Remover - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/background-remover",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <BackgroundRemoverTool />
    </>
  );
}

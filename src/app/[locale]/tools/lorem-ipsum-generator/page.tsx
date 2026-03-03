import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import LoremIpsumTool from "./LoremIpsumTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.lorem-ipsum-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/lorem-ipsum-generator`,
      languages: {
        en: `${baseUrl}/tools/lorem-ipsum-generator`,
        sq: `${baseUrl}/sq/tools/lorem-ipsum-generator`,
      },
    },
  };
}

export default async function LoremIpsumPage({
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
            name: "Lorem Ipsum Generator - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/lorem-ipsum-generator",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: {
              "@type": "Organization",
              name: "Atlas Studio",
              url: "https://atlas-studio.eu",
            },
          }),
        }}
      />
      <LoremIpsumTool />
    </>
  );
}

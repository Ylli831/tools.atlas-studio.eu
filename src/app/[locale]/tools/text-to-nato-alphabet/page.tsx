import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import TextToNatoAlphabetTool from "./TextToNatoAlphabetTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.text-to-nato-alphabet" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/text-to-nato-alphabet`,
      languages: { en: `${baseUrl}/tools/text-to-nato-alphabet`, sq: `${baseUrl}/sq/tools/text-to-nato-alphabet` },
    },
  };
}

export default async function TextToNatoAlphabetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "NATO Phonetic Alphabet - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/text-to-nato-alphabet",
        applicationCategory: "UtilityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <TextToNatoAlphabetTool />
    </>
  );
}

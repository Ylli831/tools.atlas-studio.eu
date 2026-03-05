import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import RsaKeyPairGeneratorTool from "./RsaKeyPairGeneratorTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.rsa-key-pair-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/rsa-key-pair-generator`,
      languages: { en: `${baseUrl}/tools/rsa-key-pair-generator`, sq: `${baseUrl}/sq/tools/rsa-key-pair-generator` },
    },
  };
}

export default async function RsaKeyPairGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "RSA Key Pair Generator - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/rsa-key-pair-generator",
        applicationCategory: "SecurityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <RsaKeyPairGeneratorTool />
    </>
  );
}

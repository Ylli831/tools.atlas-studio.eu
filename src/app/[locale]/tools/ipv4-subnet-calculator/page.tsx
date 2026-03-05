import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Ipv4SubnetCalculatorTool from "./Ipv4SubnetCalculatorTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.ipv4-subnet-calculator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/ipv4-subnet-calculator`,
      languages: {
        en: `${baseUrl}/tools/ipv4-subnet-calculator`,
        sq: `${baseUrl}/sq/tools/ipv4-subnet-calculator`,
      },
    },
  };
}

export default async function Ipv4SubnetCalculatorPage({
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
            name: "IPv4 Subnet Calculator - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/ipv4-subnet-calculator",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <Ipv4SubnetCalculatorTool />
    </>
  );
}

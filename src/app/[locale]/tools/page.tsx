import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { tools } from "@/lib/tools-registry";
import ToolsGrid from "./ToolsGrid";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "sq" ? "" : `/${locale}`;

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools`,
      languages: {
        sq: `${baseUrl}/tools`,
        en: `${baseUrl}/en/tools`,
      },
    },
  };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ToolsGrid />;
}

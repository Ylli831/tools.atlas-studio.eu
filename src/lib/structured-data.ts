import type { ToolDefinition } from "./tools-registry";

const categoryToAppCategory: Record<string, string> = {
  pdf: "UtilityApplication",
  image: "MultimediaApplication",
  generator: "UtilityApplication",
  text: "UtilityApplication",
  developer: "DeveloperApplication",
  business: "BusinessApplication",
  design: "DesignApplication",
  security: "SecurityApplication",
};

export function getApplicationCategory(category: string): string {
  return categoryToAppCategory[category] || "UtilityApplication";
}

export function generateWebApplicationJsonLd(tool: ToolDefinition, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} - Atlas Studio Tools`,
    url: `https://tools.atlas-studio.eu/tools/${tool.slug}`,
    applicationCategory: getApplicationCategory(tool.category),
    operatingSystem: "Any",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
  };
}

export function generateHowToJsonLd(name: string, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${name}`,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: { "@type": "HowToTool", name: `Atlas Studio ${name}` },
  };
}

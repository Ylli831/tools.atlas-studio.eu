"use client";

import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-registry";

export default function HowToSection({ toolSlug }: { toolSlug: string }) {
  const tc = useTranslations("common");
  const tool = tools.find((t) => t.slug === toolSlug);
  if (!tool) return null;

  const howtoKey = tool.hasFileUpload ? "howto_upload" : "howto_input";
  const steps = [
    { number: 1, text: tc(`${howtoKey}.step1`) },
    { number: 2, text: tc(`${howtoKey}.step2`) },
    { number: 3, text: tc(`${howtoKey}.step3`) },
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h2 className="text-base font-semibold text-slate mb-4">{tc("how_it_works")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/10 text-teal flex items-center justify-center text-sm font-semibold">
              {step.number}
            </div>
            <p className="text-sm text-muted-foreground pt-0.5">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "PT Serif",
  "Nunito",
  "Poppins",
  "Ubuntu",
  "Libre Baskerville",
];

const SUGGESTED_PAIRS: { heading: string; body: string }[] = [
  { heading: "Playfair Display", body: "Source Sans 3" },
  { heading: "Montserrat", body: "Merriweather" },
  { heading: "Oswald", body: "Lato" },
  { heading: "Raleway", body: "Roboto" },
  { heading: "Poppins", body: "Libre Baskerville" },
  { heading: "Ubuntu", body: "Open Sans" },
  { heading: "Playfair Display", body: "Nunito" },
  { heading: "Montserrat", body: "PT Serif" },
];

function fontToUrlParam(font: string): string {
  return font.replace(/\s+/g, "+");
}

export default function FontPairPreviewerTool() {
  const t = useTranslations("tools.font-pair-previewer");
  const [headingFont, setHeadingFont] = useState("Playfair Display");
  const [bodyFont, setBodyFont] = useState("Source Sans 3");

  useEffect(() => {
    const fonts = [headingFont, bodyFont];
    const uniqueFonts = [...new Set(fonts)];

    uniqueFonts.forEach((font) => {
      const id = `font-${font.replace(/\s+/g, "-")}`;
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontToUrlParam(font)}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    });
  }, [headingFont, bodyFont]);

  const cssImport = useMemo(() => {
    const families = [headingFont, bodyFont]
      .filter((f, i, arr) => arr.indexOf(f) === i)
      .map((f) => `family=${fontToUrlParam(f)}:wght@400;700`)
      .join("&");
    const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    return `@import url('${url}');\n\nh1, h2, h3 {\n  font-family: '${headingFont}', serif;\n}\n\nbody, p {\n  font-family: '${bodyFont}', sans-serif;\n}`;
  }, [headingFont, bodyFont]);

  return (
    <ToolLayout toolSlug="font-pair-previewer">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("heading_font")}
            </label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("body_font")}
            </label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate mb-4"
            style={{ fontFamily: `'${headingFont}', serif` }}
          >
            {t("heading_preview")}
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: `'${bodyFont}', sans-serif` }}
          >
            {t("body_preview")}
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <h3
              className="text-xl font-bold text-slate mb-2"
              style={{ fontFamily: `'${headingFont}', serif` }}
            >
              Subheading Example
            </h3>
            <p
              className="text-sm text-muted-foreground leading-relaxed"
              style={{ fontFamily: `'${bodyFont}', sans-serif` }}
            >
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {t("suggested_pairs")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SUGGESTED_PAIRS.map((pair, i) => (
              <button
                key={i}
                onClick={() => {
                  setHeadingFont(pair.heading);
                  setBodyFont(pair.body);
                }}
                className={`text-left p-3 rounded-lg border transition-colors text-xs ${
                  headingFont === pair.heading && bodyFont === pair.body
                    ? "border-teal bg-teal/5"
                    : "border-border bg-card hover:border-teal/50"
                }`}
              >
                <span className="font-semibold text-foreground block truncate">{pair.heading}</span>
                <span className="text-muted-foreground block truncate">{pair.body}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">{t("css_output")}</label>
            <CopyButton text={cssImport} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-60 whitespace-pre-wrap">
            {cssImport}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

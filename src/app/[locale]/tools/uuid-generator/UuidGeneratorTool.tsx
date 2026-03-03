"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function UuidGeneratorTool() {
  const t = useTranslations("tools.uuid-generator");
  const tc = useTranslations("common");
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"standard" | "no-dashes" | "uppercase" | "braces">("standard");
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();
      switch (format) {
        case "no-dashes":
          uuid = uuid.replace(/-/g, "");
          break;
        case "uppercase":
          uuid = uuid.toUpperCase();
          break;
        case "braces":
          uuid = `{${uuid}}`;
          break;
      }
      results.push(uuid);
    }
    setUuids(results);
  }, [count, format]);

  const copyOne = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout toolSlug="uuid-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("count")}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("format")}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="standard">{t("standard")}</option>
              <option value="no-dashes">{t("no_dashes")}</option>
              <option value="uppercase">{t("uppercase_fmt")}</option>
              <option value="braces">{t("braces")}</option>
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
        >
          {t("generate")}
        </button>

        {uuids.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{uuids.length} UUIDs</p>
              <button onClick={copyAll} className="text-xs text-teal hover:underline">
                {copied === "all" ? tc("copied") : t("copy_all")}
              </button>
            </div>

            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 group">
                  <code className="text-sm font-mono text-foreground">{uuid}</code>
                  <button
                    onClick={() => copyOne(uuid, i)}
                    className="text-xs text-teal hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === i ? tc("copied") : tc("copy")}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

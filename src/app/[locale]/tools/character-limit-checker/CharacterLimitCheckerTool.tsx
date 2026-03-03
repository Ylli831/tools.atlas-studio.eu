"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const PLATFORMS = [
  { key: "twitter", label: "X / Twitter", limit: 280, color: "#1DA1F2" },
  { key: "linkedin_post", label: "LinkedIn Post", limit: 3000, color: "#0077B5" },
  { key: "linkedin_headline", label: "LinkedIn Headline", limit: 220, color: "#0077B5" },
  { key: "sms", label: "SMS (1 segment)", limit: 160, color: "#4CAF50" },
  { key: "meta_desc", label: "Meta Description", limit: 160, color: "#FF6F00" },
  { key: "meta_title", label: "Meta Title", limit: 60, color: "#FF6F00" },
  { key: "instagram", label: "Instagram Caption", limit: 2200, color: "#E1306C" },
  { key: "youtube", label: "YouTube Title", limit: 100, color: "#FF0000" },
  { key: "email_subject", label: "Email Subject", limit: 60, color: "#9C27B0" },
];

export default function CharacterLimitCheckerTool() {
  const t = useTranslations("tools.character-limit-checker");
  const [text, setText] = useState("");
  const [customLimit, setCustomLimit] = useState("");

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <ToolLayout toolSlug="character-limit-checker">
      <div className="space-y-5">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("input_placeholder")}
            rows={6}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">
            <span>{charCount} {t("chars")}</span>
            <span>·</span>
            <span>{wordCount} {t("words")}</span>
          </div>
        </div>

        {/* Custom limit */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">{t("custom_limit")}</label>
          <input type="number" value={customLimit} onChange={(e) => setCustomLimit(e.target.value)}
            placeholder="e.g. 500" min="1"
            className="w-32 rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          {customLimit && (
            <ProgressBar chars={charCount} limit={parseInt(customLimit)} label={t("custom")} />
          )}
        </div>

        {/* Platform limits */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">{t("platforms")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLATFORMS.map((platform) => (
              <div key={platform.key} className="bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{platform.label}</span>
                  <span className={`text-xs font-medium ${charCount > platform.limit ? "text-red-500" : "text-muted-foreground"}`}>
                    {charCount}/{platform.limit}
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (charCount / platform.limit) * 100)}%`,
                      backgroundColor: charCount > platform.limit ? "#ef4444" : charCount > platform.limit * 0.9 ? "#f59e0b" : platform.color,
                    }}
                  />
                </div>
                {charCount > platform.limit && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("over_by", { count: charCount - platform.limit })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ProgressBar({ chars, limit, label }: { chars: number; limit: number; label: string }) {
  const pct = Math.min(100, (chars / limit) * 100);
  const over = chars > limit;
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 bg-surface rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : "#487877" }} />
      </div>
      <span className={`text-xs font-medium ${over ? "text-red-500" : "text-muted-foreground"}`}>{chars}/{limit}</span>
    </div>
  );
}

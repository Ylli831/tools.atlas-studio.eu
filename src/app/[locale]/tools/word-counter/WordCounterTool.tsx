"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function analyze(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length || (trimmed.length > 0 ? 1 : 0) : 0;
  const readingTimeMin = Math.floor(words / 200);
  const readingTimeSec = Math.round(((words % 200) / 200) * 60);
  const speakingTimeMin = Math.floor(words / 130);
  const speakingTimeSec = Math.round(((words % 130) / 130) * 60);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMin,
    readingTimeSec,
    speakingTimeMin,
    speakingTimeSec,
  };
}

export default function WordCounterTool() {
  const t = useTranslations("tools.word-counter");
  const [text, setText] = useState("");

  const stats = useMemo(() => analyze(text), [text]);

  return (
    <ToolLayout toolSlug="word-counter">
      <div className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("words"), value: stats.words },
            { label: t("characters"), value: stats.characters },
            { label: t("sentences"), value: stats.sentences },
            { label: t("paragraphs"), value: stats.paragraphs },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-teal">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Extended stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              {stats.charactersNoSpaces}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("characters_no_spaces")}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              {stats.readingTimeMin}
              {t("minutes")} {stats.readingTimeSec}
              {t("seconds")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("reading_time")}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              {stats.speakingTimeMin}
              {t("minutes")} {stats.speakingTimeSec}
              {t("seconds")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("speaking_time")}
            </p>
          </div>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          rows={14}
          className="w-full bg-card border border-border rounded-xl p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
        />
      </div>
    </ToolLayout>
  );
}

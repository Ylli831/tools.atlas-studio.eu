"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 2) return word.length > 0 ? 1 : 0;

  // Remove trailing silent-e
  let w = word;
  if (w.endsWith("e") && !w.endsWith("le") && w.length > 2) {
    w = w.slice(0, -1);
  }

  // Count vowel groups
  const vowelGroups = w.match(/[aeiouy]+/gi);
  const count = vowelGroups ? vowelGroups.length : 1;

  return Math.max(1, count);
}

function getWords(text: string): string[] {
  return text.match(/[a-zA-Z']+/g) || [];
}

function getSentences(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return sentences.length > 0 ? sentences : [];
}

function getReadingLevel(fleschScore: number): { label: string; color: string } {
  if (fleschScore >= 90) return { label: "Very Easy (5th grade)", color: "text-success" };
  if (fleschScore >= 80) return { label: "Easy (6th grade)", color: "text-success" };
  if (fleschScore >= 70) return { label: "Fairly Easy (7th grade)", color: "text-teal" };
  if (fleschScore >= 60) return { label: "Standard (8th-9th grade)", color: "text-teal" };
  if (fleschScore >= 50) return { label: "Fairly Difficult (10th-12th grade)", color: "text-terracotta" };
  if (fleschScore >= 30) return { label: "Difficult (College)", color: "text-danger" };
  return { label: "Very Difficult (College graduate)", color: "text-danger" };
}

interface ReadabilityStats {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smog: number;
  complexWordCount: number;
}

function analyzeText(text: string): ReadabilityStats | null {
  const words = getWords(text);
  const sentences = getSentences(text);

  if (words.length === 0 || sentences.length === 0) return null;

  const wordCount = words.length;
  const sentenceCount = sentences.length;

  let syllableCount = 0;
  let complexWordCount = 0;

  for (const word of words) {
    const syllables = countSyllables(word);
    syllableCount += syllables;
    if (syllables >= 3) complexWordCount++;
  }

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  // Flesch Reading Ease
  const fleschReadingEase =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade =
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

  // Gunning Fog Index
  const gunningFog =
    0.4 * (avgWordsPerSentence + 100 * (complexWordCount / wordCount));

  // SMOG Index
  const smog =
    sentenceCount >= 1
      ? 1.043 * Math.sqrt(complexWordCount * (30 / sentenceCount)) + 3.1291
      : 0;

  return {
    wordCount,
    sentenceCount,
    syllableCount,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    fleschReadingEase,
    fleschKincaidGrade,
    gunningFog,
    smog,
    complexWordCount,
  };
}

export default function ReadabilityCheckerTool() {
  const t = useTranslations("tools.readability-checker");
  const tc = useTranslations("common");
  const [text, setText] = useState("");

  const stats = useMemo(() => analyzeText(text), [text]);
  const readingLevel = stats ? getReadingLevel(stats.fleschReadingEase) : null;

  return (
    <ToolLayout toolSlug="readability-checker">
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("text_label")}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("text_placeholder")}
            rows={8}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
          />
        </div>

        {stats && (
          <>
            {/* Reading Level */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground mb-1">{t("reading_level")}</p>
              <p className={`text-xl font-bold ${readingLevel?.color}`}>
                {readingLevel?.label}
              </p>
            </div>

            {/* Readability Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ScoreCard
                label={t("flesch_reading")}
                value={stats.fleschReadingEase.toFixed(1)}
                description="0-100"
              />
              <ScoreCard
                label={t("flesch_grade")}
                value={stats.fleschKincaidGrade.toFixed(1)}
                description="Grade level"
              />
              <ScoreCard
                label={t("gunning_fog")}
                value={stats.gunningFog.toFixed(1)}
                description="Years of education"
              />
              <ScoreCard
                label={t("smog")}
                value={stats.smog.toFixed(1)}
                description="Years of education"
              />
            </div>

            {/* Text Statistics */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <StatItem label={t("words")} value={stats.wordCount.toString()} />
                <StatItem label={t("sentences")} value={stats.sentenceCount.toString()} />
                <StatItem label={t("syllables")} value={stats.syllableCount.toString()} />
                <StatItem
                  label={t("avg_words_sentence")}
                  value={stats.avgWordsPerSentence.toFixed(1)}
                />
                <StatItem
                  label={t("avg_syllables_word")}
                  value={stats.avgSyllablesPerWord.toFixed(2)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function ScoreCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-teal">{value}</p>
      <p className="text-sm font-medium text-foreground mt-1">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

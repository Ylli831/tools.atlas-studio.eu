"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ToolSuggestionForm() {
  const t = useTranslations("suggestion");
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/tool-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), email: email.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setIdea("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-success font-medium">{t("thanks")}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-base font-semibold text-slate mb-1">{t("title")}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t("subtitle")}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={t("placeholder")}
          rows={3}
          className="w-full bg-surface border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-teal"
          required
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
          />
          <button
            type="submit"
            disabled={status === "sending" || !idea.trim()}
            className="bg-teal text-white font-medium px-5 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        </div>
        {status === "error" && (
          <p className="text-sm text-red-500">{t("error")}</p>
        )}
      </form>
    </div>
  );
}

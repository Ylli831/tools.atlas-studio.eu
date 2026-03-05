"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

export default function HmacGeneratorTool() {
  const t = useTranslations("tools.hmac-generator");
  const tc = useTranslations("common");

  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!message || !secret) return;
    setGenerating(true);
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(secret);
      const msgData = enc.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: algorithm } },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
      setOutput(arrayBufferToHex(signature));
    } catch {
      setOutput("Error generating HMAC");
    } finally {
      setGenerating(false);
    }
  }, [message, secret, algorithm]);

  return (
    <ToolLayout toolSlug="hmac-generator">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("message")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("message_placeholder")}
            rows={4}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("secret")}
          </label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={t("secret_placeholder")}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("algorithm")}
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
          >
            {ALGORITHMS.map((alg) => (
              <option key={alg} value={alg}>
                {alg}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!message || !secret || generating}
          className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
        >
          {t("generate")}
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")} ({algorithm})
              </label>
              <CopyButton text={output} />
            </div>
            <div className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono break-all">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

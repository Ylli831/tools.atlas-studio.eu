"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function arrayBufferToPem(buffer: ArrayBuffer, type: "PUBLIC" | "PRIVATE"): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const lines: string[] = [];
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.slice(i, i + 64));
  }

  const label = type === "PUBLIC" ? "PUBLIC KEY" : "PRIVATE KEY";
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

const KEY_SIZES = [1024, 2048, 4096] as const;
type KeySize = (typeof KEY_SIZES)[number];

export default function RsaKeyPairGeneratorTool() {
  const t = useTranslations("tools.rsa-key-pair-generator");
  const tc = useTranslations("common");

  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setPublicKey("");
    setPrivateKey("");
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      setPublicKey(arrayBufferToPem(publicKeyBuffer, "PUBLIC"));
      setPrivateKey(arrayBufferToPem(privateKeyBuffer, "PRIVATE"));
    } catch {
      // Generation failed
    } finally {
      setGenerating(false);
    }
  }, [keySize]);

  return (
    <ToolLayout toolSlug="rsa-key-pair-generator">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("key_size")}
            </label>
            <select
              value={keySize}
              onChange={(e) => setKeySize(Number(e.target.value) as KeySize)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              {KEY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} bits
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {generating ? t("generating") : t("generate")}
          </button>
        </div>

        {generating && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
            <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">{t("generating")}...</span>
          </div>
        )}

        {publicKey && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("public_key")}
              </label>
              <CopyButton text={publicKey} />
            </div>
            <textarea
              readOnly
              value={publicKey}
              rows={8}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            />
          </div>
        )}

        {privateKey && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">
                {t("private_key")}
              </label>
              <CopyButton text={privateKey} />
            </div>
            <textarea
              readOnly
              value={privateKey}
              rows={12}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

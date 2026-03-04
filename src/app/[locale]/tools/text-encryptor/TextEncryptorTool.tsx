"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Tab = "encrypt" | "decrypt";

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(plaintext: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );
  // Combine: salt (16) + iv (12) + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  // Base64 encode
  let binary = "";
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

async function decryptText(encoded: string, password: string): Promise<string> {
  const binary = atob(encoded);
  const combined = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    combined[i] = binary.charCodeAt(i);
  }
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

export default function TextEncryptorTool() {
  const t = useTranslations("tools.text-encryptor");
  const tc = useTranslations("common");
  const [tab, setTab] = useState<Tab>("encrypt");
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!inputText.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await encryptText(inputText, password);
      setOutput(result);
    } catch {
      setError(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await decryptText(inputText, password);
      setOutput(result);
    } catch {
      setError(t("wrong_password"));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setInputText("");
    setPassword("");
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout toolSlug="text-encryptor">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {(["encrypt", "decrypt"] as Tab[]).map((t_tab) => (
            <button
              key={t_tab}
              onClick={() => handleTabChange(t_tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t_tab
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`${t_tab}_tab`)}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("text_label")}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); setError(""); }}
            placeholder={tab === "encrypt" ? t("text_placeholder") : t("encrypted_placeholder")}
            rows={6}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
            spellCheck={false}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("password_label")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder={t("password_placeholder")}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={tab === "encrypt" ? handleEncrypt : handleDecrypt}
          disabled={!inputText.trim() || !password.trim() || loading}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              {tc("processing")}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              {tab === "encrypt" ? t("encrypt") : t("decrypt")}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-danger/5 border border-danger/20 rounded-xl p-4">
            <p className="text-sm text-danger font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, ".")
    .replace(/\//g, "/")
    .slice(0, 53);
}

async function hashPassword(
  password: string,
  cost: number,
  salt?: Uint8Array
): Promise<{ hash: string; salt: Uint8Array }> {
  const enc = new TextEncoder();
  const passwordBytes = enc.encode(password);

  if (!salt) {
    salt = crypto.getRandomValues(new Uint8Array(16));
  }

  const iterations = Math.pow(2, cost);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const saltB64 = arrayBufferToBase64(salt.buffer as ArrayBuffer);
  const hashB64 = arrayBufferToBase64(derivedBits);
  const costStr = cost.toString().padStart(2, "0");

  return {
    hash: `$2a$${costStr}$${saltB64}${hashB64}`,
    salt: salt,
  };
}

async function verifyPassword(
  password: string,
  hashStr: string
): Promise<boolean> {
  const parts = hashStr.match(/^\$2a\$(\d{2})\$(.{22})(.{31})$/);
  if (!parts) return false;

  const cost = parseInt(parts[1], 10);
  const saltB64 = parts[2];

  // Decode salt from base64
  const saltStr = saltB64.replace(/\./g, "+");
  const saltBinary = atob(saltStr);
  const salt = new Uint8Array(saltBinary.length);
  for (let i = 0; i < saltBinary.length; i++) {
    salt[i] = saltBinary.charCodeAt(i);
  }

  const result = await hashPassword(password, cost, salt);
  return result.hash === hashStr;
}

export default function BcryptGeneratorTool() {
  const t = useTranslations("tools.bcrypt-generator");
  const tc = useTranslations("common");

  const [password, setPassword] = useState("");
  const [cost, setCost] = useState(12);
  const [hash, setHash] = useState("");
  const [generating, setGenerating] = useState(false);

  const [verifyHash, setVerifyHash] = useState("");
  const [verifyPassword2, setVerifyPassword2] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!password.trim()) return;
    setGenerating(true);
    try {
      const result = await hashPassword(password, cost);
      setHash(result.hash);
    } catch {
      // Generation failed
    } finally {
      setGenerating(false);
    }
  }, [password, cost]);

  const handleVerify = useCallback(async () => {
    if (!verifyHash.trim() || !verifyPassword2.trim()) return;
    setVerifying(true);
    try {
      const match = await verifyPassword(verifyPassword2, verifyHash);
      setVerifyResult(match);
    } catch {
      setVerifyResult(false);
    } finally {
      setVerifying(false);
    }
  }, [verifyHash, verifyPassword2]);

  return (
    <ToolLayout toolSlug="bcrypt-generator">
      <div className="space-y-6">
        {/* Hash Generation Section */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("password")}
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("iterations")}: {cost} (2^{cost} = {Math.pow(2, cost).toLocaleString()} iterations)
            </label>
            <input
              type="range"
              min={10}
              max={16}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10</span>
              <span>12</span>
              <span>14</span>
              <span>16</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!password.trim() || generating}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {generating ? `${t("hash")}...` : t("hash")}
          </button>

          {hash && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  {t("output_label")}
                </label>
                <CopyButton text={hash} />
              </div>
              <div className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono break-all">
                {hash}
              </div>
            </div>
          )}
        </div>

        {/* Verify Section */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            {t("verify")}
          </h3>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("verify_hash")}
            </label>
            <input
              type="text"
              value={verifyHash}
              onChange={(e) => {
                setVerifyHash(e.target.value);
                setVerifyResult(null);
              }}
              placeholder="$2a$12$..."
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("password")}
            </label>
            <input
              type="text"
              value={verifyPassword2}
              onChange={(e) => {
                setVerifyPassword2(e.target.value);
                setVerifyResult(null);
              }}
              placeholder={t("password_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={!verifyHash.trim() || !verifyPassword2.trim() || verifying}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {verifying ? `${t("verify")}...` : t("verify")}
          </button>

          {verifyResult !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                verifyResult
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {verifyResult ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
              {verifyResult ? t("match") : t("no_match")}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

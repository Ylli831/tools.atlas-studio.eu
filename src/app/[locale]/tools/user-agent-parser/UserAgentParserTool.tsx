"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: string;
  engine: { name: string; version: string };
  raw: string;
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: "Unknown", version: "" },
    os: { name: "Unknown", version: "" },
    device: "Desktop",
    engine: { name: "Unknown", version: "" },
    raw: ua,
  };

  // Browser detection
  if (/Edg\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Microsoft Edge", version: RegExp.$1 };
  } else if (/OPR\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Opera", version: RegExp.$1 };
  } else if (/Vivaldi\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Vivaldi", version: RegExp.$1 };
  } else if (/Brave/i.test(ua) && /Chrome\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Brave", version: RegExp.$1 };
  } else if (/SamsungBrowser\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Samsung Browser", version: RegExp.$1 };
  } else if (/UCBrowser\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "UC Browser", version: RegExp.$1 };
  } else if (/Firefox\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Firefox", version: RegExp.$1 };
  } else if (/CriOS\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Chrome (iOS)", version: RegExp.$1 };
  } else if (/Chrome\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Chrome", version: RegExp.$1 };
  } else if (/Safari\/(\d+[\d.]*)/i.test(ua) && /Version\/(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Safari", version: RegExp.$1 };
  } else if (/MSIE\s(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Internet Explorer", version: RegExp.$1 };
  } else if (/Trident.*rv:(\d+[\d.]*)/i.test(ua)) {
    result.browser = { name: "Internet Explorer", version: RegExp.$1 };
  }

  // OS detection
  if (/Windows NT 10\.0/i.test(ua)) {
    result.os = { name: "Windows", version: "10/11" };
  } else if (/Windows NT 6\.3/i.test(ua)) {
    result.os = { name: "Windows", version: "8.1" };
  } else if (/Windows NT 6\.2/i.test(ua)) {
    result.os = { name: "Windows", version: "8" };
  } else if (/Windows NT 6\.1/i.test(ua)) {
    result.os = { name: "Windows", version: "7" };
  } else if (/Windows/i.test(ua)) {
    result.os = { name: "Windows", version: "" };
  } else if (/Mac OS X (\d+[._\d]*)/i.test(ua)) {
    result.os = { name: "macOS", version: RegExp.$1.replace(/_/g, ".") };
  } else if (/Android (\d+[\d.]*)/i.test(ua)) {
    result.os = { name: "Android", version: RegExp.$1 };
  } else if (/iPhone OS (\d+[_\d]*)/i.test(ua)) {
    result.os = { name: "iOS", version: RegExp.$1.replace(/_/g, ".") };
  } else if (/iPad.*OS (\d+[_\d]*)/i.test(ua)) {
    result.os = { name: "iPadOS", version: RegExp.$1.replace(/_/g, ".") };
  } else if (/CrOS/i.test(ua)) {
    result.os = { name: "Chrome OS", version: "" };
  } else if (/Linux/i.test(ua)) {
    result.os = { name: "Linux", version: "" };
  }

  // Device detection
  if (/Mobile|Android.*Mobile|iPhone/i.test(ua)) {
    result.device = "Mobile";
  } else if (/Tablet|iPad/i.test(ua)) {
    result.device = "Tablet";
  } else if (/Bot|Crawler|Spider|Slurp|Googlebot/i.test(ua)) {
    result.device = "Bot/Crawler";
  }

  // Engine detection
  if (/AppleWebKit\/(\d+[\d.]*)/i.test(ua)) {
    result.engine = { name: "WebKit", version: RegExp.$1 };
    if (/Chrome/i.test(ua)) {
      result.engine.name = "Blink";
    }
  } else if (/Gecko\/(\d+)/i.test(ua)) {
    result.engine = { name: "Gecko", version: RegExp.$1 };
  } else if (/Trident\/(\d+[\d.]*)/i.test(ua)) {
    result.engine = { name: "Trident", version: RegExp.$1 };
  }

  return result;
}

const sampleUAs = [
  { label: "Chrome (Windows)", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
  { label: "Safari (macOS)", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15" },
  { label: "Firefox (Linux)", ua: "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0" },
  { label: "Chrome (Android)", ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" },
  { label: "Safari (iPhone)", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" },
  { label: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
];

export default function UserAgentParserTool() {
  const t = useTranslations("tools.user-agent-parser");
  const tc = useTranslations("common");

  const [uaString, setUaString] = useState("");
  const [parsed, setParsed] = useState<ParsedUA | null>(null);

  useEffect(() => {
    const current = navigator.userAgent;
    setUaString(current);
    setParsed(parseUserAgent(current));
  }, []);

  const handleParse = () => {
    if (uaString.trim()) {
      setParsed(parseUserAgent(uaString));
    }
  };

  const allText = parsed
    ? `Browser: ${parsed.browser.name} ${parsed.browser.version}\nOS: ${parsed.os.name} ${parsed.os.version}\nDevice: ${parsed.device}\nEngine: ${parsed.engine.name} ${parsed.engine.version}\nRaw: ${parsed.raw}`
    : "";

  return (
    <ToolLayout toolSlug="user-agent-parser">
      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              User-Agent String
            </label>
            <button
              onClick={() => {
                setUaString(navigator.userAgent);
                setParsed(parseUserAgent(navigator.userAgent));
              }}
              className="text-xs text-teal hover:underline"
            >
              Use current browser
            </button>
          </div>
          <textarea
            value={uaString}
            onChange={(e) => setUaString(e.target.value)}
            placeholder="Paste a User-Agent string here..."
            rows={3}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
          />
          <div className="flex gap-2">
            <button
              onClick={handleParse}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              Parse
            </button>
          </div>
        </div>

        {/* Sample UAs */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sample User Agents</label>
          <div className="flex flex-wrap gap-2">
            {sampleUAs.map((sample) => (
              <button
                key={sample.label}
                onClick={() => {
                  setUaString(sample.ua);
                  setParsed(parseUserAgent(sample.ua));
                }}
                className="bg-surface text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border transition-colors text-xs"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {parsed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Parsed Result</h2>
              <CopyButton text={allText} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Browser */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Browser</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{parsed.browser.name}</p>
                <p className="text-sm text-muted-foreground font-mono">v{parsed.browser.version || "N/A"}</p>
              </div>

              {/* OS */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Operating System</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{parsed.os.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{parsed.os.version || "N/A"}</p>
              </div>

              {/* Device */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Device Type</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{parsed.device}</p>
              </div>

              {/* Engine */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Rendering Engine</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{parsed.engine.name}</p>
                <p className="text-sm text-muted-foreground font-mono">v{parsed.engine.version || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

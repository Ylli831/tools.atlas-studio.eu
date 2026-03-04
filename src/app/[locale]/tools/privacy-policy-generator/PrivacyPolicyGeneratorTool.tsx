"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function generatePolicyText(
  siteName: string,
  siteUrl: string,
  contactEmail: string,
  collectsPersonal: boolean,
  usesCookies: boolean,
  usesAnalytics: boolean,
  thirdParty: boolean,
): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  let policy = `Privacy Policy for ${siteName}\n`;
  policy += `Last updated: ${date}\n\n`;

  policy += `1. Introduction\n\n`;
  policy += `Welcome to ${siteName} ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at ${siteUrl}.\n\n`;

  policy += `2. Information We Collect\n\n`;
  if (collectsPersonal) {
    policy += `We may collect personal information that you voluntarily provide to us, including but not limited to:\n`;
    policy += `- Name and email address\n`;
    policy += `- Contact information\n`;
    policy += `- Any other information you choose to provide\n\n`;
  } else {
    policy += `We do not collect personal information directly from you. We may collect non-personal information automatically as you navigate our site.\n\n`;
  }

  if (usesCookies) {
    policy += `3. Cookies\n\n`;
    policy += `We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device. You can control cookies through your browser settings. The types of cookies we use include:\n`;
    policy += `- Essential cookies: Required for the website to function properly.\n`;
    policy += `- Preference cookies: Remember your settings and preferences.\n`;
    policy += `- Analytics cookies: Help us understand how visitors interact with our website.\n\n`;
  } else {
    policy += `3. Cookies\n\n`;
    policy += `We do not use cookies on our website.\n\n`;
  }

  if (usesAnalytics) {
    policy += `4. Analytics\n\n`;
    policy += `We use analytics services to collect information about how visitors use our website. This may include data such as:\n`;
    policy += `- Pages visited and time spent on each page\n`;
    policy += `- Browser type and device information\n`;
    policy += `- Referring website addresses\n`;
    policy += `- Geographic location (country/city level)\n\n`;
    policy += `This data is collected in aggregate form and does not personally identify individual visitors.\n\n`;
  } else {
    policy += `4. Analytics\n\n`;
    policy += `We do not use analytics services on our website.\n\n`;
  }

  if (thirdParty) {
    policy += `5. Third-Party Sharing\n\n`;
    policy += `We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or providing services to you. These third parties are obligated to keep your information confidential and use it only for the purposes we specify.\n\n`;
    policy += `We may also share information when required by law or to protect our rights.\n\n`;
  } else {
    policy += `5. Third-Party Sharing\n\n`;
    policy += `We do not share your personal information with third parties, except as required by law.\n\n`;
  }

  policy += `6. Data Security\n\n`;
  policy += `We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.\n\n`;

  policy += `7. Your Rights\n\n`;
  policy += `You have the right to:\n`;
  policy += `- Access the personal data we hold about you\n`;
  policy += `- Request correction of inaccurate data\n`;
  policy += `- Request deletion of your data\n`;
  policy += `- Object to processing of your data\n`;
  policy += `- Request data portability\n\n`;

  policy += `8. Children's Privacy\n\n`;
  policy += `Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children.\n\n`;

  policy += `9. Changes to This Policy\n\n`;
  policy += `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.\n\n`;

  policy += `10. Contact Us\n\n`;
  policy += `If you have any questions about this Privacy Policy, please contact us at:\n`;
  policy += `Email: ${contactEmail}\n`;
  policy += `Website: ${siteUrl}\n`;

  return policy;
}

function generatePolicyHtml(
  siteName: string,
  siteUrl: string,
  contactEmail: string,
  collectsPersonal: boolean,
  usesCookies: boolean,
  usesAnalytics: boolean,
  thirdParty: boolean,
): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Privacy Policy - ${siteName}</title>\n</head>\n<body>\n`;
  html += `  <h1>Privacy Policy for ${siteName}</h1>\n`;
  html += `  <p><em>Last updated: ${date}</em></p>\n\n`;

  html += `  <h2>1. Introduction</h2>\n`;
  html += `  <p>Welcome to ${siteName} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at <a href="${siteUrl}">${siteUrl}</a>.</p>\n\n`;

  html += `  <h2>2. Information We Collect</h2>\n`;
  if (collectsPersonal) {
    html += `  <p>We may collect personal information that you voluntarily provide to us, including but not limited to:</p>\n`;
    html += `  <ul>\n    <li>Name and email address</li>\n    <li>Contact information</li>\n    <li>Any other information you choose to provide</li>\n  </ul>\n\n`;
  } else {
    html += `  <p>We do not collect personal information directly from you. We may collect non-personal information automatically as you navigate our site.</p>\n\n`;
  }

  html += `  <h2>3. Cookies</h2>\n`;
  if (usesCookies) {
    html += `  <p>We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your browser settings.</p>\n`;
    html += `  <ul>\n    <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>\n    <li><strong>Preference cookies:</strong> Remember your settings and preferences.</li>\n    <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.</li>\n  </ul>\n\n`;
  } else {
    html += `  <p>We do not use cookies on our website.</p>\n\n`;
  }

  html += `  <h2>4. Analytics</h2>\n`;
  if (usesAnalytics) {
    html += `  <p>We use analytics services to collect information about how visitors use our website. This data is collected in aggregate form and does not personally identify individual visitors.</p>\n\n`;
  } else {
    html += `  <p>We do not use analytics services on our website.</p>\n\n`;
  }

  html += `  <h2>5. Third-Party Sharing</h2>\n`;
  if (thirdParty) {
    html += `  <p>We may share your information with trusted third-party service providers who assist us in operating our website. These third parties are obligated to keep your information confidential.</p>\n\n`;
  } else {
    html += `  <p>We do not share your personal information with third parties, except as required by law.</p>\n\n`;
  }

  html += `  <h2>6. Data Security</h2>\n`;
  html += `  <p>We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>\n\n`;

  html += `  <h2>7. Your Rights</h2>\n`;
  html += `  <ul>\n    <li>Access the personal data we hold about you</li>\n    <li>Request correction of inaccurate data</li>\n    <li>Request deletion of your data</li>\n    <li>Object to processing of your data</li>\n    <li>Request data portability</li>\n  </ul>\n\n`;

  html += `  <h2>8. Children&rsquo;s Privacy</h2>\n`;
  html += `  <p>Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children.</p>\n\n`;

  html += `  <h2>9. Changes to This Policy</h2>\n`;
  html += `  <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>\n\n`;

  html += `  <h2>10. Contact Us</h2>\n`;
  html += `  <p>If you have any questions about this Privacy Policy, please contact us at:</p>\n`;
  html += `  <p>Email: <a href="mailto:${contactEmail}">${contactEmail}</a><br>Website: <a href="${siteUrl}">${siteUrl}</a></p>\n`;

  html += `</body>\n</html>`;
  return html;
}

export default function PrivacyPolicyGeneratorTool() {
  const t = useTranslations("tools.privacy-policy-generator");
  const tc = useTranslations("common");
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [collectsPersonal, setCollectsPersonal] = useState(true);
  const [usesCookies, setUsesCookies] = useState(true);
  const [usesAnalytics, setUsesAnalytics] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);
  const [policy, setPolicy] = useState("");
  const [copied, setCopied] = useState<"text" | "html" | null>(null);

  const generate = useCallback(() => {
    const name = siteName || "Your Website";
    const url = siteUrl || "https://example.com";
    const email = contactEmail || "contact@example.com";
    const text = generatePolicyText(name, url, email, collectsPersonal, usesCookies, usesAnalytics, thirdParty);
    setPolicy(text);
  }, [siteName, siteUrl, contactEmail, collectsPersonal, usesCookies, usesAnalytics, thirdParty]);

  const copyAsText = async () => {
    const name = siteName || "Your Website";
    const url = siteUrl || "https://example.com";
    const email = contactEmail || "contact@example.com";
    const text = generatePolicyText(name, url, email, collectsPersonal, usesCookies, usesAnalytics, thirdParty);
    await navigator.clipboard.writeText(text);
    setCopied("text");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAsHtml = async () => {
    const name = siteName || "Your Website";
    const url = siteUrl || "https://example.com";
    const email = contactEmail || "contact@example.com";
    const html = generatePolicyHtml(name, url, email, collectsPersonal, usesCookies, usesAnalytics, thirdParty);
    await navigator.clipboard.writeText(html);
    setCopied("html");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout toolSlug="privacy-policy-generator">
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("site_name")}
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Website"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("site_url")}
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("contact_email")}
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-teal/50 transition-colors">
              <input
                type="checkbox"
                checked={collectsPersonal}
                onChange={(e) => setCollectsPersonal(e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-foreground">{t("collects_personal")}</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-teal/50 transition-colors">
              <input
                type="checkbox"
                checked={usesCookies}
                onChange={(e) => setUsesCookies(e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-foreground">{t("uses_cookies")}</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-teal/50 transition-colors">
              <input
                type="checkbox"
                checked={usesAnalytics}
                onChange={(e) => setUsesAnalytics(e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-foreground">{t("uses_analytics")}</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-teal/50 transition-colors">
              <input
                type="checkbox"
                checked={thirdParty}
                onChange={(e) => setThirdParty(e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-foreground">{t("third_party")}</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generate}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        {policy && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                <button
                  onClick={copyAsText}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    copied === "text"
                      ? "bg-success/10 text-success"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {copied === "text" ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {tc("copied")}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      {t("copy_text")}
                    </>
                  )}
                </button>
                <button
                  onClick={copyAsHtml}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    copied === "html"
                      ? "bg-success/10 text-success"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {copied === "html" ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {tc("copied")}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      {t("copy_html")}
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-[500px] whitespace-pre-wrap">
              {policy}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface HtaccessConfig {
  httpsRedirect: boolean;
  wwwRedirect: boolean;
  nonWwwRedirect: boolean;
  gzip: boolean;
  caching: boolean;
  securityHeaders: boolean;
  error404: string;
  error500: string;
  blockHotlinking: boolean;
  disableDirectoryListing: boolean;
}

function generateHtaccess(config: HtaccessConfig): string {
  const sections: string[] = [];

  // HTTPS Redirect
  if (config.httpsRedirect) {
    sections.push(
      `# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`
    );
  }

  // WWW Redirect
  if (config.wwwRedirect && !config.nonWwwRedirect) {
    sections.push(
      `# Redirect to www
RewriteEngine On
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`
    );
  }

  // Non-WWW Redirect
  if (config.nonWwwRedirect && !config.wwwRedirect) {
    sections.push(
      `# Redirect to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]`
    );
  }

  // GZIP Compression
  if (config.gzip) {
    sections.push(
      `# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/atom+xml
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE font/eot
  AddOutputFilterByType DEFLATE font/otf
</IfModule>`
    );
  }

  // Browser Caching
  if (config.caching) {
    sections.push(
      `# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType font/opentype "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresDefault "access plus 2 days"
</IfModule>`
    );
  }

  // Security Headers
  if (config.securityHeaders) {
    sections.push(
      `# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>`
    );
  }

  // Custom Error Pages
  if (config.error404.trim()) {
    sections.push(`# Custom 404 Error Page\nErrorDocument 404 ${config.error404.trim()}`);
  }
  if (config.error500.trim()) {
    sections.push(`# Custom 500 Error Page\nErrorDocument 500 ${config.error500.trim()}`);
  }

  // Block Hotlinking
  if (config.blockHotlinking) {
    sections.push(
      `# Block Hotlinking
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]
RewriteRule \\.(jpg|jpeg|png|gif|webp|avif|svg)$ - [F,NC,L]`
    );
  }

  // Disable Directory Listing
  if (config.disableDirectoryListing) {
    sections.push(`# Disable Directory Listing\nOptions -Indexes`);
  }

  return sections.join("\n\n");
}

export default function HtaccessGeneratorTool() {
  const t = useTranslations("tools.htaccess-generator");
  const tc = useTranslations("common");
  const [config, setConfig] = useState<HtaccessConfig>({
    httpsRedirect: true,
    wwwRedirect: false,
    nonWwwRedirect: true,
    gzip: true,
    caching: true,
    securityHeaders: true,
    error404: "/404.html",
    error500: "",
    blockHotlinking: false,
    disableDirectoryListing: true,
  });

  const output = useMemo(() => generateHtaccess(config), [config]);

  const updateToggle = (key: keyof HtaccessConfig) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: !prev[key] };
      // Ensure www and non-www are mutually exclusive
      if (key === "wwwRedirect" && newConfig.wwwRedirect) newConfig.nonWwwRedirect = false;
      if (key === "nonWwwRedirect" && newConfig.nonWwwRedirect) newConfig.wwwRedirect = false;
      return newConfig;
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ".htaccess";
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleClass = (active: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
      active ? "bg-teal" : "bg-border"
    }`;

  const toggleDotClass = (active: boolean) =>
    `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      active ? "translate-x-6" : "translate-x-1"
    }`;

  return (
    <ToolLayout toolSlug="htaccess-generator">
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {/* Toggle switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("https_redirect")}</span>
              <button type="button" className={toggleClass(config.httpsRedirect)} onClick={() => updateToggle("httpsRedirect")}>
                <span className={toggleDotClass(config.httpsRedirect)} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("www_redirect")}</span>
              <button type="button" className={toggleClass(config.wwwRedirect)} onClick={() => updateToggle("wwwRedirect")}>
                <span className={toggleDotClass(config.wwwRedirect)} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("non_www_redirect")}</span>
              <button type="button" className={toggleClass(config.nonWwwRedirect)} onClick={() => updateToggle("nonWwwRedirect")}>
                <span className={toggleDotClass(config.nonWwwRedirect)} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("gzip")}</span>
              <button type="button" className={toggleClass(config.gzip)} onClick={() => updateToggle("gzip")}>
                <span className={toggleDotClass(config.gzip)} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("caching")}</span>
              <button type="button" className={toggleClass(config.caching)} onClick={() => updateToggle("caching")}>
                <span className={toggleDotClass(config.caching)} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">{t("security_headers")}</span>
              <button type="button" className={toggleClass(config.securityHeaders)} onClick={() => updateToggle("securityHeaders")}>
                <span className={toggleDotClass(config.securityHeaders)} />
              </button>
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t("custom_error")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">404</label>
              <input
                type="text"
                value={config.error404}
                onChange={(e) => setConfig((prev) => ({ ...prev, error404: e.target.value }))}
                placeholder="/404.html"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">500</label>
              <input
                type="text"
                value={config.error500}
                onChange={(e) => setConfig((prev) => ({ ...prev, error500: e.target.value }))}
                placeholder="/500.html"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleDownload}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              {t("output_label")}
            </label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-[600px] whitespace-pre">
            {output || tc("fill_fields")}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

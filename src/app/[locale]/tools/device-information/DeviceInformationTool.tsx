"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface DeviceInfo {
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  pixelRatio: number;
  colorDepth: number;
  orientation: string;
  browser: string;
  userAgent: string;
  platform: string;
  language: string;
  languages: string;
  timezone: string;
  timezoneOffset: number;
  online: boolean;
  cookiesEnabled: boolean;
  doNotTrack: string;
  memory: string;
  cpuCores: number;
  maxTouchPoints: number;
  connectionType: string;
  connectionSpeed: string;
  battery: string;
  batteryCharging: string;
  gpu: string;
  gpuVendor: string;
  webglVersion: string;
  javaEnabled: boolean;
  pdfViewer: boolean;
}

function getGpuInfo(): { renderer: string; vendor: string; version: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { renderer: "N/A", vendor: "N/A", version: "N/A" };

    const webgl = gl as WebGLRenderingContext;
    const ext = webgl.getExtension("WEBGL_debug_renderer_info");
    const version = gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0";

    if (ext) {
      return {
        renderer: webgl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "N/A",
        vendor: webgl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "N/A",
        version,
      };
    }

    return {
      renderer: webgl.getParameter(webgl.RENDERER) || "N/A",
      vendor: webgl.getParameter(webgl.VENDOR) || "N/A",
      version,
    };
  } catch {
    return { renderer: "N/A", vendor: "N/A", version: "N/A" };
  }
}

export default function DeviceInformationTool() {
  const t = useTranslations("tools.device-information");
  const tc = useTranslations("common");

  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const collectInfo = useCallback(async () => {
    const gpu = getGpuInfo();

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { effectiveType?: string; downlink?: number };
      getBattery?: () => Promise<{ level: number; charging: boolean }>;
      pdfViewerEnabled?: boolean;
    };

    let batteryLevel = "N/A";
    let batteryCharging = "N/A";
    try {
      if (nav.getBattery) {
        const battery = await nav.getBattery();
        batteryLevel = `${Math.round(battery.level * 100)}%`;
        batteryCharging = battery.charging ? "Yes" : "No";
      }
    } catch {
      // Battery API not available
    }

    const connection = nav.connection;

    setInfo({
      screen: { width: screen.width, height: screen.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      pixelRatio: window.devicePixelRatio,
      colorDepth: screen.colorDepth,
      orientation: screen.orientation?.type || "N/A",
      browser: navigator.userAgent,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages.join(", "),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || "unspecified",
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "N/A",
      cpuCores: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      connectionType: connection?.effectiveType || "N/A",
      connectionSpeed: connection?.downlink ? `${connection.downlink} Mbps` : "N/A",
      battery: batteryLevel,
      batteryCharging: batteryCharging,
      gpu: gpu.renderer,
      gpuVendor: gpu.vendor,
      webglVersion: gpu.version,
      javaEnabled: false,
      pdfViewer: nav.pdfViewerEnabled ?? false,
    });
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    collectInfo();

    const interval = setInterval(collectInfo, 5000);

    const handleResize = () => collectInfo();
    const handleOnline = () => collectInfo();
    const handleOffline = () => collectInfo();

    window.addEventListener("resize", handleResize);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [collectInfo]);

  const allText = info
    ? [
        `Screen: ${info.screen.width}x${info.screen.height}`,
        `Viewport: ${info.viewport.width}x${info.viewport.height}`,
        `Pixel Ratio: ${info.pixelRatio}`,
        `Color Depth: ${info.colorDepth}-bit`,
        `Orientation: ${info.orientation}`,
        `Platform: ${info.platform}`,
        `Language: ${info.language}`,
        `Languages: ${info.languages}`,
        `Timezone: ${info.timezone}`,
        `UTC Offset: ${info.timezoneOffset > 0 ? "-" : "+"}${Math.abs(info.timezoneOffset / 60)}h`,
        `Online: ${info.online ? "Yes" : "No"}`,
        `Cookies: ${info.cookiesEnabled ? "Enabled" : "Disabled"}`,
        `Do Not Track: ${info.doNotTrack}`,
        `Memory: ${info.memory}`,
        `CPU Cores: ${info.cpuCores}`,
        `Touch Points: ${info.maxTouchPoints}`,
        `Connection: ${info.connectionType}`,
        `Speed: ${info.connectionSpeed}`,
        `Battery: ${info.battery}`,
        `Charging: ${info.batteryCharging}`,
        `GPU: ${info.gpu}`,
        `GPU Vendor: ${info.gpuVendor}`,
        `WebGL: ${info.webglVersion}`,
        `PDF Viewer: ${info.pdfViewer ? "Yes" : "No"}`,
        `User Agent: ${info.userAgent}`,
      ].join("\n")
    : "";

  const sections = info
    ? [
        {
          title: "Display",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          ),
          items: [
            ["Screen Resolution", `${info.screen.width} x ${info.screen.height}`],
            ["Viewport Size", `${info.viewport.width} x ${info.viewport.height}`],
            ["Device Pixel Ratio", `${info.pixelRatio}x`],
            ["Color Depth", `${info.colorDepth}-bit`],
            ["Orientation", info.orientation],
            ["Touch Points", `${info.maxTouchPoints}`],
          ],
        },
        {
          title: "System",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          ),
          items: [
            ["Platform", info.platform],
            ["CPU Cores", `${info.cpuCores}`],
            ["Memory", info.memory],
            ["Battery Level", info.battery],
            ["Charging", info.batteryCharging],
          ],
        },
        {
          title: "Network",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          ),
          items: [
            ["Online Status", info.online ? "Online" : "Offline"],
            ["Connection Type", info.connectionType],
            ["Download Speed", info.connectionSpeed],
          ],
        },
        {
          title: "Browser & Locale",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
          ),
          items: [
            ["Language", info.language],
            ["All Languages", info.languages],
            ["Timezone", info.timezone],
            ["UTC Offset", `${info.timezoneOffset > 0 ? "-" : "+"}${Math.abs(info.timezoneOffset / 60)}h`],
            ["Cookies", info.cookiesEnabled ? "Enabled" : "Disabled"],
            ["Do Not Track", info.doNotTrack],
            ["PDF Viewer", info.pdfViewer ? "Available" : "Not available"],
          ],
        },
        {
          title: "GPU / Graphics",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
            </svg>
          ),
          items: [
            ["GPU Renderer", info.gpu],
            ["GPU Vendor", info.gpuVendor],
            ["WebGL Version", info.webglVersion],
          ],
        },
      ]
    : [];

  return (
    <ToolLayout toolSlug="device-information">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={collectInfo}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              Refresh
            </button>
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          {info && <CopyButton text={allText} />}
        </div>

        {!info ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading device information...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
                  {section.icon}
                  <span className="text-sm font-semibold text-foreground">{section.title}</span>
                </div>
                <div className="divide-y divide-border">
                  {section.items.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-mono text-foreground text-right max-w-[60%] truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Agent (full width) */}
        {info && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">User Agent</span>
              <CopyButton text={info.userAgent} />
            </div>
            <p className="text-xs font-mono text-muted-foreground break-all">{info.userAgent}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

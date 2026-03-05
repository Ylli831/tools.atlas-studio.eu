"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
}

function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

function maskToCidr(mask: number): number {
  let count = 0;
  let m = mask;
  while (m & 0x80000000) {
    count++;
    m = (m << 1) >>> 0;
  }
  return count;
}

function isValidIp(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p;
  });
}

function getIpClass(ip: number): string {
  const first = (ip >>> 24) & 255;
  if (first < 128) return "A";
  if (first < 192) return "B";
  if (first < 224) return "C";
  if (first < 240) return "D (Multicast)";
  return "E (Reserved)";
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
  binaryMask: string;
  isPrivate: boolean;
}

function calculateSubnet(ipStr: string, cidr: number): SubnetResult {
  const ip = ipToNumber(ipStr);
  const mask = cidrToMask(cidr);
  const wildcard = (~mask) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = wildcard + 1;
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts === 1 ? 1 : 0;
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

  const first = (ip >>> 24) & 255;
  const isPrivate =
    first === 10 ||
    (first === 172 && (((ip >>> 16) & 255) >= 16 && ((ip >>> 16) & 255) <= 31)) ||
    (first === 192 && ((ip >>> 16) & 255) === 168);

  const binaryMask = mask
    .toString(2)
    .padStart(32, "0")
    .replace(/(.{8})/g, "$1.")
    .slice(0, -1);

  return {
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    subnetMask: numberToIp(mask),
    wildcardMask: numberToIp(wildcard),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    totalHosts,
    usableHosts,
    cidr,
    ipClass: getIpClass(ip),
    binaryMask,
    isPrivate,
  };
}

export default function Ipv4SubnetCalculatorTool() {
  const t = useTranslations("tools.ipv4-subnet-calculator");
  const tc = useTranslations("common");

  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);

    let ipStr: string;
    let cidr: number;

    if (input.includes("/")) {
      const parts = input.split("/");
      ipStr = parts[0].trim();
      cidr = parseInt(parts[1].trim());
    } else {
      const parts = input.trim().split(/\s+/);
      ipStr = parts[0];
      if (parts.length > 1 && isValidIp(parts[1])) {
        const maskNum = ipToNumber(parts[1]);
        cidr = maskToCidr(maskNum);
      } else {
        setError("Enter IP with CIDR (e.g., 192.168.1.0/24) or IP + subnet mask");
        return;
      }
    }

    if (!isValidIp(ipStr)) {
      setError("Invalid IP address");
      return;
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      setError("CIDR must be between 0 and 32");
      return;
    }

    setResult(calculateSubnet(ipStr, cidr));
  };

  const allText = result
    ? `Network: ${result.networkAddress}/${result.cidr}\nSubnet Mask: ${result.subnetMask}\nWildcard: ${result.wildcardMask}\nBroadcast: ${result.broadcastAddress}\nFirst Host: ${result.firstHost}\nLast Host: ${result.lastHost}\nUsable Hosts: ${result.usableHosts.toLocaleString()}\nTotal Addresses: ${result.totalHosts.toLocaleString()}\nIP Class: ${result.ipClass}\nPrivate: ${result.isPrivate ? "Yes" : "No"}\nBinary Mask: ${result.binaryMask}`
    : "";

  return (
    <ToolLayout toolSlug="ipv4-subnet-calculator">
      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            IP Address / CIDR
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
              placeholder="192.168.1.0/24 or 10.0.0.0 255.0.0.0"
              className="flex-1 bg-card border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-teal"
            />
            <button
              onClick={calculate}
              className="bg-teal text-white font-medium px-6 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm whitespace-nowrap"
            >
              Calculate
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Quick CIDR presets */}
        <div className="flex flex-wrap gap-2">
          {[8, 16, 20, 22, 24, 25, 26, 27, 28, 29, 30, 32].map((cidr) => (
            <button
              key={cidr}
              onClick={() => {
                const ip = input.split(/[/\s]/)[0] || "192.168.1.0";
                setInput(`${ip}/${cidr}`);
              }}
              className="bg-surface text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border transition-colors text-xs font-mono"
            >
              /{cidr}
            </button>
          ))}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Results</h2>
              <CopyButton text={allText} />
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Network Address", `${result.networkAddress}/${result.cidr}`],
                    ["Subnet Mask", result.subnetMask],
                    ["Wildcard Mask", result.wildcardMask],
                    ["Broadcast Address", result.broadcastAddress],
                    ["First Usable Host", result.firstHost],
                    ["Last Usable Host", result.lastHost],
                    ["Usable Hosts", result.usableHosts.toLocaleString()],
                    ["Total Addresses", result.totalHosts.toLocaleString()],
                    ["IP Class", result.ipClass],
                    ["Private Address", result.isPrivate ? "Yes" : "No"],
                    ["Binary Mask", result.binaryMask],
                  ].map(([label, value], i) => (
                    <tr
                      key={label}
                      className={i % 2 === 0 ? "bg-card" : "bg-surface/50"}
                    >
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {label}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground text-right">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

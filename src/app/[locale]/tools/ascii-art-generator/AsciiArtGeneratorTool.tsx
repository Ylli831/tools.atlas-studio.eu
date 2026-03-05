"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ============ STANDARD FONT (FIGlet-inspired) ============
const STANDARD_FONT: Record<string, string[]> = {
  A: ["  _  ", " / \\ ", "/ _ \\", "| |_| |", "|_| |_|"],
  B: [" ____  ", "| __ ) ", "|  _ \\ ", "| |_) |", "|____/ "],
  C: ["  ____ ", " / ___|", "| |    ", "| |___ ", " \\____|"],
  D: [" ____  ", "|  _ \\ ", "| | | |", "| |_| |", "|____/ "],
  E: [" _____ ", "| ____|", "|  _|  ", "| |___ ", "|_____|"],
  F: [" _____ ", "|  ___|", "| |_   ", "|  _|  ", "|_|    "],
  G: ["  ____ ", " / ___|", "| |  _ ", "| |_| |", " \\____|"],
  H: [" _   _ ", "| | | |", "| |_| |", "|  _  |", "|_| |_|"],
  I: [" ___ ", "|_ _|", " | | ", " | | ", "|___|"],
  J: ["     _ ", "    | |", " _  | |", "| |_| |", " \\____|"],
  K: [" _  __", "| |/ /", "| ' / ", "| . \\ ", "|_|\\_\\"],
  L: [" _     ", "| |    ", "| |    ", "| |___ ", "|_____|"],
  M: [" __  __ ", "|  \\/  |", "| |\\/| |", "| |  | |", "|_|  |_|"],
  N: [" _   _ ", "| \\ | |", "|  \\| |", "| |\\  |", "|_| \\_|"],
  O: ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\___/ "],
  P: [" ____  ", "|  _ \\ ", "| |_) |", "|  __/ ", "|_|    "],
  Q: ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\__\\_\\"],
  R: [" ____  ", "|  _ \\ ", "| |_) |", "|  _ < ", "|_| \\_\\"],
  S: [" ____  ", "/ ___| ", "\\___ \\ ", " ___) |", "|____/ "],
  T: [" _____ ", "|_   _|", "  | |  ", "  | |  ", "  |_|  "],
  U: [" _   _ ", "| | | |", "| | | |", "| |_| |", " \\___/ "],
  V: ["__     __", "\\ \\   / /", " \\ \\ / / ", "  \\ V /  ", "   \\_/   "],
  W: ["__        __", "\\ \\      / /", " \\ \\ /\\ / / ", "  \\ V  V /  ", "   \\_/\\_/   "],
  X: ["__  __", "\\ \\/ /", " \\  / ", " /  \\ ", "/_/\\_\\"],
  Y: ["__   __", "\\ \\ / /", " \\ V / ", "  | |  ", "  |_|  "],
  Z: [" _____", "|__  /", "  / / ", " / /_ ", "/____|"],
  " ": ["   ", "   ", "   ", "   ", "   "],
  "0": ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\___/ "],
  "1": [" _ ", "/ |", "| |", "| |", "|_|"],
  "2": [" ____  ", "|___ \\ ", "  __) |", " / __/ ", "|_____|"],
  "3": [" _____ ", "|___ / ", "  |_ \\ ", " ___) |", "|____/ "],
  "4": [" _  _   ", "| || |  ", "| || |_ ", "|__  _| ", "   |_|  "],
  "5": [" ____  ", "| ___| ", "|___ \\ ", " ___) |", "|____/ "],
  "6": ["  __   ", " / /_  ", "| '_ \\ ", "| (_) |", " \\___/ "],
  "7": [" _____ ", "|___  |", "   / / ", "  / /  ", " /_/   "],
  "8": ["  ___  ", " ( _ ) ", " / _ \\ ", "| (_) |", " \\___/ "],
  "9": ["  ___  ", " / _ \\ ", "| (_) |", " \\__, |", "   /_/ "],
  "!": [" _ ", "| |", "| |", "|_|", "(_)"],
  "?": [" ___ ", "|__ \\", "  / /", " |_| ", " (_) "],
  ".": ["   ", "   ", "   ", " _ ", "(_)"],
  ",": ["   ", "   ", "   ", " _ ", "( )"],
  "-": ["      ", "      ", " ____ ", "|____|", "      "],
  "_": ["         ", "         ", "         ", "         ", " _______ "],
  "@": ["  ____  ", " / __ \\ ", "| |__| |", "|  __  |", "|_|  |_|"],
};

// ============ BANNER FONT (wide block letters with #) ============
const BANNER_FONT: Record<string, string[]> = {
  A: ["  ##  ", " #  # ", "######", "#    #", "#    #"],
  B: ["##### ", "#    #", "##### ", "#    #", "##### "],
  C: [" #####", "#     ", "#     ", "#     ", " #####"],
  D: ["####  ", "#   # ", "#    #", "#   # ", "####  "],
  E: ["######", "#     ", "####  ", "#     ", "######"],
  F: ["######", "#     ", "####  ", "#     ", "#     "],
  G: [" #####", "#     ", "#  ###", "#    #", " #####"],
  H: ["#    #", "#    #", "######", "#    #", "#    #"],
  I: ["######", "  ##  ", "  ##  ", "  ##  ", "######"],
  J: ["######", "    # ", "    # ", "#   # ", " ### "],
  K: ["#   # ", "#  #  ", "###   ", "#  #  ", "#   # "],
  L: ["#     ", "#     ", "#     ", "#     ", "######"],
  M: ["#    #", "##  ##", "# ## #", "#    #", "#    #"],
  N: ["#    #", "##   #", "# #  #", "#  # #", "#   ##"],
  O: [" #### ", "#    #", "#    #", "#    #", " #### "],
  P: ["##### ", "#    #", "##### ", "#     ", "#     "],
  Q: [" #### ", "#    #", "#  # #", "#   # ", " ### #"],
  R: ["##### ", "#    #", "##### ", "#  #  ", "#   # "],
  S: [" #####", "#     ", " #### ", "     #", "##### "],
  T: ["######", "  ##  ", "  ##  ", "  ##  ", "  ##  "],
  U: ["#    #", "#    #", "#    #", "#    #", " #### "],
  V: ["#    #", "#    #", " #  # ", " #  # ", "  ##  "],
  W: ["#    #", "#    #", "# ## #", "##  ##", "#    #"],
  X: ["#    #", " #  # ", "  ##  ", " #  # ", "#    #"],
  Y: ["#    #", " #  # ", "  ##  ", "  ##  ", "  ##  "],
  Z: ["######", "    # ", "  ##  ", " #    ", "######"],
  " ": ["      ", "      ", "      ", "      ", "      "],
  "0": [" #### ", "#   ##", "#  # #", "##   #", " #### "],
  "1": ["  #   ", " ##   ", "  #   ", "  #   ", " ###  "],
  "2": [" #### ", "#    #", "   ## ", "  #   ", "######"],
  "3": ["##### ", "     #", " #### ", "     #", "##### "],
  "4": ["#    #", "#    #", "######", "     #", "     #"],
  "5": ["######", "#     ", "##### ", "     #", "##### "],
  "6": [" #### ", "#     ", "##### ", "#    #", " #### "],
  "7": ["######", "    # ", "   #  ", "  #   ", " #    "],
  "8": [" #### ", "#    #", " #### ", "#    #", " #### "],
  "9": [" #### ", "#    #", " #####", "     #", " #### "],
  "!": ["  ##  ", "  ##  ", "  ##  ", "      ", "  ##  "],
  "?": [" #### ", "#    #", "   ## ", "      ", "  ##  "],
  ".": ["      ", "      ", "      ", "      ", "  ##  "],
  ",": ["      ", "      ", "      ", "  ##  ", " ##   "],
  "-": ["      ", "      ", "######", "      ", "      "],
};

// ============ SHADOW FONT (letters with shadow offset) ============
const SHADOW_FONT: Record<string, string[]> = {
  A: ["   _   ", "  /_\\  ", " / _ \\ ", "/_/ \\_\\", "  |_|  "],
  B: [" ___  ", "| _ ) ", "| _ \\ ", "|___/ ", " |__| "],
  C: ["  ___ ", " / __|", "| (__ ", " \\___|", "  |_| "],
  D: [" ___  ", "|   \\ ", "| |) |", "|___/ ", " |__| "],
  E: [" ___  ", "| __| ", "| _|  ", "|___|_", "  |_| "],
  F: [" ___  ", "| __| ", "| _|  ", "|_|   ", " |_|  "],
  G: ["  ___ ", " / __|", "| (_ |", " \\___|", "  |_| "],
  H: [" _  _ ", "| || |", "| __ |", "|_||_|", " |__| "],
  I: [" ___ ", "|_ _|", " | | ", " |_| ", " |_| "],
  J: ["   _ ", "  | |", "  | |", " _| |", "|___|"],
  K: [" _  __", "| |/ /", "| ' < ", "|_|\\_\\", " |__| "],
  L: [" _    ", "| |   ", "| |__ ", "|____|", " |__| "],
  M: [" __  __", "|  \\/  |", "| |\\/| |", "|_|__|_|", " |____|"],
  N: [" _  _ ", "| \\| |", "| .` |", "|_|\\_|", " |__| "],
  O: ["  ___  ", " / _ \\ ", "| (_) |", " \\___/ ", "  |_|  "],
  P: [" ___  ", "| _ \\ ", "|  _/ ", "|_|   ", " |_|  "],
  Q: ["  ___  ", " / _ \\ ", "| (_) |", " \\__\\_\\", "  |__|"],
  R: [" ___  ", "| _ \\ ", "|   / ", "|_|_\\ ", " |__| "],
  S: [" ___ ", "/ __|", "\\__ \\", "|___/", " |_| "],
  T: [" _____ ", "|_   _|", "  | |  ", "  |_|  ", "  |_|  "],
  U: [" _   _ ", "| | | |", "| |_| |", " \\___/ ", "  |_|  "],
  V: ["__   __", "\\ \\ / /", " \\ V / ", "  \\_/  ", "  |_|  "],
  W: ["__      __", "\\ \\    / /", " \\ \\/\\/ / ", "  \\_/\\_/  ", "   |__|   "],
  X: ["__  __", "\\ \\/ /", " >  < ", "/_/\\_\\", " |__| "],
  Y: ["__  __", "\\ \\/ /", " \\  / ", "  \\/  ", "  |_| "],
  Z: [" ____", "|_  /", " / / ", "/___\\", " |_| "],
  " ": ["    ", "    ", "    ", "    ", "    "],
  "0": [" ___ ", "/ _ \\", "| | |", "\\___/", " |_| "],
  "1": [" _  ", "/ | ", "| | ", "|_| ", "|_| "],
  "2": [" ___ ", "|_  )", " / / ", "/___\\", " |_| "],
  "3": [" ___ ", "|__ \\", " __) ", "|___/", " |_| "],
  "4": [" _ _ ", "| | |", "|_  |", "  |_|", "  |_|"],
  "5": [" ___ ", "| __|", "|__ \\", "|___/", " |_| "],
  "6": ["  __ ", " / / ", "| _ \\", "\\___/", " |_| "],
  "7": [" ____", "|__ /", "  / /", " /_/ ", " |_| "],
  "8": [" ___ ", "(_ _)", "/ _ \\", "\\___/", " |_| "],
  "9": [" ___ ", "/ _ \\", "\\_, /", " /_/ ", " |_| "],
  "!": [" _ ", "| |", "|_|", "(_)", " _ "],
  "?": [" __ ", "|_ )", " |/ ", " () ", " __ "],
  ".": ["   ", "   ", "   ", " . ", " _ "],
  ",": ["   ", "   ", "   ", " , ", " _ "],
  "-": ["     ", "     ", " ___ ", "|___|", "     "],
};

// ============ SMALL FONT (compact) ============
const SMALL_FONT: Record<string, string[]> = {
  A: [" _ ", "/_\\", "| |"],
  B: [" _ ", "|_)", "|_)"],
  C: [" _ ", "|  ", "|_ "],
  D: [" _ ", "| \\", "|_/"],
  E: [" _ ", "|_ ", "|_ "],
  F: [" _ ", "|_ ", "|  "],
  G: [" _ ", "| _", "|_|"],
  H: ["   ", "|_|", "| |"],
  I: ["_ ", "| ", "| "],
  J: [" _ ", " | ", "_| "],
  K: ["   ", "|/ ", "|\\ "],
  L: ["   ", "|  ", "|_ "],
  M: ["    ", "|\\/|", "|  |"],
  N: ["   ", "|\\ ", "| \\"],
  O: [" _ ", "| |", "|_|"],
  P: [" _ ", "|_)", "|  "],
  Q: [" _ ", "| |", " \\|"],
  R: [" _ ", "|_)", "| \\"],
  S: [" _ ", "|_ ", " _)"],
  T: ["___", " | ", " | "],
  U: ["   ", "| |", "|_|"],
  V: ["   ", "\\ /", " v "],
  W: ["     ", "\\   /", " \\_/ "],
  X: ["   ", "\\ /", "/ \\"],
  Y: ["   ", "\\ /", " | "],
  Z: ["__ ", " / ", "/_ "],
  " ": ["  ", "  ", "  "],
  "0": [" _ ", "| |", "|_|"],
  "1": ["  ", " |", " |"],
  "2": ["__ ", " _)", "|_ "],
  "3": ["__ ", " _)", " _)"],
  "4": ["   ", "|_|", "  |"],
  "5": ["__ ", "|_ ", " _)"],
  "6": [" _ ", "|_ ", "|_)"],
  "7": ["__ ", " / ", "/  "],
  "8": [" _ ", "|_|", "|_|"],
  "9": [" _ ", "|_)", " _/"],
  "!": ["_ ", "! ", ". "],
  "?": ["__ ", " _)", ".  "],
  ".": ["  ", "  ", ". "],
  ",": ["  ", "  ", ", "],
  "-": ["   ", " - ", "   "],
};

// ============ BLOCK FONT (filled block chars from banner) ============
const BLOCK_FONT: Record<string, string[]> = {};
for (const [key, lines] of Object.entries(BANNER_FONT)) {
  BLOCK_FONT[key] = lines.map((line) =>
    line.replace(/#/g, "\u2588").replace(/ /g, " ")
  );
}

const FONTS: Record<string, { data: Record<string, string[]>; height: number }> = {
  standard: { data: STANDARD_FONT, height: 5 },
  banner: { data: BANNER_FONT, height: 5 },
  shadow: { data: SHADOW_FONT, height: 5 },
  small: { data: SMALL_FONT, height: 3 },
  block: { data: BLOCK_FONT, height: 5 },
};

function renderAsciiArt(text: string, fontName: string): string {
  const font = FONTS[fontName] || FONTS.standard;
  const chars = text.toUpperCase().split("");
  const lineCount = font.height;
  const lines: string[] = Array.from({ length: lineCount }, () => "");

  for (const ch of chars) {
    const glyph = font.data[ch] || font.data["?"] || Array.from({ length: lineCount }, () => " ");
    for (let i = 0; i < lineCount; i++) {
      lines[i] += (glyph[i] || "") + " ";
    }
  }

  return lines.map((l) => l.trimEnd()).join("\n");
}

const FONT_NAMES: Record<string, string> = {
  standard: "Standard",
  banner: "Banner",
  shadow: "Shadow",
  small: "Small",
  block: "Block",
};

export default function AsciiArtGeneratorTool() {
  const t = useTranslations("tools.ascii-art-generator");
  const tc = useTranslations("common");

  const [input, setInput] = useState("Hello");
  const [fontStyle, setFontStyle] = useState("standard");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return renderAsciiArt(input, fontStyle);
  }, [input, fontStyle]);

  return (
    <ToolLayout toolSlug="ascii-art-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              {t("input_label")}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("input_placeholder")}
              maxLength={30}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              {t("font_style")}
            </label>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            >
              {Object.entries(FONT_NAMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              {t("output_label")}
            </span>
            <CopyButton text={output} />
          </div>
          <div className="px-4 py-3 overflow-x-auto">
            <pre className="text-sm font-mono text-foreground whitespace-pre leading-tight">
              {output || "..."}
            </pre>
          </div>
        </div>

        {/* Font preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.entries(FONT_NAMES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFontStyle(key)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                fontStyle === key
                  ? "border-teal bg-teal/5"
                  : "border-border bg-card hover:border-teal/50"
              }`}
            >
              <div className="text-xs font-medium text-foreground mb-1">{label}</div>
              <pre className="text-[6px] leading-[7px] font-mono text-muted-foreground overflow-hidden">
                {renderAsciiArt("AB", key)}
              </pre>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

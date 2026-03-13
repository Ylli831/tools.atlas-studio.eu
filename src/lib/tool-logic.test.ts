import { describe, it, expect } from "vitest";

// ============================================================
// IBAN Validator
// Extracted from src/app/[locale]/tools/iban-validator/IbanValidatorTool.tsx
// ============================================================

const IBAN_LENGTHS: Record<string, number> = {
  AL: 28, AT: 20, BE: 16, CH: 21, DE: 22, ES: 24, FR: 27,
  GB: 22, IT: 27, NL: 18, PL: 28, SE: 24, NO: 15, DK: 18,
  FI: 18, CZ: 24, HU: 28, RO: 24, HR: 21, SK: 24, PT: 25,
  GR: 27, IE: 22, LU: 20,
};

function modulo(numStr: string, mod: number): number {
  let remainder = 0;
  for (const ch of numStr) {
    remainder = (remainder * 10 + parseInt(ch)) % mod;
  }
  return remainder;
}

function validateIban(raw: string): { valid: boolean; countryCode: string; length: number } {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  const countryCode = iban.slice(0, 2);
  const expectedLength = IBAN_LENGTHS[countryCode] ?? null;

  if (iban.length < 4) return { valid: false, countryCode, length: iban.length };
  if (expectedLength && iban.length !== expectedLength) return { valid: false, countryCode, length: iban.length };

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  const valid = modulo(numeric, 97) === 1;

  return { valid, countryCode, length: iban.length };
}

describe("IBAN Validator", () => {
  it("validates correct Albanian IBAN", () => {
    const result = validateIban("AL47212110090000000235698741");
    expect(result.valid).toBe(true);
    expect(result.countryCode).toBe("AL");
    expect(result.length).toBe(28);
  });

  it("validates correct German IBAN", () => {
    expect(validateIban("DE89370400440532013000").valid).toBe(true);
  });

  it("validates correct UK IBAN", () => {
    expect(validateIban("GB29NWBK60161331926819").valid).toBe(true);
  });

  it("validates correct French IBAN", () => {
    expect(validateIban("FR7630006000011234567890189").valid).toBe(true);
  });

  it("validates correct Swiss IBAN", () => {
    expect(validateIban("CH9300762011623852957").valid).toBe(true);
  });

  it("rejects IBAN with wrong check digits", () => {
    expect(validateIban("DE00370400440532013000").valid).toBe(false);
  });

  it("rejects IBAN with wrong length", () => {
    expect(validateIban("DE8937040044053201300").valid).toBe(false);
  });

  it("rejects too short input", () => {
    expect(validateIban("DE8").valid).toBe(false);
  });

  it("handles spaces in input", () => {
    expect(validateIban("DE89 3704 0044 0532 0130 00").valid).toBe(true);
  });

  it("handles lowercase input", () => {
    expect(validateIban("de89370400440532013000").valid).toBe(true);
  });
});

// ============================================================
// Number Base Converter
// Extracted from src/app/[locale]/tools/number-base-converter/NumberBaseConverterTool.tsx
// ============================================================

function convertBase(value: string, fromBase: number, toBase: number): string {
  const cleaned = value.trim().replace(/^0[bBxXoO]/, "");
  const n = parseInt(cleaned, fromBase);
  if (isNaN(n)) return "-";
  return n.toString(toBase).toUpperCase();
}

describe("Number Base Converter", () => {
  it("converts decimal to binary", () => {
    expect(convertBase("255", 10, 2)).toBe("11111111");
  });

  it("converts decimal to hex", () => {
    expect(convertBase("255", 10, 16)).toBe("FF");
  });

  it("converts binary to decimal", () => {
    expect(convertBase("11111111", 2, 10)).toBe("255");
  });

  it("converts hex to decimal", () => {
    expect(convertBase("FF", 16, 10)).toBe("255");
  });

  it("converts octal to decimal", () => {
    expect(convertBase("377", 8, 10)).toBe("255");
  });

  it("converts zero", () => {
    expect(convertBase("0", 10, 2)).toBe("0");
    expect(convertBase("0", 10, 16)).toBe("0");
  });

  it("handles prefix stripping", () => {
    expect(convertBase("0xFF", 16, 10)).toBe("255");
    expect(convertBase("0b11111111", 2, 10)).toBe("255");
    expect(convertBase("0o377", 8, 10)).toBe("255");
  });

  it("returns dash for invalid input", () => {
    expect(convertBase("ZZZ", 2, 10)).toBe("-");
  });
});

// ============================================================
// Base64 Encode/Decode
// Extracted from src/app/[locale]/tools/base64-encoder/Base64Tool.tsx
// ============================================================

function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

describe("Base64 Encoder/Decoder", () => {
  it("encodes simple ASCII text", () => {
    expect(base64Encode("Hello, World!")).toBe("SGVsbG8sIFdvcmxkIQ==");
  });

  it("decodes back to original", () => {
    expect(base64Decode("SGVsbG8sIFdvcmxkIQ==")).toBe("Hello, World!");
  });

  it("roundtrips ASCII text", () => {
    const text = "The quick brown fox jumps over the lazy dog";
    expect(base64Decode(base64Encode(text))).toBe(text);
  });

  it("roundtrips Unicode text", () => {
    const text = "Përshëndetje botë! 🌍";
    expect(base64Decode(base64Encode(text))).toBe(text);
  });

  it("handles empty string", () => {
    expect(base64Encode("")).toBe("");
    expect(base64Decode("")).toBe("");
  });

  it("encodes special characters", () => {
    const text = "<script>alert('xss')</script>";
    const encoded = base64Encode(text);
    expect(base64Decode(encoded)).toBe(text);
  });
});

// ============================================================
// URL Encoder/Decoder
// Extracted from src/app/[locale]/tools/url-encoder/UrlEncoderTool.tsx
// ============================================================

describe("URL Encoder/Decoder", () => {
  it("encodes special characters with encodeURIComponent", () => {
    expect(encodeURIComponent("hello world")).toBe("hello%20world");
    expect(encodeURIComponent("a=1&b=2")).toBe("a%3D1%26b%3D2");
  });

  it("preserves URL structure with encodeURI", () => {
    const url = "https://example.com/path?q=hello world&lang=en";
    const encoded = encodeURI(url);
    expect(encoded).toContain("https://example.com/path?q=hello%20world&lang=en");
  });

  it("roundtrips with encodeURIComponent/decodeURIComponent", () => {
    const text = "café & résumé = ñ";
    expect(decodeURIComponent(encodeURIComponent(text))).toBe(text);
  });

  it("handles Unicode", () => {
    const text = "日本語テスト";
    expect(decodeURIComponent(encodeURIComponent(text))).toBe(text);
  });
});

// ============================================================
// UUID Format Validation
// ============================================================

describe("UUID Format", () => {
  it("crypto.randomUUID produces valid v4 format", () => {
    const uuid = crypto.randomUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("generates unique UUIDs", () => {
    const uuids = Array.from({ length: 100 }, () => crypto.randomUUID());
    const unique = new Set(uuids);
    expect(unique.size).toBe(100);
  });
});

// ============================================================
// Color Picker — Contrast & Color Conversion
// Extracted from src/app/[locale]/tools/color-picker/ColorPickerTool.tsx
// ============================================================

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(...hexToRgb(hex1));
  const l2 = relativeLuminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type WcagLevel = "fail" | "AA_large" | "AA" | "AAA";

function getWcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA_large";
  return "fail";
}

describe("Color Picker — hexToRgb", () => {
  it("converts black", () => {
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  });
  it("converts white", () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
  });
  it("converts teal brand color", () => {
    expect(hexToRgb("#487877")).toEqual([72, 120, 119]);
  });
});

describe("Color Picker — rgbToHsl", () => {
  it("converts black", () => {
    expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
  });
  it("converts white", () => {
    expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
  });
  it("converts pure red", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
  });
});

describe("Color Picker — WCAG Contrast", () => {
  it("black on white is 21:1", () => {
    const ratio = contrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });
  it("white on white is 1:1", () => {
    const ratio = contrastRatio("#ffffff", "#ffffff");
    expect(ratio).toBeCloseTo(1, 0);
  });
  it("teal on cream is close to AA threshold", () => {
    const ratio = contrastRatio("#487877", "#f5f3ef");
    expect(ratio).toBeGreaterThanOrEqual(4.4);
    expect(ratio).toBeLessThan(4.6);
  });
  it("light gray on white fails", () => {
    const ratio = contrastRatio("#cccccc", "#ffffff");
    expect(ratio).toBeLessThan(3);
  });
});

describe("Color Picker — getWcagLevel", () => {
  it("returns fail for ratio < 3", () => {
    expect(getWcagLevel(2.5)).toBe("fail");
  });
  it("returns AA_large for ratio 3-4.49", () => {
    expect(getWcagLevel(3.5)).toBe("AA_large");
  });
  it("returns AA for ratio 4.5-6.99", () => {
    expect(getWcagLevel(5.0)).toBe("AA");
  });
  it("returns AAA for ratio >= 7", () => {
    expect(getWcagLevel(7.0)).toBe("AAA");
    expect(getWcagLevel(21)).toBe("AAA");
  });
});

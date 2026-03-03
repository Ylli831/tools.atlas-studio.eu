"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

type UnitDef = { label: string; factor: number };
type Category = { label: string; units: Record<string, UnitDef>; isTemp?: boolean };

const CATEGORIES: Record<string, Category> = {
  length: {
    label: "Length",
    units: {
      mm: { label: "Millimeter (mm)", factor: 0.001 },
      cm: { label: "Centimeter (cm)", factor: 0.01 },
      m: { label: "Meter (m)", factor: 1 },
      km: { label: "Kilometer (km)", factor: 1000 },
      in: { label: "Inch (in)", factor: 0.0254 },
      ft: { label: "Foot (ft)", factor: 0.3048 },
      yd: { label: "Yard (yd)", factor: 0.9144 },
      mi: { label: "Mile (mi)", factor: 1609.344 },
    },
  },
  weight: {
    label: "Weight / Mass",
    units: {
      mg: { label: "Milligram (mg)", factor: 0.000001 },
      g: { label: "Gram (g)", factor: 0.001 },
      kg: { label: "Kilogram (kg)", factor: 1 },
      t: { label: "Tonne (t)", factor: 1000 },
      oz: { label: "Ounce (oz)", factor: 0.0283495 },
      lb: { label: "Pound (lb)", factor: 0.453592 },
    },
  },
  temperature: {
    label: "Temperature",
    isTemp: true,
    units: {
      c: { label: "Celsius (°C)", factor: 1 },
      f: { label: "Fahrenheit (°F)", factor: 1 },
      k: { label: "Kelvin (K)", factor: 1 },
    },
  },
  volume: {
    label: "Volume",
    units: {
      ml: { label: "Milliliter (ml)", factor: 0.001 },
      l: { label: "Liter (L)", factor: 1 },
      m3: { label: "Cubic meter (m³)", factor: 1000 },
      fl_oz: { label: "Fluid ounce (fl oz)", factor: 0.0295735 },
      cup: { label: "Cup (US)", factor: 0.236588 },
      pt: { label: "Pint (US)", factor: 0.473176 },
      gal: { label: "Gallon (US)", factor: 3.78541 },
    },
  },
  speed: {
    label: "Speed",
    units: {
      "m/s": { label: "Meter/second (m/s)", factor: 1 },
      "km/h": { label: "Km/hour (km/h)", factor: 0.277778 },
      "mph": { label: "Miles/hour (mph)", factor: 0.44704 },
      "knot": { label: "Knot (kn)", factor: 0.514444 },
    },
  },
  area: {
    label: "Area",
    units: {
      "mm2": { label: "mm²", factor: 0.000001 },
      "cm2": { label: "cm²", factor: 0.0001 },
      "m2": { label: "m²", factor: 1 },
      "km2": { label: "km²", factor: 1000000 },
      "ha": { label: "Hectare (ha)", factor: 10000 },
      "ft2": { label: "ft²", factor: 0.092903 },
      "ac": { label: "Acre (ac)", factor: 4046.86 },
    },
  },
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === "f") celsius = (value - 32) * 5 / 9;
  if (from === "k") celsius = value - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function convert(value: number, from: string, to: string, category: Category): number {
  if (category.isTemp) return convertTemp(value, from, to);
  const fromFactor = category.units[from]?.factor ?? 1;
  const toFactor = category.units[to]?.factor ?? 1;
  return (value * fromFactor) / toFactor;
}

export default function UnitConverterTool() {
  const t = useTranslations("tools.unit-converter");
  const [catKey, setCatKey] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [inputValue, setInputValue] = useState("1");

  const cat = CATEGORIES[catKey];
  const unitKeys = Object.keys(cat.units);

  const handleCatChange = (key: string) => {
    setCatKey(key);
    const keys = Object.keys(CATEGORIES[key].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] ?? keys[0]);
    setInputValue("1");
  };

  const result = (() => {
    const n = parseFloat(inputValue);
    if (isNaN(n)) return "";
    const r = convert(n, fromUnit, toUnit, cat);
    return parseFloat(r.toPrecision(8)).toString();
  })();

  return (
    <ToolLayout toolSlug="unit-converter">
      <div className="space-y-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button key={key} onClick={() => handleCatChange(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${catKey === key ? "bg-teal text-white" : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"}`}
            >
              {val.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("from")}</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            >
              {unitKeys.map((k) => <option key={k} value={k}>{cat.units[k].label}</option>)}
            </select>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>

          {/* Swap */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <button onClick={() => { const tmp = fromUnit; setFromUnit(toUnit); setToUnit(tmp); }}
              className="sm:mt-7 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal border border-border rounded-xl px-3 py-2.5 hover:border-teal transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4" /><path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              {t("swap")}
            </button>
          </div>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t("to")}</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          >
            {unitKeys.map((k) => <option key={k} value={k}>{cat.units[k].label}</option>)}
          </select>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-teal/5 border border-teal/20 rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">{t("result")}</p>
            <p className="text-3xl font-bold text-teal">
              {result} <span className="text-lg text-muted-foreground font-normal">{cat.units[toUnit]?.label}</span>
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

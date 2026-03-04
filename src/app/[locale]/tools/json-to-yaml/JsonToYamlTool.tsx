"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import yaml from "js-yaml";

type Mode = "json-to-yaml" | "yaml-to-json";

const SAMPLE_JSON = `{
  "name": "Atlas Studio",
  "version": "2.0.0",
  "description": "Web Development & Tech Solutions",
  "features": [
    "Web Apps",
    "Mobile Apps",
    "Cloud Solutions"
  ],
  "config": {
    "port": 3000,
    "debug": false,
    "database": {
      "host": "localhost",
      "name": "atlas_db"
    }
  }
}`;

const SAMPLE_YAML = `name: Atlas Studio
version: 2.0.0
description: Web Development & Tech Solutions
features:
  - Web Apps
  - Mobile Apps
  - Cloud Solutions
config:
  port: 3000
  debug: false
  database:
    host: localhost
    name: atlas_db`;

export default function JsonToYamlTool() {
  const t = useTranslations("tools.json-to-yaml");
  const tc = useTranslations("common");
  const [mode, setMode] = useState<Mode>("json-to-yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = useCallback((text: string, currentMode: Mode) => {
    if (!text.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (currentMode === "json-to-yaml") {
        const parsed = JSON.parse(text);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      } else {
        const parsed = yaml.load(text);
        setOutput(JSON.stringify(parsed, null, 2));
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : tc("error"));
      setOutput("");
    }
  }, [tc]);

  useEffect(() => {
    convert(input, mode);
  }, [input, mode, convert]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
  };

  const handleLoadSample = () => {
    if (mode === "json-to-yaml") {
      setInput(SAMPLE_JSON);
    } else {
      setInput(SAMPLE_YAML);
    }
  };

  return (
    <ToolLayout toolSlug="json-to-yaml">
      <div className="space-y-4">
        {/* Mode Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => handleModeChange("json-to-yaml")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "json-to-yaml"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("json_to_yaml")}
            </button>
            <button
              onClick={() => handleModeChange("yaml-to-json")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "yaml-to-json"
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("yaml_to_json")}
            </button>
          </div>
          <button
            onClick={handleLoadSample}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {t("load_sample")}
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {mode === "json-to-yaml" ? t("json_label") : t("yaml_label")}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "json-to-yaml" ? t("json_placeholder") : t("yaml_placeholder")}
              rows={16}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                {mode === "json-to-yaml" ? t("yaml_label") : t("json_label")}
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={16}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

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
      </div>
    </ToolLayout>
  );
}

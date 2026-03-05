"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Keyframe {
  id: number;
  percent: number;
  transform: string;
  opacity: string;
  backgroundColor: string;
}

const TIMING_FUNCTIONS = ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.68, -0.55, 0.27, 1.55)"];
const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];

export default function CssAnimationGeneratorTool() {
  const t = useTranslations("tools.css-animation-generator");
  const tc = useTranslations("common");

  const [animName, setAnimName] = useState("myAnimation");
  const [duration, setDuration] = useState("1s");
  const [timing, setTiming] = useState("ease");
  const [delay, setDelay] = useState("0s");
  const [iterations, setIterations] = useState("infinite");
  const [direction, setDirection] = useState("normal");
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { id: 1, percent: 0, transform: "translateX(0)", opacity: "1", backgroundColor: "" },
    { id: 2, percent: 50, transform: "translateX(50px)", opacity: "0.5", backgroundColor: "" },
    { id: 3, percent: 100, transform: "translateX(0)", opacity: "1", backgroundColor: "" },
  ]);
  const [previewKey, setPreviewKey] = useState(0);

  let nextId = Math.max(...keyframes.map((k) => k.id)) + 1;

  const addKeyframe = () => {
    setKeyframes((prev) => [
      ...prev,
      { id: nextId, percent: 50, transform: "", opacity: "1", backgroundColor: "" },
    ]);
  };

  const removeKeyframe = (id: number) => {
    if (keyframes.length <= 2) return;
    setKeyframes((prev) => prev.filter((k) => k.id !== id));
  };

  const updateKeyframe = (id: number, field: keyof Keyframe, value: string | number) => {
    setKeyframes((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k))
    );
  };

  const cssOutput = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    const kfLines = sorted
      .map((kf) => {
        const props: string[] = [];
        if (kf.transform) props.push(`    transform: ${kf.transform};`);
        if (kf.opacity) props.push(`    opacity: ${kf.opacity};`);
        if (kf.backgroundColor) props.push(`    background-color: ${kf.backgroundColor};`);
        return `  ${kf.percent}% {\n${props.join("\n")}\n  }`;
      })
      .join("\n");

    const keyframesBlock = `@keyframes ${animName} {\n${kfLines}\n}`;
    const animationProp = `animation: ${animName} ${duration} ${timing} ${delay} ${iterations} ${direction};`;

    return `${keyframesBlock}\n\n.element {\n  ${animationProp}\n}`;
  }, [animName, duration, timing, delay, iterations, direction, keyframes]);

  const animationStyle = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    const kfLines = sorted
      .map((kf) => {
        const props: string[] = [];
        if (kf.transform) props.push(`transform: ${kf.transform}`);
        if (kf.opacity) props.push(`opacity: ${kf.opacity}`);
        if (kf.backgroundColor) props.push(`background-color: ${kf.backgroundColor}`);
        return `${kf.percent}% { ${props.join("; ")} }`;
      })
      .join(" ");

    return `${animName} ${duration} ${timing} ${delay} ${iterations} ${direction}`;
  }, [animName, duration, timing, delay, iterations, direction, keyframes]);

  const keyframesCSS = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    return sorted
      .map((kf) => {
        const props: string[] = [];
        if (kf.transform) props.push(`transform: ${kf.transform}`);
        if (kf.opacity) props.push(`opacity: ${kf.opacity}`);
        if (kf.backgroundColor) props.push(`background-color: ${kf.backgroundColor}`);
        return `${kf.percent}% { ${props.join("; ")}; }`;
      })
      .join(" ");
  }, [keyframes]);

  const refreshPreview = () => setPreviewKey((k) => k + 1);

  return (
    <ToolLayout toolSlug="css-animation-generator">
      <div className="space-y-6">
        {/* Animation properties */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("animation_name")}</label>
              <input
                type="text"
                value={animName}
                onChange={(e) => setAnimName(e.target.value.replace(/\s/g, ""))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("duration")}</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1s"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("timing")}</label>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                {TIMING_FUNCTIONS.map((tf) => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("delay")}</label>
              <input
                type="text"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                placeholder="0s"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("iteration")}</label>
              <input
                type="text"
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                placeholder="infinite"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t("direction")}</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Keyframes editor */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Keyframes</label>
            <button onClick={addKeyframe} className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm">
              {t("add_keyframe")}
            </button>
          </div>
          <div className="space-y-3">
            {keyframes.map((kf) => (
              <div key={kf.id} className="grid grid-cols-[60px_1fr_1fr_1fr_auto] gap-2 items-center">
                <div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={kf.percent}
                    onChange={(e) => updateKeyframe(kf.id, "percent", Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                  />
                </div>
                <input
                  type="text"
                  value={kf.transform}
                  onChange={(e) => updateKeyframe(kf.id, "transform", e.target.value)}
                  placeholder="transform"
                  className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                />
                <input
                  type="text"
                  value={kf.opacity}
                  onChange={(e) => updateKeyframe(kf.id, "opacity", e.target.value)}
                  placeholder="opacity"
                  className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                />
                <input
                  type="text"
                  value={kf.backgroundColor}
                  onChange={(e) => updateKeyframe(kf.id, "backgroundColor", e.target.value)}
                  placeholder="bg color"
                  className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                />
                {keyframes.length > 2 && (
                  <button
                    onClick={() => removeKeyframe(kf.id)}
                    className="text-muted-foreground hover:text-red-500 text-sm px-2"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">{t("preview")}</label>
            <button onClick={refreshPreview} className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm">
              Replay
            </button>
          </div>
          <div className="flex items-center justify-center min-h-[200px] bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-lg p-8">
            <style>{`@keyframes ${animName} { ${keyframesCSS} }`}</style>
            <div
              key={previewKey}
              className="w-24 h-24 bg-teal rounded-xl"
              style={{ animation: animationStyle }}
            />
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">{t("output_label")}</span>
            <CopyButton text={cssOutput} />
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
            {cssOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

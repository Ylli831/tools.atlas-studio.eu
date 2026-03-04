"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-registry";
import ToolIcon from "./ToolIcon";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("tools");
  const tc = useTranslations("categories");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tools.slice(0, 8);
    return tools.filter((tool) => {
      const name = t(`${tool.slug}.name` as never).toLowerCase();
      const desc = t(`${tool.slug}.description` as never).toLowerCase();
      const cat = tc(tool.category).toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q) || tool.slug.includes(q);
    });
  }, [query, t, tc]);

  const navigate = (slug: string) => {
    setOpen(false);
    router.push(`/tools/${slug}` as never);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      navigate(filtered[selected].slug);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-x-0 top-[15%] mx-auto w-full max-w-lg px-4">
        <div
          className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search tools..."
              className="flex-1 py-3.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">Esc</kbd>
          </div>

          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No tools found</p>
            ) : (
              filtered.map((tool, i) => (
                <button
                  key={tool.slug}
                  onClick={() => navigate(tool.slug)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? "bg-teal/10" : "hover:bg-surface"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <ToolIcon icon={tool.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {t(`${tool.slug}.name` as never)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tc(tool.category)}
                    </p>
                  </div>
                  {i === selected && (
                    <span className="text-xs text-muted-foreground">Enter ↵</span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 font-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 font-mono">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 font-mono">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

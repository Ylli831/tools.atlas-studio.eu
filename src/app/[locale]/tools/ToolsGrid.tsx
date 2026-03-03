"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { tools, categories } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ToolsGrid() {
  const t = useTranslations("tools");
  const tc = useTranslations("categories");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "all");

  const updateUrl = (q: string, cat: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat !== "all") params.set("category", cat);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    updateUrl(val, activeCategory);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    updateUrl(search, cat);
  };

  // `/` key focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        handleSearch("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tools.filter((tool) => {
      const name = t(`${tool.slug}.name` as never).toLowerCase();
      const desc = t(`${tool.slug}.description` as never).toLowerCase();
      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "new" && tool.isNew) ||
        tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, t]);

  const isFiltered = search.trim() !== "" || activeCategory !== "all";

  useScrollReveal(".reveal", `${activeCategory}-${search}`);

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate mb-1">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {search ? (
              <button
                onClick={() => handleSearch("")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : (
              <kbd className="text-xs text-muted-foreground border border-border rounded px-1 py-0.5 font-mono leading-none select-none">/</kbd>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => handleCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-teal text-white"
                : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"
            }`}
          >
            {t("filter_all")} ({tools.length})
          </button>
          <button
            onClick={() => handleCategory("new")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "new"
                ? "bg-terracotta text-white"
                : "bg-card border border-border text-muted-foreground hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {t("filter_new")} ({tools.filter((t) => t.isNew).length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-teal text-white"
                  : "bg-card border border-border text-muted-foreground hover:border-teal hover:text-teal"
              }`}
            >
              {tc(cat)} ({tools.filter((tool) => tool.category === cat).length})
            </button>
          ))}
        </div>

        {/* Result count */}
        {isFiltered && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4">
            {t("showing_count", { count: filtered.length })}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <svg
              width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="mx-auto mb-3 opacity-30"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm">
              {t("no_results")}{" "}
              <span className="font-medium text-foreground">&ldquo;{search}&rdquo;</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {filtered.map((tool, i) => (
              <div key={tool.slug} className="reveal h-full" style={{ transitionDelay: `${Math.min(i, 8) * 40}ms` }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

// The filterable catalogue grid.
//
// Every page is rendered into the HTML and filtering only hides cards client
// side: the index is an indexable list of links to all the prompt pages, so
// the crawler must see them all without running the filters.
import Link from "next/link";
import { useState } from "react";
import type { LibraryPage } from "@/lib/library";
import { getCategoryById, getToolById } from "@/lib/metadata";
import type { AITool, Category } from "@/types";

interface LibraryGridProps {
  pages: LibraryPage[];
  categories: Category[];
  tools: AITool[];
}

export default function LibraryGrid({ pages, categories, tools }: LibraryGridProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [tool, setTool] = useState<AITool | null>(null);

  // A tool belongs to one category, so filtering by tool while another
  // category is selected can only ever yield nothing. Selecting one clears
  // the other rather than showing the user an empty grid.
  function pickCategory(next: Category | null) {
    setCategory(next);
    if (next && tool && !pages.some((p) => p.category === next && p.tool === tool)) {
      setTool(null);
    }
  }

  function pickTool(next: AITool | null) {
    setTool(next);
    if (next) {
      const owner = pages.find((p) => p.tool === next)?.category ?? null;
      if (category && owner !== category) setCategory(null);
    }
  }

  const visible = pages.filter(
    (p) =>
      (!category || p.category === category) && (!tool || p.tool === tool)
  );

  return (
    <>
      <div className="space-y-3 mb-8">
        <FilterRow label="Catégorie">
          <Chip active={!category} onClick={() => pickCategory(null)}>
            Toutes
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => pickCategory(c)}>
              {getCategoryById(c)?.icon} {getCategoryById(c)?.label ?? c}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Outil">
          <Chip active={!tool} onClick={() => pickTool(null)}>
            Tous
          </Chip>
          {tools.map((t) => {
            const owner = pages.find((p) => p.tool === t)?.category ?? "";
            return (
              <Chip key={t} active={tool === t} onClick={() => pickTool(t)}>
                {getToolById(owner, t)?.name ?? t}
              </Chip>
            );
          })}
        </FilterRow>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((page) => {
          const cat = getCategoryById(page.category);
          const isVisible = visible.includes(page);
          return (
            <li key={page.slug} className={isVisible ? "" : "hidden"}>
              <Link
                href={`/prompts/${page.slug}`}
                className="h-full flex flex-col px-5 py-4 rounded-xl border border-border bg-white hover:border-accent hover:bg-accent/5 transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{cat?.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {page.title}
                  </span>
                </div>
                <p className="text-sm text-muted">{page.tagline}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="text-sm text-muted py-8 text-center">
          Aucun prompt ne correspond à ce filtre.
        </p>
      )}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-muted w-20 shrink-0">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-white text-muted hover:border-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

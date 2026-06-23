"use client";

import type { CategoryMeta } from "@/types";
import Badge from "@/components/ui/Badge";

interface CategoryCardProps {
  category: CategoryMeta;
  onSelect: (id: CategoryMeta["id"]) => void;
}

export default function CategoryCard({ category, onSelect }: CategoryCardProps) {
  const isDisabled = category.comingSoon;

  return (
    <button
      onClick={() => !isDisabled && onSelect(category.id)}
      disabled={isDisabled}
      className={`
        group relative w-full text-left rounded-2xl border p-6 transition-all duration-200
        ${
          isDisabled
            ? "border-border bg-card-hover cursor-not-allowed opacity-60"
            : "border-border bg-white hover:border-accent hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        }
      `}
    >
      {category.comingSoon && (
        <div className="absolute top-4 right-4">
          <Badge label="Bientôt" variant="muted" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-4xl leading-none">{category.icon}</div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 transition-colors ${
              isDisabled ? "text-foreground" : "group-hover:text-accent"
            }`}
          >
            {category.label}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {category.description}
          </p>
          {!isDisabled && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {category.tools.map((tool) => (
                <span
                  key={tool.id}
                  className="text-xs text-muted bg-card-hover px-2 py-0.5 rounded-md border border-border"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isDisabled && (
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-5 h-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

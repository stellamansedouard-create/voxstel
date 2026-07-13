"use client";

import type { CategoryMeta, UseCaseMeta } from "@/types";
import { getUseCases } from "@/lib/usecases";

interface UseCaseSelectorProps {
  category: CategoryMeta;
  onSelect: (useCaseId: string) => void;
}

export default function UseCaseSelector({ category, onSelect }: UseCaseSelectorProps) {
  const useCases: UseCaseMeta[] = getUseCases(category.id);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Que voulez-vous créer ?
        </h2>
        <p className="text-muted text-sm">
          Choisissez le type le plus proche de votre besoin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {useCases.map((uc) => (
          <button
            key={uc.id}
            onClick={() => onSelect(uc.id)}
            className="group w-full text-left bg-white border border-border rounded-2xl p-4 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                {uc.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-sm text-foreground group-hover:text-accent transition-colors mb-0.5">
                  {uc.label}
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  {uc.tagline}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

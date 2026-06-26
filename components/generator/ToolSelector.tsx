"use client";

import { ImageIcon, Video, FileText, Music } from "lucide-react";
import type { CategoryMeta, AITool, ToolCapability } from "@/types";
import Badge from "@/components/ui/Badge";

interface ToolSelectorProps {
  category: CategoryMeta;
  onSelect: (tool: AITool) => void;
}

const CAPABILITY_CONFIG: Record<ToolCapability, { label: string; Icon: React.ElementType }> = {
  image: { label: "Image", Icon: ImageIcon },
  video: { label: "Vidéo", Icon: Video },
  text:  { label: "Texte", Icon: FileText },
  music: { label: "Musique", Icon: Music },
};

export default function ToolSelector({ category, onSelect }: ToolSelectorProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choisissez votre IA
        </h2>
        <p className="text-muted text-sm">
          Sélectionnez l&apos;outil pour lequel vous voulez générer un prompt
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {category.tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id as AITool)}
            className="group w-full text-left bg-white border border-border rounded-2xl p-4 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-card-hover flex items-center justify-center flex-shrink-0 group-hover:bg-accent/5 transition-colors">
                <span className="text-sm font-bold text-accent">
                  {tool.name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                      {tool.name}
                    </span>
                    {tool.badge && <Badge label={tool.badge} />}
                  </div>
                  {tool.capabilities && tool.capabilities.length > 0 && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {tool.capabilities.map((cap) => {
                        const { Icon } = CAPABILITY_CONFIG[cap];
                        return (
                          <span
                            key={cap}
                            title={CAPABILITY_CONFIG[cap].label}
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-accent/8 text-accent/60"
                          >
                            <Icon size={11} />
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

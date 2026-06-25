export type Category = "image" | "video" | "text" | "music";

export type ImageTool =
  | "midjourney"
  | "dalle3"
  | "firefly"
  | "imagen"
  | "stablediffusion"
  | "leonardoai"
  | "ideogram";

export type VideoTool = "sora" | "runway" | "pika" | "lumaai" | "klingai" | "veo";

export type TextTool = "claude" | "gpt4" | "gemini" | "llama" | "mistral" | "deepseek";

export type MusicTool = "suno" | "udio" | "stableaudio" | "aiva";

export type AITool = ImageTool | VideoTool | TextTool | MusicTool;

/** Question affichée directement au chargement de l'écran Précisions */
export interface DirectQuestion {
  id: string;
  label: string;
  suggestions: string[];
}

/** Catégorie optionnelle dans la section "Aller plus loin" */
export interface PrecisionCategory {
  id: string;
  label: string;
  priority: boolean;
}

/** Q&A d'un tour précédent, réaffiché modifiable lors d'un "Renforcer" */
export interface PreviousQAItem {
  id: string;
  label: string;
  value: string;
  type: "direct" | "category";
}

/** Aspect visuel détecté dans une image de référence */
export interface ImageAspect {
  id: string;
  label: string;
  description: string;
}

/** État de l'image de référence pour la génération de prompt */
export interface ImageReference {
  aspects: ImageAspect[];
  selectedAspectIds: string[];
}

/** État du fichier texte/code de référence — même structure qu'ImageReference */
export type TextReference = ImageReference;

export interface GeneratedPrompt {
  en: string;
  fr: string;
}

export type GeneratorStep = "category" | "tool" | "description" | "adaptive" | "result";

export interface GeneratorState {
  category: Category | null;
  tool: AITool | null;
  description: string;
  directQuestions: DirectQuestion[];
  directAnswers: Record<string, string>;
  categories: PrecisionCategory[];
  answeredCategories: string[];
  adaptiveAnswers: Record<string, string>;
  previousQA: PreviousQAItem[];
  isRefinement: boolean;
  imageReference: ImageReference | null;
  textReference: TextReference | null;
  generatedPrompt: GeneratedPrompt | null;
  step: GeneratorStep;
  isLoading: boolean;
  error: string | null;
  refinementCount: number;
  usageContext: string;
}

export interface ToolMeta {
  id: AITool;
  name: string;
  description: string;
  badge?: string;
  promptContext: string;
}

export interface CategoryMeta {
  id: Category;
  label: string;
  icon: string;
  description: string;
  tools: ToolMeta[];
  comingSoon?: boolean;
}

export type PricingPlan = "free" | "pro" | "unlimited" | "promax";

export interface PricingInfo {
  plan: PricingPlan;
  monthlyLimit: number | null;
  price: number;
  currency: string;
  features: string[];
  usesSonnet?: boolean;
}

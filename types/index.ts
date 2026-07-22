export type Category = "image" | "video" | "text" | "music";

export type ImageTool =
  | "midjourney"
  | "dalle3"
  | "firefly"
  | "imagen"
  | "stablediffusion"
  | "leonardoai"
  | "ideogram";

export type VideoTool = "sora" | "runway" | "pika" | "lumaai" | "klingai" | "veo" | "geminivideo";

export type TextTool = "claude" | "gpt4" | "gemini" | "llama" | "mistral" | "deepseek";

export type MusicTool = "suno" | "udio" | "stableaudio" | "aiva";

export type AITool = ImageTool | VideoTool | TextTool | MusicTool;

/** Question affichée directement au chargement de l'écran Précisions */
export interface DirectQuestion {
  id: string;
  label: string;
  suggestions: string[];
  theme?: string;
}

/** Q&A d'un tour précédent, réaffiché modifiable lors d'un "Renforcer" */
export interface PreviousQAItem {
  id: string;
  label: string;
  value: string;
  type: "direct";
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
  /**
   * id de la ligne prompts_history correspondante — ajouté 22/07/2026 pour
   * pouvoir reconnecter le tracking "was_copied" (mort dans le code depuis
   * un refactor précédent : la colonne existe en base mais rien ne l'écrivait
   * plus). Optionnel pour rester compatible avec tout appelant qui ne le
   * fournit pas encore (parcours bibliothèque, non touché par ce correctif).
   */
  historyId?: string;
}

export type GeneratorStep =
  | "category"
  | "usecase"
  | "tool"
  | "description"
  | "adaptive"
  | "result"
  /** Ambiance refining round, seeded from a library page prompt. */
  | "ambiance"
  /** Subject entry — the ambiance is locked from here on. */
  | "subject"
  /** Subject questions; may never reopen an ambiance choice. */
  | "subject-questions"
  /** Shown when a delivery is blocked at 0 credits. */
  | "paywall";

/** Which of the three library-page entry points the user took. */
export type AmbianceFlow =
  /** Refine the ambiance only. Stops at the refined ambiance (free layer). */
  | "refine-ambiance"
  /** Skip refining, go straight to the subject with the ambiance as-is. */
  | "keep-ambiance"
  /** Refine the ambiance, then continue to the subject. */
  | "refine-and-subject";

/**
 * The ambiance layer — free and reusable. Once `locked` is true the subject
 * step may read it but must never reopen its choices.
 */
export interface AmbianceLayer {
  /** The ambiance prompt text: the library page's, or its refined version. */
  prompt: string;
  /** Set when the flow enters the subject step. */
  locked: boolean;
  /** The library page this ambiance came from, for attribution/analytics. */
  sourcePageSlug?: string;
}

/**
 * Music is the one category the target tool already splits in two, so its
 * output keeps two fields instead of one merged prompt.
 */
export interface MusicLayeredOutput {
  kind: "music";
  /** Suno STYLE field — the locked ambiance. */
  style: string;
  /** Suno LYRICS field — tagged structure + lyrics (the subject layer). */
  lyrics: string;
}

/** image / video / text: ambiance and subject merge into a single prompt. */
export interface MergedLayeredOutput {
  kind: "merged";
  en: string;
  fr: string;
}

export type LayeredOutput = MusicLayeredOutput | MergedLayeredOutput;

/** Handoff payload written by a library page and read by the generator. */
export interface LibraryHandoff {
  category: Category;
  tool: AITool;
  ambiancePrompt: string;
  flow: AmbianceFlow;
  pageSlug: string;
  pageTitle: string;
}

/** Cas d'usage concret dans une catégorie (ex: "Fond d'écran" pour Image).
 *  Le libellé reste grand public ; c'est questionGuidance qui apporte la
 *  précision en pilotant les questions posées par le moteur. */
export interface UseCaseMeta {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  /** Injecté dans le moteur de questions pour forcer les questions
   *  indispensables à ce type (ex: fond d'écran → appareil/format). */
  questionGuidance: string;
  /** Injecté dans la génération finale pour façonner le prompt. */
  promptGuidance?: string;
}

export interface GeneratorState {
  category: Category | null;
  useCase: string | null;
  tool: AITool | null;
  description: string;
  directQuestions: DirectQuestion[];
  directAnswers: Record<string, string>;
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
  /** Set only when the run was seeded from a library page. */
  ambiance: AmbianceLayer | null;
  ambianceFlow: AmbianceFlow | null;
  /** The user's subject ("what do you want to talk about"). */
  subject: string;
  /** Two-field music output, or the merged prompt for other categories. */
  layeredOutput: LayeredOutput | null;
}

export type ToolCapability = "image" | "video" | "text" | "music";

export interface ToolMeta {
  id: AITool;
  name: string;
  description: string;
  badge?: string;
  promptContext: string;
  capabilities?: ToolCapability[];
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

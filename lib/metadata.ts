import type { CategoryMeta } from "@/types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "image",
    label: "Image",
    icon: "🖼️",
    description: "Générez des prompts pour créer des images époustouflantes",
    tools: [
      {
        id: "midjourney",
        name: "Midjourney",
        description: "Le standard artistique — style cinématique et créativité",
        badge: "Populaire",
        capabilities: ["image"],
        promptContext:
          "Midjourney v6. Éléments clés : sujet principal, style artistique, ambiance/mood, éclairage, palette de couleurs, ratio (--ar), version (--v 6.1), qualité (--q 2). Les paramètres Midjourney vont à la fin après '--'. Le prompt suit la structure : [sujet], [style], [ambiance], [éclairage], [détails techniques], --paramètres",
      },
      {
        id: "dalle3",
        name: "DALL-E 3",
        description: "Précision et rendu de texte — OpenAI",
        capabilities: ["image"],
        promptContext:
          "DALL-E 3. Éléments clés : description de scène complète et naturelle, style visuel, ambiance, composition, éclairage. Préfère les phrases complètes plutôt que des listes de mots-clés. Très bon pour le rendu de texte dans l'image.",
      },
      {
        id: "firefly",
        name: "Adobe Firefly",
        description: "Design commercial copyright-free — Adobe",
        capabilities: ["image"],
        promptContext:
          "Adobe Firefly. Éléments clés : description du sujet, style de rendu (Photo/Art/Graphic), ton colorimétrique (Warm/Cool/Pastel/Vibrant), type de contenu (Scene/Portrait/Abstract/Product), éclairage. Optimisé pour usage commercial.",
      },
      {
        id: "imagen",
        name: "Gemini / Imagen",
        description: "Génération ultra-réaliste — Google",
        capabilities: ["image"],
        promptContext:
          "Google Imagen / Gemini. Éléments clés : description photoréaliste détaillée, composition de scène, qualité d'éclairage, perspective caméra (angle, distance), ambiance, détails atmosphériques.",
      },
      {
        id: "stablediffusion",
        name: "Stable Diffusion",
        description: "Open-source, ultra-personnalisable",
        capabilities: ["image"],
        promptContext:
          "Stable Diffusion. Éléments clés : description détaillée du sujet, style artistique, références d'artistes, tags de qualité (masterpiece, best quality, 8k, ultra-detailed), éclairage, palette de couleurs. Peut inclure des éléments pour le negative prompt.",
      },
      {
        id: "leonardoai",
        name: "Leonardo AI",
        description: "Maîtrise fine du style et des personnages",
        capabilities: ["image", "video"],
        promptContext:
          "Leonardo AI. Éléments clés : sujet avec détails de personnage si applicable, style artistique précis, descripteurs de qualité (hyperdetailed, cinematic, photorealistic), éclairage, color grading, composition.",
      },
      {
        id: "ideogram",
        name: "Ideogram",
        description: "Excellence pour le texte dans les images",
        capabilities: ["image"],
        promptContext:
          "Ideogram. Éléments clés : concept visuel, éléments textuels à inclure si besoin (entre guillemets), style de design (poster/logo/illustration/photo), palette de couleurs, type de composition, ambiance.",
      },
    ],
  },
  {
    id: "video",
    label: "Vidéo",
    icon: "🎬",
    description: "Créez des prompts pour générer des vidéos IA",
    tools: [
      {
        id: "sora",
        name: "Sora",
        description: "Vidéos cinématiques longues — OpenAI",
        capabilities: ["video", "image"],
        promptContext:
          "Sora. Éléments clés : description de scène, mouvement de caméra (zoom/tracking/pan/tilt), séquence d'action, durée approximative, éclairage, style cinématique.",
      },
      {
        id: "runway",
        name: "Runway Gen-3",
        description: "Effets visuels et transitions créatives",
        capabilities: ["video", "image"],
        promptContext:
          "Runway Gen-3. Éléments clés : description de la scène/sujet, mouvement de caméra, vitesse du mouvement, style visuel, color grade, durée.",
      },
      {
        id: "pika",
        name: "Pika",
        description: "Animations et motion design",
        capabilities: ["video"],
        promptContext:
          "Pika. Éléments clés : scène, description du mouvement, mouvement de caméra, style, qualité cinématique.",
      },
      {
        id: "lumaai",
        name: "Luma Dream Machine",
        description: "Vidéos réalistes avec physique précise",
        capabilities: ["video", "image"],
        promptContext:
          "Luma Dream Machine. Éléments clés : description de scène détaillée, mouvement de caméra, éclairage, ambiance, style visuel.",
      },
      {
        id: "klingai",
        name: "Kling AI",
        description: "Expressions naturelles et mouvements fluides",
        capabilities: ["video", "image"],
        promptContext:
          "Kling AI. Éléments clés : sujet, action/mouvement, perspective caméra, environnement de scène, style visuel.",
      },
      {
        id: "veo",
        name: "Veo",
        description: "Vidéos haute fidélité — Google DeepMind",
        capabilities: ["video"],
        promptContext:
          "Google Veo. Éléments clés : description de scène, travail de caméra, mouvement, style visuel, ambiance.",
      },
      {
        id: "geminivideo",
        name: "Gemini",
        description: "Génération vidéo intégrée à l'écosystème Google",
        capabilities: ["video", "image"],
        promptContext:
          "Google Gemini (vidéo). Éléments clés : description de scène, mouvement de caméra, style visuel, ambiance, éclairage.",
      },
    ],
  },
  {
    id: "text",
    label: "Texte / Code",
    icon: "✍️",
    description: "Optimisez vos prompts pour les LLMs",
    tools: [
      {
        id: "claude",
        name: "Claude",
        description: "Raisonnement avancé et nuance — Anthropic",
        capabilities: ["text"],
        promptContext:
          "Claude (Anthropic). Éléments clés : description claire de la tâche, contexte, rôle/persona à adopter, format de sortie souhaité, contraintes, exemples si utile. Structure claire et hiérarchique.",
      },
      {
        id: "gpt4",
        name: "GPT-4 / GPT-4o",
        description: "Modèle polyvalent leader — OpenAI",
        capabilities: ["text", "image"],
        promptContext:
          "GPT-4/GPT-4o. Éléments clés : tâche précise, contexte, rôle, instructions étape par étape si complexe, format de sortie.",
      },
      {
        id: "gemini",
        name: "Gemini",
        description: "IA multimodale — Google",
        capabilities: ["text", "image"],
        promptContext:
          "Google Gemini. Éléments clés : description de tâche, contexte, exigences de format, contraintes spécifiques.",
      },
      {
        id: "llama",
        name: "Llama",
        description: "Open-source, auto-hébergeable — Meta",
        capabilities: ["text"],
        promptContext:
          "Llama. Éléments clés : instruction claire, contexte, définition du rôle système, format de sortie.",
      },
      {
        id: "mistral",
        name: "Mistral",
        description: "Efficace et multilingue — Mistral AI",
        capabilities: ["text"],
        promptContext:
          "Mistral. Éléments clés : tâche claire, contexte, format, persona si pertinent.",
      },
      {
        id: "deepseek",
        name: "DeepSeek",
        description: "Excellence en code et raisonnement — DeepSeek",
        capabilities: ["text"],
        promptContext:
          "DeepSeek. Éléments clés : description précise de la tâche, contexte, étapes de raisonnement pour tâches complexes, format de sortie.",
      },
    ],
  },
  {
    id: "music",
    label: "Musique",
    icon: "🎵",
    description: "Composez des prompts pour générer de la musique",
    tools: [
      {
        id: "suno",
        name: "Suno",
        description: "Chansons complètes avec paroles — Suno AI",
        capabilities: ["music"],
        promptContext:
          "Suno. Éléments clés : genre/style musical, ambiance/ressenti, tempo (BPM ou feeling), instruments principaux, style vocal, thème des paroles, décennie/influence.",
      },
      {
        id: "udio",
        name: "Udio",
        description: "Production musicale professionnelle — Udio",
        capabilities: ["music"],
        promptContext:
          "Udio. Éléments clés : genre musical, sous-genre, ambiance, tempo, instruments, type de voix, descripteurs de qualité de production.",
      },
      {
        id: "stableaudio",
        name: "Stable Audio",
        description: "Sons et musiques haute fidélité — Stability AI",
        capabilities: ["music"],
        promptContext:
          "Stable Audio. Éléments clés : genre, instruments, ambiance, tempo, style de production, durée approximative.",
      },
      {
        id: "aiva",
        name: "AIVA",
        description: "Composition orchestrale — AIVA Technologies",
        capabilities: ["music"],
        promptContext:
          "AIVA. Éléments clés : style de composition, instruments/ensemble, émotion/mood, tempo, signature rythmique, références de compositeurs/influences.",
      },
    ],
  },
];

export function getCategoryById(id: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getToolById(
  categoryId: string,
  toolId: string
): CategoryMeta["tools"][number] | undefined {
  const cat = getCategoryById(categoryId);
  return cat?.tools.find((t) => t.id === toolId);
}

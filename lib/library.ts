// Library pages — the entry point into the ambiance/subject flow.
//
// SCOPE NOTE: the real library (its routes, its curated catalogue, its SEO
// content) is not built yet. These seed pages exist so the three flows can be
// exercised end to end. The generator reads a library page only through
// LibraryPage below, so swapping this hardcoded list for the real catalogue
// (DB, CMS, MDX…) does not touch the engine.
//
// Every prompt here is AMBIANCE ONLY — the free, reusable layer. Notably, the
// music entries carry style and never lyrics: all lyric writing happens behind
// the buttons, in the generator.
import type { AITool, Category } from "@/types";

export interface LibraryPage {
  slug: string;
  title: string;
  /** One line under the title. Describes the result, never the technique. */
  tagline: string;
  category: Category;
  /** The tool the ambiance is written for. */
  tool: AITool;
  /** The ambiance prompt injected into the refining engine as its seed. */
  ambiancePrompt: string;
  /**
   * Placeholder microcopy shown next to the subject buttons. Wording is not
   * final and must never mention a price.
   */
  fomoMicrocopy?: string;
}

export const LIBRARY_PAGES: LibraryPage[] = [
  {
    slug: "boom-bap-east-coast-90s",
    title: "Boom bap East Coast 90s",
    tagline: "Le grain d'un vinyle poussiéreux et une batterie qui claque.",
    category: "music",
    tool: "suno",
    ambiancePrompt: `[Genre & era] 90s East Coast boom bap, golden era New York
[Instrumental] dusty vinyl-sampled piano loop, warm upright bass, crisp snare, subtle vinyl crackle
[Voice & flow] male rap vocal, laid-back conversational flow, slightly behind the beat
[Mix] analog SP-1200 grit, tape saturation, mono-leaning drums, no modern loudness
[Tempo & mood] 90 BPM, nocturnal, reflective, understated confidence`,
    fomoMicrocopy: "Ce style est à vous — il ne reste qu'à lui donner un propos.",
  },
  {
    slug: "neon-noir-cyberpunk",
    title: "Néon noir cyberpunk",
    tagline: "Une ruelle trempée de pluie sous une enseigne qui grésille.",
    category: "image",
    tool: "midjourney",
    ambiancePrompt: `[Style] cinematic neo-noir photography, anamorphic lens, shot on 35mm
[Light] magenta and cyan neon signage, harsh rim light, deep unlit shadows
[Atmosphere] rain-slicked asphalt, volumetric haze, steam rising from vents
[Texture] fine film grain, subtle chromatic aberration, slight lens flare
[Palette] saturated magenta, electric cyan, cold desaturated blacks`,
    fomoMicrocopy: "L'ambiance est posée — il ne manque que ce qui l'habite.",
  },
  {
    slug: "cv-structure-ats",
    title: "Structure de CV lisible par les ATS",
    tagline: "Une trame claire qui passe les filtres automatiques.",
    category: "text",
    tool: "claude",
    ambiancePrompt: `[Format] CV une page, sections nettes, pas de colonnes ni de tableaux
[Sections] Titre & accroche / Expériences / Compétences / Formation / Divers
[Style d'écriture] verbes d'action à l'initiale, une ligne par réalisation, chiffrée quand c'est possible
[Ton] factuel, sobre, sans superlatif ni jargon creux
[Contraintes] pas d'image, pas d'icône, dates au format MM/AAAA, ordre antéchronologique`,
    fomoMicrocopy: "La trame est prête — reste à la remplir avec votre parcours.",
  },
  {
    slug: "plan-sequence-contemplatif",
    title: "Plan-séquence contemplatif",
    tagline: "Une caméra qui prend son temps, à l'heure dorée.",
    category: "video",
    tool: "sora",
    ambiancePrompt: `[Scene style] slow contemplative cinematography, wide establishing framing
[Camera] single unbroken dolly move, eye level, gentle parallax
[Light] golden hour backlight, long shadows, warm haze in the air
[Grade] soft filmic contrast, lifted blacks, muted warm palette
[Pace] no cuts, unhurried, ambient room tone`,
    fomoMicrocopy: "Le décor tourne — il ne manque plus que l'action.",
  },
];

export function getLibraryPage(slug: string): LibraryPage | undefined {
  return LIBRARY_PAGES.find((p) => p.slug === slug);
}

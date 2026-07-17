// The library catalogue — the entry point into the ambiance/subject flow and
// the SEO surface of the site.
//
// Pages are static: this typed module is the single source of content, read at
// build time by `generateStaticParams`. Adding a page = adding an entry here.
// No database, no CMS — these pages must be indexable HTML with no latency.
//
// Every prompt here is AMBIANCE ONLY — the free, reusable layer. Notably, the
// music entries carry style and never lyrics: all lyric writing happens behind
// the buttons, in the generator.
import type { AITool, AmbianceFlow, Category } from "@/types";

/** A rendered example of what the ambiance produces. Null until generated. */
export interface RenderAsset {
  kind: "audio" | "image" | "video";
  /** Path under /public, e.g. "/library/renders/boom-bap.mp3". */
  src: string;
  /** Required for image renders; ignored for audio/video. */
  alt?: string;
}

/**
 * One of the three entry buttons. `label` is page-specific copy; `flow` binds
 * it to one of the three canonical flows the generator already implements.
 * No page may invent a fourth flow.
 */
export interface LibraryButton {
  label: string;
  flow: AmbianceFlow;
}

export interface LibraryPage {
  slug: string;
  title: string;
  /** One line under the title. Describes the result, never the technique. */
  tagline: string;
  category: Category;
  /** The tool the ambiance is written for. */
  tool: AITool;
  /** <title> for this page. */
  seoTitle: string;
  /** <meta name="description">. */
  seoDescription: string;
  /** Queries this page is written to answer. Not rendered — reference only. */
  targetKeywords: string[];
  /** The ambiance prompt: free to copy, and the seed for the refining engine. */
  ambiancePrompt: string;
  /** The three entry points. Order is the display order. */
  buttons: LibraryButton[];
  /**
   * One line of microcopy beside the subject buttons. Placeholder wording for
   * now — final copy comes later, and it must never mention a price.
   */
  fomoMicrocopy?: string;
  /** Null while the render has not been produced. The page must not break. */
  renderAsset: RenderAsset | null;
}

export const LIBRARY_PAGES: LibraryPage[] = [
  // ---------------------------------------------------------------- music
  {
    slug: "prompt-suno-rap-francais-boom-bap",
    title: "Rap français boom bap",
    tagline: "Le grain d'un vinyle poussiéreux et une batterie qui claque.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno rap français boom bap — le style prêt à copier",
    seoDescription:
      "Un prompt Suno complet pour un rap français boom bap 90s : instrumental, batterie, voix, mix et tempo. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno rap", "suno prompt français"],
    ambiancePrompt: `[Genre & era]
French boom bap rap, golden-era 90s East Coast influence, modern clean
production, underground but polished

[Instrumental]
Dusty jazz piano loop sampled feel, warm upright double bass, mellow
Rhodes chords in the background, subtle vinyl crackle and tape hiss,
soulful muted trumpet stabs on accents

[Drums]
Hard-hitting boom bap drum break, punchy compressed kick, sharp cracking
snare with slight reverb tail, tight hi-hats, occasional lo-fi swing

[Voice & flow]
Male voice, deep warm timbre, laid-back confident flow, clear French
diction, slightly gritty texture, conversational delivery sitting just
behind the beat

[Mix & mood]
Warm analog mix, wide stereo image, nostalgic and introspective mood,
head-nodding groove, vinyl-sampled aesthetic, sidechained bass for
breathing room

[Tempo & key]
88 BPM, minor key, swing feel`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Garder ce style + écrire mes paroles", flow: "keep-ambiance" },
      { label: "Affiner le style + écrire mes paroles", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style, c'est la partie facile. Des paroles qui riment juste et racontent ton histoire, c'est un métier.",
    renderAsset: null,
  },
  {
    slug: "prompt-suno-pop-francaise",
    title: "Pop française moderne",
    tagline: "Une prod radio léchée, entre nostalgie et refrain solaire.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno pop française moderne — style radio prêt à copier",
    seoDescription:
      "Un prompt Suno pour une pop française moderne prête pour la radio : synthés, beat, voix féminine, mix large. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno pop", "prompt musique ia"],
    ambiancePrompt: `[Genre & era]
Modern French pop, 2020s radio production, polished and emotional,
mainstream but tasteful

[Instrumental]
Bright plucked synth arpeggios, warm analog pads, deep round sub-bass,
live-feel finger-snap percussion, airy piano layer in the chorus,
subtle vocal chops as texture

[Drums]
Punchy programmed beat, tight kick, crisp layered claps on the snare,
soft hi-hat rolls building into the drop, four-on-the-floor energy
in the chorus

[Voice & flow]
Clear female lead vocal, intimate in the verses, soaring and doubled
in the chorus, natural French diction, emotional but controlled,
light reverb tail

[Mix & mood]
Wide bright stereo mix, radio-ready loudness, nostalgic yet uplifting
mood, summer-evening feel, dynamic build between verse and chorus

[Tempo & key]
112 BPM, major key, straight feel`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Garder ce style + écrire mes paroles", flow: "keep-ambiance" },
      { label: "Affiner le style + écrire mes paroles", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Un refrain qu'on retient, ça ne s'improvise pas. On l'écrit avec toi.",
    renderAsset: null,
  },
  {
    slug: "prompt-suno-lofi-chill",
    title: "Lo-fi chill instrumental",
    tagline: "Un piano feutré, la pluie dehors, et rien à prouver.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno lo-fi chill — style instrumental à copier",
    seoDescription:
      "Un prompt Suno lo-fi chill instrumental : piano jazzy, vinyle, batterie molle, ambiance café pluvieux. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno lofi", "prompt suno ai"],
    ambiancePrompt: `[Genre & era]
Lo-fi hip-hop, chillhop, cozy bedroom-producer aesthetic, instrumental,
study-and-relax vibe

[Instrumental]
Mellow jazzy electric piano chords, warm mono bass, soft muted guitar
licks, dusty vinyl crackle throughout, distant rain and café ambience,
gentle tape wobble and flutter

[Drums]
Laid-back lo-fi drum loop, soft rounded kick, brushed snare, loose
swung hi-hats, unquantized human feel, low velocity

[Mix & mood]
Warm low-passed mix, rolled-off highs, intimate and calming, slightly
melancholic, no vocals, endless-loop feel

[Tempo & key]
72 BPM, major 7th chords, relaxed swing`,
    buttons: [
      // Two buttons, not three. This ambiance is instrumental and ends on "no
      // vocals", and music's subject layer is the Suno LYRICS field by
      // construction — so a keep-ambiance entry here would freeze an
      // instrumental style and then write lyrics over it. The brief's third
      // button ("Décliner ce style") was dropped rather than mapped: declining
      // a style means changing the STYLE field, which is what refining already
      // does, so it would have duplicated the button above.
      { label: "Affiner le style", flow: "refine-ambiance" },
      // A vocal layer is a subject over the style. It goes through a refining
      // round first because that is the step where the user lifts "no vocals"
      // before any lyrics are written.
      { label: "Ajouter une voix", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Envie d'une version unique, calée sur ton ambiance exacte ? On l'affine avec toi.",
    renderAsset: null,
  },
  {
    slug: "prompt-suno-generique-youtube",
    title: "Générique d'intro YouTube",
    tagline: "Dix secondes pour qu'on reconnaisse ta chaîne.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno intro YouTube — jingle de générique à copier",
    seoDescription:
      "Un prompt Suno pour un jingle d'intro YouTube court et percutant : synthés, riser, impact, master moderne. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno intro", "jingle youtube ia"],
    ambiancePrompt: `[Genre & era]
Short branding intro jingle, modern and energetic, made to be memorable
in under 10 seconds

[Instrumental]
Bright punchy synth stabs, rising riser sweep into the hit, deep impact
sub on the landing, quick arpeggiated hook, tight percussive layer

[Drums]
Big impactful kick on the drop, snappy clap, fast hi-hat build-up,
one climactic hit to close

[Mix & mood]
Loud, bright, high-energy, hype and confident, clean modern master,
punchy transient design

[Tempo & key]
128 BPM, major key, 8-second loop feel`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Créer mon jingle (avec mon nom de chaîne)", flow: "keep-ambiance" },
      { label: "Affiner + créer mon jingle", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Une intro qui dit VRAIMENT ton nom et ton univers, on la construit avec toi.",
    renderAsset: null,
  },

  // ---------------------------------------------------------------- image
  {
    slug: "prompt-image-cyberpunk-cinematique",
    title: "Ambiance cyberpunk cinématique",
    tagline: "Une ruelle trempée de pluie sous une enseigne qui grésille.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt image cyberpunk cinématique — ambiance prête à copier",
    seoDescription:
      "Un prompt d'ambiance cyberpunk cinématique : néons magenta et cyan, asphalte mouillé, grain 35mm. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt midjourney cyberpunk", "prompt ia image"],
    ambiancePrompt: `[Scene & universe]
Rain-soaked cyberpunk back-alley at night, dense futuristic megacity,
towering neon signage, steam rising from street vents, wet reflective
asphalt

[Lighting]
Moody low-key lighting, magenta and cyan neon glow as key light, deep
teal shadows, volumetric haze catching the light, subtle rim light from
a distant streetlamp, high contrast

[Color & grade]
Cinematic teal-and-magenta color grade, crushed blacks, saturated neon
highlights, slight bloom on light sources

[Composition & lens]
Wide cinematic framing, low camera angle, shallow depth of field, 35mm
anamorphic look, subtle lens flare, foreground bokeh from rain droplets

[Texture & render]
Photoreal, fine film grain, 35mm analog texture, ultra-detailed, 8K
render, atmospheric depth`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton personnage, ta pose, ta lumière — pour un rendu parfait, il faut la précision qu'on t'apporte.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-portrait-cinematique",
    title: "Portrait éditorial cinématique",
    tagline: "Une lumière de fenêtre, un regard, rien d'autre.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt image portrait cinématique — style éditorial à copier",
    seoDescription:
      "Un prompt d'ambiance pour un portrait éditorial cinématique : lumière douce directionnelle, étalonnage filmique, rendu 85mm. À copier sans inscription.",
    targetKeywords: ["prompt midjourney portrait", "prompt chatgpt image portrait"],
    ambiancePrompt: `[Scene & mood]
Intimate editorial portrait, moody and cinematic, quiet emotional
atmosphere, storytelling single-subject framing

[Lighting]
Soft directional key light from a large window, gentle falloff into
shadow, subtle warm rim light separating subject from background,
Rembrandt-style triangle on the cheek

[Color & grade]
Muted filmic color grade, desaturated earth tones, soft teal shadows,
warm skin retention, low-contrast highlights

[Composition & lens]
85mm portrait lens look, shallow depth of field, creamy background bokeh,
tight framing on face and shoulders, eye-level angle, rule-of-thirds

[Texture & render]
Photoreal skin texture, natural imperfections kept, fine grain, medium-
format clarity, editorial magazine finish`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Créer mon portrait (mon sujet)", flow: "keep-ambiance" },
      { label: "Affiner + créer mon portrait", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Qui est cette personne, comment elle pose, ce qu'elle porte — c'est là que se joue la ressemblance. On la précise avec toi.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photo-produit-ecommerce",
    title: "Photo produit e-commerce",
    tagline: "Un studio net, une lumière douce, un produit qui se vend.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt image photo produit — style e-commerce à copier",
    seoDescription:
      "Un prompt d'ambiance pour une photo produit e-commerce : studio minimaliste, softbox, fond continu, rendu catalogue 8K. À copier sans inscription.",
    targetKeywords: ["prompt image produit", "prompt midjourney produit"],
    ambiancePrompt: `[Scene & setup]
Clean professional product photography, minimalist studio setup, single
hero product on a smooth surface, premium commercial look

[Lighting]
Soft large softbox key light, gentle gradient falloff, subtle reflection
under the product, controlled specular highlights, no harsh shadows,
bright even fill

[Color & grade]
Neutral clean white balance, true-to-life colors, high dynamic range,
crisp whites, gentle contrast

[Composition & lens]
Eye-level three-quarter angle, 100mm macro clarity, product centered
with breathing room, seamless background, sharp focus edge to edge

[Texture & render]
Ultra-sharp, high detail on material and texture, photoreal, catalog-
ready, 8K commercial finish`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon produit dans ce décor", flow: "keep-ambiance" },
      { label: "Affiner + placer mon produit", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton produit exact, sa matière, ses reflets — le rendu vendeur demande de la précision. On la construit avec toi.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-illustration-enfant-2d",
    title: "Illustration enfant / animation 2D",
    tagline: "Des formes rondes, des pastels, un livre d'images.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt image illustration enfantine — style 2D à copier",
    seoDescription:
      "Un prompt d'ambiance pour une illustration enfantine 2D : contours ronds, palette pastel, rendu vectoriel livre d'images. À copier sans inscription.",
    targetKeywords: ["prompt illustration enfant", "prompt animation ia"],
    ambiancePrompt: `[Style & universe]
Cute 2D children's illustration, soft cartoon style, warm and friendly,
storybook aesthetic, wholesome and playful

[Line & shape]
Clean rounded outlines, simple bold shapes, big expressive eyes, gentle
character proportions, no sharp edges

[Color & lighting]
Soft pastel color palette, warm flat lighting, gentle ambient shadows,
cozy and bright, harmonious complementary colors

[Composition]
Centered friendly subject, simple uncluttered background, plenty of
negative space, balanced and readable at small sizes

[Texture & render]
Smooth flat vector-like render, subtle paper texture, clean edges,
picture-book finish, crisp and colorful`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Créer mon personnage", flow: "keep-ambiance" },
      { label: "Affiner + créer mon personnage", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton personnage, son histoire, ses expressions — pour qu'il soit vraiment le tien, on le dessine avec toi.",
    renderAsset: null,
  },

  // ---------------------------------------------------------------- text
  {
    slug: "prompt-post-linkedin-engagement",
    title: "Post LinkedIn à fort engagement",
    tagline: "Une accroche, cinq paragraphes aérés, une question qui fait réagir.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt post LinkedIn engageant — structure prête à copier",
    seoDescription:
      "Un prompt complet pour un post LinkedIn à fort engagement : accroche, progression narrative, chute, question finale. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt chatgpt linkedin", "prompt post linkedin"],
    ambiancePrompt: `[Rôle]
Tu es un ghostwriter LinkedIn spécialisé dans les posts à fort engagement
organique pour des profils professionnels.

[Objectif]
Rédiger un post LinkedIn qui capte l'attention dès la première ligne,
retient jusqu'au bout, et déclenche commentaires et partages.

[Structure imposée]
1. Une accroche d'une seule ligne, percutante, qui crée une tension ou
   une curiosité (le "hook").
2. Un saut de ligne, puis 3 à 5 courts paragraphes d'une à deux phrases
   maximum, très aérés.
3. Une progression narrative : problème → tournant → leçon.
4. Une chute mémorable qui reformule l'idée clé.
5. Une question ouverte finale pour inviter au commentaire.

[Ton & style]
Direct, humain, sans jargon corporate, phrases courtes, rythme qui pousse
à lire la ligne suivante. Pas d'emojis en rafale, 3 hashtags maximum en
fin de post.

[Contraintes]
250 mots maximum. Aucune formule creuse ("je suis ravi d'annoncer").
Chaque phrase doit apporter quelque chose.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon sujet", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton anecdote, ton secteur, ta voix — c'est ce qui fait la différence entre un post générique et un post qui cartonne.",
    renderAsset: null,
  },
  {
    slug: "prompt-chatgpt-cv-percutant",
    title: "CV percutant",
    tagline: "Une trame orientée résultats, lisible en six secondes.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT pour un CV percutant — structure à copier",
    seoDescription:
      "Un prompt complet pour un CV clair et orienté résultats, calibré pour les filtres ATS : accroche, expériences chiffrées, compétences. À copier sans inscription.",
    targetKeywords: ["prompt claude cv", "prompt chatgpt cv"],
    ambiancePrompt: `[Rôle]
Tu es un expert en recrutement et un rédacteur de CV qui maîtrise les
codes ATS (logiciels de tri automatique) et l'impact en 6 secondes de
lecture.

[Objectif]
Produire un CV clair, percutant, orienté résultats, qui passe les filtres
ATS et donne envie au recruteur d'appeler.

[Structure imposée]
1. Un titre professionnel + une accroche de 2 lignes (proposition de valeur).
2. Une section "expériences" en verbes d'action + résultats chiffrés
   (pas de descriptions de tâches).
3. Une section "compétences" avec mots-clés alignés sur l'offre visée.
4. Formation et certifications, concises.
5. Mise en forme sobre, lisible, une page si possible.

[Règles de rédaction]
Chaque ligne d'expérience suit le schéma : verbe d'action + mission +
résultat mesurable. Bannir "responsable de", "en charge de". Préférer
"a augmenté", "a réduit", "a lancé".

[Contraintes]
Ton professionnel, factuel, sans exagération. Adapter le vocabulaire au
secteur visé.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon profil et mon métier", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon profil", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton parcours, tes chiffres, le poste que tu vises — un CV qui décroche l'entretien se construit sur mesure.",
    renderAsset: null,
  },
  {
    slug: "prompt-lettre-de-motivation",
    title: "Lettre de motivation",
    tagline: "Courte, sincère, et impossible à recycler pour quelqu'un d'autre.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt lettre de motivation IA — structure prête à copier",
    seoDescription:
      "Un prompt complet pour une lettre de motivation moderne et sincère : accroche sur l'entreprise, preuves d'adéquation, appel à l'action. À copier sans inscription.",
    targetKeywords: ["prompt lettre de motivation", "prompt claude lettre"],
    ambiancePrompt: `[Rôle]
Tu es un conseiller en recrutement qui rédige des lettres de motivation
modernes, sincères et convaincantes, loin des formules toutes faites.

[Objectif]
Écrire une lettre courte qui montre l'adéquation entre le candidat et le
poste, avec un vrai angle personnel, sans clichés.

[Structure imposée]
1. Une accroche qui parle de l'ENTREPRISE et non du candidat (montrer
   qu'on la connaît).
2. Un paragraphe "pourquoi moi" : 2-3 preuves concrètes d'adéquation.
3. Un paragraphe "pourquoi vous" : ce qui attire précisément dans ce
   poste / cette boîte.
4. Une clôture avec appel à l'action clair (proposer un échange).

[Ton & style]
Sincère, direct, professionnel mais humain. Bannir "par la présente",
"je me permets de", "vive intérêt". Phrases vivantes.

[Contraintes]
300 mots maximum. Zéro formule creuse. Chaque phrase doit être
spécifique au poste, jamais interchangeable.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon poste et mon histoire", flow: "keep-ambiance" },
      { label: "Affiner + adapter", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Une lettre qui pourrait servir à n'importe qui ne sert à personne. La tienne, on l'écrit sur ton histoire réelle.",
    renderAsset: null,
  },
  {
    slug: "prompt-email-prospection-froid",
    title: "Email de prospection à froid",
    tagline: "Cent vingt mots, un seul appel à l'action, zéro jargon.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt email de prospection — structure cold email à copier",
    seoDescription:
      "Un prompt complet pour un cold email B2B à fort taux de réponse : objet, accroche personnalisée, preuve, CTA unique. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt email prospection", "prompt chatgpt cold email"],
    ambiancePrompt: `[Rôle]
Tu es un expert en cold emailing B2B qui écrit des emails de prospection
à fort taux de réponse, personnalisés et non intrusifs.

[Objectif]
Rédiger un email court qui obtient une réponse, sans donner l'impression
d'un envoi de masse.

[Structure imposée]
1. Un objet court et intrigant (pas de majuscules, pas de "!", pas de
   promo).
2. Une première ligne qui parle du DESTINATAIRE, pas de l'expéditeur
   (accroche personnalisée).
3. Un pont : le problème qu'on résout, en une phrase.
4. Une preuve rapide (résultat, référence) en une ligne.
5. Un seul appel à l'action, simple et à faible engagement (une question).

[Ton & style]
Conversationnel, direct, respectueux du temps du lecteur. Pas de jargon
commercial, pas de superlatifs. Comme un email écrit à la main.

[Contraintes]
120 mots maximum. Un seul CTA. Zéro pièce jointe mentionnée. Ton
d'égal à égal.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma cible et mon offre", flow: "keep-ambiance" },
      { label: "Affiner + adapter", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La personnalisation, c'est 80 % du taux de réponse. Ta cible, ton offre, ton angle — on les cale avec toi.",
    renderAsset: null,
  },

  // ---------------------------------------------------------------- video
  {
    slug: "prompt-video-cinematique-drone",
    title: "Vidéo cinématique drone / nature",
    tagline: "Un drone qui prend son temps, à l'heure dorée.",
    category: "video",
    tool: "sora",
    seoTitle: "Prompt vidéo cinématique drone — style à copier (Sora, Veo)",
    seoDescription:
      "Un prompt de style pour une vidéo aérienne cinématique : mouvement lent, heure dorée, étalonnage filmique, 4K anamorphique. À copier sans inscription.",
    targetKeywords: ["prompt sora", "prompt veo", "prompt video ai"],
    ambiancePrompt: `[Visual style]
Cinematic aerial drone footage, sweeping and smooth, epic nature
documentary look, sense of vast scale

[Cinematography]
Slow forward push combined with a gentle orbit, high altitude descending
to reveal, steady horizon, motion-blur on fast passes

[Lighting & time]
Golden hour, low warm sun, long shadows, soft god-rays through
atmospheric haze, gentle lens flare when facing the sun

[Color grade]
Warm cinematic grade, amber highlights, soft teal shadows, filmic
contrast, natural saturation

[Lens & finish]
Anamorphic 2.39:1 aspect ratio, shallow atmospheric depth, subtle film
grain, 24fps cinematic motion, ultra-sharp 4K`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Créer ma scène", flow: "keep-ambiance" },
      { label: "Affiner + créer ma scène", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style pose l'ambiance. Ton sujet, ton action, ton découpage de plans — on les construit avec toi.",
    renderAsset: null,
  },
  {
    slug: "prompt-video-produit-dynamique",
    title: "Vidéo produit dynamique",
    tagline: "Des travellings macro, des reflets nets, une pub qui claque.",
    category: "video",
    tool: "sora",
    seoTitle: "Prompt vidéo produit dynamique — style pub à copier",
    seoDescription:
      "Un prompt de style pour une vidéo produit publicitaire : travellings macro, orbite 360°, lumière studio, finition 4K haut de gamme. À copier sans inscription.",
    targetKeywords: ["prompt video produit", "prompt sora produit"],
    ambiancePrompt: `[Visual style]
Dynamic product commercial video, sleek and modern, high-end advertising
look, energetic and premium

[Cinematography]
Smooth macro dolly moves around the product, quick snappy push-ins,
360-degree orbit reveal, seamless speed ramps, floating hero shots

[Lighting]
Studio lighting with soft gradients, controlled highlights raking across
the surface, subtle rim light, clean reflections, dark premium backdrop

[Color grade]
Rich contrast, deep blacks, punchy saturated product colors, crisp
commercial finish

[Lens & finish]
Shallow depth of field, macro clarity, 4K ultra-sharp, 60fps smooth
slow-motion capability, glossy advertising polish`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Mettre mon produit en scène", flow: "keep-ambiance" },
      { label: "Affiner + mettre en scène", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton produit, ses angles, son argument — une vidéo qui vend se cale sur ton projet précis.",
    renderAsset: null,
  },
];

export function getLibraryPage(slug: string): LibraryPage | undefined {
  return LIBRARY_PAGES.find((p) => p.slug === slug);
}

/** The tools actually present in the catalogue, in catalogue order. */
export function getLibraryTools(): AITool[] {
  return Array.from(new Set(LIBRARY_PAGES.map((p) => p.tool)));
}

/** The categories actually present in the catalogue, in catalogue order. */
export function getLibraryCategories(): Category[] {
  return Array.from(new Set(LIBRARY_PAGES.map((p) => p.category)));
}

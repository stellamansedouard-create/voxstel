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
  {
    slug: "prompt-suno-drill-francais",
    title: "Drill français",
    tagline: "Une basse qui menace et un flow qui claque sec.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno drill français — le style prêt à copier",
    seoDescription:
      "Un prompt Suno complet pour un drill français sombre : 808 glissés, hi-hats triplets, piano menaçant, mix froid. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno drill", "prompt drill français"],
    ambiancePrompt: `[Genre & era]
French drill, UK drill influence adapted to French flow, dark and
aggressive modern trap-adjacent sound, 2020s underground

[Instrumental]
Sliding 808 bass with pitch glides, dark minor-key piano or string
stabs, sparse eerie melodic loop, cold atmospheric pads

[Drums]
Hard-hitting drill hi-hat rolls and triplets, syncopated open hi-hats,
punchy layered kick, sharp rimshot-style snare on the off-beat

[Voice & flow]
Male voice, tense and sharp delivery, aggressive short-phrase flow with
rapid-fire ad-libs, clear French diction, menacing undertone

[Mix & mood]
Dark cinematic mix, heavy low-end, cold reverb on vocals, tense and
confrontational mood, minimal but suffocating atmosphere

[Tempo & key]
140 BPM (half-time feel), minor key, drill swing`,
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
    slug: "prompt-suno-rnb-alternatif",
    title: "RnB alternatif",
    tagline: "Un RnB texturé, entre soul moderne et productions expérimentales.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno RnB alternatif — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un RnB alternatif texturé : Rhodes, sub-bass, batterie swinguée, voix en falsetto. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno rnb", "prompt suno r&b alternatif"],
    ambiancePrompt: `[Genre & era]
Alternative R&B rooted in the 2010s-2020s aesthetic (Frank Ocean, SZA, Kaytranada influence), blending neo-soul chord voicings with hazy, downtempo production. Avoids mainstream pop-R&B gloss and radio-friendly hooks.

[Instrumental]
Warm Rhodes electric piano and detuned synth pads under a sparse sub-bass line. Occasional jazzy guitar licks run through chorus and vibrato. Arrangement stays minimal and spacious, leaving room for vocal ad-libs.

[Drums]
Loose, swung drum programming with soft-hitting kicks, muted snares, and hi-hats that breathe rather than machine-gun. Occasional live-feel fills, no rigid grid quantization.

[Voice & flow]
Airy, falsetto-leaning lead vocal, intimate close-mic delivery. Layered harmonies and pitched-down ad-libs sit in the background. Phrasing is conversational, not over-melismatic.

[Mix & mood]
Vocals sit slightly buried in reverb, low end rounded and warm, no harsh top-end. Mood is introspective, late-night, emotionally vulnerable.

[Tempo & key]
70-85 BPM. Minor keys (D minor, F# minor) for melancholic undertone. Occasional half-time feel to emphasize groove over speed.`,
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
    slug: "prompt-suno-reggae-dancehall",
    title: "Reggae / dancehall",
    tagline: "Le riddim jamaïcain, du roots au dancehall moderne.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno reggae & dancehall — le style à copier",
    seoDescription:
      "Un prompt Suno pour un riddim jamaïcain, du one-drop roots au dancehall moderne : guitare skank, basse sub, voix patois. À copier sans inscription.",
    targetKeywords: ["prompt suno reggae", "prompt suno dancehall"],
    ambiancePrompt: `[Genre & era]
Jamaican riddim tradition spanning classic roots reggae (Marley-era one-drop) to contemporary dancehall (Vybz Kartel, Popcaan production style). Choose one lane per song rather than blending both eras.

[Instrumental]
Skanking rhythm guitar hitting the off-beat, deep sub-heavy bassline carrying the melody, and a Hammond organ bubble pattern filling the gaps. For dancehall variants, swap organic guitar for digital riddim synths and horn stabs.

[Drums]
One-drop drum pattern (kick and snare landing together on beat 3) for roots reggae, or a stepped digital riddim with syncopated snare rolls for dancehall. Hi-hats stay tight and dry.

[Voice & flow]
Roots reggae favors a soulful, melodic lead vocal with call-and-response backing singers. Dancehall favors a rhythmic, half-sung half-toasted delivery riding tight against the riddim, patois-inflected cadence.

[Mix & mood]
Bass and drums dominate the mix, vocals sit forward but not harsh. Roots reggae mood is warm and communal; dancehall mood is punchy, confident, party-ready.

[Tempo & key]
70-90 BPM for roots reggae, 90-110 BPM for dancehall. Major or Mixolydian keys for an uplifting, rolling feel.`,
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
    slug: "prompt-suno-afrobeat",
    title: "Afrobeat",
    tagline: "Percussions, cuivres et groove afro contemporain.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno afrobeat — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un afrobeats contemporain : log drum, percussions polyrythmiques, cuivres et voix mélodique. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno afrobeat", "prompt suno afrobeats"],
    ambiancePrompt: `[Genre & era]
Contemporary Afrobeats (Burna Boy, Wizkid, Rema production style), distinct from 1970s Fela Kuti Afrobeat — polyrhythmic, log-drum-driven, built for radio and dancefloors alike.

[Instrumental]
Layered polyrhythmic percussion (shakers, congas, talking drum) under a bouncy, syncopated log-drum bassline. Warm analog-style synth chords and occasional call-and-response horn stabs fill the top register.

[Drums]
Rolling log-drum pattern as the rhythmic backbone, paired with a shuffled hi-hat pattern and off-kilter kick placements that create the signature bounce. Percussion loops layer densely without cluttering the low end.

[Voice & flow]
Melodic, half-sung half-chanted lead vocal riding the pocket of the log drum, frequent call-and-response with backing vocals. Pidgin-inflected phrasing and ad-libs punctuate the groove.

[Mix & mood]
Percussion and log-drum bass sit forward and punchy, vocals warm and present. Mood is celebratory, sun-drenched, effortlessly danceable.

[Tempo & key]
100-112 BPM. Major keys with pentatonic melodic runs for an open, bright character.`,
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
    slug: "prompt-suno-rock",
    title: "Rock",
    tagline: "Guitares saturées, énergie brute, format rock intemporel.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno rock — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un rock à guitares saturées : riffs, batterie live, voix brute et variante stoner. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno rock", "prompt musique rock ia"],
    ambiancePrompt: `[Genre & era]
Guitar-driven rock spanning classic and alternative influences (70s riff-rock through 90s alt-rock), with an optional heavier, fuzzed-out stoner-rock edge for a darker, driving variant.

[Instrumental]
Distorted rhythm guitar carrying power chords, a second lead guitar layering melodic riffs or solos, and a driving bass doubling the rhythm guitar's root notes. For the stoner-rock variant, add heavy fuzz and a slower, riff-repeating structure.

[Drums]
Live-feel acoustic drum kit, punchy kick and snare, crash cymbals marking song sections. Fills are energetic and human, not quantized to a grid.

[Voice & flow]
Raw, chest-voice lead vocal with grit and edge, occasional shouted or gang-vocal backing on choruses. Phrasing direct and anthemic, built for singalong hooks.

[Mix & mood]
Guitars and drums fight for the same frequency space intentionally — a dense, loud, "wall of sound" mix. Mood ranges from rebellious and energetic to heavy and hypnotic in the stoner variant.

[Tempo & key]
110-140 BPM for standard rock, 70-90 BPM for the stoner-rock variant. Power chords in E or D minor/major for maximum drive.`,
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
    slug: "prompt-suno-metal",
    title: "Metal",
    tagline: "Riffs lourds, double pédale, énergie metal sans concession.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno metal — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un metal sans concession : riffs palm-muted, double pédale, chant puissant, variante nu-metal. À copier sans inscription.",
    targetKeywords: ["prompt suno metal", "prompt musique metal ia"],
    ambiancePrompt: `[Genre & era]
Heavy metal foundation (thrash/traditional metal riff structures) with an optional modern nu-metal variant layering groove-based riffs and hip-hop-influenced vocal cadence.

[Instrumental]
Heavily palm-muted, downtuned rhythm guitar driving tight, syncopated riffs; a second guitar for harmonized leads or solos. Bass doubles the riff an octave down for weight. Nu-metal variant adds a 7-string downtuned guitar and occasional turntable or synth texture.

[Drums]
Double-kick drum patterns under fast, tight rhythm guitar sections; crash-heavy accents on riff changes. Nu-metal variant favors a more groove-based, mid-tempo double kick with hip-hop-influenced snare placement.

[Voice & flow]
Traditional metal favors a powerful, sustained belting vocal or aggressive shouted delivery. Nu-metal variant alternates between melodic sung choruses and rhythmic, rap-adjacent verses.

[Mix & mood]
Guitars scooped in the mids for clarity against the drums, bass reinforcing low-end weight without muddying the riff. Mood is aggressive, intense, cathartic.

[Tempo & key]
130-180 BPM for traditional/thrash metal, 90-110 BPM for nu-metal groove sections. Drop D or drop C tunings for maximum heaviness.`,
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
    slug: "prompt-suno-house-edm-festival",
    title: "House",
    tagline: "Groove 4/4, basse ronde, énergie club et festival.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno house & EDM festival — le style à copier",
    seoDescription:
      "Un prompt Suno pour une house 4/4 de club et festival : basse filtrée, nappes analogiques, drops et breakdowns. À copier sans inscription.",
    targetKeywords: ["prompt suno house", "prompt suno edm"],
    ambiancePrompt: `[Genre & era]
Four-on-the-floor house music built for club and festival mainstage energy, drawing on deep house warmth and big-room EDM festival production for the drop sections.

[Instrumental]
Rolling, filtered bassline locked to the kick, warm analog-style chord stabs, and a plucked or arpeggiated synth lead carrying the main hook. Risers and white-noise sweeps build tension before drops.

[Drums]
Steady four-on-the-floor kick, offbeat open hi-hat, and a clapping snare on beats 2 and 4. Breakdown sections strip back to just kick and atmosphere before building back up.

[Voice & flow]
Optional processed, filtered vocal chops or a single soulful topline used sparingly as a hook rather than a full lead vocal. Vocoder or pitch-shifted textures common in festival-leaning versions.

[Mix & mood]
Sub-bass and kick occupy the low end tightly (sidechained together), mids stay open for the lead synth. Mood is euphoric, driving, built for peak-time energy.

[Tempo & key]
122-128 BPM. Minor keys with uplifting major-key breakdowns for the classic tension-and-release arc.`,
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
    slug: "prompt-suno-techno-minimal",
    title: "Techno minimal",
    tagline: "Groove hypnotique, minimalisme et transe électronique.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno techno minimale — le style à copier",
    seoDescription:
      "Un prompt Suno pour une techno minimale hypnotique : kick sec, percussions éparses, groove répétitif sans mélodie. À copier sans inscription.",
    targetKeywords: ["prompt suno techno", "prompt suno techno minimale"],
    ambiancePrompt: `[Genre & era]
Minimal techno in the Berlin/Detroit-influenced tradition — repetitive, hypnotic, built from small variations over long stretches rather than pop-song structure.

[Instrumental]
A single evolving synth or filtered noise texture as the main element, with sparse, dry percussion loops layered gradually. No chord progressions or melodic hooks — the groove itself is the hook.

[Drums]
Dry, tight four-on-the-floor kick with minimal reverb, subtle off-grid percussion accents (shakers, rimshots) introduced slowly across the track to create micro-variation.

[Voice & flow]
No lead vocal. If used at all, a single spoken or heavily processed vocal fragment looped as a rhythmic texture, never a sung melody.

[Mix & mood]
Mix stays dry and tight, low end controlled and precise, no wide stereo effects that would break the hypnotic focus. Mood is trance-inducing, clinical, immersive.

[Tempo & key]
125-135 BPM. Modal or key-ambiguous tonal center — harmonic movement is minimal by design.`,
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
    slug: "prompt-suno-trap-moderne",
    title: "Trap moderne",
    tagline: "808 saturés, hi-hats roulés, énergie trap actuelle.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno trap moderne — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour une trap actuelle : 808 saturés, hi-hats en triolets, mélodie sombre et flow ad-lib. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno trap", "prompt suno trap français"],
    ambiancePrompt: `[Genre & era]
Modern trap production (2020s mainstream trap/hip-hop), distinct from boom bap — built around 808 sub-bass melodies and rapid hi-hat programming rather than sampled drum breaks.

[Instrumental]
Dark, minor-key piano or bell melody as the main hook, layered over a booming, pitch-bent 808 sub-bass that doubles as the bassline's melodic core. Sparse, moody synth pads fill the background.

[Drums]
Rolling triplet hi-hat patterns with rapid rolls, a sharp, cracking snare on beat 3, and the 808 kick tuned to match the bassline's root notes. Hi-hat velocity varies to avoid a robotic feel.

[Voice & flow]
Rhythmic, ad-lib-heavy rap delivery riding tight against the hi-hat pattern, half-sung melodic hooks on the chorus. Auto-tune commonly used for melodic sections.

[Mix & mood]
808s dominate the low end, hi-hats sit crisp and forward, vocals compressed hard for radio-ready loudness. Mood is dark, confident, high-energy.

[Tempo & key]
130-150 BPM (often felt as half-time 65-75 BPM). Minor keys, frequently Phrygian-flavored for a dark, tense character.`,
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
    slug: "prompt-suno-chanson-francaise-classique",
    title: "Chanson française classique",
    tagline: "L'esprit poétique de la chanson française d'auteur.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno chanson française — le style à copier",
    seoDescription:
      "Un prompt Suno dans l'esprit de la chanson française d'auteur : piano, cordes, accordéon et voix narrative. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno chanson française", "prompt chanson française ia"],
    ambiancePrompt: `[Genre & era]
French chanson tradition in the spirit of the 1950s-70s auteur-compositeur era (Brel, Brassens, Piaf) — poetic, narrative-driven songwriting with acoustic, orchestral-adjacent arrangement, distinct from contemporary radio pop.

[Instrumental]
Acoustic guitar or piano carrying the harmonic foundation, with a string section (violin, cello) entering for emotional swells. Accordion accents optional for a period-authentic Parisian color.

[Drums]
Light, brushed drum kit or none at all — many songs in this tradition rely on guitar/piano rhythm alone, with drums entering only for dramatic build sections.

[Voice & flow]
Expressive, theatrical lead vocal prioritizing diction and storytelling over vocal acrobatics — every word must be intelligible. Dynamic phrasing follows the lyric's narrative arc, quiet verses building to impassioned choruses.

[Mix & mood]
Vocal sits front and center, unmasked by heavy processing, intimate and slightly dry. Mood is literary, nostalgic, emotionally weighty.

[Tempo & key]
60-90 BPM, often with tempo rubato (flexible, expressive timing). Minor keys with modal inflections for a melancholic, timeless character.`,
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
    slug: "prompt-suno-variete-francaise",
    title: "Variété française",
    tagline: "Pop française grand public, mélodies qui restent en tête.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno variété française — le style à copier",
    seoDescription:
      "Un prompt Suno pour une variété française grand public : guitare, piano, prod radio léchée et refrain mémorable. À copier sans inscription.",
    targetKeywords: ["prompt suno variété française", "prompt musique variété ia"],
    ambiancePrompt: `[Genre & era]
Contemporary mainstream French pop (2010s-2020s radio format, in the spirit of Vitaa, Amir, Vianney), built for broad appeal and immediate melodic hooks — distinct from the auteur-driven chanson tradition.

[Instrumental]
Polished acoustic or electric guitar strumming pattern, modern pop piano chords, and a light electronic layer (synth pads, subtle programmed elements) for contemporary radio sheen.

[Drums]
Clean, modern pop drum programming or hybrid acoustic-electronic kit, punchy kick and snappy snare, steady groove built for radio rotation rather than experimentation.

[Voice & flow]
Warm, accessible lead vocal with clear pop phrasing, catchy repeated hook lines in the chorus, light harmonies doubling the melody. Delivery is polished and radio-friendly, not raw.

[Mix & mood]
Bright, well-balanced mix optimized for streaming loudness, vocal forward and clear. Mood is uplifting, relatable, feel-good.

[Tempo & key]
95-115 BPM. Major keys with straightforward, singable melodic intervals.`,
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
    slug: "prompt-suno-jazz-lounge",
    title: "Jazz lounge",
    tagline: "Une ambiance jazz feutrée, élégante et sophistiquée.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno jazz lounge — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un jazz lounge feutré : contrebasse, accords étendus, trompette sourdine et balais. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno jazz", "prompt suno jazz lounge"],
    ambiancePrompt: `[Genre & era]
Smooth jazz lounge tradition — cocktail-bar atmosphere drawing on cool jazz and bossa-tinged harmony, built for background elegance rather than improvisational complexity.

[Instrumental]
Warm upright or hollow-body electric bass walking gently under lush extended piano chords (7ths, 9ths), with a muted trumpet or saxophone carrying soft melodic phrases.

[Drums]
Brushed drum kit with a soft ride cymbal pattern and light swing feel, kick and snare barely audible — rhythm implied more than driven.

[Voice & flow]
Optional smooth, breathy vocal with relaxed, behind-the-beat phrasing, or purely instrumental. If present, vocal stays understated, never belted.

[Mix & mood]
Warm, roomy mix with natural reverb suggesting a live lounge space, instruments sitting close together. Mood is sophisticated, relaxed, late-evening elegant.

[Tempo & key]
70-100 BPM with a swung eighth-note feel. Major 7th and minor 7th chords for rich, unresolved harmonic color.`,
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
    slug: "prompt-suno-blues",
    title: "Blues",
    tagline: "Guitare qui pleure, groove shuffle, émotion brute.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno blues — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un blues électrique : grille 12 mesures, guitare overdrive, shuffle, harmonica, voix éraillée. À copier sans inscription.",
    targetKeywords: ["prompt suno blues", "prompt musique blues ia"],
    ambiancePrompt: `[Genre & era]
Traditional and electric blues in the Delta-to-Chicago lineage — built on the 12-bar blues form, guitar-centric, emotionally direct.

[Instrumental]
Electric guitar with a warm, slightly overdriven tone playing call-and-response licks against the vocal line, walking bass following the 12-bar progression, occasional harmonica fills.

[Drums]
Shuffled swing rhythm with a laid-back kick and snare groove, ride cymbal or hi-hat carrying the shuffle feel. Simple, groove-focused, never busy.

[Voice & flow]
Gritty, expressive lead vocal with heavy use of blue notes and vocal bends, phrasing that leaves space for instrumental responses between vocal lines.

[Mix & mood]
Warm, slightly vintage-toned mix, guitar and vocal both given room to breathe. Mood is raw, soulful, emotionally cathartic.

[Tempo & key]
70-110 BPM with a shuffled triplet feel. 12-bar blues progression in E, A, or G with dominant 7th chords throughout.`,
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
    slug: "prompt-suno-country",
    title: "Country",
    tagline: "Guitares acoustiques, storytelling et groove country moderne.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno country — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour une country moderne façon Nashville : guitare acoustique, pedal steel, banjo, voix narrative. À copier sans inscription.",
    targetKeywords: ["prompt suno country", "prompt musique country ia"],
    ambiancePrompt: `[Genre & era]
Contemporary country (radio-format Nashville sound), blending acoustic storytelling roots with modern pop-country production polish.

[Instrumental]
Acoustic guitar strumming the rhythmic foundation, pedal steel or banjo accents coloring the melody, and a warm bass carrying simple root-fifth movement.

[Drums]
Straightforward, driving rock-adjacent drum groove, punchy kick and snare with a steady backbeat, built for radio rotation rather than complexity.

[Voice & flow]
Warm, narrative-driven lead vocal with a slight twang, clear storytelling phrasing prioritizing lyric intelligibility, harmonies entering on choruses.

[Mix & mood]
Bright, radio-ready mix, vocal forward and warm, acoustic instruments given natural presence. Mood is heartfelt, relatable, small-town authentic.

[Tempo & key]
90-120 BPM. Major keys (G, C, D) for an open, accessible harmonic character.`,
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
    slug: "prompt-suno-reggaeton-latin",
    title: "Reggaeton / latin",
    tagline: "Dembow qui claque, énergie latine, groove qui fait bouger.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno reggaeton & latin — le style à copier",
    seoDescription:
      "Un prompt Suno pour un reggaeton actuel : dembow, congas, timbales, sub-bass et flow mi-chanté mi-rappé. À copier sans inscription.",
    targetKeywords: ["prompt suno reggaeton", "prompt suno musique latine"],
    ambiancePrompt: `[Genre & era]
Contemporary reggaeton built on the dembow rhythm foundation, incorporating broader Latin pop influences (Bad Bunny, Karol G production style) for crossover appeal.

[Instrumental]
Syncopated Latin percussion loops (congas, timbales) layered over a deep, rounded sub-bass, with bright synth stabs or a marimba-style melodic hook carrying the topline.

[Drums]
Signature dembow pattern (boom-ch-boom-chick) as the rhythmic backbone, crisp snare/clap accents locked to the pattern, hi-hats adding subtle syncopated texture on top.

[Voice & flow]
Rhythmic, half-sung half-rapped Spanish-cadence delivery riding tight against the dembow groove, catchy repeated hook phrases, ad-libs punctuating between lines.

[Mix & mood]
Bass and dembow percussion dominate the low-mid, vocal compressed forward for club and radio impact. Mood is confident, sensual, dancefloor-ready.

[Tempo & key]
90-100 BPM (dembow feel). Minor keys with a rhythmic, groove-first melodic approach.`,
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
    slug: "prompt-suno-drum-and-bass",
    title: "Drum and bass",
    tagline: "Breaks rapides, basse profonde, énergie électronique intense.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno drum and bass — le style à copier",
    seoDescription:
      "Un prompt Suno pour une drum and bass à 174 BPM : breakbeat haché, sub-bass modulée, variantes liquid et neurofunk. À copier sans inscription.",
    targetKeywords: ["prompt suno drum and bass", "prompt suno dnb"],
    ambiancePrompt: `[Genre & era]
UK drum and bass tradition — fast breakbeat-driven electronic music built around chopped, syncopated drum breaks and deep sub-bass, spanning liquid (melodic) to neurofunk (aggressive) subgenres.

[Instrumental]
Deep, modulating sub-bass with an evolving filter sweep as the melodic and rhythmic anchor, layered with atmospheric pads (liquid variant) or distorted, growling bass textures (neurofunk variant).

[Drums]
Rapid, chopped breakbeat pattern (typically derived from classic break samples) running at double the perceived tempo of the bassline, intricate hi-hat and snare placement creating constant forward motion.

[Voice & flow]
Optional soulful, melodic topline vocal for the liquid variant, floating above the fast breaks; neurofunk variant typically stays instrumental or uses only processed vocal stabs.

[Mix & mood]
Sub-bass and breaks dominate the low end with tight, controlled dynamics; liquid variant stays airy and emotive, neurofunk stays dark and aggressive.

[Tempo & key]
170-176 BPM. Minor keys for neurofunk's tension, major or modal for liquid's uplifting character.`,
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
    slug: "prompt-suno-musique-ambiance-meditation",
    title: "Musique d'ambiance / méditation",
    tagline: "Textures apaisantes pour se recentrer et respirer.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno musique de méditation — le style à copier",
    seoDescription:
      "Un prompt Suno pour une musique d'ambiance méditative : nappes lentes, drones, bols chantants, réverbération longue. À copier sans inscription.",
    targetKeywords: ["prompt suno méditation", "prompt musique relaxation ia"],
    ambiancePrompt: `[Genre & era]
Ambient meditation music in the drone/soundscape tradition (Brian Eno-influenced), built for stillness and focus rather than song structure.

[Instrumental]
Slow-evolving synth pads and sustained drones as the harmonic bed, occasional soft bell tones, singing bowl textures, or field-recording elements (water, wind) layered sparingly.

[Drums]
No conventional drum kit — if rhythmic elements exist at all, they take the form of a soft, slow pulse or heartbeat-like sub-bass throb, never a defined beat.

[Voice & flow]
No lead vocal, or optionally a wordless, breathy vocal texture used as an additional pad layer rather than a foreground element.

[Mix & mood]
Wide, spacious stereo field with long reverb tails, low dynamic range for consistent, unobtrusive listening. Mood is calm, grounding, meditative.

[Tempo & key]
50-70 BPM or tempo-free (free-floating, non-metric). Modal or drone-based tonal center avoiding strong harmonic resolution.`,
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
    slug: "prompt-suno-berceuse-enfant",
    title: "Berceuse enfant",
    tagline: "Une mélodie douce pour accompagner l'endormissement.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno berceuse — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour une berceuse douce : arpèges à la guitare, boîte à musique, voix chuchotée et tempo lent. À copier sans inscription.",
    targetKeywords: ["prompt suno berceuse", "prompt berceuse ia"],
    ambiancePrompt: `[Genre & era]
Traditional lullaby form — simple, repetitive, built specifically to soothe a child toward sleep, distinct from playful children's songs.

[Instrumental]
Gentle acoustic guitar fingerpicking or a soft music-box-style piano/celesta melody, minimal additional instrumentation to avoid stimulation, occasional very soft string pad underneath.

[Drums]
No drums — rhythmic pulse, if any, comes only from the fingerpicked or arpeggiated instrumental pattern itself, kept steady and predictable.

[Voice & flow]
Soft, breathy, low-volume vocal with slow, unhurried phrasing and simple, repetitive melodic phrases that a child can recognize and settle into.

[Mix & mood]
Very quiet dynamic range throughout, warm and close-mic'd vocal, no sudden volume changes. Mood is tender, safe, unhurried.

[Tempo & key]
50-65 BPM. Simple major keys with narrow melodic range (avoiding large interval jumps).`,
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
    slug: "prompt-suno-musique-noel",
    title: "Musique de Noël",
    tagline: "L'ambiance chaleureuse des fêtes, entre tradition et modernité.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno musique de Noël — le style à copier",
    seoDescription:
      "Un prompt Suno pour une musique de Noël chaleureuse : grelots, glockenspiel, cordes, chœurs et refrain fédérateur. À copier sans inscription.",
    targetKeywords: ["prompt suno noël", "prompt musique de noël ia"],
    ambiancePrompt: `[Genre & era]
Christmas holiday music blending traditional carol harmony with a modern, radio-friendly festive production — warm and nostalgic rather than religious-only in tone.

[Instrumental]
Sleigh bells and glockenspiel carrying the melodic sparkle, warm string section or brass ensemble filling harmonic swells, acoustic guitar or piano anchoring the chord progression.

[Drums]
Light, brushed or soft pop drum groove with jingling percussion accents layered throughout, kick and snare kept gentle to preserve the cozy, festive character.

[Voice & flow]
Warm, joyful lead vocal with clear, singable phrasing built for group singalong, layered choir-style harmonies entering on the chorus for a communal feel.

[Mix & mood]
Bright, full mix with generous reverb evoking a large room or hall, bells and strings given sparkle in the top end. Mood is warm, nostalgic, celebratory.

[Tempo & key]
100-120 BPM. Major keys (C, G, F) with classic diatonic harmony for instant familiarity.`,
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
    slug: "prompt-suno-musique-mariage-premiere-danse",
    title: "Musique de mariage (première danse)",
    tagline: "La bande-son émotionnelle d'un moment unique.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno première danse de mariage — le style à copier",
    seoDescription:
      "Un prompt Suno pour une ballade de première danse : guitare arpégée, cordes qui montent, voix tendre, 60-75 BPM. À copier sans inscription.",
    targetKeywords: ["prompt suno mariage", "prompt musique première danse ia"],
    ambiancePrompt: `[Genre & era]
Romantic first-dance ballad, drawing on contemporary acoustic-pop wedding song conventions — built to carry genuine emotional weight for a slow, intimate dance.

[Instrumental]
Fingerpicked acoustic guitar or solo piano opening the song intimately, strings entering gradually to swell during the emotional peak, arrangement building from sparse to full across the track.

[Drums]
Minimal to none in the verses — soft brushed drums or a subtle cajon pulse may enter only in the final chorus to lift the emotional climax.

[Voice & flow]
Tender, heartfelt lead vocal with unhurried, intimate phrasing, dynamic build from a near-whispered verse to a fuller, more open chorus delivery.

[Mix & mood]
Warm, close, intimate mix in the verses opening into a wider, more spacious sound at the emotional peak. Mood is tender, devoted, quietly overwhelming.

[Tempo & key]
60-75 BPM, slow enough for a comfortable dance tempo. Major keys with occasional bittersweet minor inflections for emotional depth.`,
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
    slug: "prompt-suno-musique-sport-motivation-gym",
    title: "Musique de sport / motivation gym",
    tagline: "L'énergie qui pousse à se dépasser, séance après séance.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno musique de sport — le style à copier",
    seoDescription:
      "Un prompt Suno pour une musique de gym motivante : basse synthé saturée, kick compressé et chant scandé. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno sport", "prompt musique motivation gym ia"],
    ambiancePrompt: `[Genre & era]
High-energy workout music in the electronic/hip-hop hybrid tradition — built for gym and training playlists, prioritizing relentless drive over melodic subtlety.

[Instrumental]
Punchy, distorted synth bass driving the groove, aggressive stabbing synth or brass hits accenting the beat, minimal harmonic complexity to keep energy focused and forward.

[Drums]
Hard-hitting, compressed kick and snare locked into a driving, unrelenting groove, energetic hi-hat rolls building tension into each chorus or drop.

[Voice & flow]
Confident, powerful, chant-like vocal delivery with short, repeatable motivational phrases, gang-vocal or shouted ad-libs reinforcing the hook.

[Mix & mood]
Loud, in-your-face mix with maximum punch on kick and bass, minimal dynamic range for constant high energy. Mood is aggressive, driving, relentlessly motivating.

[Tempo & key]
128-150 BPM. Minor keys with a hard-hitting, rhythmically insistent melodic approach.`,
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
    slug: "prompt-suno-musique-jeu-video",
    title: "Musique de jeu vidéo",
    tagline: "Une bande-son immersive, du pixel à l'épique orchestral.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno musique de jeu vidéo — le style à copier",
    seoDescription:
      "Un prompt Suno pour une bande-son de jeu vidéo : variante chiptune 8-bit ou orchestrale épique, au choix. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno jeu vidéo", "prompt musique jeu vidéo ia"],
    ambiancePrompt: `[Genre & era]
Video game scoring tradition spanning two production poles: retro chiptune (8-bit/16-bit console era) for arcade-style energy, and sweeping orchestral score for cinematic, adventure-driven moments. Pick one lane per track.

[Instrumental]
Chiptune variant: square-wave and pulse-wave synth melodies with arpeggiated basslines, evoking classic console sound chips. Orchestral variant: full string section, brass fanfares, and woodwind counter-melodies building cinematic scope.

[Drums]
Chiptune variant: tight, punchy 8-bit-style percussion samples in a driving, looped pattern. Orchestral variant: taiko-style epic percussion and timpani hits punctuating dramatic swells.

[Voice & flow]
Instrumental by default in both variants — if vocal elements appear, they take the form of wordless choir textures (orchestral) or simple chip-voice stabs (chiptune), not a lead singer.

[Mix & mood]
Chiptune variant stays bright, compressed, and energetic; orchestral variant stays wide, dynamic, and dramatic with a big dynamic range. Mood ranges from playful urgency to heroic grandeur.

[Tempo & key]
Chiptune: 140-170 BPM, bright major keys. Orchestral: variable tempo with dramatic rubato, minor keys for tension building to major-key resolution.`,
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
    slug: "prompt-suno-musique-podcast-intro-outro",
    title: "Musique de podcast (intro/outro)",
    tagline: "Une identité sonore claire pour ouvrir et fermer chaque épisode.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno générique de podcast — le style à copier",
    seoDescription:
      "Un prompt Suno pour un générique de podcast : motif instrumental reconnaissable, lit sous la voix, fade in et fade out. À copier sans inscription.",
    targetKeywords: ["prompt suno podcast", "prompt musique podcast ia"],
    ambiancePrompt: `[Genre & era]
Audio-first branding music designed specifically for spoken-word podcast formats — built to sit under or bookend voice-over narration, distinct from short video-sync stingers made for visual content.

[Instrumental]
A simple, recognizable instrumental motif (a short melodic phrase on synth, guitar, or piano) that stays memorable on repeat listens across episodes, structured with a clear fade-in for intros and a clean fade-out for outros.

[Drums]
Light, unobtrusive rhythmic pulse if present at all — designed to sit under spoken narration without competing with intelligibility, often dropping out entirely once voice-over begins.

[Voice & flow]
Instrumental only, with structure built around two clear moments: a 10-20 second intro bed that rises then settles under an announcer's voice, and a 15-30 second outro that can play out in full without narration.

[Mix & mood]
Mid-range-focused mix leaving clear space for spoken voice frequencies, moderate dynamic range for consistent playback across listening environments (earbuds, car, speakers). Mood is professional, recognizable, consistent episode to episode.

[Tempo & key]
90-110 BPM for energetic formats, 70-90 BPM for calmer/interview formats. Major or neutral keys for broad topical flexibility across episode content.`,
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
    slug: "prompt-suno-gospel",
    title: "Gospel",
    tagline: "Chœurs puissants, énergie spirituelle, émotion collective.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno gospel — le style prêt à copier",
    seoDescription:
      "Un prompt Suno pour un gospel puissant : orgue Hammond, chœur en call-and-response et voix mélismatique. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt suno gospel", "prompt musique gospel ia"],
    ambiancePrompt: `[Genre & era]
Traditional and contemporary gospel — rooted in African American church music tradition, built around powerful choir arrangements and passionate, spirit-driven vocal delivery.

[Instrumental]
Hammond organ carrying rich, sustained chords as the harmonic foundation, piano doubling and embellishing the organ's part, occasional tambourine and hand-clap textures reinforcing the groove.

[Drums]
Driving, syncopated groove with a strong backbeat, dynamic buildup from restrained verses to full, energetic choruses, fills that punctuate emotional peaks.

[Voice & flow]
Powerful, soulful lead vocal with heavy melisma and improvisational runs, full choir backing vocals entering with call-and-response energy, dynamic range from hushed verses to full-throated climax.

[Mix & mood]
Wide, full mix with the choir given room and depth, organ and lead vocal both prominent. Mood is uplifting, cathartic, spiritually charged.

[Tempo & key]
80-130 BPM depending on song section (slow build to fast climax common). Major keys with gospel-specific chord extensions (add9, sus4) for emotional richness.`,
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
    slug: "prompt-suno-synthwave-retro-80s",
    title: "Synthwave / rétro 80s",
    tagline: "Néons, synthés analogiques, nostalgie électronique des années 80.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno synthwave rétro 80s — le style à copier",
    seoDescription:
      "Un prompt Suno pour une synthwave néon : basse analogique, arpèges, nappes larges et snare à réverb gated. À copier sans inscription.",
    targetKeywords: ["prompt suno synthwave", "prompt musique rétro 80s ia"],
    ambiancePrompt: `[Genre & era]
Synthwave, drawing on 1980s film-score and synth-pop aesthetics (John Carpenter scores, early electronic pop) filtered through a modern retro-futuristic lens.

[Instrumental]
Analog-style synth bass with a warm, saturated tone, layered arpeggiated synth lines carrying the melodic hook, lush pad chords evoking widescreen 80s film scores.

[Drums]
Gated reverb snare (the signature 80s drum sound), punchy programmed kick, and a steady, driving electronic beat with minimal syncopation — rhythmically straightforward by design.

[Voice & flow]
Optional cool, slightly detached lead vocal with a hint of reverb and chorus effect, reminiscent of 80s synth-pop delivery, or fully instrumental for a cinematic version.

[Mix & mood]
Wide stereo synths with heavy chorus and reverb, punchy but not harsh low end. Mood is nostalgic, cinematic, neon-lit and driving.

[Tempo & key]
100-120 BPM. Minor keys with dramatic, cinematic chord progressions for that widescreen retro-futuristic feel.`,
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
    slug: "prompt-suno-comptine-enfant",
    title: "Comptine pour enfant",
    tagline: "Une chanson ludique et rythmée, pensée pour les tout-petits.",
    category: "music",
    tool: "suno",
    seoTitle: "Prompt Suno comptine pour enfant — le style à copier",
    seoDescription:
      "Un prompt Suno pour une comptine ludique : ukulélé, glockenspiel, claps et refrain répétitif facile à chanter. À copier sans inscription.",
    targetKeywords: ["prompt suno comptine", "prompt comptine enfant ia"],
    ambiancePrompt: `[Genre & era]
Traditional French nursery rhyme (comptine) form — playful, educational, built for active engagement (clapping, counting, movement), distinct from the sleep-focused lullaby.

[Instrumental]
Bright, simple acoustic instrumentation (ukulele, glockenspiel, light piano), short repeating melodic phrase that's easy for a child to imitate and remember.

[Drums]
Light, playful percussion — hand claps, tambourine, or a simple woodblock pattern — steady and predictable enough for a child to clap or move along.

[Voice & flow]
Bright, cheerful, clearly-enunciated vocal with simple, repetitive lyrical structure (often call-and-response or counting-based), delivery upbeat and slightly exaggerated for engagement.

[Mix & mood]
Clean, bright, uncluttered mix with the vocal always crystal clear, no heavy processing. Mood is playful, joyful, energetic.

[Tempo & key]
100-120 BPM. Major keys with a narrow, easy-to-sing melodic range and simple, repeating phrases.`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Garder ce style + écrire mes paroles", flow: "keep-ambiance" },
      { label: "Affiner le style + écrire mes paroles", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style, c'est la partie facile. Des paroles qui riment juste et racontent ton histoire, c'est un métier.",
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
  {
    slug: "prompt-image-fantasy-medievale",
    title: "Ambiance fantasy médiévale épique",
    tagline: "Une forteresse dans la brume et une lumière qui ne pardonne pas.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt image fantasy médiévale — ambiance épique à copier",
    seoDescription:
      "Un prompt d'ambiance fantasy médiévale épique : forteresse dans la brume, lumière d'orage, étalonnage cinématique 8K. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt midjourney fantasy", "prompt image médiéval"],
    ambiancePrompt: `[Scene & universe]
Epic medieval fantasy landscape, towering stone fortress on a
cliffside, dense misty forest below, distant mountain range, sense of
ancient scale

[Lighting]
Overcast dramatic sky, diffused silver light breaking through storm
clouds, faint god-rays, cold ambient light with warm torchlight accents
from the fortress windows

[Color & grade]
Desaturated cinematic palette, cool greys and deep greens, muted gold
accents, moody fantasy grade

[Composition & lens]
Wide epic establishing shot, low horizon line, strong
foreground-to-background depth, subtle atmospheric perspective, slight
wide-angle distortion

[Texture & render]
Photoreal painterly hybrid, fine atmospheric mist, ultra-detailed
stonework and foliage, 8K render, cinematic depth of field`,
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
    slug: "prompt-image-photographie-mode-editoriale",
    title: "Photographie de mode éditoriale",
    tagline: "Un shooting mode digne d'un magazine, entre styling et narration visuelle.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photo de mode éditoriale — à copier",
    seoDescription:
      "Un prompt d'ambiance pour un shooting mode magazine : garde-robe stylée, flash directionnel, étalonnage saturé, rendu 85-135mm. À copier sans inscription.",
    targetKeywords: ["prompt midjourney mode", "prompt photo de mode ia"],
    ambiancePrompt: `[Scene & universe]
High-fashion editorial spread set in a fashion magazine context — model in full designer wardrobe, styled hair and makeup, dynamic pose suggesting movement or narrative, studio or striking location backdrop (urban rooftop, minimalist set, or dramatic landscape).

[Lighting]
Hard, directional studio strobe lighting creating sculpted shadows on fabric and face, or a single dramatic light source for editorial tension; occasional colored gel lighting for a bold fashion-forward mood.

[Color & grade]
Bold, saturated color grading true to fashion magazine aesthetics, or high-contrast desaturated grade for an austere haute-couture feel; skin tones kept true while background and wardrobe colors are pushed.

[Composition & lens]
Full-body or three-quarter framing emphasizing silhouette and wardrobe detail, shot on an 85-135mm equivalent lens for flattering compression, dynamic off-center composition following editorial conventions.

[Texture & render]
Crisp fabric texture (silk sheen, leather grain, tailored structure), sharp focus on wardrobe detail, subtle skin retouching that preserves natural texture rather than over-smoothing.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le styling et la lumière posent le ton. Ton mannequin, ta collection, ta direction artistique — c'est là que la précision fait la différence.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-culinaire",
    title: "Photographie culinaire",
    tagline: "Des plats qui donnent envie, avec la lumière et la texture d'un vrai shoot pro.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photographie culinaire — à copier",
    seoDescription:
      "Un prompt d'ambiance pour une photo culinaire pro : lumière rasante, textures appétissantes, macro 100mm, stylisme food. À copier sans inscription.",
    targetKeywords: ["prompt midjourney culinaire", "prompt photo plat ia"],
    ambiancePrompt: `[Scene & universe]
Professional food photography setup — a single plated dish as the hero subject, styled with complementary props (linen napkin, rustic wood surface, minimal garnish), context suggesting a restaurant or high-end cookbook shoot.

[Lighting]
Soft, directional window-style light from one side creating gentle shadow and highlight on the food's texture, diffused to avoid harsh specular hotspots on glossy surfaces.

[Color & grade]
Warm, appetizing color grade emphasizing natural food tones (rich browns, deep reds, fresh greens), slight contrast boost to make textures pop without looking artificial.

[Composition & lens]
Overhead flat-lay or 45-degree angle shot, shallow depth of field with a macro-capable lens (100mm equivalent) isolating the dish's focal point while background softly blurs.

[Texture & render]
Sharp, glistening texture detail on sauces, steam or condensation rendered where relevant for freshness cues, crumb and garnish detail crisp and appetizing.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'assiette est posée, la lumière est parfaite. Ton plat, ta recette, ta marque — c'est l'étape suivante.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-immobiliere-architecture",
    title: "Photographie immobilière / architecture",
    tagline: "Des espaces mis en valeur, lumière et lignes maîtrisées.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photo immobilière et architecture",
    seoDescription:
      "Un prompt d'ambiance pour une photo immobilière : verticales redressées, lumière naturelle, grand angle, rendu catalogue. À copier sans inscription.",
    targetKeywords: ["prompt midjourney immobilier", "prompt photo architecture ia"],
    ambiancePrompt: `[Scene & universe]
Professional real estate or architectural photography of an interior or exterior space, composition emphasizing clean lines, spatial flow, and the property's best features (natural light, open layout, architectural detail).

[Lighting]
Balanced, evenly-exposed lighting blending available natural daylight with subtle fill to avoid blown-out windows or overly dark interior shadows — a natural, true-to-life look.

[Color & grade]
Neutral, true-to-life color grade with accurate white balance, slight warmth boost for inviting interiors, cool clarity for modern architectural exteriors.

[Composition & lens]
Wide-angle lens (16-24mm equivalent) with corrected vertical lines to avoid distortion, composition following leading lines and symmetry to showcase spatial scale.

[Texture & render]
Crisp detail on architectural materials (wood grain, stone, glass reflections), clean and sharp throughout the frame with no distracting clutter.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'espace est révélé. Ton bien, ton angle, ta mise en scène — c'est ce qui vend.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-mariage",
    title: "Photographie de mariage",
    tagline: "Des instants capturés avec émotion et élégance intemporelle.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photographie de mariage — à copier",
    seoDescription:
      "Un prompt d'ambiance pour une photo de mariage : lumière dorée, émotion candide, bokeh 85mm, étalonnage intemporel. À copier sans inscription.",
    targetKeywords: ["prompt midjourney mariage", "prompt photo mariage ia"],
    ambiancePrompt: `[Scene & universe]
Documentary-style wedding photography capturing genuine emotional moments — ceremony, portraits, or candid reception scenes — set against a romantic venue backdrop (garden, chapel, or elegant reception hall).

[Lighting]
Soft, flattering natural light (golden hour preferred for outdoor portraits) or elegant ambient venue lighting for indoor moments, always prioritizing flattering skin tones and gentle shadow falloff.

[Color & grade]
Warm, romantic color grade with soft highlights and gentle contrast, film-inspired tonal curve evoking timeless elegance rather than clinical sharpness.

[Composition & lens]
Mix of candid wide shots (24-35mm equivalent) for scene context and intimate close portraits (85mm equivalent) for emotional detail, natural unposed framing.

[Texture & render]
Soft, slightly dreamy rendering with gentle grain, fine detail preserved in fabric (lace, veil) and floral elements without looking harsh or overly digital.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le moment est posé. Ton couple, ton lieu, ton histoire — c'est ce qui rend chaque photo unique.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-paysage-nature-grand-angle",
    title: "Paysage nature grand angle",
    tagline: "Des panoramas grandioses, entre échelle et détail.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney paysage grand angle — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance pour un paysage grandiose : premier plan marqué, heure dorée, perspective atmosphérique, rendu 8K. À copier sans inscription.",
    targetKeywords: ["prompt midjourney paysage", "prompt paysage nature ia"],
    ambiancePrompt: `[Scene & universe]
Sweeping wide-angle nature landscape — mountains, coastline, forest, or open valley — composition emphasizing vast scale and natural grandeur, often with a strong foreground element for depth.

[Lighting]
Golden hour or blue hour natural lighting creating dramatic directional light across the terrain, long shadows and warm rim light on peaks or ridgelines.

[Color & grade]
Rich, natural color grade with enhanced sky drama (deep blues, warm oranges) balanced against true-to-life terrain colors, avoiding oversaturation.

[Composition & lens]
Ultra-wide-angle lens (14-20mm equivalent), rule-of-thirds horizon placement, strong foreground-to-background depth layering for scale and immersion.

[Texture & render]
Sharp detail across the full depth of field (foreground rocks and foliage through distant mountains), crisp atmospheric clarity or intentional soft haze for mood.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le décor est planté. Ton sujet, ta composition finale — c'est toi qui la construis.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-portrait-animalier",
    title: "Portrait animalier",
    tagline: "Des portraits d'animaux pleins de caractère et de détails.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney portrait animalier — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance pour un portrait animalier : détail du pelage, regard net, téléobjectif, arrière-plan compressé. À copier sans inscription.",
    targetKeywords: ["prompt midjourney animal", "prompt portrait animalier ia"],
    ambiancePrompt: `[Scene & universe]
Close-up wildlife or pet portrait photography emphasizing the animal's personality and expression, natural or softly blurred habitat background providing context without distraction.

[Lighting]
Soft, directional natural light highlighting fur or feather texture and catching a natural highlight in the eyes, avoiding harsh flash that flattens detail.

[Color & grade]
Natural, true-to-life color grade with subtle warmth, fur or feather tones rendered accurately and richly rather than overly stylized.

[Composition & lens]
Telephoto lens (200-400mm equivalent) for wildlife or 85mm for pets, shallow depth of field isolating the animal from background, eye-level framing for intimacy.

[Texture & render]
Extremely sharp detail on fur, feathers, or eyes — the defining feature of a strong animal portrait — with soft, creamy background blur.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le regard est capté. Ton animal, sa posture, son environnement — à toi de compléter la scène.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-design-tatouage",
    title: "Design de tatouage",
    tagline: "Un design de tatouage précis, prêt à transmettre au tatoueur.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney design de tatouage — à copier",
    seoDescription:
      "Un prompt d'ambiance pour un design de tatouage : trait net, contraste lisible, fond neutre, prêt à montrer au tatoueur. À copier sans inscription.",
    targetKeywords: ["prompt midjourney tatouage", "prompt design tatouage ia"],
    ambiancePrompt: `[Scene & universe]
Clean tattoo flash design presented on a neutral background (skin-tone mockup or plain white), style ranging from fine-line minimalist to bold traditional linework depending on desired direction.

[Lighting]
Even, shadowless studio-style lighting ensuring every line and detail of the design is clearly visible with no ambiguity for the tattoo artist.

[Color & grade]
Black-and-white linework as the default (standard for tattoo stencils), or a limited, deliberate color palette if a color tattoo style is specified.

[Composition & lens]
Flat, front-facing presentation of the design at full detail, proportioned for the intended body placement (forearm, back piece, small accent).

[Texture & render]
Crisp, clean line quality with consistent line weight, no unintended texture or shading artifact that would confuse the stencil transfer process.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le design est là. Ton emplacement, ta taille, ton style final — c'est la précision qui suit.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-logo-identite-marque",
    title: "Logo / identité de marque",
    tagline: "Un logo clair, mémorable, prêt à porter une marque.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney logo et identité de marque",
    seoDescription:
      "Un prompt d'ambiance pour un logo : formes géométriques simples, lisibilité à petite taille, fond neutre, rendu vectoriel. À copier sans inscription.",
    targetKeywords: ["prompt midjourney logo", "prompt création logo ia"],
    ambiancePrompt: `[Scene & universe]
Clean brand logo concept presented on a neutral or brand-colored background, style ranging from minimalist wordmark to iconic symbol mark, appropriate for the brand's industry and tone.

[Lighting]
Flat, even studio-style presentation lighting with no directional shadow, ensuring the logo reads clearly at any scale.

[Color & grade]
Deliberate, limited color palette (2-3 colors max) chosen for brand recognition and reproducibility across print and digital, with a monochrome version implied for versatility.

[Composition & lens]
Centered, balanced composition with strong negative space, scalable geometric structure that remains legible from business card to billboard size.

[Texture & render]
Crisp vector-style clean edges, no unnecessary gradient or texture noise that would break at small sizes or in single-color print.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La base est posée. Ton nom de marque, ton secteur, tes déclinaisons — c'est là qu'on affine.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-style-anime-manga",
    title: "Style anime / manga",
    tagline: "Un rendu anime authentique, entre expressivité et dynamisme.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney style anime et manga — à copier",
    seoDescription:
      "Un prompt d'ambiance pour un rendu anime authentique : cel shading, traits expressifs, couleurs franches, cadrage dynamique. À copier sans inscription.",
    targetKeywords: ["prompt midjourney anime", "prompt style manga ia"],
    ambiancePrompt: `[Scene & universe]
Character or scene illustrated in authentic Japanese anime/manga style, dynamic pose or expressive scene composition typical of anime key visuals or manga panel art.

[Lighting]
Cel-shaded lighting with hard-edged highlight and shadow blocks characteristic of anime rendering, occasional dramatic rim lighting for emotional emphasis.

[Color & grade]
Vibrant, saturated color palette typical of anime production, or muted manga-style grayscale with screentone shading patterns depending on desired output.

[Composition & lens]
Dynamic anime-style framing with exaggerated perspective or dramatic close-up angles, speed lines or motion effects where action is implied.

[Texture & render]
Clean cel-shaded flat color rendering with crisp linework, characteristic large expressive eyes and stylized proportions.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style est fixé. Ton personnage, son univers, sa scène — c'est ce qui donne vie à l'histoire.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-peinture-huile-classique",
    title: "Peinture à l'huile classique",
    tagline: "La texture et la richesse d'une véritable peinture à l'huile.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney peinture à l'huile — style à copier",
    seoDescription:
      "Un prompt d'ambiance pour une peinture à l'huile classique : empâtement visible, clair-obscur, glacis, toile texturée. À copier sans inscription.",
    targetKeywords: ["prompt midjourney peinture", "prompt peinture huile ia"],
    ambiancePrompt: `[Scene & universe]
Classical oil painting composition in the tradition of Old Master portraiture or still life, subject rendered with painterly realism and academic composition conventions.

[Lighting]
Chiaroscuro-inspired dramatic lighting with strong light-to-dark contrast, soft directional light source typical of classical studio painting setups.

[Color & grade]
Rich, warm classical color palette with deep umbers, burnt siennas, and muted golds, subtle color glazing effect reminiscent of layered oil technique.

[Composition & lens]
Traditional academic composition with balanced framing, subject often centered or following classical portrait conventions, painterly depth through atmospheric perspective.

[Texture & render]
Visible brushstroke texture and impasto detail, canvas grain subtly present, painterly softness at edges rather than photographic sharpness.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La toile est prête. Ton sujet, ta commande, ton format final — c'est là que l'œuvre prend forme.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-aquarelle",
    title: "Aquarelle",
    tagline: "La légèreté et la transparence d'une aquarelle authentique.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney aquarelle — style à copier",
    seoDescription:
      "Un prompt d'ambiance pour une aquarelle authentique : lavis transparents, bords humides, grain du papier, blancs réservés. À copier sans inscription.",
    targetKeywords: ["prompt midjourney aquarelle", "prompt aquarelle ia"],
    ambiancePrompt: `[Scene & universe]
Watercolor illustration with soft, flowing subject rendering — botanical, landscape, or portrait — capturing the medium's characteristic translucency and organic bleed.

[Lighting]
Soft, diffused implied lighting achieved through gentle color washes rather than hard directional shading, natural light quality throughout.

[Color & grade]
Delicate, transparent color layering with visible pigment bleed at edges, muted or pastel palette with occasional bold color accents for focal points.

[Composition & lens]
Loose, organic composition with intentional negative space (unpainted paper visible), soft edges that fade rather than hard-line boundaries.

[Texture & render]
Visible paper texture (cold-press grain), soft color bleeding and granulation effects characteristic of real watercolor pigment behavior.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'aquarelle prend forme. Ton sujet précis, ta palette, ton format — c'est la suite logique.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-concept-art-science-fiction",
    title: "Concept art science-fiction",
    tagline: "Un univers SF pensé jusque dans les moindres détails techniques.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney concept art science-fiction",
    seoDescription:
      "Un prompt d'ambiance pour un concept art SF : design fonctionnel, échelle lisible, éclairage volumétrique, finition production. À copier sans inscription.",
    targetKeywords: ["prompt midjourney concept art", "prompt science fiction ia"],
    ambiancePrompt: `[Scene & universe]
Cinematic science-fiction concept art — spacecraft, futuristic environment, or advanced technology — designed with plausible functional detail suggesting a lived-in, engineered universe.

[Lighting]
Dramatic cinematic lighting with strong volumetric elements (light shafts, atmospheric haze), high-contrast highlights on metallic and glass surfaces.

[Color & grade]
Cool, futuristic color grade (blues, teals, cold whites) contrasted with warm accent lighting (engine glow, neon), cinematic color grading typical of film concept art.

[Composition & lens]
Wide establishing-shot composition emphasizing scale and technological grandeur, dynamic camera angle suggesting a film production still.

[Texture & render]
Highly detailed hard-surface texturing (weathered metal, exposed circuitry, reflective glass), photorealistic rendering with fine mechanical detail.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'univers est posé. Ton personnage, ton vaisseau, ta scène d'action — c'est ce qui raconte l'histoire.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-ambiance-horreur-sombre",
    title: "Ambiance horreur / sombre",
    tagline: "Une atmosphère oppressante, entre tension et détail glaçant.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney ambiance horreur — atmosphère à copier",
    seoDescription:
      "Un prompt d'ambiance horreur : clair-obscur, brouillard, menace hors-champ, palette désaturée et grain marqué. À copier sans inscription.",
    targetKeywords: ["prompt midjourney horreur", "prompt ambiance sombre ia"],
    ambiancePrompt: `[Scene & universe]
Dark, unsettling horror atmosphere — abandoned location, ominous figure, or eerie environment — composition designed to build tension and psychological unease.

[Lighting]
Low-key lighting with deep shadows dominating the frame, a single harsh or flickering light source creating stark, unsettling contrast.

[Color & grade]
Desaturated, cold color palette with sickly greens or deep blacks, occasional blood-red accent for shock emphasis, heavy shadow crush.

[Composition & lens]
Off-kilter or claustrophobic framing (Dutch angles, tight corridors), negative space used to suggest an unseen threat lurking just outside the frame.

[Texture & render]
Grimy, weathered surface texture (decay, rust, damp), grain and slight noise for a raw, unpolished horror-film quality.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La tension est posée. Ton personnage, ta menace, ta scène précise — c'est ce qui fait vraiment peur.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-style-minimaliste-epure",
    title: "Style minimaliste épuré",
    tagline: "L'épure au service de l'impact visuel.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney style minimaliste épuré — à copier",
    seoDescription:
      "Un prompt d'ambiance minimaliste : espace négatif dominant, palette réduite, une seule forme forte, lumière douce. À copier sans inscription.",
    targetKeywords: ["prompt midjourney minimaliste", "prompt style épuré ia"],
    ambiancePrompt: `[Scene & universe]
Minimalist composition stripped to essential elements — a single subject against generous negative space, clean and deliberate visual simplicity.

[Lighting]
Soft, even, shadowless lighting or a single clean directional source, avoiding visual clutter from complex shadow patterns.

[Color & grade]
Restrained color palette, often monochromatic or two-tone, high clarity with no unnecessary color noise.

[Composition & lens]
Strong use of negative space and geometric balance, subject placed with intentional, often off-center, precision following minimalist design principles.

[Texture & render]
Clean, smooth rendering with minimal texture detail, sharp focus on the singular subject with nothing competing for attention.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'espace est prêt. Ton sujet précis, son placement — c'est ce qui transforme l'épure en message.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-vintage-argentique",
    title: "Photographie vintage / argentique",
    tagline: "Le grain, la chaleur et l'imperfection charmante de la pellicule.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photo argentique vintage — à copier",
    seoDescription:
      "Un prompt d'ambiance argentique : grain de pellicule, dominante chaude, halation, imperfections de développement. À copier sans inscription.",
    targetKeywords: ["prompt midjourney argentique", "prompt photo vintage ia"],
    ambiancePrompt: `[Scene & universe]
Photography styled after analog film photography — any subject rendered with the specific optical and chemical characteristics of shooting on real film stock, evoking a nostalgic, non-digital feel.

[Lighting]
Natural, slightly imperfect lighting typical of film-era photography, soft highlight rolloff rather than the clinical dynamic range of digital sensors.

[Color & grade]
Warm, slightly faded color grade with characteristic film color shifts (warm highlights, muted shadows), light halation around bright highlights.

[Composition & lens]
Classic 35mm or medium-format framing conventions, occasionally slightly imperfect composition evoking candid, unposed film-era shooting.

[Texture & render]
Visible authentic film grain structure, subtle light leaks or vignetting at frame edges, soft optical characteristics of vintage lens glass.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le grain est posé. Ton sujet, ton époque précise, ta pellicule — c'est ce qui rend le rendu vraiment authentique.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-de-rue",
    title: "Photographie de rue",
    tagline: "L'instant décisif, capté dans le mouvement de la ville.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photographie de rue — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance street photo : instant décisif, lumière urbaine disponible, 35mm, cadrage pris sur le vif. À copier sans inscription.",
    targetKeywords: ["prompt midjourney street photo", "prompt photographie de rue ia"],
    ambiancePrompt: `[Scene & universe]
Candid street photography capturing an authentic urban moment — a passerby, a fleeting interaction, or an unposed slice of city life — composition built around spontaneity rather than staging.

[Lighting]
Available natural city light, hard midday shadow for graphic contrast or soft overcast diffusion for even tonal range, occasionally supplemented by neon or shop-window glow at dusk.

[Color & grade]
True-to-life urban color palette with slightly boosted contrast, or a muted, documentary-style desaturation depending on the mood — color choice always secondary to the captured moment itself.

[Composition & lens]
35mm or 50mm equivalent for a natural human perspective, off-center or layered composition using urban framing elements (doorways, reflections, crowds) to add depth.

[Texture & render]
Slightly gritty, unpolished realism — visible texture in pavement, brick, and weathered surfaces — nothing overly smoothed or artificially clean.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'instant est saisi. Ton lieu, ton personnage, ta ville — c'est ce qui rend la scène vraiment tienne.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-astrophotographie-espace",
    title: "Astrophotographie / espace",
    tagline: "L'immensité du ciel nocturne, capturée avec précision.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney astrophotographie — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance astro : voie lactée, ciel profond, pose longue, premier plan en silhouette, rendu ultra-net. À copier sans inscription.",
    targetKeywords: ["prompt midjourney espace", "prompt astrophotographie ia"],
    ambiancePrompt: `[Scene & universe]
Astrophotography scene — star-filled night sky, Milky Way arch, or deep-space nebula view — often paired with a grounded foreground element (mountain silhouette, lone tree) for scale.

[Lighting]
Minimal ambient light dominated by starlight and celestial glow, faint horizon glow from distant light pollution if a foreground landscape is included, otherwise true deep-space darkness.

[Color & grade]
Deep blue-black sky tones with visible star color variation (blue-white to warm orange), nebula and galactic core rendered in rich purples and teals where relevant.

[Composition & lens]
Ultra-wide lens (14-24mm equivalent) for sky-dominant framing, long-exposure-style star clarity with pin-sharp point sources rather than streaked trails unless intentionally specified.

[Texture & render]
Crisp, high-clarity star detail against a smooth, noise-controlled dark sky, subtle atmospheric glow around brighter celestial objects.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le ciel est posé. Ton point de vue, ton premier plan, ta composition — c'est ce qui ancre l'image sur Terre.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-photographie-sous-marine",
    title: "Photographie sous-marine",
    tagline: "La lumière filtrée et le silence du monde aquatique.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney photographie sous-marine — à copier",
    seoDescription:
      "Un prompt d'ambiance sous-marine : lumière filtrée en rayons, dominante bleu-vert, particules en suspension, grand angle. À copier sans inscription.",
    targetKeywords: ["prompt midjourney sous-marine", "prompt photo océan ia"],
    ambiancePrompt: `[Scene & universe]
Underwater photography capturing marine life, coral reef, or a diver's silhouette, composition shaped by the diffused, weightless quality unique to the underwater environment.

[Lighting]
Filtered, blue-tinted natural light streaming from the surface above, softened and scattered by water, occasional strobe-lit foreground detail for color accuracy on close subjects.

[Color & grade]
Deep blue-green ambient color grade with warmer color correction applied to the foreground subject to counteract water's natural color absorption at depth.

[Composition & lens]
Wide-angle lens (16mm equivalent) to counteract water's magnification effect, composition using light rays (god rays) filtering from the surface for atmospheric depth.

[Texture & render]
Soft, slightly hazy background from suspended particulates, sharp detail retained on the main subject, natural water movement suggested through subtle blur on loose elements (hair, fins, marine flora).`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'eau est posée. Ta créature, ton plongeur, ta profondeur — c'est ce qui donne vie à la scène.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-macro-photographie",
    title: "Macro photographie",
    tagline: "L'infiniment petit révélé dans les moindres détails.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney macro photographie — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance macro : rapport 1:1, profondeur de champ minuscule, texture révélée, éclairage diffusé. À copier sans inscription.",
    targetKeywords: ["prompt midjourney macro", "prompt macro photographie ia"],
    ambiancePrompt: `[Scene & universe]
Extreme close-up macro photography revealing intricate detail invisible to the naked eye — insect, flower, water droplet, or textured surface — subject filling the frame at magnified scale.

[Lighting]
Soft, controlled diffused lighting (ring light or softbox style) eliminating harsh shadow at extreme close range, occasional backlighting to reveal translucency in petals or wings.

[Color & grade]
Vivid, true-to-life color rendering with enhanced micro-contrast to bring out fine surface detail, colors kept natural rather than artificially boosted.

[Composition & lens]
True macro lens equivalent (1:1 magnification), extremely shallow depth of field isolating a precise focal plane while the rest melts into soft bokeh.

[Texture & render]
Extraordinarily sharp, high-resolution surface detail (pollen grains, water droplet refraction, insect exoskeleton texture), background rendered as a smooth color wash.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le détail est révélé. Ton sujet précis, ton échelle — c'est ce qui transforme l'observation en image.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-noir-et-blanc-contraste",
    title: "Noir et blanc contrasté",
    tagline: "La force du contraste, sans artifice de couleur.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney noir et blanc contrasté — à copier",
    seoDescription:
      "Un prompt d'ambiance monochrome : noirs profonds, hautes lumières préservées, lumière sculptante, grain argentique. À copier sans inscription.",
    targetKeywords: ["prompt midjourney noir et blanc", "prompt photo monochrome ia"],
    ambiancePrompt: `[Scene & universe]
Any subject rendered in bold black-and-white treatment where tonal contrast — not color — carries the visual impact, composition built around light-versus-dark graphic relationships.

[Lighting]
Strong directional lighting deliberately chosen to maximize tonal separation, deep shadow areas contrasted against bright, clipped highlights for dramatic graphic effect.

[Color & grade]
Full monochrome conversion with a wide tonal range from true black to bright white, deliberately high contrast curve rather than a flat, low-contrast gray scale.

[Composition & lens]
Composition relying on shape, line, and tonal contrast rather than color cues to guide the eye, strong geometric or graphic framing.

[Texture & render]
Crisp micro-contrast bringing out fine texture (skin, fabric, stone) that color might otherwise distract from, deep blacks with retained shadow detail rather than crushed noise.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le contraste est posé. Ton sujet, ta scène précise — c'est ce qui donne au noir et blanc toute sa force.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-pop-art",
    title: "Pop art",
    tagline: "Des couleurs franches et un style graphique qui claque.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney pop art — style à copier",
    seoDescription:
      "Un prompt d'ambiance pop art : aplats saturés, contours noirs marqués, trame Ben Day, composition graphique frontale. À copier sans inscription.",
    targetKeywords: ["prompt midjourney pop art", "prompt style pop art ia"],
    ambiancePrompt: `[Scene & universe]
Bold pop art illustration in the tradition of 1960s graphic art movements — a subject rendered with flat, graphic simplicity and iconic visual punch, often with a consumer-culture or portrait focus.

[Lighting]
Flat, graphic lighting with minimal gradient — light and shadow rendered as distinct flat color blocks rather than smooth photographic transitions.

[Color & grade]
Bold, high-saturation primary and secondary colors (reds, yellows, blues) in deliberate flat blocks, strong color contrast between adjacent shapes.

[Composition & lens]
Bold, centered composition with graphic outline (thick black contour lines), often incorporating halftone dot patterns or repeated panel elements.

[Texture & render]
Flat, screen-print-style rendering with visible halftone dot texture in shaded areas, crisp hard edges with no photographic gradient blending.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style est posé. Ton sujet, ta palette précise — c'est ce qui rend l'image immédiatement reconnaissable.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-steampunk",
    title: "Steampunk",
    tagline: "Rouages, cuivre et vapeur — l'esthétique rétro-futuriste par excellence.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney steampunk — ambiance à copier",
    seoDescription:
      "Un prompt d'ambiance steampunk : laiton et cuivre, rouages apparents, vapeur, palette sépia rétro-futuriste. À copier sans inscription.",
    targetKeywords: ["prompt midjourney steampunk", "prompt style steampunk ia"],
    ambiancePrompt: `[Scene & universe]
Steampunk scene blending Victorian-era aesthetics with fantastical brass-and-steam mechanical technology — a character, vehicle, or environment built from intricate gears, pipes, and pressure valves.

[Lighting]
Warm, amber-toned lighting evoking gaslight and firelight, dramatic shadow cast by mechanical structures, occasional glowing steam or ember accents.

[Color & grade]
Rich sepia and brass color palette (warm browns, burnished copper, muted gold) with deep charcoal shadows, vintage-toned overall grade.

[Composition & lens]
Detailed wide or medium shot showcasing intricate mechanical elements, composition allowing space for the elaborate machinery to read clearly.

[Texture & render]
Highly detailed metallic texture (polished brass, aged copper, leather straps, riveted iron), visible steam wisps and fine mechanical engraving detail.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'univers est posé. Ton personnage, sa machine, son histoire — c'est ce qui donne vie au rouage.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-cottagecore-champetre",
    title: "Cottagecore / champêtre",
    tagline: "La douceur d'une vie simple, entre nature et nostalgie.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney cottagecore champêtre — à copier",
    seoDescription:
      "Un prompt d'ambiance cottagecore : lumière douce de fin d'après-midi, textures naturelles, palette pastel fanée. À copier sans inscription.",
    targetKeywords: ["prompt midjourney cottagecore", "prompt ambiance champêtre ia"],
    ambiancePrompt: `[Scene & universe]
Cottagecore pastoral scene — a rustic countryside cottage, a flower-filled meadow, or a cozy hand-crafted domestic moment — evoking a slow, romanticized rural lifestyle.

[Lighting]
Soft, warm natural sunlight filtering through trees or a cottage window, golden hour glow, gentle and diffused rather than dramatic or harsh.

[Color & grade]
Warm, muted pastel color palette (soft greens, dusty pinks, cream), slightly faded and nostalgic tonal quality reminiscent of a hand-painted storybook.

[Composition & lens]
Intimate, cozy framing with natural elements (wildflowers, wicker baskets, worn wood) filling the foreground, soft focus falloff toward the edges.

[Texture & render]
Tactile, handmade texture quality — woven fabric, aged wood grain, delicate flower petals — rendered with a gentle, slightly soft-focus warmth rather than clinical sharpness.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'ambiance est posée. Ton lieu, ton personnage, ta saison — c'est ce qui complète cette parenthèse champêtre.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-illustration-botanique",
    title: "Illustration botanique",
    tagline: "La précision scientifique au service de la beauté végétale.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney illustration botanique — à copier",
    seoDescription:
      "Un prompt d'ambiance botanique : précision scientifique, trait fin, fond parchemin, planche naturaliste. À copier sans inscription.",
    targetKeywords: ["prompt midjourney botanique", "prompt illustration botanique ia"],
    ambiancePrompt: `[Scene & universe]
Botanical illustration in the scientific naturalist tradition — a single plant, flower, or leaf specimen rendered with precise anatomical accuracy, isolated on a clean background as in classical field guides.

[Lighting]
Even, shadowless studio-style lighting ensuring every structural detail of the specimen (veins, petal layers, stem texture) is clearly visible without distracting shadow.

[Color & grade]
Naturalistic, botanically accurate color rendering true to the specific plant species, no artistic color exaggeration — accuracy takes priority over stylization.

[Composition & lens]
Centered, isolated specimen composition on a plain cream or white background, often including labeled detail insets (cross-section, seed, root) in the classical scientific plate style.

[Texture & render]
Fine, precise linework and delicate color layering reminiscent of watercolor or engraved botanical plates, crisp detail on leaf venation and petal translucency.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La précision est posée. Ton espèce précise, sa composition — c'est ce qui transforme l'illustration en véritable planche botanique.",
    renderAsset: null,
  },
  {
    slug: "prompt-image-portrait-corporate-linkedin",
    title: "Portrait corporate / LinkedIn",
    tagline: "Une photo de profil professionnelle, nette et immédiatement crédible.",
    category: "image",
    tool: "midjourney",
    seoTitle: "Prompt Midjourney portrait corporate LinkedIn",
    seoDescription:
      "Un prompt d'ambiance pour une photo de profil pro : lumière douce, fond neutre, cadrage buste, rendu net et crédible. À copier sans inscription.",
    targetKeywords: ["prompt midjourney portrait corporate", "prompt photo linkedin ia"],
    ambiancePrompt: `[Scene & universe]
Clean, professional headshot designed specifically for a business or LinkedIn profile — subject in business attire, neutral or softly blurred office-style background, immediately readable as a professional profile photo rather than an artistic portrait.

[Lighting]
Soft, even, flattering studio lighting (large softbox or window-diffused) eliminating harsh shadow, ensuring a clean, approachable, trustworthy appearance.

[Color & grade]
Neutral, true-to-life color grade with accurate, healthy skin tones, no stylized color grading — clarity and professionalism take priority over artistic mood.

[Composition & lens]
Head-and-shoulders or waist-up framing, shot on an 85mm equivalent for natural, undistorted facial proportions, subject centered or slightly off-center following standard profile-photo conventions.

[Texture & render]
Crisp, clean skin rendering with natural texture retained (not over-smoothed), sharp focus on the eyes, softly blurred background to keep full attention on the subject.`,
    buttons: [
      { label: "Affiner l'ambiance", flow: "refine-ambiance" },
      { label: "Placer mon sujet dans cette ambiance", flow: "keep-ambiance" },
      { label: "Affiner + placer mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le cadrage est posé. Ta tenue, ton expression, ton secteur — c'est ce qui rend la photo vraiment toi.",
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
  {
    slug: "prompt-chatgpt-description-produit-ecommerce",
    title: "Description produit e-commerce",
    tagline: "Trois lignes qui vendent, pas qui décrivent.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT fiche produit e-commerce — structure à copier",
    seoDescription:
      "Un prompt complet pour une fiche produit e-commerce qui convertit : titre SEO, accroche bénéfice, points forts, levée d'objection. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt chatgpt fiche produit", "prompt description produit"],
    ambiancePrompt: `[Rôle]
Tu es un copywriter e-commerce spécialisé en fiches produit qui
convertissent, maîtrisant le SEO produit et les déclencheurs d'achat.

[Objectif]
Produire une fiche produit qui capte l'attention en une phrase, lève
les objections, et pousse au clic "Ajouter au panier" — sans jargon
marketing vide.

[Structure imposée]
1. Un titre produit clair incluant le mot-clé principal.
2. Une accroche d'1 à 2 phrases centrée sur le bénéfice, pas la
fonctionnalité.
3. Une liste de 3 à 5 points forts, formulés en bénéfice concret pour
le client.
4. Un paragraphe court qui lève l'objection la plus probable (prix,
qualité, livraison).
5. Une phrase de réassurance ou d'urgence légère, sans pression
artificielle.

[Règles de rédaction]
Bénéfice avant caractéristique à chaque ligne. Bannir les superlatifs
vides ("incroyable", "révolutionnaire"). Phrases courtes, rythme qui se
lit à voix haute.

[Contraintes]
Ton adapté à la cible (premium, familial, technique...). Longueur
totale 80 à 150 mots sauf indication contraire.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon produit", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon produit", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Ton produit, ta cible, ton positionnement — une fiche qui convertit se construit sur mesure.",
    renderAsset: null,
  },

  {
    slug: "prompt-article-blog-seo",
    title: "Article de blog SEO",
    tagline: "Un article structuré pour se positionner sur Google.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT article de blog SEO — structure à copier",
    seoDescription:
      "Un prompt complet pour un article de blog optimisé SEO : H1 avec mot-clé, intro accroche, 3-5 H2, conclusion et meta-description. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt article de blog", "prompt rédaction seo ia"],
    ambiancePrompt: `[Rôle]
Act as an experienced SEO content writer and editor who understands French search intent, on-page optimization, and how to structure long-form content that both ranks and genuinely helps the reader.

[Objectif]
Produce a complete, publish-ready blog article in French that targets a specific keyword and search intent, balancing SEO structure with genuine reader value — never keyword-stuffed, never generic filler.

[Structure imposée]
Title (H1) including the target keyword naturally, a hook introduction stating the reader's problem, 3-5 H2 sections each answering a distinct sub-question, a practical conclusion with a clear next step, and a meta-description under 155 characters.

[Règles de rédaction]
Write in clear, direct French at a general-audience reading level, use short paragraphs (2-4 sentences) and bullet points where they aid scanability, back claims with concrete examples rather than vague assertions.

[Contraintes]
Target length 1200-1800 words unless otherwise specified, avoid AI-sounding transitional clichés ("dans le monde d'aujourd'hui", "il est important de noter"), output in French regardless of the language of these instructions.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon sujet et mon mot-clé", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure SEO est posée. Ton sujet précis, ton mot-clé cible, ta ligne éditoriale — c'est ce qui fait vraiment ranker.",
    renderAsset: null,
  },
  {
    slug: "prompt-communique-de-presse",
    title: "Communiqué de presse",
    tagline: "Une annonce professionnelle, prête pour les médias.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT communiqué de presse — structure à copier",
    seoDescription:
      "Un prompt complet pour un communiqué de presse : titre informatif, chapô, corps en pyramide inversée, citation, boilerplate. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt communiqué de presse", "prompt communiqué presse ia"],
    ambiancePrompt: `[Rôle]
Act as a corporate communications professional experienced in writing French press releases that journalists actually read and use, following AFP-style journalistic conventions.

[Objectif]
Produce a publish-ready press release announcing a company event, product launch, or milestone, written to maximize the chance of media pickup and clear third-party comprehension.

[Structure imposée]
Headline stating the news in one line, dateline (city, date), lead paragraph covering who/what/when/where/why, 2-3 supporting paragraphs with context and a quote from a company spokesperson, boilerplate company description, media contact block.

[Règles de rédaction]
Write in formal, neutral journalistic French (third person, no marketing hype language), lead with the most newsworthy fact first following the inverted-pyramid structure, keep sentences factual and verifiable.

[Contraintes]
Target length 300-500 words, include one clearly-marked placeholder quote for the spokesperson to review, avoid superlatives ("révolutionnaire", "unique au monde") unless factually substantiated.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon annonce", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon annonce", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le format presse est posé. Ton annonce précise, ton porte-parole, ta date — c'est ce qui rend le communiqué vraiment diffusable.",
    renderAsset: null,
  },
  {
    slug: "prompt-page-de-vente-landing-page",
    title: "Page de vente (landing page)",
    tagline: "Une page complète pensée pour convertir, de l'accroche au CTA.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT page de vente — structure landing à copier",
    seoDescription:
      "Un prompt complet pour une landing page qui convertit : accroche, bénéfices, preuve sociale, levée d'objections, CTA. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt page de vente", "prompt landing page ia"],
    ambiancePrompt: `[Rôle]
Act as a direct-response copywriter specialized in high-converting French landing pages, combining persuasive copywriting principles with clear, honest communication.

[Objectif]
Produce a complete, section-by-section landing page for a specific offer (product, service, or lead magnet), structured to guide a visitor from initial attention to a single clear conversion action.

[Structure imposée]
Hero section (headline + subheadline + primary CTA), problem/agitation section, solution/offer presentation, 3-5 benefit blocks (not just features), social proof section (testimonials/numbers), objection-handling FAQ, final CTA section — one offer, one page, one goal.

[Règles de rédaction]
Write benefit-driven copy that speaks directly to the reader ("vous"), keep sentences short and scannable, every section must earn its place by moving the reader closer to the single conversion action.

[Contraintes]
No competing calls-to-action — only one offer per page, avoid generic stock-phrase headlines, output in French, flag clearly where real testimonials/numbers/proof need to be inserted by the user.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon offre", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon offre", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure de vente est posée. Ton offre précise, ta preuve sociale, ton prix — c'est ce qui transforme la page en machine à convertir.",
    renderAsset: null,
  },
  {
    slug: "prompt-newsletter-email",
    title: "Newsletter email",
    tagline: "Un email qui se lit jusqu'au bout et donne envie de cliquer.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT newsletter — structure email à copier",
    seoDescription:
      "Un prompt complet pour une newsletter qui se lit jusqu'au bout : objet, accroche, corps rythmé, un seul CTA clair. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt newsletter", "prompt email marketing ia"],
    ambiancePrompt: `[Rôle]
Act as an email marketing copywriter experienced in French B2C/B2B newsletters, understanding what drives opens, reads, and clicks in an inbox.

[Objectif]
Produce a complete, ready-to-send newsletter email that informs or promotes while maintaining a genuine, non-salesy relationship tone with the subscriber.

[Structure imposée]
Subject line (with an optional A/B alternative), preview text, personal opening line, 1-3 content blocks each with a clear focus, single primary call-to-action, friendly sign-off.

[Règles de rédaction]
Write in a warm, conversational French tone as if from one person to another (not corporate broadcast voice), keep paragraphs to 1-3 sentences for mobile readability, lead with value before any ask.

[Contraintes]
Target length 150-300 words for the body, one dominant CTA (secondary links allowed but visually subordinate), avoid spam-trigger phrasing ("gratuit", "urgent" in excess, all-caps).`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma liste et mon sujet", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon sujet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le squelette est posé. Ton actualité, ton offre, ta liste précise — c'est ce qui rend l'email vraiment pertinent pour tes abonnés.",
    renderAsset: null,
  },
  {
    slug: "prompt-legendes-reseaux-sociaux-instagram",
    title: "Légendes réseaux sociaux (Instagram)",
    tagline: "Une légende qui capte l'attention et donne envie d'interagir.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT légende Instagram — structure à copier",
    seoDescription:
      "Un prompt complet pour une légende Instagram qui engage : première ligne qui arrête le scroll, corps aéré, CTA et hashtags. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt instagram", "prompt légende instagram ia"],
    ambiancePrompt: `[Rôle]
Act as a social media copywriter specialized in Instagram captions that stop the scroll and drive engagement, distinct from general marketing copy.

[Objectif]
Produce a scroll-stopping caption tied to a specific post/photo, designed to maximize engagement (comments, saves, shares) for that individual piece of content — not a permanent profile statement.

[Structure imposée]
Hook line (first 1-2 lines visible before "more"), short body developing the thought or story, engagement prompt (question or call-to-comment), 5-10 relevant hashtags grouped at the end.

[Règles de rédaction]
Write in a casual, first-person French tone matching Instagram's conversational register, use line breaks for readability, hook must work standalone since it's the only visible text before truncation.

[Contraintes]
Target length 50-150 words for the body (excluding hashtags), one clear engagement prompt per caption, avoid generic hashtag stuffing — hashtags must be topically specific.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon post", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon post", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'accroche est posée. Ta photo précise, ton moment, ton ton — c'est ce qui rend la légende vraiment tienne.",
    renderAsset: null,
  },
  {
    slug: "prompt-script-video-youtube",
    title: "Script vidéo YouTube",
    tagline: "Un script pensé pour la rétention, pas juste pour le texte.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT script vidéo YouTube — structure à copier",
    seoDescription:
      "Un prompt complet pour un script YouTube pensé rétention : hook 15 secondes, promesse, développement rythmé, CTA. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt script youtube", "prompt script vidéo ia"],
    ambiancePrompt: `[Rôle]
Act as a YouTube scriptwriter who understands retention mechanics, pacing, and how spoken delivery differs from written prose.

[Objectif]
Produce a complete, timestamped video script optimized to hook viewers in the first 15 seconds and hold attention through to a clear call-to-action at the end.

[Structure imposée]
Hook (0-15s, states the payoff up front), brief context/promise section, 3-5 main content sections with a pattern interrupt or visual cue note between each, recap, call-to-action (subscribe/next video).

[Règles de rédaction]
Write in spoken, conversational French meant to be read aloud (short sentences, natural rhythm, no complex subordinate clauses), include bracketed notes for visual cues or B-roll where relevant.

[Contraintes]
Match target video length if specified (roughly 150 spoken words per minute), avoid written-style formalities that sound stiff when spoken aloud, one clear CTA at the end only.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma vidéo", flow: "keep-ambiance" },
      { label: "Affiner + adapter à ma vidéo", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le rythme est posé. Ton sujet, tes exemples, tes visuels — c'est ce qui retient vraiment le spectateur.",
    renderAsset: null,
  },
  {
    slug: "prompt-script-podcast",
    title: "Script podcast",
    tagline: "Une trame audio naturelle, du lancement à la conclusion.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT script de podcast — trame à copier",
    seoDescription:
      "Un prompt complet pour une trame de podcast : accroche, annonce du sujet, segments, transitions et conclusion. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt podcast", "prompt script podcast ia"],
    ambiancePrompt: `[Rôle]
Act as a podcast producer and scriptwriter experienced in French audio-only content, understanding the difference between a rigid script and a flexible talking-point outline.

[Objectif]
Produce a structured episode outline (not a word-for-word script) that guides a natural-sounding spoken episode while ensuring key points and transitions aren't missed.

[Structure imposée]
Cold open/hook, intro (show branding + episode topic), 3-5 main talking-point segments with natural transition cues, listener call-to-action (subscribe/review), outro.

[Règles de rédaction]
Write as flexible talking points and guiding questions rather than word-for-word dialogue, French phrasing should sound natural when paraphrased aloud, include suggested transition phrases between segments.

[Contraintes]
Target segment timing notes if episode length is specified, avoid over-scripting to preserve natural conversational flow, one clear listener CTA placed near the end.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon épisode", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon épisode", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La trame est posée. Ton invité, tes anecdotes, ton ton — c'est ce qui rend l'épisode vraiment vivant.",
    renderAsset: null,
  },
  {
    slug: "prompt-section-business-plan",
    title: "Section business plan",
    tagline: "Une section claire et structurée, prête pour investisseurs ou banque.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT business plan — structure de section à copier",
    seoDescription:
      "Un prompt complet pour rédiger une section de business plan claire et chiffrée, prête pour un investisseur ou une banque. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt business plan", "prompt business plan ia"],
    ambiancePrompt: `[Rôle]
Act as a business consultant experienced in writing French business plan sections that satisfy both investor and bank-lender expectations for clarity and rigor.

[Objectif]
Produce a specific, well-argued business plan section (e.g. market analysis, financial projections narrative, or executive summary) that reads as professional and credible, not generic template filler.

[Structure imposée]
Clear section heading, opening statement of the section's core claim, supporting evidence/data points (clearly marked as placeholders where user data is needed), concluding statement tying back to overall business viability.

[Règles de rédaction]
Write in formal, precise French business register, back every claim with a data point or clearly-flagged placeholder rather than vague assertion, avoid startup-pitch hype language in favor of measured credibility.

[Contraintes]
Length appropriate to section type (typically 300-600 words), explicitly flag every place where the user's real figures/data must be inserted, output in French.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon projet", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon projet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure argumentaire est posée. Tes chiffres réels, ton marché précis — c'est ce qui rend la section vraiment crédible.",
    renderAsset: null,
  },
  {
    slug: "prompt-lettre-de-demission",
    title: "Lettre de démission",
    tagline: "Une lettre claire, professionnelle, sans mauvaise surprise.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT lettre de démission — modèle à copier",
    seoDescription:
      "Un prompt complet pour une lettre de démission claire et professionnelle : mention du préavis, ton neutre, aucune formule à risque. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt lettre de démission", "prompt lettre démission ia"],
    ambiancePrompt: `[Rôle]
Act as an HR-savvy professional writer who knows the formal conventions and legal courtesy expected in a French resignation letter.

[Objectif]
Produce a formal, unambiguous resignation letter that clearly states the intent to resign, the notice period, and maintains a professional tone regardless of the underlying reason for leaving.

[Structure imposée]
Sender/recipient header block, formal salutation, opening paragraph stating the resignation clearly and the last working day, brief (optional) reason or thanks paragraph, formal closing.

[Règles de rédaction]
Write in formal French business letter register ("Je vous prie de bien vouloir accepter..."), keep tone neutral and professional even if the underlying context is difficult, avoid emotional language or grievances.

[Contraintes]
Length under 250 words, explicitly state the legal/contractual notice period as a placeholder for the user to confirm, output in French following standard French formal letter conventions.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma situation", flow: "keep-ambiance" },
      { label: "Affiner + adapter à ma situation", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le cadre formel est posé. Ton préavis exact, ton poste, ta date — c'est ce qui rend la lettre vraiment conforme.",
    renderAsset: null,
  },
  {
    slug: "prompt-lettre-de-reclamation",
    title: "Lettre de réclamation",
    tagline: "Une réclamation ferme, argumentée et professionnelle.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT lettre de réclamation — modèle à copier",
    seoDescription:
      "Un prompt complet pour une réclamation ferme et argumentée : faits datés, préjudice, demande précise, délai de réponse. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt lettre de réclamation", "prompt réclamation ia"],
    ambiancePrompt: `[Rôle]
Act as a consumer rights-savvy writer experienced in French formal complaint letters that are firm, factual, and effective at prompting resolution.

[Objectif]
Produce a formal complaint letter that clearly states the issue, the factual timeline, the specific resolution requested, and a reasonable deadline — firm without being aggressive.

[Structure imposée]
Sender/recipient header block with reference numbers, formal salutation, factual issue statement with dates/references, clear statement of the requested resolution, deadline and next-step consequence, formal closing.

[Règles de rédaction]
Write in firm, factual French formal register, state facts chronologically and objectively before making the request, avoid emotional or accusatory language even when the situation is frustrating.

[Contraintes]
Length under 300 words, explicitly flag placeholders for order numbers/dates/reference numbers, output in French following standard "lettre de réclamation" conventions (with optional recommandé avec accusé de réception mention).`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon litige", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon litige", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "L'argumentaire est posé. Tes dates précises, ton préjudice, ta référence de commande — c'est ce qui rend la réclamation vraiment solide.",
    renderAsset: null,
  },
  {
    slug: "prompt-discours-de-mariage",
    title: "Discours de mariage",
    tagline: "Un discours sincère qui marque les esprits sans tomber dans le cliché.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT discours de mariage — trame à copier",
    seoDescription:
      "Un prompt complet pour un discours de mariage sincère : accroche, anecdote, hommage aux mariés, toast final. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt discours mariage", "prompt discours mariage ia"],
    ambiancePrompt: `[Rôle]
Act as a warm, skilled speechwriter experienced in French wedding toasts, balancing genuine emotion with well-timed humor.

[Objectif]
Produce a heartfelt, personalized wedding speech (from a specified role — parent, best man/maid of honor, sibling) that tells a genuine story rather than reciting generic wedding platitudes.

[Structure imposée]
Warm opening (who the speaker is and their relationship to the couple), one or two specific personal anecdotes illustrating the couple's relationship, a heartfelt wish for their future, closing toast line.

[Règles de rédaction]
Write in a warm, personal spoken-French register meant to be read aloud, prioritize one or two specific, vivid anecdotes over generic praise, balance genuine emotion with light, well-placed humor.

[Contraintes]
Target length 2-3 minutes spoken (roughly 300-450 words), explicitly flag where the user must insert real names, anecdotes, and personal details — no generic filler standing in for real content.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mes mariés et mes anecdotes", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon discours", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le squelette émotionnel est posé. Ton anecdote précise, ton lien avec le couple — c'est ce qui rend le discours vraiment inoubliable.",
    renderAsset: null,
  },
  {
    slug: "prompt-eloge-funebre",
    title: "Éloge funèbre",
    tagline: "Un hommage sincère, écrit avec justesse et respect.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT éloge funèbre — trame à copier",
    seoDescription:
      "Un prompt complet pour un hommage juste et respectueux : ouverture, portrait, souvenirs marquants, mot de fin. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt éloge funèbre", "prompt hommage funéraille ia"],
    ambiancePrompt: `[Rôle]
Act as a compassionate, experienced writer skilled in helping people compose a French eulogy that honors a life with dignity, warmth, and authenticity.

[Objectif]
Produce a respectful, personal eulogy structure that helps the speaker honor the deceased's life and character through specific memories, while remaining deliverable within an emotionally difficult moment.

[Structure imposée]
Gentle opening acknowledging the loss and the speaker's relationship to the deceased, reflection on their character (values, what made them who they were), one or two specific personal memories, closing message of gratitude or farewell.

[Règles de rédaction]
Write in a gentle, sincere French register, prioritize specific concrete memories over generic praise, allow space for both grief and warmth — avoid forced positivity.

[Contraintes]
Target length 3-5 minutes spoken (roughly 450-700 words), explicitly flag where the user must insert real names, dates, and personal memories, keep tone respectful throughout regardless of any complexity in the relationship.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à la personne", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon hommage", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le cadre est posé avec respect. Ton souvenir précis, votre lien — c'est ce qui rend l'hommage vraiment sincère.",
    renderAsset: null,
  },
  {
    slug: "prompt-evaluation-annuelle-performance-review",
    title: "Évaluation annuelle (performance review)",
    tagline: "Un entretien annuel structuré, constructif et équitable.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT entretien annuel — trame à copier",
    seoDescription:
      "Un prompt complet pour une évaluation annuelle structurée : bilan factuel, réussites, axes de progrès, objectifs mesurables. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt entretien annuel", "prompt évaluation performance ia"],
    ambiancePrompt: `[Rôle]
Act as an experienced HR manager skilled in writing constructive, fair French performance reviews that balance recognition with clear developmental feedback.

[Objectif]
Produce a structured performance review write-up covering achievements, areas for development, and forward-looking goals, written to be both honest and motivating.

[Structure imposée]
Opening summary of the review period, achievements section with specific examples, areas for development framed constructively (not just criticism), concrete goals for the next period, closing supportive statement.

[Règles de rédaction]
Write in professional, balanced French HR register, back every point (positive or developmental) with a specific, concrete example rather than vague generalization, frame development areas as forward-looking opportunities.

[Contraintes]
Length 400-700 words depending on role seniority, explicitly flag where the user must insert specific real examples/metrics, maintain a fair, non-punitive tone even when addressing underperformance.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon collaborateur", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon équipe", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure équitable est posée. Tes exemples concrets, tes objectifs précis — c'est ce qui rend l'évaluation vraiment utile.",
    renderAsset: null,
  },
  {
    slug: "prompt-offre-emploi-fiche-de-poste",
    title: "Offre d'emploi (fiche de poste)",
    tagline: "Une annonce claire qui attire les bons profils.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT offre d'emploi — fiche de poste à copier",
    seoDescription:
      "Un prompt complet pour une offre d'emploi qui attire les bons profils : intitulé clair, missions, profil, conditions. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt offre emploi", "prompt fiche de poste ia"],
    ambiancePrompt: `[Rôle]
Act as a recruiter and employer-branding copywriter experienced in writing French job postings that attract qualified candidates rather than generic, low-quality applications.

[Objectif]
Produce a complete, publish-ready job posting that clearly communicates the role, expectations, and company culture, structured to help the right candidates self-select in.

[Structure imposée]
Job title and one-line hook, company/team introduction, role summary and key responsibilities (bulleted), required and nice-to-have qualifications (bulleted, clearly separated), benefits/what's offered, application instructions.

[Règles de rédaction]
Write in clear, direct French avoiding corporate jargon and buzzword-stuffed requirement lists, distinguish clearly between must-have and nice-to-have qualifications, be specific about actual day-to-day responsibilities.

[Contraintes]
Length 300-500 words, avoid inflated requirement lists that would discourage qualified candidates from applying, output in French, flag salary range as an optional placeholder to insert.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon poste", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon poste", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure est posée. Ton poste précis, ton équipe, tes vraies conditions — c'est ce qui attire les bons candidats.",
    renderAsset: null,
  },
  {
    slug: "prompt-page-faq-produit",
    title: "Page FAQ produit",
    tagline: "Les vraies questions de tes clients, avec des réponses qui rassurent.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT page FAQ produit — structure à copier",
    seoDescription:
      "Un prompt complet pour une FAQ produit qui rassure : vraies questions clients, réponses courtes, levée d'objections. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt faq", "prompt faq produit ia"],
    ambiancePrompt: `[Rôle]
Act as a customer support and conversion copywriter experienced in writing French product FAQ pages that reduce pre-purchase hesitation and support tickets simultaneously.

[Objectif]
Produce a complete FAQ section addressing the real objections and questions a prospective customer has before purchasing a specific product, structured to reduce friction and build trust.

[Structure imposée]
Questions grouped by theme (e.g. product/shipping/returns/support), each question phrased as the customer would actually ask it, each answer direct and complete without requiring a follow-up question.

[Règles de rédaction]
Write questions in natural, first-person customer phrasing (not corporate rephrasing), keep answers direct and specific (2-4 sentences), address genuine objections rather than only easy softball questions.

[Contraintes]
8-15 questions depending on product complexity, explicitly flag where the user must insert real policy details (shipping times, return windows, pricing), output in French.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon produit", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon produit", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Les vraies questions sont posées. Ton produit précis, tes vraies politiques (livraison, retours) — c'est ce qui rassure vraiment le client.",
    renderAsset: null,
  },
  {
    slug: "prompt-ordre-du-jour-de-reunion",
    title: "Ordre du jour de réunion",
    tagline: "Une réunion cadrée, avec des objectifs clairs pour chaque point.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT ordre du jour de réunion — à copier",
    seoDescription:
      "Un prompt complet pour un ordre du jour cadré : objectif par point, durée, responsable, décisions attendues. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt ordre du jour", "prompt réunion ia"],
    ambiancePrompt: `[Rôle]
Act as an experienced project manager skilled in structuring French meeting agendas that keep discussions focused and produce actionable outcomes.

[Objectif]
Produce a clear, time-boxed meeting agenda that states the purpose of each item, who owns it, and what decision or outcome is expected — designed to prevent meetings from drifting.

[Structure imposée]
Meeting title, date/time/duration, attendee list, objective statement (one sentence: why this meeting exists), agenda items each with owner and time allocation, decisions-needed section, next-steps/action-items placeholder.

[Règles de rédaction]
Write each agenda item as an actionable statement, not a vague topic ("Décider du budget Q3" rather than "Budget"), keep language direct and French professional register.

[Contraintes]
Total time allocations must sum to the stated meeting duration, limit to 3-6 agenda items to keep the meeting focused, explicitly flag where real attendee names/times must be inserted.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma réunion", flow: "keep-ambiance" },
      { label: "Affiner + adapter à ma réunion", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le cadre est posé. Tes participants réels, tes sujets précis, ta durée — c'est ce qui rend la réunion vraiment efficace.",
    renderAsset: null,
  },
  {
    slug: "prompt-trame-presentation-pitch-deck",
    title: "Trame de présentation (pitch deck)",
    tagline: "La structure slide par slide d'une présentation qui convainc.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT pitch deck — trame slide par slide à copier",
    seoDescription:
      "Un prompt complet pour un pitch deck investisseur : problème, solution, marché, traction, équipe, demande. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt pitch deck", "prompt présentation investisseur ia"],
    ambiancePrompt: `[Rôle]
Act as a presentation strategist experienced in structuring French pitch decks (investor, client, or internal) that build a clear, persuasive narrative arc across multiple slides.

[Objectif]
Produce a complete slide-by-slide outline (not a spoken script) where each slide has a single clear message, structured to build toward a specific ask or decision by the final slide.

[Structure imposée]
Title slide, problem/context slide, solution/offer slide, 2-4 supporting slides (market/traction/team/product depending on pitch type), objection-handling slide, closing ask slide with clear next step — one core message per slide.

[Règles de rédaction]
Write each slide as a headline statement plus 2-3 supporting bullet points (not paragraphs — decks are read, not narrated line by line), keep language punchy and confident in French.

[Contraintes]
8-12 slides total unless otherwise specified, one idea per slide (no slide should require the audience to process two separate arguments), explicitly flag where real data/numbers must be inserted.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à ma startup", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon projet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La trame slide par slide est posée. Tes chiffres réels, ton offre précise — c'est ce qui rend le deck vraiment convaincant.",
    renderAsset: null,
  },
  {
    slug: "prompt-pitch-elevator-30-secondes",
    title: "Pitch elevator (30 secondes)",
    tagline: "Un pitch oral qui tient en 30 secondes et donne envie d'en savoir plus.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT pitch elevator 30 secondes — à copier",
    seoDescription:
      "Un prompt complet pour un pitch oral de 30 secondes : accroche, problème, solution, preuve, ouverture. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt elevator pitch", "prompt pitch 30 secondes ia"],
    ambiancePrompt: `[Rôle]
Act as a communication coach specialized in French elevator pitches, skilled at compressing a complex idea into a short, spoken, memorable statement.

[Objectif]
Produce a single, tightly-written spoken script (roughly 30 seconds when read aloud) that clearly states what the speaker does, for whom, and why it matters — memorable enough to say without notes.

[Structure imposée]
Opening hook (who you help + the problem, one sentence), what you offer (one sentence), what makes it different/credible (one sentence), closing line inviting further conversation.

[Règles de rédaction]
Write in natural spoken French, not written prose — short sentences, no subordinate clauses that are hard to deliver aloud, must be memorable enough to internalize rather than read from a card.

[Contraintes]
Strict target of 75-90 spoken words (roughly 30 seconds at natural pace), no jargon requiring further explanation, single version only — this is a one-shot spoken script, not a multi-section document.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon activité", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon pitch", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le squelette oral est posé. Ton activité précise, ton public cible — c'est ce qui rend le pitch vraiment mémorable à l'oral.",
    renderAsset: null,
  },
  {
    slug: "prompt-resume-de-livre-synopsis",
    title: "Résumé de livre / synopsis",
    tagline: "Un résumé fidèle qui donne l'essentiel sans spoiler ce qu'il ne faut pas.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT résumé de livre et synopsis — à copier",
    seoDescription:
      "Un prompt complet pour un résumé fidèle : intrigue principale, personnages, thèmes, sans divulguer le dénouement. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt résumé de livre", "prompt synopsis ia"],
    ambiancePrompt: `[Rôle]
Act as a skilled literary editor experienced in writing French book synopses that accurately represent a work's content and tone for different purposes (back-cover blurb, book club summary, or full plot synopsis).

[Objectif]
Produce a summary of a specified book at the requested depth (short back-cover teaser vs. full plot synopsis), accurately representing the work's content, themes, and tone without misrepresenting it.

[Structure imposée]
For a teaser: hook line, premise, central tension, no ending revealed. For a full synopsis: setup, main plot progression through key turning points, resolution — clearly labeled if it contains spoilers.

[Règles de rédaction]
Match the tone of the summary to the tone of the source work (a thriller synopsis should feel tense, a comedy should feel light), stay factually accurate to the actual plot rather than inventing details.

[Contraintes]
150-300 words for a teaser, 400-800 words for a full synopsis, explicitly state whether the output contains spoilers, output in French.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon livre", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon livre", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le format est posé. Le livre précis, la profondeur voulue (teaser ou synopsis complet) — c'est ce qui rend le résumé vraiment fidèle.",
    renderAsset: null,
  },
  {
    slug: "prompt-requete-sql-a-partir-dune-description",
    title: "Requête SQL à partir d'une description",
    tagline: "Une requête SQL fonctionnelle à partir d'une simple description en français.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt Claude requête SQL — structure à copier",
    seoDescription:
      "Un prompt complet pour obtenir une requête SQL correcte à partir d'une description en français : schéma, contraintes, explication. À copier sans inscription.",
    targetKeywords: ["prompt claude sql", "prompt générer requête sql ia"],
    ambiancePrompt: `[Rôle]
Act as a senior database engineer skilled at translating plain-language business questions into correct, efficient SQL queries across common dialects (PostgreSQL, MySQL, SQL Server).

[Objectif]
Produce a working SQL query that precisely answers the described data request, including a brief explanation of the query's logic and any assumptions made about the schema.

[Structure imposée]
Assumed table/column names stated explicitly at the top (as an assumption block), the SQL query itself formatted and readable, a short plain-French explanation of what the query does and why.

[Règles de rédaction]
Write clean, readable SQL with consistent capitalization (keywords uppercase) and clear aliasing, favor explicit JOIN syntax over implicit joins, comment complex logic inline.

[Contraintes]
State which SQL dialect the query targets, flag any ambiguity in the original description that required an assumption, avoid SELECT * in production-style examples — specify needed columns explicitly.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon schéma de données", flow: "keep-ambiance" },
      { label: "Affiner + adapter à ma base", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La logique est posée. Ton schéma réel, tes noms de tables et colonnes — c'est ce qui rend la requête vraiment exécutable.",
    renderAsset: null,
  },
  {
    slug: "prompt-generation-de-tests-unitaires",
    title: "Génération de tests unitaires",
    tagline: "Des tests unitaires solides, couvrant les cas limites qui comptent.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt Claude tests unitaires — structure à copier",
    seoDescription:
      "Un prompt complet pour générer des tests unitaires solides : cas nominaux, cas limites, erreurs attendues, isolation. À copier sans inscription.",
    targetKeywords: ["prompt claude tests unitaires", "prompt génération de tests ia"],
    ambiancePrompt: `[Rôle]
Act as a senior software engineer experienced in writing thorough, maintainable unit tests that catch real bugs rather than just inflating coverage metrics.

[Objectif]
Produce a complete unit test suite for a specified function or module, covering happy-path behavior, edge cases, and error conditions, in the testing framework appropriate to the language.

[Structure imposée]
Setup/fixture block if needed, grouped test cases (happy path, edge cases, error handling) each with a clearly descriptive test name stating what is being verified, assertions that check specific expected behavior.

[Règles de rédaction]
Write descriptive test names that state the expected behavior in plain terms (e.g. "throws error when input is negative" rather than "test1"), keep each test focused on a single behavior.

[Contraintes]
Cover at minimum: standard expected input, boundary/edge-case input, and invalid/error input, specify the testing framework and language being targeted, flag any external dependencies that would need mocking.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon code", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon code", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La couverture logique est posée. Ta fonction réelle, ton langage précis — c'est ce qui rend les tests vraiment fiables.",
    renderAsset: null,
  },
  {
    slug: "prompt-documentation-api",
    title: "Documentation d'API",
    tagline: "Une documentation claire que les développeurs peuvent suivre sans poser de questions.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt Claude documentation d'API — structure à copier",
    seoDescription:
      "Un prompt complet pour documenter une API : endpoints, paramètres, exemples de requête et réponse, codes d'erreur. À copier sans inscription.",
    targetKeywords: ["prompt claude documentation api", "prompt doc technique ia"],
    ambiancePrompt: `[Rôle]
Act as a technical writer specialized in developer-facing API documentation, understanding what information a developer needs to successfully integrate an endpoint without guesswork.

[Objectif]
Produce complete, developer-ready documentation for a specified API endpoint, including all information needed to make a successful request and correctly handle the response.

[Structure imposée]
Endpoint summary (method + path + one-line purpose), authentication requirements, request parameters table (name/type/required/description), example request, response schema, example response, common error codes with explanations.

[Règles de rédaction]
Write in precise, unambiguous technical English or French as specified, use consistent formatting for parameter tables, include realistic example values rather than placeholder text like "string".

[Contraintes]
Every parameter must state whether it's required or optional and its type, include at least one full example request/response pair, flag any assumptions about the API's actual behavior that need verification.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon API", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon API", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure technique est posée. Ton endpoint réel, tes paramètres exacts — c'est ce qui rend la doc vraiment utilisable.",
    renderAsset: null,
  },
  {
    slug: "prompt-regex-a-partir-dune-description",
    title: "Regex à partir d'une description",
    tagline: "Une expression régulière qui fait exactement ce qu'il faut, expliquée simplement.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt Claude expression régulière — structure à copier",
    seoDescription:
      "Un prompt complet pour obtenir une regex juste à partir d'une description : cas couverts, cas exclus, explication pas à pas. À copier sans inscription.",
    targetKeywords: ["prompt claude regex", "prompt expression régulière ia"],
    ambiancePrompt: `[Rôle]
Act as a developer skilled at translating plain-language pattern-matching requirements into correct, efficient regular expressions, and explaining them in terms a non-regex-expert can follow.

[Objectif]
Produce a working regular expression that precisely matches the described pattern, along with a plain-language breakdown of what each part of the expression does and test examples showing matches and non-matches.

[Structure imposée]
The regex pattern itself (clearly formatted), a part-by-part plain-French explanation of the pattern, 2-3 example strings that should match, 2-3 example strings that should not match.

[Règles de rédaction]
Explain each component of the regex in plain terms rather than assuming regex fluency, favor readable patterns (named groups, comments if the language/flavor supports it) over maximally clever one-liners.

[Contraintes]
State which regex flavor/language the pattern targets (JavaScript, Python, PCRE, etc., since syntax varies), flag any edge cases the pattern deliberately does or doesn't handle, avoid catastrophic backtracking risk in the pattern.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon besoin", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon besoin", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La logique de correspondance est posée. Ton cas d'usage réel, tes exemples précis — c'est ce qui rend la regex vraiment fiable.",
    renderAsset: null,
  },
  {
    slug: "prompt-checklist-de-revue-de-code",
    title: "Checklist de revue de code",
    tagline: "Une revue de code structurée qui ne laisse rien passer.",
    category: "text",
    tool: "claude",
    seoTitle: "Prompt Claude revue de code — checklist à copier",
    seoDescription:
      "Un prompt complet pour une revue de code structurée : correction, lisibilité, sécurité, performance, tests. À copier sans inscription.",
    targetKeywords: ["prompt claude revue de code", "prompt code review ia"],
    ambiancePrompt: `[Rôle]
Act as a senior engineer experienced in conducting thorough, constructive code reviews that catch real issues without being pedantic or discouraging.

[Objectif]
Produce a structured code review checklist adapted to the specified language/context, covering correctness, readability, security, and maintainability, usable as a repeatable review process.

[Structure imposée]
Grouped checklist sections (correctness/logic, readability/naming, error handling, security, performance, tests), each item phrased as a concrete yes/no question rather than a vague principle.

[Règles de rédaction]
Phrase each checklist item as a specific, checkable question ("Are all user inputs validated before use?" rather than "Check security"), prioritize the items most likely to catch real bugs over stylistic nitpicks.

[Contraintes]
Adapt specific items to the stated language/framework where relevant (e.g. SQL injection checks for backend code, prop-type checks for frontend code), keep the list to 15-25 items to remain practically usable.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon projet", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon projet", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le cadre de revue est posé. Ton langage précis, ton contexte projet — c'est ce qui rend la checklist vraiment adaptée à ton code.",
    renderAsset: null,
  },
  {
    slug: "prompt-bio-instagram-reseaux-sociaux",
    title: "Bio Instagram / réseaux sociaux",
    tagline: "Une bio de profil qui dit qui tu es en quelques secondes.",
    category: "text",
    tool: "gpt4",
    seoTitle: "Prompt ChatGPT bio Instagram — structure à copier",
    seoDescription:
      "Un prompt complet pour une bio de profil percutante : positionnement en une ligne, preuve, appel à l'action, format court. À copier sans inscription.",
    targetKeywords: ["prompt chatgpt bio instagram", "prompt bio réseaux sociaux ia"],
    ambiancePrompt: `[Rôle]
Act as a personal branding copywriter specialized in writing French social media bios that communicate identity and value instantly within tight character limits.

[Objectif]
Produce a permanent profile bio (distinct from a single-post caption) that clearly communicates who the person or brand is, what they offer, and why to follow — readable in under 3 seconds.

[Structure imposée]
Identity/role line (who you are), value proposition line (what you offer or what followers get), personality or credibility marker (optional emoji-supported line), single call-to-action line (link/DM/shop).

[Règles de rédaction]
Write in extremely condensed, high-signal French — every word must earn its place, use line breaks and sparse emoji as visual structure rather than decoration, avoid vague self-descriptions ("passionné(e) de...") in favor of concrete value statements.

[Contraintes]
Strict 150-character total limit (Instagram bio constraint), one clear call-to-action only, flag where a real link/handle must be inserted.`,
    buttons: [
      { label: "Affiner la structure", flow: "refine-ambiance" },
      { label: "Adapter à mon profil", flow: "keep-ambiance" },
      { label: "Affiner + adapter à mon profil", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "La structure de la bio est posée. Ton positionnement précis, ton lien — c'est ce qui rend le profil vraiment identifiable en un coup d'œil.",
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
  {
    slug: "prompt-video-reels-tiktok-vertical",
    title: "Vidéo réseaux sociaux verticale (Reels/TikTok)",
    tagline: "Un format vertical pensé pour arrêter le pouce.",
    category: "video",
    tool: "sora",
    seoTitle: "Prompt vidéo Reels / TikTok vertical — style à copier",
    seoDescription:
      "Un prompt de style pour une vidéo verticale 9:16 Reels/TikTok : montage rapide, hooks, lumière punchy, rendu mobile. À copier tel quel, sans inscription.",
    targetKeywords: ["prompt sora tiktok", "prompt video reels"],
    ambiancePrompt: `[Visual style]
Vertical 9:16 social media video, energetic and punchy handheld-feel
aesthetic, bright modern lifestyle look, fast-paced editing rhythm

[Cinematography]
Quick dynamic cuts, whip pans, close-up hooks in the first second, mix
of handheld motion and stabilized inserts

[Lighting & time]
Bright natural daylight or clean studio lighting, high-key exposure,
crisp and punchy contrast

[Color grade]
Vibrant modern social-media grade, punchy saturation, clean skin tones,
slight warmth

[Lens & finish]
Sharp digital look, 30fps smooth motion, subtle motion blur on fast
pans, optimized for mobile viewing`,
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
    slug: "prompt-video-interview-temoignage",
    title: "Vidéo interview / témoignage client",
    tagline: "Un cadrage qui inspire confiance, une lumière qui ne ment pas.",
    category: "video",
    tool: "sora",
    seoTitle: "Prompt vidéo interview / témoignage — style à copier",
    seoDescription:
      "Un prompt de style pour une vidéo interview/témoignage : cadrage portrait, lumière douce, profondeur de champ, rendu 85mm broadcast. À copier sans inscription.",
    targetKeywords: ["prompt sora interview", "prompt video témoignage"],
    ambiancePrompt: `[Visual style]
Clean corporate interview setup, warm and trustworthy documentary look,
shallow depth of field portrait framing

[Cinematography]
Static or subtle slow push-in, eye-level camera, three-quarter framing,
soft focus falloff on the background

[Lighting & time]
Soft key light with gentle fill, natural window-light feel, warm
neutral color temperature, no harsh shadows

[Color grade]
Natural true-to-life grade, warm neutral tones, gentle contrast,
professional and approachable

[Lens & finish]
85mm-equivalent look, creamy background blur, clean 24fps cinematic
motion, broadcast-quality sharpness`,
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
    slug: "prompt-video-motion-design-intro-logo",
    title: "Vidéo motion design intro logo / chaîne",
    tagline: "Trois secondes pour poser une identité qu'on n'oublie pas.",
    category: "video",
    tool: "sora",
    seoTitle: "Prompt vidéo motion design intro logo — style à copier",
    seoDescription:
      "Un prompt de style pour une intro logo en motion design : formes géométriques, reveal fluide, palette de marque, rendu vectoriel 60fps. À copier sans inscription.",
    targetKeywords: ["prompt sora motion design", "prompt video intro logo"],
    ambiancePrompt: `[Visual style]
Clean minimal motion design intro, modern tech-brand aesthetic,
geometric shapes and smooth logo reveal

[Cinematography]
Smooth camera-less motion graphics movement, elegant logo build-up,
precise timing, no organic camera shake

[Lighting & time]
Studio-clean lighting simulation, soft gradient background, subtle glow
on key elements

[Color grade]
Bold brand-color palette, high contrast between background and logo,
crisp modern grade

[Lens & finish]
Ultra-clean vector-sharp render, smooth 60fps motion, subtle particle
or light-trail accents, polished commercial finish`,
    buttons: [
      { label: "Affiner le style", flow: "refine-ambiance" },
      { label: "Créer ma scène", flow: "keep-ambiance" },
      { label: "Affiner + créer ma scène", flow: "refine-and-subject" },
    ],
    fomoMicrocopy:
      "Le style pose l'ambiance. Ton sujet, ton action, ton découpage de plans — on les construit avec toi.",
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

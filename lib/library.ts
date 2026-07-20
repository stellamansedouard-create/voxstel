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

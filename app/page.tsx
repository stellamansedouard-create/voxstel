import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

const CATEGORY_FEATURES = [
  {
    id: "image",
    icon: "🖼️",
    title: "Image",
    tools: "7 outils — Midjourney, DALL-E 3, Firefly…",
    desc: "Style, éclairage, composition, ratio : chaque paramètre visuel précisément défini pour votre IA.",
  },
  {
    id: "video",
    icon: "🎬",
    title: "Vidéo",
    tools: "6 outils — Sora, Runway, Pika, Luma AI…",
    desc: "Mouvement de caméra, transitions, durée de scène : vos vidéos IA réussies dès le premier essai.",
  },
  {
    id: "text",
    icon: "✍️",
    title: "Texte / Code",
    tools: "6 outils — Claude, GPT-4, Gemini, Llama…",
    desc: "Ton, structure, complexité, format : des instructions qui extraient le meilleur des grands modèles.",
  },
  {
    id: "music",
    icon: "🎵",
    title: "Musique",
    tools: "4 outils — Suno, Udio, AIVA, Stable Audio",
    desc: "Genre, tempo, instruments, arrangement : exprimez en mots ce que vous entendez dans votre tête.",
  },
];

const MINI_STEPS = [
  { n: "01", label: "Choisissez l'IA" },
  { n: "02", label: "Décrivez librement" },
  { n: "03", label: "Affinez avec Voxstel" },
  { n: "04", label: "Copiez le prompt" },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-background overflow-x-hidden">

        {/* ─────────────────────────────────────────────────────────────
            HERO — Aspirationnel
        ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">

          {/* Ambient amber blobs */}
          <div
            className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(200,145,10,0.08) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(200,145,10,0.05) 0%, transparent 70%)",
              transform: "translate(-30%, 20%)",
            }}
            aria-hidden
          />

          <div className="relative max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-10 border border-accent/20">
              <span aria-hidden>✦</span>
              <span>Prompts IA · Image · Vidéo · Texte · Musique</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-[64px] font-bold text-foreground leading-[1.06] tracking-tight mb-7 text-balance">
              Vous avez l'idée.{" "}
              <br className="hidden sm:block" />
              <span className="text-accent">Voxstel trouve les mots.</span>
            </h1>

            <p className="text-xl text-muted leading-relaxed max-w-xl mx-auto mb-11 text-balance">
              Décrivez ce que vous imaginez — même en quelques mots.
              Voxstel pose les bonnes questions et génère le prompt parfait
              pour votre IA, en anglais et en français.
            </p>

            {/* CTA unique */}
            <div className="flex justify-center">
              <Link
                href="/generate/image"
                className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8 shadow-md"
              >
                Essayer gratuitement <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            PROBLÈME → SOLUTION — Le fossé du prompt
        ───────────────────────────────────────────────────────────── */}
        <section
          className="relative py-24 px-4 overflow-hidden"
          style={{ backgroundColor: "rgba(200,145,10,0.035)" }}
        >
          <div className="relative max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Texte */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-5 block">
                  Vous le vivez peut-être
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-7 text-balance leading-tight">
                  Un bon prompt, ça ne s'improvise pas.
                </h2>

                <p className="text-lg text-muted leading-relaxed mb-5 text-balance">
                  Vous voyez parfaitement la scène dans votre tête. L'image que vous voulez
                  créer. La vidéo. La musique. Mais quand vous commencez à taper, les mots
                  ne viennent pas — ou ils viennent, et le résultat ne ressemble à rien.
                </p>

                <p className="text-lg text-muted leading-relaxed mb-10 text-balance">
                  Entre votre vision et ce que l'IA comprend, il y a un langage.
                  Chaque outil a ses propres règles, ses propres paramètres.
                </p>

                {/* Solution callout */}
                <div
                  className="flex items-start gap-4 px-7 py-5 rounded-2xl border"
                  style={{
                    backgroundColor: "rgba(200,145,10,0.06)",
                    borderColor: "rgba(200,145,10,0.25)",
                  }}
                >
                  <span className="text-accent text-2xl mt-0.5 flex-shrink-0" aria-hidden>✦</span>
                  <p className="text-base text-foreground leading-relaxed">
                    Voxstel maîtrise ce langage pour vous.{" "}
                    <span className="font-semibold text-accent">
                      Décrivez votre idée — il génère le prompt parfait.
                    </span>
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-sm lg:max-w-md">
                  <Image
                    src="/images/probleme-solution-visage.png"
                    alt="De la frustration à la satisfaction créative avec Voxstel"
                    width={480}
                    height={560}
                    className="rounded-2xl w-full h-auto object-cover"
                    style={{
                      boxShadow:
                        "0 8px 40px rgba(200,145,10,0.14), 0 2px 12px rgba(0,0,0,0.07)",
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            TRANSFORMATION — Avant / Après visuel
        ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
                La différence Voxstel
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
                De l'idée brute au prompt parfait
              </h2>
              <p className="text-lg text-muted max-w-md mx-auto">
                En 30 secondes. Sans connaître les règles du prompt engineering.
              </p>
            </div>

            {/* Before / After */}
            <div className="grid md:grid-cols-[1fr_64px_1fr] items-start gap-4 max-w-4xl mx-auto mb-12">

              {/* BEFORE */}
              <div className="bg-card border border-border rounded-2xl p-7 shadow-sm flex flex-col">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-card-hover flex items-center justify-center text-lg flex-shrink-0">
                    💭
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                      Ce que vous tapez
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted/70 block mb-1.5">
                      🇬🇧 English
                    </span>
                    <p className="text-xs text-foreground font-mono leading-relaxed bg-card-hover rounded-xl p-3 italic">
                      "a person thinking"
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted/70 block mb-1.5">
                      🇫🇷 Français
                    </span>
                    <p className="text-xs text-foreground leading-relaxed bg-card-hover rounded-xl p-3 italic">
                      "une personne qui réfléchit"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted/60 mb-5">
                  <span>⚠</span>
                  <span>Trop vague — l'IA ne sait pas par où commencer</span>
                </div>
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src="/images/transformation-avant.png"
                    alt="Résultat IA avec un prompt basique — image confuse et sans âme"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* ARROW */}
              <div className="flex items-center justify-center pt-[72px]" aria-hidden>
                {/* Desktop: horizontal arrow */}
                <div className="hidden md:flex flex-col items-center gap-1.5">
                  <div className="h-px w-8 bg-accent/30" />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                    style={{ backgroundColor: "#C8910A" }}
                  >
                    →
                  </div>
                  <div className="h-px w-8 bg-accent/30" />
                </div>
                {/* Mobile: vertical arrow */}
                <div className="md:hidden flex flex-col items-center gap-1.5 py-2">
                  <div className="w-px h-6 bg-accent/30" />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: "#C8910A" }}
                  >
                    ↓
                  </div>
                  <div className="w-px h-6 bg-accent/30" />
                </div>
              </div>

              {/* AFTER */}
              <div
                className="bg-card rounded-2xl p-7 shadow-md flex flex-col"
                style={{
                  border: "2px solid rgba(200,145,10,0.30)",
                  backgroundColor: "rgba(200,145,10,0.025)",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: "rgba(200,145,10,0.12)" }}
                    >
                      ✨
                    </div>
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                      Votre prompt Voxstel
                    </p>
                  </div>
                  <span className="text-xs text-muted bg-card-hover px-2 py-1 rounded-lg border border-border">
                    Midjourney
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted/70 block mb-1.5">
                      🇬🇧 English
                    </span>
                    <p className="text-xs text-foreground font-mono leading-relaxed bg-card-hover rounded-xl p-3">
                      A young woman gazing thoughtfully out a rain-streaked window, warm amber lamplight illuminating her face, cinematic side lighting, shallow depth of field, photorealistic portrait
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted/70 block mb-1.5">
                      🇫🇷 Français
                    </span>
                    <p className="text-xs text-foreground leading-relaxed bg-card-hover rounded-xl p-3">
                      Une jeune femme regardant pensivement par une fenêtre striée de pluie, lumière chaude ambrée illuminant son visage, éclairage cinématographique latéral, faible profondeur de champ, portrait photoréaliste
                    </p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src="/images/transformation-apres.png"
                    alt="Résultat IA avec le prompt optimisé Voxstel — portrait photoréaliste cinématographique"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Mini étapes horizontales */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 max-w-2xl mx-auto">
              {MINI_STEPS.map((step, i) => (
                <div key={step.n} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step.n}
                    </span>
                    <span className="text-sm text-muted whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < MINI_STEPS.length - 1 && (
                    <span className="text-accent/40 mx-1" aria-hidden>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            FONCTIONNALITÉS — 4 catégories
        ───────────────────────────────────────────────────────────── */}
        <section id="fonctionnalites" className="py-20 px-4 relative overflow-hidden">

          {/* Decorative accent shape */}
          <div
            className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(200,145,10,0.05) 0%, transparent 65%)",
              transform: "translate(40%, -50%)",
            }}
            aria-hidden
          />

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
                Fonctionnalités
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                4 univers créatifs. Chacun maîtrisé.
              </h2>
              <p className="text-lg text-muted max-w-xl mx-auto text-balance">
                Pas un formulaire générique — une analyse intelligente qui adapte
                ses questions à votre IA cible et à votre description.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {CATEGORY_FEATURES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/generate/${cat.id}`}
                  className="group text-left bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-accent/35 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mt-0.5">
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">{cat.title}</h3>
                      <p className="text-xs text-muted font-medium mb-3">{cat.tools}</p>
                      <p className="text-sm text-muted leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                    <span className="text-sm font-semibold text-accent">Essayer cette catégorie</span>
                    <span className="text-accent" aria-hidden>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            CTA FINAL — Chaleureux
        ───────────────────────────────────────────────────────────── */}
        <section className="py-24 px-4 relative overflow-hidden">

          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,145,10,0.07) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative max-w-2xl mx-auto text-center">
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-8" aria-hidden>
              <div className="h-px w-12 bg-accent/30" />
              <span className="text-accent text-lg">✦</span>
              <div className="h-px w-12 bg-accent/30" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5 text-balance leading-tight">
              Votre prochaine création mérite
              <br />
              <span className="text-accent">un prompt à sa hauteur.</span>
            </h2>

            <p className="text-lg text-muted mb-10 text-balance leading-relaxed">
              Gratuit pour commencer — sans carte bancaire, sans engagement.
              <br />
              Prêt en 30 secondes.
            </p>

            <Link
              href="/generate/image"
              className="btn-primary inline-flex items-center gap-2.5 text-base py-4 px-9 shadow-md"
            >
              Créer mon premier prompt <span aria-hidden>→</span>
            </Link>

            <p className="text-xs text-muted mt-5">
              Déjà 23 outils IA supportés · Image · Vidéo · Texte · Musique
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

"use client";

// Drives the three library-page flows:
//
//   refine-ambiance     ambiance round -> refined ambiance. Stops there (free).
//   keep-ambiance       straight to the subject, ambiance frozen as-is.
//   refine-and-subject  ambiance round, then the subject.
//
// The ambiance is frozen the moment the subject step is entered, and the subject
// rounds are seeded with the frozen text so they can never reopen it.
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGeneratorStore } from "@/store/useGeneratorStore";
import { getWording } from "@/lib/ambiance";
import { writeHandoff } from "@/lib/ambiance-handoff";
import { getStoredUTM } from "@/lib/utm.client";
import DirectQuestions from "./DirectQuestions";
import LockedAmbiance from "./LockedAmbiance";
import SubjectInput from "./SubjectInput";
import LayeredResult from "./LayeredResult";
import Paywall from "./Paywall";
import Spinner from "@/components/ui/Spinner";
import type { Category, DirectQuestion, GeneratorStep, LayeredOutput } from "@/types";

interface LibraryJourneyProps {
  category: Category;
}

interface QAEntry {
  question: string;
  theme: string;
  answer: string;
  layer: "ambiance" | "subject";
}

export default function LibraryJourney({ category }: LibraryJourneyProps) {
  const store = useGeneratorStore();
  const router = useRouter();
  const pathname = usePathname();
  const w = getWording(category);

  // Q&A of every round, sent with the delivery so the journey is measurable.
  const [qaLog, setQaLog] = useState<QAEntry[]>([]);
  const askedRef = useRef(false);
  // Step to return to when the user backs out of the paywall.
  const [paywallReturn, setPaywallReturn] = useState<GeneratorStep>("subject");

  const ambiance = store.ambiance;

  /** A delivery hit 0 credits: no engine call ran, nothing was charged. */
  function showPaywall() {
    setPaywallReturn(store.step);
    store.setLoading(false);
    store.setStep("paywall");
  }

  /** Restores the handoff and bounces to login without losing the journey. */
  const bounceToLogin = useCallback(() => {
    if (!ambiance || !store.ambianceFlow || !store.tool) return;
    writeHandoff({
      category,
      tool: store.tool,
      ambiancePrompt: ambiance.prompt,
      flow: store.ambianceFlow,
      pageSlug: ambiance.sourcePageSlug ?? "",
      pageTitle: "",
    });
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ambiance, store.ambianceFlow, store.tool, category, router, pathname]);

  /** Seeds the refining engine with the page prompt (or the subject). */
  const askQuestions = useCallback(
    async (mode: "ambiance" | "subject") => {
      if (!ambiance || !store.tool) return;
      store.setLoading(true);
      store.setError(null);

      // Wall off a 0-credit user BEFORE the question engine spends a call. This
      // is a UX pre-gate only; the server-side delivery gates still enforce.
      // Fail open on any non-401 read error so a transient blip can't block a
      // paying user — the delivery gate will still catch a real 0 balance.
      try {
        const balRes = await fetch("/api/credits/balance");
        if (balRes.status === 401) return bounceToLogin();
        if (balRes.ok) {
          const bal = (await balRes.json()) as {
            credits: number;
            unlimited: boolean;
          };
          if (!bal.unlimited && bal.credits < 1) return showPaywall();
        }
      } catch {
        // network hiccup -> fall through, server gate still protects delivery
      }

      try {
        const res = await fetch("/api/refine-precision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: store.tool,
            category,
            description: mode === "ambiance" ? ambiance.prompt : store.subject,
            previousQA: [],
            ambianceSeed: { mode, ambiancePrompt: ambiance.prompt },
          }),
        });
        if (res.status === 401) return bounceToLogin();
        // The question engine is credit-gated server-side now. Same paywall the
        // delivery step raises, so backing out returns to the current step.
        if (res.status === 402) return showPaywall();
        if (!res.ok) throw new Error("questions failed");

        const data: { questions: DirectQuestion[] } = await res.json();
        const questions = data.questions ?? [];

        if (mode === "subject" && questions.length === 0) {
          await deliver({});
          return;
        }
        store.setLayerQuestions(
          questions,
          mode === "ambiance" ? "ambiance" : "subject-questions"
        );
      } catch {
        store.setError("Erreur lors de l'analyse. Veuillez réessayer.");
      } finally {
        store.setLoading(false);
      }
    },
    [ambiance, store.tool, store.subject, category] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Seed the ambiance round once, on entry.
  useEffect(() => {
    if (store.step === "ambiance" && !askedRef.current && store.directQuestions.length === 0) {
      askedRef.current = true;
      void askQuestions("ambiance");
    }
  }, [store.step, store.directQuestions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Maps the current round's answers to `label -> answer` and logs the Q&A. */
  function collectAnswers(layer: "ambiance" | "subject") {
    const byLabel: Record<string, string> = {};
    const entries: QAEntry[] = [];
    for (const q of store.directQuestions) {
      const answer = store.directAnswers[q.id]?.trim();
      if (!answer) continue;
      byLabel[q.label] = answer;
      entries.push({ question: q.label, theme: q.theme ?? "", answer, layer });
    }
    setQaLog((log) => [...log, ...entries]);
    return { byLabel, entries };
  }

  /** Applies the ambiance answers. Free when it feeds the subject; paid when the
   *  refined ambiance is itself the delivered product (refine-ambiance flow). */
  async function submitAmbiance() {
    if (!ambiance || !store.tool) return;
    const { byLabel, entries } = collectAnswers("ambiance");

    // refine-and-subject: this refine is an INTERMEDIATE step, not a delivery.
    // It stays free and ungated — the single charge happens on the subject.
    if (store.ambianceFlow === "refine-and-subject") {
      store.setLoading(true);
      store.setError(null);
      try {
        const res = await fetch("/api/ambiance/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            tool: store.tool,
            ambiancePrompt: ambiance.prompt,
            answers: byLabel,
          }),
        });
        if (res.status === 401) return bounceToLogin();
        if (res.status === 402) return showPaywall();
        if (!res.ok) throw new Error("apply failed");

        const { ambiance: refined } = (await res.json()) as { ambiance: string };
        store.setAmbiancePrompt(refined);
        store.lockAmbiance();
        store.setStep("subject");
      } catch {
        store.setError("Erreur lors de l'affinage. Veuillez réessayer.");
      } finally {
        store.setLoading(false);
      }
      return;
    }

    // refine-ambiance: the refined ambiance IS the delivered product, so it is
    // a paid delivery — 1 credit as soon as the flow reaches this final step,
    // whether or not the result differs from the page's raw prompt.
    store.setLoading(true);
    store.setError(null);
    try {
      const res = await fetch("/api/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layer: "ambiance",
          category,
          tool: store.tool,
          ambiancePrompt: ambiance.prompt,
          answers: byLabel,
          sourcePageSlug: ambiance.sourcePageSlug ?? null,
          questionsAnswers: entries,
          _tracking: getStoredUTM(),
        }),
      });
      if (res.status === 401) return bounceToLogin();
      if (res.status === 402) return showPaywall();
      if (!res.ok) throw new Error("deliver failed");

      // historyId — added 22/07/2026 so LayeredResult can reconnect
      // was_copied for this delivery, same mechanism as the classic
      // generator. /api/deliver has returned it since lib/deliver.ts's
      // chargeAndRecord started selecting the inserted row's id; only this
      // client-side destructure was missing it.
      const data = (await res.json()) as { ambiance: string | null; historyId: string };
      store.setAmbiancePrompt(data.ambiance ?? ambiance.prompt);
      store.setLayeredHistoryId(data.historyId);
      store.setStep("result");
    } catch {
      store.setError("Erreur lors de l'affinage. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }

  /** Entering the subject freezes the ambiance for the rest of the run. */
  async function submitSubject() {
    if (!store.subject.trim()) return;
    store.lockAmbiance();
    await askQuestions("subject");
  }

  async function submitSubjectAnswers() {
    await deliver(collectAnswers("subject").byLabel);
  }

  /** Layer 2 — the single gated delivery point. Charges 1 credit on success. */
  async function deliver(subjectAnswers: Record<string, string>) {
    if (!ambiance || !store.tool) return;
    store.setLoading(true);
    store.setError(null);
    try {
      const res = await fetch("/api/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layer: "subject",
          category,
          tool: store.tool,
          ambiance: { ...ambiance, locked: true },
          subject: store.subject,
          subjectAnswers,
          sourcePageSlug: ambiance.sourcePageSlug ?? null,
          questionsAnswers: [
            ...qaLog,
            ...Object.entries(subjectAnswers).map(([question, answer]) => ({
              question,
              theme: "",
              answer,
              layer: "subject" as const,
            })),
          ].filter(
            // de-dupe: collectAnswers already logged this round
            (entry, i, all) =>
              all.findIndex(
                (o) => o.question === entry.question && o.answer === entry.answer
              ) === i
          ),
          _tracking: getStoredUTM(),
        }),
      });
      if (res.status === 401) return bounceToLogin();
      if (res.status === 402) return showPaywall();
      if (!res.ok) throw new Error("deliver failed");

      // historyId — see the ambiance branch above for why this was missing.
      const data = (await res.json()) as {
        output: LayeredOutput | null;
        historyId: string;
      };
      if (data.output) store.setLayeredOutput(data.output, data.historyId);
    } catch {
      store.setError("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }

  if (!ambiance) return null;

  const hasAnswer = Object.values(store.directAnswers).some((v) => v?.trim());

  return (
    <div className="animate-fade-in space-y-6">
      {store.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{store.error}</p>
        </div>
      )}

      {store.isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" label="Voxstel travaille sur votre prompt..." />
        </div>
      )}

      {!store.isLoading && store.step === "ambiance" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ajustons {w.ambiance}
            </h2>
            <p className="text-muted">
              Vous gardez les grandes lignes de ce que vous avez choisi — ces
              questions ne servent qu&apos;à le mettre à votre goût.
            </p>
          </div>

          <LockedAmbiance category={category} ambiance={ambiance.prompt} />

          <DirectQuestions
            questions={store.directQuestions}
            answers={store.directAnswers}
            onAnswer={store.setDirectAnswer}
          />

          <button onClick={submitAmbiance} className="btn-primary w-full">
            {hasAnswer ? "Appliquer mes choix →" : "Continuer sans changement →"}
          </button>
        </>
      )}

      {!store.isLoading && store.step === "subject" && (
        <SubjectInput
          category={category}
          lockedAmbiance={ambiance.prompt}
          value={store.subject}
          onChange={store.setSubject}
          onSubmit={submitSubject}
        />
      )}

      {!store.isLoading && store.step === "subject-questions" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Précisons {w.subject}
            </h2>
            <p className="text-muted">
              {w.ambianceLabel} reste verrouillé{w.ambianceAgr} —
              ces questions ne portent que sur {w.subject}.
            </p>
          </div>

          <LockedAmbiance category={category} ambiance={ambiance.prompt} />

          <DirectQuestions
            questions={store.directQuestions}
            answers={store.directAnswers}
            onAnswer={store.setDirectAnswer}
          />

          <button onClick={submitSubjectAnswers} className="btn-primary w-full">
            Générer mon prompt →
          </button>
        </>
      )}

      {!store.isLoading && store.step === "paywall" && (
        <Paywall onBack={() => store.setStep(paywallReturn)} />
      )}

      {!store.isLoading && store.step === "result" && (
        <LayeredResult
          category={category}
          output={store.layeredOutput}
          ambiance={ambiance.prompt}
          historyId={store.layeredHistoryId}
          onRestart={() => {
            store.reset();
            store.setCategory(category);
          }}
          onContinueToSubject={
            store.ambianceFlow === "refine-ambiance"
              ? () => {
                  store.lockAmbiance();
                  store.setStep("subject");
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

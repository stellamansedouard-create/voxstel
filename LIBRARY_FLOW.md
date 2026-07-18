# Library → generator flow (ambiance / subject)

The bridge from a library page into the generator, with the free reusable
ambiance layer separated from the paid unique subject layer.

## Rollback

**No migration, no schema change, no Stripe/credits change.** Rollback is a plain
revert — nothing to undo in the database:

```bash
git revert --no-commit <first-commit>..<last-commit>
git commit
```

Two things are worth knowing before reverting:

- `questions_answers` rows written by this journey stay in `prompts_history`.
  They are additive and harmless: the column is nullable and every other code
  path already leaves it NULL.
- `app/api/refine-precision/route.ts` is shared with the existing generator. The
  seeded path is behind an optional `ambianceSeed` param; when it is absent the
  route behaves exactly as before, so a revert cannot strand the old flow.

To disable the journey without reverting code, empty `LIBRARY_PAGES` in
`lib/library.ts`: no page, no buttons, no entry point. The generator's normal
blank-field flow is untouched.

## Where things live

| Concern | File |
| --- | --- |
| Where the ambiance/subject boundary sits per category, wording, injected instructions | `lib/ambiance.ts` |
| Library pages (seed data — the real catalogue does not exist yet) | `lib/library.ts` |
| The 3 buttons | `components/library/AmbianceActions.tsx` |
| Page → generator handoff (sessionStorage) | `lib/ambiance-handoff.ts` |
| Ambiance generation (refine) | `lib/ambiance-layer.ts` |
| Subject generation (pure) | `lib/subject-layer.ts` |
| **The delivery seam — balance check, credit, history** | `lib/deliver.ts` |
| Flow orchestration | `components/generator/LibraryJourney.tsx` |

## The delivery seam (Prompt 4)

`deliverGeneratedPrompt()` in `lib/deliver.ts` is the single gated entry point
for BOTH engine outputs the journey delivers — the refined ambiance and the
subject — called from exactly one route (`app/api/deliver/route.ts`). In order
it: (1) checks the balance before any engine call, throwing
`InsufficientCreditsError` (→ HTTP 402 → paywall) at 0 credits; (2) generates;
(3) on success charges 1 credit via `deductCredit()` (Prompt 1, reused as-is)
**and** writes one `prompts_history` row, as one logical unit — a failed history
insert refunds the credit.

Billing unit = one **delivered** prompt, never one question round. A refining
run may ask 8 questions before delivering: still exactly 1 credit.

Free vs paid:

- **Free** — copying a page's raw prompt (`CopyablePrompt`, pure clipboard, no
  API) and, inside the refine-and-subject flow, the *intermediate* ambiance
  refine (`/api/ambiance/apply`) that only feeds the paid subject.
- **Paid** — every delivered generation: a refined ambiance that is the end
  product (refine-ambiance flow, only when the user actually changed something),
  and every subject.

## The ambiance lock

The subject step may read the ambiance but must never reopen it.

- **music** — the ambiance *is* the Suno STYLE field, so it is copied through
  verbatim and never sent to the model. Only LYRICS is generated. The lock is
  structural.
- **image / video / text** — one prompt, so merging needs a model call. The
  ambiance goes in as frozen read-only context, and `generateSubjectPrompt()`
  throws if handed an unlocked ambiance.

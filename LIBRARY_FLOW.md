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
| Layer 1 — ambiance (free) | `lib/ambiance-layer.ts` |
| Layer 2 — subject (**the Prompt 4 seam**) | `lib/subject-layer.ts` |
| Flow orchestration | `components/generator/LibraryJourney.tsx` |

## Prompt 4 seam

`deliverSubjectLayer()` in `lib/subject-layer.ts` is the single delivery point
for layer 2, called from exactly one place (`app/api/subject/deliver/route.ts`).
The `TODO(prompt-4)` marker at the top of the function is where `deductCredit` +
the 0-credit paywall go. Nothing is gated or counted today — the journey
delivers for free so it can be tested without spending a credit.

## The ambiance lock

The subject step may read the ambiance but must never reopen it.

- **music** — the ambiance *is* the Suno STYLE field, so it is copied through
  verbatim and never sent to the model. Only LYRICS is generated. The lock is
  structural.
- **image / video / text** — one prompt, so merging needs a model call. The
  ambiance goes in as frozen read-only context, and `deliverSubjectLayer()`
  throws if handed an unlocked ambiance.

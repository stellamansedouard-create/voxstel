/**
 * Feature flags — set to true to gate a feature behind a specific plan
 * once the auth / subscription system is in place.
 */

/** Restrict image reference upload to the "Unlimited" plan.
 *  Opened to all authenticated users (incl. free) to let them discover the
 *  feature — the 3/month free quota is the real limiter. */
export const FEATURE_IMAGE_REFERENCE_PLAN_RESTRICTED = false;

/** Restrict text/code reference upload to the "Unlimited" plan.
 *  Opened to all authenticated users (incl. free) — see note above. */
export const FEATURE_TEXT_REFERENCE_PLAN_RESTRICTED = false;

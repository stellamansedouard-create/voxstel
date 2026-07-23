// Thin wrapper around Microsoft Clarity (@microsoft/clarity).
//
// Clarity records session replays / heatmaps and drops its own cookies, so it
// must only load after the visitor has accepted the cookie banner — same gate
// as the Google Ads tag (see lib/gtag.ts / components/CookieBanner.tsx).
//
// initClarity() is safe to call from multiple places (the mount-time loader for
// a returning visitor AND the banner's "Accepter" handler): a module-level flag
// guarantees Clarity.init() runs at most once per page load.

const CLARITY_PROJECT_ID = "xqsu0uj952";

let initialized = false;

/**
 * Loads Clarity's script and starts recording. No-op on the server (Clarity
 * touches `window`/`document` at import time) and no-op if already initialized.
 */
export function initClarity() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  initialized = true;

  // Dynamic import so the SDK is never pulled into the server bundle and only
  // downloaded once consent is granted.
  void import("@microsoft/clarity").then(({ default: Clarity }) => {
    Clarity.init(CLARITY_PROJECT_ID);
  });
}

// Thin wrapper around the Meta Pixel global — safe to call before the script has loaded.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbLoaded?: boolean;
  }
}

const FB_PIXEL_ID = "1011680201609950";

/**
 * Injects the Meta Pixel script and fires the initial PageView.
 * Must only be called after consent is granted — fbq('consent', 'revoke')
 * does NOT stop the network request (it's Meta's US-only Limited Data Use
 * flag, not a GDPR-style block), so the only real way to withhold data is
 * to never load the script until the user accepts.
 */
export function loadFacebookPixel() {
  if (typeof window === "undefined" || window._fbLoaded) return;
  window._fbLoaded = true;

  /* eslint-disable */
  (function (f: any, b: any, e: string, v: string, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js", undefined, undefined, undefined);
  /* eslint-enable */

  window.fbq!("init", FB_PIXEL_ID);
  window.fbq!("track", "PageView");
}

export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

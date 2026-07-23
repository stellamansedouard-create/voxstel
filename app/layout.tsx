import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { UTMTracker } from "@/components/UTMTracker";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import CookieBanner from "@/components/CookieBanner";
import { PixelEventHandler } from "@/components/PixelEventHandler";
import { GoogleAdsTagLoader } from "@/components/GoogleAdsTagLoader";
import { ClarityLoader } from "@/components/ClarityLoader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxstel — Générateur de Prompts IA",
  description: "Générez des prompts professionnels pour toutes les IAs génératives : Image, Vidéo, Texte, Musique.",
  keywords: ["prompts", "IA", "Midjourney", "DALL-E", "Claude", "générateur"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/*
          Google tag (gtag.js) + Consent Mode v2. Loaded unconditionally for every
          visitor — this is Google's recommended pattern: default all storage to
          "denied" so no cookie/ID is set pre-consent, then update to "granted"
          once the existing cookie banner (components/CookieBanner.tsx) is
          accepted. See lib/gtag.ts for the consent-update call.

          strategy="beforeInteractive" (not afterInteractive): Next.js only
          renders beforeInteractive scripts into the server-rendered <head> —
          afterInteractive scripts are injected client-side wherever the
          component happens to mount, which for this layout meant the end of
          <body>, not <head> as Google's own tag-installation check expects.

          The 'consent default' value below reads the vx_consent cookie
          synchronously, right here in the inline script — not via a React
          useEffect (components/GoogleAdsTagLoader.tsx) — because gtag('config', ...)
          fires an automatic page_view hit immediately, before React hydrates.
          A returning visitor who already accepted would otherwise have that
          first hit (and every hit before hydration finishes) sent with
          denied consent regardless, which is what was making Google Ads
          diagnostics report ~100% of signals as denied.

          url_passthrough: while consent is still denied (new visitor who
          hasn't clicked the banner yet), gtag forwards gclid/dclid through
          internal navigations via URL params instead of cookies, so the click
          ID survives until the visitor accepts — improves Google Ads
          conversion attribution without storing anything pre-consent.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18310195091"
          strategy="beforeInteractive"
        />
        <Script id="gtag-consent-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            var vxConsentState = /(?:^|; )vx_consent=accepted(?:;|$)/.test(document.cookie) ? 'granted' : 'denied';
            gtag('consent', 'default', {
              'ad_storage': vxConsentState,
              'ad_user_data': vxConsentState,
              'ad_personalization': vxConsentState,
              'analytics_storage': vxConsentState
            });
            gtag('js', new Date());
            gtag('set', 'url_passthrough', true);
            gtag('config', 'AW-18310195091');
            gtag('config', 'G-960CH3E68D');
          `}
        </Script>
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {/* Global fixed header — rendered ONCE here so it's present on every
            route (generator, library, prompt pages included). Pages must not
            render <Header/> themselves. Pages reserve space with their own top
            padding (the header is position:fixed, h-16). */}
        <Header />
        <Suspense fallback={null}>
          <GoogleAdsTagLoader />
        </Suspense>
        <Suspense fallback={null}>
          <ClarityLoader />
        </Suspense>
        <Suspense fallback={null}>
          <UTMTracker />
        </Suspense>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Suspense fallback={null}>
          <PixelEventHandler />
        </Suspense>
        {children}
        {/* Global footer — same rule as the header above: rendered ONCE here so
            every route gets it, including the ones added later. It used to be
            imported page by page, which silently left /bibliotheque,
            /prompts/[slug] and /generate with no footer and no internal links
            out. Pages must not render <Footer/> themselves. */}
        <Footer />
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </body>
    </html>
  );
}

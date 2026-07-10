import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { UTMTracker } from "@/components/UTMTracker";
import CookieBanner from "@/components/CookieBanner";
import { PixelEventHandler } from "@/components/PixelEventHandler";
import { FacebookPixelLoader } from "@/components/FacebookPixelLoader";
import { GoogleAdsTagLoader } from "@/components/GoogleAdsTagLoader";
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
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
            gtag('js', new Date());
            gtag('config', 'AW-18310195091');
            gtag('config', 'G-960CH3E68D');
          `}
        </Script>
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <Suspense fallback={null}>
          <FacebookPixelLoader />
        </Suspense>
        <Suspense fallback={null}>
          <GoogleAdsTagLoader />
        </Suspense>
        <Suspense fallback={null}>
          <UTMTracker />
        </Suspense>
        <Suspense fallback={null}>
          <PixelEventHandler />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </body>
    </html>
  );
}

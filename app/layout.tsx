import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { UTMTracker } from "@/components/UTMTracker";
import CookieBanner from "@/components/CookieBanner";
import { PixelEventHandler } from "@/components/PixelEventHandler";
import "./globals.css";

const FB_PIXEL_ID = "1011680201609950";

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
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq.disablePushState = true;
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
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

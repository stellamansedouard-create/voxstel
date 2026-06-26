import type { Metadata } from "next";
import { Suspense } from "react";
import { UTMTracker } from "@/components/UTMTracker";
import CookieBanner from "@/components/CookieBanner";
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
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <Suspense fallback={null}>
          <UTMTracker />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </body>
    </html>
  );
}

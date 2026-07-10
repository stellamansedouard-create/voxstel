"use client";

import { useEffect, useState } from "react";
import { applyConsent, getConsentStatus } from "@/lib/utm.client";
import { loadFacebookPixel } from "@/lib/fbq";
import { grantAdsConsent } from "@/lib/gtag";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentStatus() === null) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    applyConsent(true);
    loadFacebookPixel();
    grantAdsConsent();
    setVisible(false);
  }

  function handleRefuse() {
    applyConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted leading-relaxed flex-1">
          Nous utilisons des cookies de mesure d&apos;audience (UTM) et des balises publicitaires
          (Meta, Google Ads) pour comprendre d&apos;où viennent nos visiteurs et mesurer nos
          campagnes. Rien n&apos;est déposé tant que vous n&apos;avez pas accepté.{" "}
          <a
            href="/politique-de-confidentialite"
            className="text-accent underline hover:no-underline"
          >
            En savoir plus
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleRefuse}
            className="btn-secondary !px-4 !py-2 !text-sm"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

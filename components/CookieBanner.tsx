"use client";

import { useEffect, useState } from "react";
import { applyConsent, getConsentStatus } from "@/lib/utm.client";
import { grantAdsConsent } from "@/lib/gtag";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentStatus() === null) {
      setVisible(true);
    }
  }, []);

  // Lock background scroll while the choice is pending — the point of
  // moving this to a centered modal is that it should be genuinely hard
  // to miss, not just present somewhere on the page. It never
  // auto-dismisses: only clicking Accepter or Refuser closes it (no
  // backdrop click, no Escape key, no timeout).
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  function handleAccept() {
    applyConsent(true);
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
      aria-modal="true"
      aria-label="Gestion des cookies"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 flex flex-col gap-5">
        <div>
          <p className="text-base font-semibold text-foreground mb-2">
            Avant de continuer
          </p>
          <p className="text-sm text-muted leading-relaxed">
            Nous utilisons des cookies de mesure d&apos;audience (UTM) et des balises publicitaires
            (Meta, Google Ads) pour comprendre d&apos;où viennent nos visiteurs et mesurer nos
            campagnes. Rien n&apos;est déposé tant que vous n&apos;avez pas fait votre choix.{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-accent underline hover:no-underline"
            >
              En savoir plus
            </a>
          </p>
        </div>
        {/* Deux boutons de même taille, même padding, même geste (un clic) —
            accepter ne doit jamais être plus facile ou plus visible que
            refuser (règle CNIL sur le consentement cookies). */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRefuse}
            className="btn-secondary w-full !px-4 !py-3 !text-sm"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary w-full !px-4 !py-3 !text-sm"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

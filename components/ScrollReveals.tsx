"use client";

// Révèle les sections marquées `data-reveal` quand elles entrent dans le
// viewport. Un seul observateur pour toute la page, aucune dépendance : le
// CSS porte l'effet, ce composant ne fait qu'armer le déclencheur.
//
// Principe de sûreté : le CSS ne masque RIEN par défaut. Il ne masque que
// sous `.reveals-armed`, une classe que ce composant pose lui-même — et
// seulement une fois qu'il est en mesure de révéler. Tout chemin qui échoue
// (pas de JS, pas d'IntersectionObserver, observateur muet) laisse donc la
// page entièrement visible. L'animation est un agrément : elle ne doit jamais
// pouvoir emporter le contenu avec elle.
import { useEffect } from "react";

/** Au-delà, on considère l'observateur défaillant et on désarme. */
const WATCHDOG_MS = 1500;

export default function ScrollReveals() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (nodes.length === 0) return;

    // `prefers-reduced-motion` : on n'arme pas du tout — les sections
    // s'affichent directement, sans état masqué ni transition.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Navigateur sans IntersectionObserver : on n'arme pas non plus.
    if (!("IntersectionObserver" in window)) return;

    root.classList.add("reveals-armed");

    let delivered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        // Un navigateur sain livre un premier lot presque aussitôt, même pour
        // des éléments hors écran : c'est ce qui prouve que l'API répond.
        delivered = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          // Une section révélée le reste : pas de re-animation au scroll
          // arrière, qui donnerait une page qui clignote.
          observer.unobserve(entry.target);
        }
      },
      // Déclenche quand la section a un peu mordu dans l'écran, pour que
      // l'animation se voie au lieu de se jouer tout en bas du viewport.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));

    // Garde-fou : onglet gelé en arrière-plan, moteur sans compositing, API
    // qui échoue en silence... si rien n'est livré, on désarme et la page
    // redevient visible d'un bloc. On perd l'animation, jamais le contenu.
    const watchdog = window.setTimeout(() => {
      if (delivered) return;
      observer.disconnect();
      root.classList.remove("reveals-armed");
    }, WATCHDOG_MS);

    return () => {
      window.clearTimeout(watchdog);
      observer.disconnect();
      root.classList.remove("reveals-armed");
    };
  }, []);

  return null;
}

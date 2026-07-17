// Theme labels the question engines must choose from. Extracted verbatim from
// the refining engine so the seeded ambiance/subject rounds reuse the exact
// same taxonomy instead of growing a third copy.
export function getThemeHints(categoryId: string): string {
  switch (categoryId) {
    case "image":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Sujet & Composition" — sujet principal, personnages, éléments visuels, cadrage
- "Style & Esthétique" — style artistique, technique, medium (photo, peinture, 3D, illustration…)
- "Lumière & Couleurs" — éclairage, palette, heure, ambiance colorée
- "Décor & Contexte" — lieu, environnement, époque, contexte d'usage
- "Détails Techniques" — ratio, texte affiché, contraintes spécifiques à l'outil`;
    case "video":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Action & Scène" — sujet, action principale, personnages
- "Style Visuel" — esthétique, références visuelles, grade colorimétrique
- "Mouvement & Rythme" — mouvements caméra, transitions, rythme de montage
- "Ambiance & Atmosphère" — humeur, émotion, son d'ambiance
- "Détails Techniques" — durée, format, plateforme de destination`;
    case "text":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Sujet & Contenu" — tâche précise, périmètre, angle
- "Audience & Ton" — destinataire, niveau, registre, voix
- "Structure & Format" — longueur, mise en forme, plan, format de sortie
- "Objectif & Contraintes" — but final (SEO, conversion, documentation…), ce qu'il faut éviter
- "Technique" — langage, framework, version, environnement (pour les demandes de code)`;
    case "music":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Style & Genre" — genre, sous-genre, ère musicale, influences
- "Instrumentation" — instruments, arrangement, présence vocale
- "Énergie & Émotion" — tempo, intensité, humeur, dynamique
- "Structure & Durée" — structure du morceau, durée, intro/outro
- "Usage & Contexte" — usage final (bande-son, méditation, danse, générique…)`;
    default:
      return `Attribue un thème court et descriptif en français à chaque question (ex: "Style", "Contexte", "Technique").`;
  }
}

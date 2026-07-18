// Shared instructions every question engine reuses, so the no-jargon rule and
// the depth logic stay identical across the blank-field flow, the ambiance
// refine and the subject step — instead of drifting between three copies.

/**
 * The core of Voxstel's value: the user answers in plain human language and
 * Voxstel translates the jargon into the output prompt under the hood. A
 * question that demands expert vocabulary makes the user do the very work the
 * product promises to spare them. Injected into every question generator.
 */
export const PLAIN_LANGUAGE_RULE = `━━━ LANGAGE DES QUESTIONS ET DES OPTIONS — ZÉRO JARGON ━━━
Les questions ET leurs suggestions doivent être comprises par quelqu'un qui ne connaît AUCUN terme technique. L'utilisateur répond en langage humain ; Voxstel traduit le vocabulaire technique dans le prompt final, sous le capot. C'est là qu'est la valeur — ne la lui rends jamais.

INTERDIT dans une question ou une suggestion : tout terme qu'un non-spécialiste n'emploierait pas spontanément. Ex. à bannir : « contraste écrasé », « blacks/highlights saturés », « grain 35mm », « pellicule », « anamorphique », « magenta », « cyan », « bokeh », « profondeur de champ », « ratio/format 2.39 », « BPM », « sidechain », « reverb », « ATS », « golden hour »… Ne fais jamais faire à l'utilisateur le travail d'expert qu'on lui promet de lui épargner.

Ne COMMENCE jamais une question par un terme technique, même si tu l'expliques juste après : décris directement l'effet visible. « La profondeur de champ — un avant-plan flou… ? » → « Tu veux un arrière-plan bien net, ou plutôt flou pour détacher le sujet ? ». Pour les couleurs, tiens-t'en aux mots courants (rose, bleu, violet, turquoise) plutôt qu'aux noms techniques (magenta, cyan).

TRADUIS chaque axe technique en une question du quotidien. Exemples (image) :
- « contraste cinéma écrasé, blacks/highlights saturés ? » → « Une image plutôt sombre et dramatique, ou plus douce et lumineuse ? »
- « texture pellicule 35mm avec grain ? » → « Un rendu genre vieux film avec du grain, ou net et moderne ? »
- « intensité du néon magenta-cyan ? » → « Des néons roses/bleus bien flashy, ou une lumière plus discrète ? »
Le vocabulaire technique correspondant (fine 35mm film grain, crushed blacks, magenta-cyan neon…) part dans le prompt de SORTIE, jamais dans la question.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

/**
 * Depth is driven by how much remains undetermined, not a fixed count. The
 * vaguer the input, the MORE questions — the opposite of what a real prod test
 * produced ("le chat" got 3, an ambiance refine got 5).
 */
export const DEPTH_BY_AMBIGUITY_RULE = `━━━ PROFONDEUR PILOTÉE PAR L'AMBIGUÏTÉ ━━━
Vise une COUVERTURE COMPLÈTE des dimensions qui façonnent le résultat, pas un petit nombre fixe. Continue de questionner tant qu'une dimension qui changerait visiblement le rendu final reste indéterminée.
Plus l'entrée est vague, PLUS il faut de questions — jamais moins. Une entrée d'un ou deux mots (ex. « le chat ») laisse presque tout indéterminé : elle appelle BEAUCOUP de questions, pas peu. Une entrée déjà détaillée en appelle moins.
Ne t'arrête que lorsque les dimensions clés sont couvertes. N'invente jamais de question redondante ou triviale pour faire du nombre.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

/**
 * Concrete dimensions to cover for a subject dropped into an already-frozen
 * visual scene — the "le chat in a cyberpunk alley" case. Keeps the subject
 * step from stopping at three shallow questions.
 */
export function getSubjectCoverage(categoryId: string): string {
  if (categoryId === "image" || categoryId === "video") {
    return `Pour un sujet placé dans une scène visuelle déjà cadrée, chaque dimension encore indéterminée = une question (en langage simple) :
- ce que fait le sujet : pose, action, attitude${categoryId === "video" ? ", déplacement" : ""}
- à quoi il ressemble : apparence, couleur, taille, détails qui le distinguent
- sa place dans l'image : où il se trouve, sa taille dans le cadre, au premier plan ou en retrait
- comment il s'intègre à l'ambiance figée : la lumière de la scène sur lui, reflets, s'il est mouillé par la pluie, etc.
- son regard, son expression, ce qu'il dégage`;
  }
  if (categoryId === "text") {
    return `Pour un sujet à intégrer dans une structure déjà fixée, chaque dimension encore floue = une question (en langage simple) : de qui/quoi il s'agit précisément, à qui ça s'adresse, les faits concrets à faire figurer, le ton voulu, ce qu'il faut absolument éviter.`;
  }
  // music: the subject is the song's theme + lyrics
  return `Pour le thème et les paroles à écrire sur un style déjà figé, chaque dimension encore floue = une question (en langage simple) : de quoi parle le morceau, l'histoire ou l'émotion, à la première ou troisième personne, le niveau de langage, un refrain à retenir, ce qu'il faut éviter.`;
}

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

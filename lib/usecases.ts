import type { Category, UseCaseMeta } from "@/types";

/**
 * Cas d'usage par catégorie, dans l'ordre d'affichage (grand public → précis).
 * Le libellé est volontairement accessible (jamais de jargon type "ratio 9:16") ;
 * la précision est portée par `questionGuidance`, qui pilote les questions
 * indispensables posées par le moteur (ex: appareil/format pour un fond d'écran).
 * Chaque liste se termine par un cas "autre" qui ne bloque jamais l'utilisateur.
 */

const AUTRE: UseCaseMeta = {
  id: "autre",
  label: "Autre — décris librement",
  icon: "✏️",
  tagline: "Ton besoin exact n'est pas listé",
  questionGuidance:
    "Aucun type précis n'a été choisi. Détermine toi-même, à partir de la description, quelles questions lèveraient les ambiguïtés les plus importantes.",
};

export const USE_CASES: Record<Category, UseCaseMeta[]> = {
  image: [
    {
      id: "wallpaper",
      label: "Fond d'écran",
      icon: "📱",
      tagline: "Pour ton téléphone, ton PC ou ta tablette",
      questionGuidance:
        "OBLIGATOIRE : pose en priorité une question sur l'appareil de destination (PC/ordinateur, smartphone, tablette) — c'est ce qui fixe l'orientation et le ratio. Même si l'utilisateur n'en parle pas, cette question est indispensable. Enchaîne ensuite sur le sujet, l'ambiance et le style visuel.",
      promptGuidance:
        "Traduis l'appareil choisi en ratio/orientation explicite dans le prompt (PC = paysage 16:9, smartphone = portrait 9:16, tablette = 3:4 ou 4:3) et respecte la syntaxe de l'outil pour le ratio.",
    },
    {
      id: "social_post",
      label: "Image pour un post",
      icon: "🖼️",
      tagline: "Instagram, LinkedIn, Facebook, X…",
      questionGuidance:
        "OBLIGATOIRE : pose en priorité une question sur la plateforme et l'emplacement (feed Instagram, story/reel, LinkedIn, X, Facebook) — cela fixe le format (carré 1:1, portrait 4:5, vertical 9:16). Demande aussi s'il doit y avoir du texte incrusté, puis le sujet, le style et l'ambiance.",
      promptGuidance:
        "Traduis la plateforme en ratio explicite (feed = 1:1 ou 4:5, story/reel = 9:16). Si un texte doit apparaître, reproduis-le à l'identique entre guillemets.",
    },
    {
      id: "avatar",
      label: "Avatar / photo de profil",
      icon: "🙂",
      tagline: "Un portrait qui te représente",
      questionGuidance:
        "Pose des questions sur le rendu (photo réaliste, illustration, cartoon, style 3D), le cadrage (visage seul, buste), le fond (uni, transparent, décor) et l'ambiance/personnalité à dégager.",
      promptGuidance:
        "Vise un cadrage carré 1:1 centré sur le visage, adapté à un usage en photo de profil.",
    },
    {
      id: "illustration",
      label: "Illustration ou dessin",
      icon: "🎨",
      tagline: "Une image artistique, libre",
      questionGuidance:
        "Approfondis la technique/medium (aquarelle, vectoriel, peinture numérique, crayon…), l'ambiance, la palette de couleurs, le sujet et le niveau de détail.",
    },
    {
      id: "logo",
      label: "Logo",
      icon: "✳️",
      tagline: "Une identité pour ta marque ou ton projet",
      questionGuidance:
        "OBLIGATOIRE : demande le nom/texte exact à intégrer (le cas échéant) et le secteur/activité. Pose aussi des questions sur le style (minimaliste, mascotte, typographique, emblème), les couleurs souhaitées et ce qu'il faut absolument éviter.",
      promptGuidance:
        "Reproduis tout nom de marque à l'identique entre guillemets. Vise un rendu épuré, lisible en petit, fond simple ou transparent.",
    },
    {
      id: "banner",
      label: "Bannière (couverture)",
      icon: "🏷️",
      tagline: "En-tête de chaîne, de page ou de site",
      questionGuidance:
        "OBLIGATOIRE : demande la destination (couverture YouTube, bannière LinkedIn, en-tête de site, couverture Facebook) car elle fixe le format très large. Demande le message/texte à afficher, le style et l'ambiance.",
      promptGuidance:
        "Utilise un format panoramique large adapté à la destination (bannière = ratio très horizontal type 16:5 à 3:1). Reproduis tout texte à l'identique.",
    },
    {
      id: "product_visual",
      label: "Visuel produit",
      icon: "📦",
      tagline: "Mettre un produit en valeur",
      questionGuidance:
        "Demande quel est le produit, le type de mise en scène (fond studio blanc, ambiance lifestyle, décor contextuel), l'angle de vue, l'éclairage et la plateforme de destination (boutique, pub, réseau).",
    },
    {
      id: "icon",
      label: "Icône / pictogramme",
      icon: "🔷",
      tagline: "Un petit symbole clair",
      questionGuidance:
        "Demande le concept à représenter, le style (plat, au trait, 3D, glyphe), le besoin de fond transparent, et l'usage/taille prévue.",
      promptGuidance:
        "Vise un rendu simple, centré, lisible en très petit, fond transparent ou uni.",
    },
    AUTRE,
  ],

  video: [
    {
      id: "short_clip",
      label: "Petite vidéo / clip",
      icon: "🎥",
      tagline: "Une courte séquence animée",
      questionGuidance:
        "Demande la scène/action principale, la durée approximative, le style visuel, les mouvements de caméra et l'ambiance.",
    },
    {
      id: "story_reel",
      label: "Story ou Reel",
      icon: "📲",
      tagline: "Format vertical pour les réseaux",
      questionGuidance:
        "OBLIGATOIRE : confirme la plateforme (Instagram/TikTok) qui impose un format vertical 9:16, et la durée courte. Demande le hook d'ouverture, l'action, le style et le rythme.",
      promptGuidance: "Impose un format vertical 9:16 court et rythmé.",
    },
    {
      id: "intro_outro",
      label: "Intro / outro",
      icon: "🎬",
      tagline: "Ouverture ou fin de vidéo",
      questionGuidance:
        "Demande la plateforme de destination, la durée (quelques secondes), le texte/logo à afficher, le style et l'ambiance sonore visée.",
    },
    {
      id: "ad",
      label: "Publicité",
      icon: "📣",
      tagline: "Une vidéo qui vend",
      questionGuidance:
        "Demande le produit/service, l'audience cible, le message clé, la plateforme (donc le format), la durée et le ton.",
    },
    {
      id: "animation",
      label: "Animation",
      icon: "✨",
      tagline: "Motion design, éléments animés",
      questionGuidance:
        "Demande le type d'animation (motion design, 2D, 3D), les éléments à animer, le style graphique, le rythme et l'ambiance.",
    },
    {
      id: "storyboard",
      label: "Storyboard",
      icon: "🎞️",
      tagline: "Une séquence de plans",
      questionGuidance:
        "Demande l'histoire/déroulé, le nombre de plans, le style visuel, les mouvements de caméra et l'ambiance générale.",
    },
    AUTRE,
  ],

  text: [
    {
      id: "email",
      label: "Email ou message",
      icon: "✉️",
      tagline: "Écrire un message clair et adapté",
      questionGuidance:
        "OBLIGATOIRE : demande le destinataire (à qui on écrit) et l'objectif du message. Demande aussi le ton (formel, amical, direct), la longueur et les points clés à faire passer.",
    },
    {
      id: "social_caption",
      label: "Légende pour un post",
      icon: "💬",
      tagline: "Le texte qui accompagne une publication",
      questionGuidance:
        "Demande la plateforme, le sujet du post, le ton, la présence d'un appel à l'action et le besoin de hashtags.",
    },
    {
      id: "cv_letter",
      label: "CV / lettre de motivation",
      icon: "📄",
      tagline: "Candidater efficacement",
      questionGuidance:
        "Demande le poste/secteur visé, les expériences ou atouts clés à mettre en avant, le ton et le destinataire (entreprise, type de recruteur).",
    },
    {
      id: "article",
      label: "Article ou blog",
      icon: "📝",
      tagline: "Un contenu de fond",
      questionGuidance:
        "Demande le sujet précis, l'audience, l'angle, la longueur visée, le ton et l'objectif (informer, convertir, référencement SEO).",
    },
    {
      id: "script",
      label: "Script (YouTube, TikTok…)",
      icon: "🎙️",
      tagline: "Un texte à dire face caméra",
      questionGuidance:
        "Demande la plateforme, la durée visée, le sujet, le hook d'accroche, le ton et l'appel à l'action final.",
    },
    {
      id: "product_sheet",
      label: "Fiche produit",
      icon: "🛒",
      tagline: "Décrire et vendre un produit",
      questionGuidance:
        "OBLIGATOIRE : demande le produit et la plateforme de vente (Amazon, Shopify, site perso…) car elle impose la structure et la longueur. Demande la cible, les arguments clés/bénéfices et le ton.",
    },
    {
      id: "newsletter",
      label: "Newsletter",
      icon: "📧",
      tagline: "Un email à ta liste",
      questionGuidance:
        "Demande le sujet/actualité, l'audience, l'objectif (informer, vendre, fidéliser), le ton et l'appel à l'action.",
    },
    {
      id: "press_release",
      label: "Communiqué de presse",
      icon: "📰",
      tagline: "Annoncer une information officielle",
      questionGuidance:
        "Demande l'information à annoncer, l'organisation concernée, la cible (journalistes, secteur), la date et les citations éventuelles à inclure.",
    },
    {
      id: "code_snippet",
      label: "Un bout de code",
      icon: "💻",
      tagline: "Générer une fonction, un script",
      questionGuidance:
        "OBLIGATOIRE : demande le langage et, le cas échéant, le framework/version. Demande ce que le code doit faire précisément (entrées/sorties), les contraintes et l'environnement d'exécution.",
      promptGuidance:
        "Structure le prompt pour du code : rôle d'expert du langage, tâche précise, contraintes, format de sortie attendu (code commenté).",
    },
    {
      id: "code_debug",
      label: "Corriger un bug",
      icon: "🐞",
      tagline: "Comprendre et réparer un problème",
      questionGuidance:
        "OBLIGATOIRE : demande le langage/framework et le comportement attendu vs observé. Demande le message d'erreur exact s'il existe et l'environnement.",
    },
    {
      id: "code_db",
      label: "Requête base de données",
      icon: "🗄️",
      tagline: "SQL et manipulation de données",
      questionGuidance:
        "Demande le moteur (PostgreSQL, MySQL, SQLite…), la structure des tables concernées, le résultat attendu et les contraintes de performance éventuelles.",
    },
    {
      id: "code_regex",
      label: "Expression régulière (regex)",
      icon: "🔤",
      tagline: "Un motif de recherche/validation",
      questionGuidance:
        "Demande ce qui doit être détecté ou validé, des exemples qui doivent matcher et ne pas matcher, et le langage/moteur regex cible.",
    },
    {
      id: "code_doc",
      label: "Documentation technique",
      icon: "📘",
      tagline: "Expliquer du code ou un outil",
      questionGuidance:
        "Demande ce qu'il faut documenter, le public visé (dev débutant, confirmé, utilisateur final), le niveau de détail et le format (README, docstrings, guide).",
    },
    AUTRE,
  ],

  music: [
    {
      id: "song",
      label: "Chanson",
      icon: "🎵",
      tagline: "Un morceau complet, avec ou sans voix",
      questionGuidance:
        "Demande le genre/style, l'ambiance/émotion, la présence et le type de voix, le thème des paroles, le tempo et les influences/décennie.",
    },
    {
      id: "ambiance",
      label: "Musique d'ambiance",
      icon: "🌙",
      tagline: "Pour travailler, se détendre, un fond sonore",
      questionGuidance:
        "Demande l'usage (concentration, détente, méditation, fond de vidéo), l'ambiance, les instruments dominants, le tempo et la durée.",
    },
    {
      id: "jingle",
      label: "Jingle (son de marque)",
      icon: "🔔",
      tagline: "Une courte signature sonore",
      questionGuidance:
        "Demande la marque/usage, l'émotion à évoquer, la durée (quelques secondes), le style et les instruments.",
    },
    {
      id: "sfx",
      label: "Effet sonore",
      icon: "🎚️",
      tagline: "Un son précis, court",
      questionGuidance:
        "Demande le son recherché, le contexte d'usage (jeu, vidéo, appli), l'ambiance et la durée.",
    },
    AUTRE,
  ],
};

export function getUseCases(categoryId: string): UseCaseMeta[] {
  return USE_CASES[categoryId as Category] ?? [];
}

export function getUseCaseById(
  categoryId: string,
  useCaseId: string
): UseCaseMeta | undefined {
  return getUseCases(categoryId).find((u) => u.id === useCaseId);
}

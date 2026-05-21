import type { QuizQuestion, QuizTheme } from "@/lib/supabase/types";

type SeedQuestion = Omit<
  QuizQuestion,
  "id" | "created_at" | "active" | "source"
> & {
  source?: "manual" | "auto";
};

/**
 * Banque locale de questions — utilisée tant que Supabase n'est pas configuré
 * (mode démo) et comme seed initial de la table quiz_questions.
 *
 * Format : 4 réponses, exactement 1 correcte.
 * Total : 250 questions (50 par thème).
 */
export const SEED_QUESTIONS: SeedQuestion[] = [
  // ============== HISTORIQUE ==============
  {
    theme: "historique",
    difficulty: 1,
    question: "Combien de Coupes du Monde le Brésil a-t-il remportées ?",
    answers: [
      { text: "3", is_correct: false },
      { text: "4", is_correct: false },
      { text: "5", is_correct: true },
      { text: "6", is_correct: false },
    ],
    explanation: "Le Brésil a gagné en 1958, 1962, 1970, 1994 et 2002.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Qui a gagné la Coupe du Monde 2022 au Qatar ?",
    answers: [
      { text: "France", is_correct: false },
      { text: "Argentine", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Croatie", is_correct: false },
    ],
    explanation: "L'Argentine de Messi a battu la France aux tirs au but.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "En quelle année la France a-t-elle gagné sa première CDM ?",
    answers: [
      { text: "1986", is_correct: false },
      { text: "1998", is_correct: true },
      { text: "2002", is_correct: false },
      { text: "2018", is_correct: false },
    ],
    explanation: "À domicile, finale 3-0 contre le Brésil.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la première Coupe du Monde en 1930 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Italie", is_correct: false },
      { text: "Uruguay", is_correct: true },
      { text: "France", is_correct: false },
    ],
    explanation:
      "L'Uruguay a aussi remporté cette première édition à domicile.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question:
      "Quelle équipe a perdu trois finales de Coupe du Monde de suite ?",
    answers: [
      { text: "Pays-Bas", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Italie", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "Pays-Bas : finales perdues en 1974, 1978 et 2010.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Qui a inscrit le but mythique de la 'Main de Dieu' ?",
    answers: [
      { text: "Pelé", is_correct: false },
      { text: "Diego Maradona", is_correct: true },
      { text: "Johan Cruyff", is_correct: false },
      { text: "Zinédine Zidane", is_correct: false },
    ],
    explanation: "Argentine-Angleterre, quart de finale, CDM 1986.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question:
      "Quel est le seul joueur à avoir gagné 3 Coupes du Monde comme joueur ?",
    answers: [
      { text: "Diego Maradona", is_correct: false },
      { text: "Pelé", is_correct: true },
      { text: "Franz Beckenbauer", is_correct: false },
      { text: "Lionel Messi", is_correct: false },
    ],
    explanation: "Pelé : 1958, 1962 et 1970 avec le Brésil.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a remporté la CDM 2010 en Afrique du Sud ?",
    answers: [
      { text: "Pays-Bas", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Espagne", is_correct: true },
      { text: "Uruguay", is_correct: false },
    ],
    explanation: "Espagne 1-0 Pays-Bas, but d'Iniesta en prolongation.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "En 1998, qui marque les deux premiers buts de la finale ?",
    answers: [
      { text: "Thierry Henry", is_correct: false },
      { text: "Zinédine Zidane", is_correct: true },
      { text: "Emmanuel Petit", is_correct: false },
      { text: "Youri Djorkaeff", is_correct: false },
    ],
    explanation: "Deux têtes de Zizou sur corners.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Quel pays a battu l'Allemagne 7-1 en demi-finale en 2014 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "C'est l'Allemagne qui a infligé ce score", is_correct: true },
      { text: "Pays-Bas", is_correct: false },
    ],
    explanation:
      "Le Mineirao : Allemagne 7-1 Brésil, demi-finale CDM 2014 au Brésil.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Quel pays a gagné la première Coupe du Monde en 1930 ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Uruguay", is_correct: true },
      { text: "Italie", is_correct: false },
      { text: "Brésil", is_correct: false },
    ],
    explanation: "L'Uruguay a battu l'Argentine 4-2 en finale, à domicile.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "En quelle année la France a-t-elle organisé sa 1ère CDM ?",
    answers: [
      { text: "1930", is_correct: false },
      { text: "1938", is_correct: true },
      { text: "1958", is_correct: false },
      { text: "1998", is_correct: false },
    ],
    explanation:
      "La France a accueilli sa 1ère CDM en 1938 (l'Italie l'a remportée).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a remporté la CDM 1966, à domicile ?",
    answers: [
      { text: "Allemagne de l'Ouest", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Angleterre", is_correct: true },
      { text: "Portugal", is_correct: false },
    ],
    explanation:
      "L'Angleterre a battu la RFA 4-2 à Wembley (Geoff Hurst triplé).",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Quel pays a remporté la CDM 2018 en Russie ?",
    answers: [
      { text: "Croatie", is_correct: false },
      { text: "Belgique", is_correct: false },
      { text: "Angleterre", is_correct: false },
      { text: "France", is_correct: true },
    ],
    explanation: "La France a battu la Croatie 4-2 en finale.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Combien de CDM la France a-t-elle remportées au total ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: true },
      { text: "3", is_correct: false },
      { text: "0", is_correct: false },
    ],
    explanation: "Deux titres : 1998 (à domicile) et 2018 (en Russie).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la CDM 2018 ?",
    answers: [
      { text: "Russie", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Afrique du Sud", is_correct: false },
    ],
    explanation: "La Russie a accueilli la 21e édition de la CDM.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel surnom est donné au but légendaire de Maradona en 1986 ?",
    answers: [
      { text: "Le But du Siècle", is_correct: true },
      { text: "La Main de Dieu", is_correct: false },
      { text: "La Roulette", is_correct: false },
      { text: "Le But en Or", is_correct: false },
    ],
    explanation:
      "Maradona dribble la moitié de l'équipe anglaise à la 55e minute.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Comment est surnommé le triomphe uruguayen de 1950 au Brésil ?",
    answers: [
      { text: "Maracanazo", is_correct: true },
      { text: "Mineiraço", is_correct: false },
      { text: "Tropicana", is_correct: false },
      { text: "Carnaval", is_correct: false },
    ],
    explanation:
      "Le 16 juillet 1950 au Maracana, l'Uruguay bat le Brésil 2-1.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question:
      "Quel est le score historique d'Allemagne contre Hongrie en finale 1954 ?",
    answers: [
      { text: "2-2", is_correct: false },
      { text: "3-2 (Miracle de Berne)", is_correct: true },
      { text: "4-1", is_correct: false },
      { text: "3-3 puis tab", is_correct: false },
    ],
    explanation:
      "L'Allemagne renverse la Hongrie de Puskás 3-2 — le 'Miracle de Berne'.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "En quelle année la Corée du Sud et le Japon ont co-organisé la CDM ?",
    answers: [
      { text: "1998", is_correct: false },
      { text: "2002", is_correct: true },
      { text: "2006", is_correct: false },
      { text: "2010", is_correct: false },
    ],
    explanation: "Première CDM co-organisée par deux pays asiatiques.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la CDM 1958 ?",
    answers: [
      { text: "France", is_correct: false },
      { text: "Suède", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Mexique", is_correct: false },
    ],
    explanation:
      "Suède 1958 : sacre du Brésil et explosion de Pelé à 17 ans.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a remporté la CDM 1934 ?",
    answers: [
      { text: "Italie", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Tchécoslovaquie", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "Italie 1934 sur ses terres, sacre de la Squadra Azzurra.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Qui a remporté la CDM 2014 au Brésil ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "Allemagne", is_correct: true },
      { text: "Pays-Bas", is_correct: false },
    ],
    explanation:
      "L'Allemagne bat l'Argentine 1-0 (but de Götze en prolongation).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la CDM 1990 ?",
    answers: [
      { text: "Italie", is_correct: true },
      { text: "Espagne", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "France", is_correct: false },
    ],
    explanation: "Italie 1990, sacre de l'Allemagne de l'Ouest.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la CDM 1994 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Mexique", is_correct: false },
      { text: "États-Unis", is_correct: true },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "USA 1994, finale Brésil-Italie remportée par le Brésil aux tab.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Combien de CDM l'Allemagne a-t-elle remportées ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
      { text: "4", is_correct: true },
      { text: "5", is_correct: false },
    ],
    explanation: "1954, 1974, 1990 et 2014.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Combien de CDM l'Italie a-t-elle remportées ?",
    answers: [
      { text: "3", is_correct: false },
      { text: "4", is_correct: true },
      { text: "5", is_correct: false },
      { text: "2", is_correct: false },
    ],
    explanation: "1934, 1938, 1982 et 2006.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Combien de CDM l'Argentine a-t-elle remportées ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: false },
      { text: "3", is_correct: true },
      { text: "4", is_correct: false },
    ],
    explanation: "1978 (à domicile), 1986 (Maradona) et 2022 (Messi).",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Combien de CDM l'Uruguay a-t-il remportées ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: true },
      { text: "3", is_correct: false },
      { text: "0", is_correct: false },
    ],
    explanation: "1930 (à domicile) et 1950 (au Maracana).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel sélectionneur a mené la France au titre en 1998 ?",
    answers: [
      { text: "Roger Lemerre", is_correct: false },
      { text: "Aimé Jacquet", is_correct: true },
      { text: "Raymond Domenech", is_correct: false },
      { text: "Michel Platini", is_correct: false },
    ],
    explanation: "Aimé Jacquet sélectionneur de 1994 à 1998.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Qui a inscrit le but vainqueur de la finale CDM 2010 ?",
    answers: [
      { text: "Andrés Iniesta", is_correct: true },
      { text: "David Villa", is_correct: false },
      { text: "Xavi Hernández", is_correct: false },
      { text: "Cesc Fàbregas", is_correct: false },
    ],
    explanation: "Iniesta marque à la 116e minute (Espagne 1-0 Pays-Bas).",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Qui a remporté la CDM 2002 ?",
    answers: [
      { text: "Brésil", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Corée du Sud", is_correct: false },
    ],
    explanation: "Le Brésil bat l'Allemagne 2-0 en finale (Ronaldo doublé).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Qui a remporté la CDM 2006 en Allemagne ?",
    answers: [
      { text: "France", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Italie", is_correct: true },
      { text: "Portugal", is_correct: false },
    ],
    explanation:
      "Italie bat France 1-1 puis 5-3 aux tirs au but en finale.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a accueilli la CDM 1986 après le désistement colombien ?",
    answers: [
      { text: "Mexique", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "USA", is_correct: false },
    ],
    explanation: "Le Mexique a accueilli la CDM 1986 (Argentine de Maradona vainqueur).",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a accueilli la CDM 1962 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Chili", is_correct: true },
      { text: "Argentine", is_correct: false },
      { text: "Uruguay", is_correct: false },
    ],
    explanation: "Chili 1962, sacre du Brésil avec Pelé (blessé) puis Garrincha.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a accueilli la CDM 1974 ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Allemagne de l'Ouest", is_correct: true },
      { text: "Italie", is_correct: false },
    ],
    explanation: "RFA 1974, sacre allemand face aux Pays-Bas de Cruyff.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a accueilli la CDM 1978 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Mexique", is_correct: false },
      { text: "Argentine", is_correct: true },
      { text: "Chili", is_correct: false },
    ],
    explanation: "Argentine 1978, sacre à domicile (Kempes top scorer).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Qui a remporté la CDM 1982 en Espagne ?",
    answers: [
      { text: "Italie", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Espagne", is_correct: false },
    ],
    explanation: "Italie bat la RFA 3-1 (Paolo Rossi top scorer).",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "En quelle année la CDM s'est-elle d'abord disputée à 32 équipes ?",
    answers: [
      { text: "1990", is_correct: false },
      { text: "1994", is_correct: false },
      { text: "1998", is_correct: true },
      { text: "2002", is_correct: false },
    ],
    explanation: "Passage à 32 équipes pour la CDM 1998 en France.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a perdu la finale CDM 1990 face à la RFA ?",
    answers: [
      { text: "Argentine", is_correct: true },
      { text: "Italie", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Angleterre", is_correct: false },
    ],
    explanation: "Argentine 0-1 RFA, but de Brehme sur penalty.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Combien d'équipes participaient à la première CDM (1930) ?",
    answers: [
      { text: "13", is_correct: true },
      { text: "8", is_correct: false },
      { text: "16", is_correct: false },
      { text: "20", is_correct: false },
    ],
    explanation: "13 équipes : 7 sud-américaines, 4 européennes, 2 nord-américaines.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel cameroun nais devient le plus vieux buteur d'une CDM en 1994 ?",
    answers: [
      { text: "Roger Milla", is_correct: true },
      { text: "Samuel Eto'o", is_correct: false },
      { text: "Patrick Mboma", is_correct: false },
      { text: "François Omam-Biyik", is_correct: false },
    ],
    explanation:
      "Roger Milla marque à 42 ans contre la Russie (CDM 1994).",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel capitaine français a soulevé le trophée de la CDM 1998 ?",
    answers: [
      { text: "Marcel Desailly", is_correct: false },
      { text: "Laurent Blanc", is_correct: false },
      { text: "Didier Deschamps", is_correct: true },
      { text: "Zinédine Zidane", is_correct: false },
    ],
    explanation: "Deschamps capitaine en 1998, sélectionneur champion en 2018.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Qui a marqué le but vainqueur de la finale CDM 2014 ?",
    answers: [
      { text: "Mario Götze", is_correct: true },
      { text: "Thomas Müller", is_correct: false },
      { text: "Lionel Messi", is_correct: false },
      { text: "André Schürrle", is_correct: false },
    ],
    explanation: "Götze marque à la 113e minute, Allemagne 1-0 Argentine.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel pays a fini 3e de la CDM 1998 ?",
    answers: [
      { text: "Pays-Bas", is_correct: false },
      { text: "Croatie", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Italie", is_correct: false },
    ],
    explanation:
      "La Croatie, pour sa 1ère participation, finit 3e (Suker top scorer).",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays africain est devenu le 1er demi-finaliste de CDM en 2022 ?",
    answers: [
      { text: "Cameroun", is_correct: false },
      { text: "Sénégal", is_correct: false },
      { text: "Maroc", is_correct: true },
      { text: "Ghana", is_correct: false },
    ],
    explanation: "Le Maroc, demi-finaliste historique au Qatar 2022.",
  },
  {
    theme: "historique",
    difficulty: 1,
    question: "Quel a été le score de la finale CDM 2018 France-Croatie ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "3-3 (tab)", is_correct: false },
      { text: "4-2", is_correct: true },
      { text: "2-0", is_correct: false },
    ],
    explanation: "France 4-2 Croatie, finale CDM 2018.",
  },
  {
    theme: "historique",
    difficulty: 3,
    question: "Quel pays a éliminé la France en huitième CDM 2014 (était-ce le cas) ?",
    answers: [
      { text: "La France a atteint les quarts (battue par l'Allemagne)", is_correct: true },
      { text: "Nigéria", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Pays-Bas", is_correct: false },
    ],
    explanation:
      "La France élimine le Nigéria en 1/8 (2-0), puis perd 0-1 face à l'Allemagne en quart.",
  },
  {
    theme: "historique",
    difficulty: 2,
    question: "Quel gardien argentin était surnommé 'El Loco' à la CDM 2022 ?",
    answers: [
      { text: "Sergio Romero", is_correct: false },
      { text: "Emiliano 'Dibu' Martínez", is_correct: true },
      { text: "Nahuel Guzmán", is_correct: false },
      { text: "Franco Armani", is_correct: false },
    ],
    explanation: "'Dibu' Martínez, MVP du gardien et ses arrêts décisifs.",
  },

  // ============== ÉQUIPES ==============
  {
    theme: "equipes",
    difficulty: 1,
    question: "Combien d'équipes participent à la CDM 2026 pour la 1ère fois ?",
    answers: [
      { text: "32", is_correct: false },
      { text: "40", is_correct: false },
      { text: "48", is_correct: true },
      { text: "64", is_correct: false },
    ],
    explanation:
      "Le format passe de 32 à 48 équipes, réparties en 12 groupes de 4.",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quels pays organisent la Coupe du Monde 2026 ?",
    answers: [
      { text: "USA, Canada, Mexique", is_correct: true },
      { text: "USA seulement", is_correct: false },
      { text: "Mexique, Argentine, Brésil", is_correct: false },
      { text: "USA, Brésil, Canada", is_correct: false },
    ],
    explanation:
      "Première CDM à trois nations hôtes, du 11 juin au 19 juillet 2026.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quelle est la seule équipe à avoir participé à toutes les CDM ?",
    answers: [
      { text: "Allemagne", is_correct: false },
      { text: "Italie", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "Brésil", is_correct: true },
    ],
    explanation: "Le Brésil n'a jamais manqué une seule édition depuis 1930.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Combien de groupes y a-t-il en phase de poules en 2026 ?",
    answers: [
      { text: "8 groupes de 4", is_correct: false },
      { text: "12 groupes de 4", is_correct: true },
      { text: "16 groupes de 3", is_correct: false },
      { text: "12 groupes de 3", is_correct: false },
    ],
    explanation: "12 groupes de 4 équipes pour ce nouveau format à 48.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question:
      "Quelle équipe a remporté la première Coupe d'Afrique des Nations en tant que pays hôte de CDM 2026 ?",
    answers: [
      { text: "Maroc", is_correct: false },
      { text: "Côte d'Ivoire", is_correct: true },
      { text: "Sénégal", is_correct: false },
      { text: "Égypte", is_correct: false },
    ],
    explanation: "La Côte d'Ivoire a remporté la CAN 2023 à domicile.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Combien de pays sont qualifiés au titre de la CONCACAF en 2026 ?",
    answers: [
      { text: "3", is_correct: false },
      { text: "6 (dont 3 hôtes)", is_correct: true },
      { text: "8", is_correct: false },
      { text: "4", is_correct: false },
    ],
    explanation:
      "6 places dont 3 automatiques pour les hôtes (USA, Canada, Mexique) + 3 via qualifications.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quelle équipe est surnommée 'Les Lions de l'Atlas' ?",
    answers: [
      { text: "Algérie", is_correct: false },
      { text: "Tunisie", is_correct: false },
      { text: "Maroc", is_correct: true },
      { text: "Sénégal", is_correct: false },
    ],
    explanation:
      "Le Maroc est devenu en 2022 la 1ère équipe africaine demi-finaliste de la CDM.",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quel est le surnom de l'équipe de France ?",
    answers: [
      { text: "Les Bleus", is_correct: true },
      { text: "Les Tricolores uniquement", is_correct: false },
      { text: "Les Coqs", is_correct: false },
      { text: "Les Lions", is_correct: false },
    ],
    explanation:
      "Les Bleus pour la couleur du maillot — aussi 'Les Tricolores'.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quelle équipe européenne a éliminé l'Italie en barrage CDM 2022 ?",
    answers: [
      { text: "Macédoine du Nord", is_correct: true },
      { text: "Suède", is_correct: false },
      { text: "Slovaquie", is_correct: false },
      { text: "Irlande du Nord", is_correct: false },
    ],
    explanation:
      "Surprise totale : la Macédoine du Nord a battu l'Italie 1-0 à Palerme.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question:
      "Combien de places sont attribuées à l'AFC (Asie) pour la CDM 2026 ?",
    answers: [
      { text: "4", is_correct: false },
      { text: "6", is_correct: false },
      { text: "8 (+1 barrage)", is_correct: true },
      { text: "10", is_correct: false },
    ],
    explanation: "8 places directes + 1 place via barrage intercontinental.",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quel est le surnom de l'équipe d'Italie ?",
    answers: [
      { text: "Les Azzurri / Squadra Azzurra", is_correct: true },
      { text: "La Roja", is_correct: false },
      { text: "Les Tifosi", is_correct: false },
      { text: "La Nazionale Bianca", is_correct: false },
    ],
    explanation: "Les Azzurri pour la couleur azur du maillot italien.",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quel est le surnom de l'équipe d'Espagne ?",
    answers: [
      { text: "La Furia", is_correct: false },
      { text: "La Roja", is_correct: true },
      { text: "La Naranja", is_correct: false },
      { text: "Los Galácticos", is_correct: false },
    ],
    explanation: "La Roja = 'la rouge', couleur du maillot espagnol.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel est le surnom de l'équipe d'Argentine ?",
    answers: [
      { text: "Les Pumas", is_correct: false },
      { text: "L'Albiceleste", is_correct: true },
      { text: "La Furia", is_correct: false },
      { text: "Les Cariocas", is_correct: false },
    ],
    explanation: "L'Albiceleste = 'blanc-céleste', les rayures du maillot.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel est le surnom de l'équipe d'Allemagne ?",
    answers: [
      { text: "Die Mannschaft", is_correct: true },
      { text: "Les Aigles", is_correct: false },
      { text: "Die Adler", is_correct: false },
      { text: "Les Panzer", is_correct: false },
    ],
    explanation: "'Die Mannschaft' = 'l'équipe' en allemand.",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quel est le surnom de l'équipe d'Angleterre ?",
    answers: [
      { text: "Les Three Lions", is_correct: true },
      { text: "Les Reds", is_correct: false },
      { text: "Les Bulldogs", is_correct: false },
      { text: "Les Roses", is_correct: false },
    ],
    explanation:
      "Three Lions en référence aux 3 lions sur l'écusson royal anglais.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel est le surnom de l'équipe des Pays-Bas ?",
    answers: [
      { text: "Les Tulipes", is_correct: false },
      { text: "Oranje", is_correct: true },
      { text: "Les Hollandais Volants", is_correct: false },
      { text: "Les Vikings", is_correct: false },
    ],
    explanation:
      "Oranje en référence à la dynastie d'Orange-Nassau et à la couleur du maillot.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel pays a accueilli la première CDM sur le sol africain ?",
    answers: [
      { text: "Maroc", is_correct: false },
      { text: "Égypte", is_correct: false },
      { text: "Afrique du Sud", is_correct: true },
      { text: "Tunisie", is_correct: false },
    ],
    explanation: "L'Afrique du Sud a accueilli la CDM 2010.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a éliminé la France à l'ouverture de la CDM 2002 ?",
    answers: [
      { text: "Sénégal", is_correct: true },
      { text: "Danemark", is_correct: false },
      { text: "Uruguay", is_correct: false },
      { text: "Croatie", is_correct: false },
    ],
    explanation: "Sénégal 1-0 France (but Bouba Diop), choc historique.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Combien d'équipes européennes participeront à la CDM 2026 ?",
    answers: [
      { text: "13", is_correct: false },
      { text: "14", is_correct: false },
      { text: "16", is_correct: true },
      { text: "20", is_correct: false },
    ],
    explanation: "L'UEFA est la confédération la plus représentée (16 places).",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Combien d'équipes africaines participeront à la CDM 2026 ?",
    answers: [
      { text: "5", is_correct: false },
      { text: "7", is_correct: false },
      { text: "9 (+1 barrage)", is_correct: true },
      { text: "11", is_correct: false },
    ],
    explanation: "9 places CAF directes + 1 place via barrage intercontinental.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Combien d'équipes sud-américaines à la CDM 2026 ?",
    answers: [
      { text: "4", is_correct: false },
      { text: "6 (+1 barrage)", is_correct: true },
      { text: "5", is_correct: false },
      { text: "8", is_correct: false },
    ],
    explanation: "CONMEBOL a 6 places + 1 via barrage intercontinental.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel pays asiatique a été demi-finaliste de la CDM 2002 ?",
    answers: [
      { text: "Japon", is_correct: false },
      { text: "Corée du Sud", is_correct: true },
      { text: "Chine", is_correct: false },
      { text: "Australie", is_correct: false },
    ],
    explanation:
      "La Corée du Sud a éliminé Italie et Espagne sur son sol en 2002.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a remporté le 1er Mondial féminin en 1991 ?",
    answers: [
      { text: "USA", is_correct: true },
      { text: "Norvège", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Suède", is_correct: false },
    ],
    explanation: "Les USA, championnes en 1991 (en Chine).",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Combien de fois le Mexique a-t-il organisé une CDM en comptant 2026 ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3", is_correct: true },
      { text: "1", is_correct: false },
      { text: "4", is_correct: false },
    ],
    explanation: "Mexique : 1970, 1986 et 2026 (co-organisateur).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Combien de fois la France a-t-elle atteint une finale de CDM ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
      { text: "4", is_correct: true },
      { text: "5", is_correct: false },
    ],
    explanation: "1998 (✓), 2006 (perdue), 2018 (✓), 2022 (perdue).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel record détient l'Allemagne en matière de finales de CDM ?",
    answers: [
      { text: "Le plus de finales jouées (8)", is_correct: true },
      { text: "Le plus de finales gagnées (8)", is_correct: false },
      { text: "La plus longue série sans finale", is_correct: false },
      { text: "Aucun record particulier", is_correct: false },
    ],
    explanation: "L'Allemagne a joué 8 finales : 1954, 1966, 1974, 1982, 1986, 1990, 2002, 2014.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a remporté la Coupe d'Asie 2023 ?",
    answers: [
      { text: "Qatar", is_correct: true },
      { text: "Japon", is_correct: false },
      { text: "Iran", is_correct: false },
      { text: "Corée du Sud", is_correct: false },
    ],
    explanation: "Le Qatar a remporté la Coupe d'Asie 2023, à domicile (en 2024).",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quelle est la confédération de la Nouvelle-Zélande ?",
    answers: [
      { text: "AFC (Asie)", is_correct: false },
      { text: "OFC (Océanie)", is_correct: true },
      { text: "CONCACAF", is_correct: false },
      { text: "UEFA", is_correct: false },
    ],
    explanation: "OFC, la confédération océanienne (plus petite des 6).",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Combien de places en CDM 2026 pour l'OFC (Océanie) ?",
    answers: [
      { text: "0", is_correct: false },
      { text: "1 (+1 barrage)", is_correct: true },
      { text: "2 directes", is_correct: false },
      { text: "3 directes", is_correct: false },
    ],
    explanation: "1 place directe (Nouvelle-Zélande) + 1 via barrage intercontinental.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a remporté la Copa América 2024 ?",
    answers: [
      { text: "Argentine", is_correct: true },
      { text: "Colombie", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Uruguay", is_correct: false },
    ],
    explanation: "Argentine 1-0 Colombie en finale, doublé de la CDM 2022.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel surnom porte l'équipe du Sénégal ?",
    answers: [
      { text: "Les Lions de la Téranga", is_correct: true },
      { text: "Les Aigles", is_correct: false },
      { text: "Les Éléphants", is_correct: false },
      { text: "Les Étalons", is_correct: false },
    ],
    explanation:
      "'Téranga' désigne l'hospitalité en wolof ; le lion est l'emblème.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel est le surnom de l'équipe de Côte d'Ivoire ?",
    answers: [
      { text: "Les Étalons", is_correct: false },
      { text: "Les Lions Indomptables", is_correct: false },
      { text: "Les Éléphants", is_correct: true },
      { text: "Les Léopards", is_correct: false },
    ],
    explanation: "Les Éléphants — emblème national de la Côte d'Ivoire.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel est le surnom de l'équipe du Cameroun ?",
    answers: [
      { text: "Les Éléphants", is_correct: false },
      { text: "Les Lions Indomptables", is_correct: true },
      { text: "Les Étalons", is_correct: false },
      { text: "Les Aigles", is_correct: false },
    ],
    explanation: "Les Lions Indomptables, héros de la CDM 1990 (1ère quart africaine).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays africain a atteint pour la 1ère fois les quarts de CDM ?",
    answers: [
      { text: "Cameroun (1990)", is_correct: true },
      { text: "Maroc (2022)", is_correct: false },
      { text: "Sénégal (2002)", is_correct: false },
      { text: "Ghana (2010)", is_correct: false },
    ],
    explanation:
      "Cameroun 1990 : 1ère équipe africaine en quart de CDM (battue par l'Angleterre).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays sud-américain n'a jamais gagné la CDM ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "Uruguay", is_correct: false },
      { text: "Colombie", is_correct: true },
    ],
    explanation:
      "Brésil, Argentine et Uruguay sont les 3 vainqueurs sud-américains.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quelle couleur dominante porte le maillot de l'équipe du Brésil ?",
    answers: [
      { text: "Jaune", is_correct: true },
      { text: "Rouge", is_correct: false },
      { text: "Bleu", is_correct: false },
      { text: "Vert", is_correct: false },
    ],
    explanation:
      "Jaune et vert (Auriverde), depuis 1954 après le traumatisme de 1950.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays portait du blanc avant 1954 (avant son maillot jaune) ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Brésil", is_correct: true },
      { text: "Uruguay", is_correct: false },
      { text: "Pérou", is_correct: false },
    ],
    explanation:
      "Le Brésil portait du blanc avant 1950 ; le jaune adopté après le traumatisme du Maracanazo.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quelle équipe sud-américaine porte le surnom 'La Tri' ?",
    answers: [
      { text: "Chili", is_correct: false },
      { text: "Équateur", is_correct: true },
      { text: "Colombie", is_correct: false },
      { text: "Pérou", is_correct: false },
    ],
    explanation:
      "L'Équateur, surnommé 'La Tri' (pour les 3 couleurs du drapeau).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a la plus longue série de qualifications en CDM en Europe ?",
    answers: [
      { text: "Allemagne", is_correct: true },
      { text: "Italie", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Espagne", is_correct: false },
    ],
    explanation:
      "L'Allemagne enchaîne les qualifications depuis 1954 (17 participations consécutives en 2022).",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Combien d'équipes sont qualifiées d'office en tant qu'hôte 2026 ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: false },
      { text: "3 (USA, Canada, Mexique)", is_correct: true },
      { text: "4", is_correct: false },
    ],
    explanation: "Les 3 pays hôtes sont qualifiés automatiquement.",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays a été éliminé à la phase de poules CDM 2018 alors qu'il était champion en titre ?",
    answers: [
      { text: "France", is_correct: false },
      { text: "Allemagne", is_correct: true },
      { text: "Espagne", is_correct: false },
      { text: "Brésil", is_correct: false },
    ],
    explanation:
      "L'Allemagne, championne en 2014, sortie en poules de la CDM 2018 (un choc historique).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quelles 2 équipes ont défait l'Allemagne en poules CDM 2018 ?",
    answers: [
      { text: "Mexique et Corée du Sud", is_correct: true },
      { text: "Suède et Corée du Sud", is_correct: false },
      { text: "Mexique et Suède", is_correct: false },
      { text: "Brésil et Mexique", is_correct: false },
    ],
    explanation:
      "Le Mexique gagne 1-0 et la Corée du Sud 2-0, éliminant l'Allemagne.",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel pays a remporté la Coupe d'Asie féminine 2022 ?",
    answers: [
      { text: "Chine", is_correct: true },
      { text: "Japon", is_correct: false },
      { text: "Australie", is_correct: false },
      { text: "Corée du Sud", is_correct: false },
    ],
    explanation:
      "La Chine a remporté la Coupe d'Asie féminine en 2022 (en Inde).",
  },
  {
    theme: "equipes",
    difficulty: 3,
    question: "Quel pays sera tête de série du groupe contenant l'Argentine en CDM 2026 ?",
    answers: [
      { text: "C'est l'Argentine elle-même (championne en titre)", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "France", is_correct: false },
    ],
    explanation:
      "L'Argentine est tête de série (championne en titre = pot 1).",
  },
  {
    theme: "equipes",
    difficulty: 1,
    question: "Quel surnom porte l'équipe du Canada ?",
    answers: [
      { text: "Les Canucks", is_correct: false },
      { text: "Les Rouges", is_correct: true },
      { text: "Les Castors", is_correct: false },
      { text: "Les Orignaux", is_correct: false },
    ],
    explanation: "L'équipe nationale est surnommée 'Les Rouges' (Canada Soccer).",
  },
  {
    theme: "equipes",
    difficulty: 2,
    question: "Quel pays a accueilli la dernière CDM avant 2026 ?",
    answers: [
      { text: "Russie", is_correct: false },
      { text: "Qatar", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Afrique du Sud", is_correct: false },
    ],
    explanation:
      "Qatar 2022, du 20 novembre au 18 décembre (1ère CDM hivernale).",
  },

  // ============== JOUEURS ==============
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Qui a remporté le Ballon d'Or 2024 ?",
    answers: [
      { text: "Erling Haaland", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Rodri", is_correct: true },
      { text: "Vinicius Jr", is_correct: false },
    ],
    explanation:
      "Rodri (Manchester City, Espagne) a remporté le Ballon d'Or 2024.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question:
      "Qui est le meilleur buteur de l'histoire de la Coupe du Monde ?",
    answers: [
      { text: "Pelé", is_correct: false },
      { text: "Miroslav Klose", is_correct: true },
      { text: "Lionel Messi", is_correct: false },
      { text: "Ronaldo (R9)", is_correct: false },
    ],
    explanation: "Klose : 16 buts entre 2002 et 2014.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a battu le record de buts en CDM en 2014 ?",
    answers: [
      { text: "Miroslav Klose (16 buts)", is_correct: true },
      { text: "Thomas Müller", is_correct: false },
      { text: "Lionel Messi", is_correct: false },
      { text: "Cristiano Ronaldo", is_correct: false },
    ],
    explanation:
      "Klose dépasse Ronaldo R9 (15 buts) en CDM 2014 (16 buts au total).",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel club Kylian Mbappé a-t-il rejoint en 2024 ?",
    answers: [
      { text: "Manchester City", is_correct: false },
      { text: "Real Madrid", is_correct: true },
      { text: "FC Barcelone", is_correct: false },
      { text: "Liverpool", is_correct: false },
    ],
    explanation: "Mbappé a quitté le PSG pour le Real Madrid à l'été 2024.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question:
      "Qui a inscrit un triplé en finale de Coupe du Monde 2022 ?",
    answers: [
      { text: "Lionel Messi", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Olivier Giroud", is_correct: false },
      { text: "Ángel Di María", is_correct: false },
    ],
    explanation:
      "Mbappé a inscrit un triplé en finale CDM 2022, mais la France a perdu aux tirs au but.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Combien de Ballons d'Or Lionel Messi a-t-il remportés ?",
    answers: [
      { text: "6", is_correct: false },
      { text: "7", is_correct: false },
      { text: "8", is_correct: true },
      { text: "9", is_correct: false },
    ],
    explanation: "Messi : 2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question:
      "Qui est le plus jeune buteur de l'histoire de la Coupe du Monde ?",
    answers: [
      { text: "Lionel Messi", is_correct: false },
      { text: "Pelé", is_correct: true },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Michael Owen", is_correct: false },
    ],
    explanation: "Pelé avait 17 ans et 239 jours en 1958 contre le Pays de Galles.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question:
      "Quel gardien a remporté le Gant d'Or de la CDM 2022 ?",
    answers: [
      { text: "Hugo Lloris", is_correct: false },
      { text: "Emiliano Martínez", is_correct: true },
      { text: "Yann Sommer", is_correct: false },
      { text: "Manuel Neuer", is_correct: false },
    ],
    explanation:
      "Le 'Dibu' Martínez, gardien de l'Argentine championne du monde.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Qui détient le record de buts en une seule édition de CDM ?",
    answers: [
      { text: "Pelé (1958)", is_correct: false },
      { text: "Just Fontaine (1958)", is_correct: true },
      { text: "Gerd Müller (1970)", is_correct: false },
      { text: "Ronaldo R9 (2002)", is_correct: false },
    ],
    explanation: "Just Fontaine : 13 buts en 1958 avec la France.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "De quel club est issu Lamine Yamal ?",
    answers: [
      { text: "Real Madrid", is_correct: false },
      { text: "FC Barcelone", is_correct: true },
      { text: "Atlético Madrid", is_correct: false },
      { text: "Manchester City", is_correct: false },
    ],
    explanation:
      "Lamine Yamal, jeune prodige formé à La Masia (FC Barcelone).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Combien de Ballons d'Or Cristiano Ronaldo a-t-il remportés ?",
    answers: [
      { text: "4", is_correct: false },
      { text: "5", is_correct: true },
      { text: "6", is_correct: false },
      { text: "7", is_correct: false },
    ],
    explanation: "CR7 : 2008, 2013, 2014, 2016 et 2017.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a remporté le Soulier d'Or de la CDM 2018 ?",
    answers: [
      { text: "Harry Kane", is_correct: true },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Romelu Lukaku", is_correct: false },
    ],
    explanation: "Kane (Angleterre, 6 buts) Soulier d'Or 2018.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Qui a remporté le Soulier d'Or de la CDM 2022 ?",
    answers: [
      { text: "Lionel Messi", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Julián Álvarez", is_correct: false },
      { text: "Olivier Giroud", is_correct: false },
    ],
    explanation: "Mbappé (France, 8 buts) Soulier d'Or 2022.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a remporté le titre de meilleur joueur (Ballon d'Or) de la CDM 2022 ?",
    answers: [
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Lionel Messi", is_correct: true },
      { text: "Luka Modrić", is_correct: false },
      { text: "Emiliano Martínez", is_correct: false },
    ],
    explanation: "Messi élu meilleur joueur de la CDM 2022 (Argentine championne).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Qui a inscrit le but vainqueur de la finale CDM 1978 ?",
    answers: [
      { text: "Mario Kempes", is_correct: true },
      { text: "Daniel Bertoni", is_correct: false },
      { text: "Diego Maradona", is_correct: false },
      { text: "Daniel Passarella", is_correct: false },
    ],
    explanation:
      "Kempes inscrit un doublé en finale 1978 (Argentine 3-1 Pays-Bas a.p.).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur français a remporté le Ballon d'Or 1998 ?",
    answers: [
      { text: "Didier Deschamps", is_correct: false },
      { text: "Zinédine Zidane", is_correct: true },
      { text: "Thierry Henry", is_correct: false },
      { text: "Lilian Thuram", is_correct: false },
    ],
    explanation: "Zidane Ballon d'Or 1998 après le titre mondial.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Combien de buts Just Fontaine a-t-il marqués en CDM 1958 ?",
    answers: [
      { text: "9", is_correct: false },
      { text: "11", is_correct: false },
      { text: "13", is_correct: true },
      { text: "16", is_correct: false },
    ],
    explanation: "Record absolu : 13 buts en 1958 (record toujours intact).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur portugais a remporté le Soulier d'Or de la CDM 1966 ?",
    answers: [
      { text: "Mario Coluna", is_correct: false },
      { text: "Eusébio", is_correct: true },
      { text: "José Augusto", is_correct: false },
      { text: "Torres", is_correct: false },
    ],
    explanation: "Eusébio : 9 buts en CDM 1966 (Soulier d'Or).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a marqué un triplé en finale de CDM 1966 ?",
    answers: [
      { text: "Geoff Hurst", is_correct: true },
      { text: "Bobby Charlton", is_correct: false },
      { text: "Martin Peters", is_correct: false },
      { text: "Gerd Müller", is_correct: false },
    ],
    explanation:
      "Hurst : seul joueur avec un triplé en finale (Angleterre 4-2 RFA).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Qui était le sélectionneur de l'Argentine en CDM 2022 ?",
    answers: [
      { text: "Diego Simeone", is_correct: false },
      { text: "Lionel Scaloni", is_correct: true },
      { text: "César Menotti", is_correct: false },
      { text: "Carlos Bilardo", is_correct: false },
    ],
    explanation:
      "Scaloni, ancien international, sélectionneur depuis 2018.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Qui a porté le brassard de capitaine de l'Argentine en CDM 2022 ?",
    answers: [
      { text: "Nicolás Otamendi", is_correct: false },
      { text: "Lionel Messi", is_correct: true },
      { text: "Ángel Di María", is_correct: false },
      { text: "Rodrigo De Paul", is_correct: false },
    ],
    explanation: "Messi capitaine emblématique de l'Albiceleste.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur a porté le numéro 10 du Brésil en 1970 ?",
    answers: [
      { text: "Pelé", is_correct: true },
      { text: "Tostão", is_correct: false },
      { text: "Rivellino", is_correct: false },
      { text: "Jairzinho", is_correct: false },
    ],
    explanation:
      "Pelé portait le 10, célèbre depuis ; Brésil champion 1970.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur a marqué 5 buts en un seul match de CDM (record absolu) ?",
    answers: [
      { text: "Just Fontaine", is_correct: false },
      { text: "Oleg Salenko", is_correct: true },
      { text: "Pelé", is_correct: false },
      { text: "Ronaldo R9", is_correct: false },
    ],
    explanation: "Salenko (Russie) : 5 buts contre le Cameroun (6-1), CDM 1994.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Qui était capitaine de l'Allemagne en CDM 2014 ?",
    answers: [
      { text: "Manuel Neuer", is_correct: false },
      { text: "Philipp Lahm", is_correct: true },
      { text: "Bastian Schweinsteiger", is_correct: false },
      { text: "Per Mertesacker", is_correct: false },
    ],
    explanation:
      "Lahm, capitaine emblématique du sacre 2014 (a pris sa retraite après).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel gardien français a remporté la CDM 1998 ?",
    answers: [
      { text: "Bernard Lama", is_correct: false },
      { text: "Fabien Barthez", is_correct: true },
      { text: "Ulrich Ramé", is_correct: false },
      { text: "Lionel Letizi", is_correct: false },
    ],
    explanation: "Barthez, titulaire indiscutable en 1998 (et 2006).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel gardien français a remporté la CDM 2018 ?",
    answers: [
      { text: "Steve Mandanda", is_correct: false },
      { text: "Hugo Lloris", is_correct: true },
      { text: "Alphonse Areola", is_correct: false },
      { text: "Benoît Costil", is_correct: false },
    ],
    explanation: "Lloris, capitaine et titulaire en 2018.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Combien de joueurs forment l'effectif d'une équipe en CDM 2026 ?",
    answers: [
      { text: "23", is_correct: false },
      { text: "26", is_correct: true },
      { text: "30", is_correct: false },
      { text: "22", is_correct: false },
    ],
    explanation:
      "Depuis le Qatar 2022, l'effectif est passé de 23 à 26 joueurs.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Erling Haaland représente-t-il ?",
    answers: [
      { text: "Suède", is_correct: false },
      { text: "Norvège", is_correct: true },
      { text: "Danemark", is_correct: false },
      { text: "Islande", is_correct: false },
    ],
    explanation: "Haaland, attaquant norvégien (Manchester City).",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Robert Lewandowski représente-t-il ?",
    answers: [
      { text: "Ukraine", is_correct: false },
      { text: "Slovaquie", is_correct: false },
      { text: "Tchéquie", is_correct: false },
      { text: "Pologne", is_correct: true },
    ],
    explanation: "Lewandowski, capitaine emblématique de la Pologne.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Mohamed Salah représente-t-il ?",
    answers: [
      { text: "Maroc", is_correct: false },
      { text: "Égypte", is_correct: true },
      { text: "Algérie", is_correct: false },
      { text: "Tunisie", is_correct: false },
    ],
    explanation: "Salah, attaquant emblématique de Liverpool et de l'Égypte.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Sadio Mané représente-t-il ?",
    answers: [
      { text: "Sénégal", is_correct: true },
      { text: "Côte d'Ivoire", is_correct: false },
      { text: "Mali", is_correct: false },
      { text: "Guinée", is_correct: false },
    ],
    explanation: "Mané, attaquant sénégalais (Champion CAN 2022 avec le Sénégal).",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Jude Bellingham représente-t-il ?",
    answers: [
      { text: "Pays-Bas", is_correct: false },
      { text: "Angleterre", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Écosse", is_correct: false },
    ],
    explanation: "Bellingham, jeune star anglaise au Real Madrid.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel pays Vinicius Junior représente-t-il ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Brésil", is_correct: true },
      { text: "Portugal", is_correct: false },
      { text: "Espagne", is_correct: false },
    ],
    explanation: "Vinicius, ailier brésilien au Real Madrid.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur surnommé 'Petit Oiseau' a brillé pour le Brésil en 1962 ?",
    answers: [
      { text: "Garrincha", is_correct: true },
      { text: "Pelé", is_correct: false },
      { text: "Didi", is_correct: false },
      { text: "Vavá", is_correct: false },
    ],
    explanation: "Garrincha ('Petit Oiseau') brille en 1962 alors que Pelé est blessé.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Qui a marqué le but italien en finale CDM 2006 ?",
    answers: [
      { text: "Andrea Pirlo", is_correct: false },
      { text: "Marco Materazzi", is_correct: true },
      { text: "Luca Toni", is_correct: false },
      { text: "Francesco Totti", is_correct: false },
    ],
    explanation:
      "Materazzi égalise (1-1) après l'ouverture sur penalty de Zidane.",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Quel joueur français a marqué le seul but français en finale CDM 2006 ?",
    answers: [
      { text: "Thierry Henry", is_correct: false },
      { text: "Zinédine Zidane (penalty)", is_correct: true },
      { text: "David Trezeguet", is_correct: false },
      { text: "Patrick Vieira", is_correct: false },
    ],
    explanation:
      "Zidane sur penalty à la 7e minute (puis carton rouge plus tard pour coup de tête).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Combien de buts Maradona a-t-il marqués en CDM 1986 ?",
    answers: [
      { text: "3", is_correct: false },
      { text: "5", is_correct: true },
      { text: "7", is_correct: false },
      { text: "8", is_correct: false },
    ],
    explanation:
      "Maradona marque 5 buts et délivre 5 passes décisives en CDM 1986.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Combien de buts Ronaldo R9 a-t-il marqués en CDM 2002 ?",
    answers: [
      { text: "6", is_correct: false },
      { text: "8", is_correct: true },
      { text: "10", is_correct: false },
      { text: "4", is_correct: false },
    ],
    explanation: "Ronaldo R9 : 8 buts en CDM 2002 (Soulier d'Or).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur a remporté le Ballon d'Or 2002 ?",
    answers: [
      { text: "Zinédine Zidane", is_correct: false },
      { text: "Ronaldo (R9)", is_correct: true },
      { text: "Roberto Carlos", is_correct: false },
      { text: "Rivaldo", is_correct: false },
    ],
    explanation:
      "Ronaldo R9, Ballon d'Or 2002 après son sacre mondial avec le Brésil.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur français devient meilleur buteur de l'histoire des Bleus en 2023 ?",
    answers: [
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Olivier Giroud", is_correct: true },
      { text: "Thierry Henry", is_correct: false },
    ],
    explanation:
      "Giroud dépasse Henry en 2023 (sélection vs Gibraltar — record à 57 buts puis +).",
  },
  {
    theme: "joueurs",
    difficulty: 1,
    question: "Mario Götze a marqué le but vainqueur de quelle finale ?",
    answers: [
      { text: "Finale CDM 2010", is_correct: false },
      { text: "Finale CDM 2014", is_correct: true },
      { text: "Finale CDM 2018", is_correct: false },
      { text: "Finale Euro 2024", is_correct: false },
    ],
    explanation:
      "Götze marque à la 113e minute en finale CDM 2014 (Allemagne 1-0 Argentine).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur portugais détient le record de sélections en équipe nationale ?",
    answers: [
      { text: "Cristiano Ronaldo", is_correct: true },
      { text: "Luís Figo", is_correct: false },
      { text: "Pepe", is_correct: false },
      { text: "Bruno Fernandes", is_correct: false },
    ],
    explanation:
      "CR7, plus de 200 sélections avec le Portugal (record toutes nations confondues).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a inscrit le but spectaculaire à 19 ans en finale CDM 2018 ?",
    answers: [
      { text: "Lucas Hernandez", is_correct: false },
      { text: "Benjamin Pavard", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Antoine Griezmann", is_correct: false },
    ],
    explanation:
      "Mbappé, 19 ans, marque en finale (4e but français), comme Pelé en 1958.",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur a remporté le Ballon d'Or 2006 ?",
    answers: [
      { text: "Zinédine Zidane", is_correct: false },
      { text: "Fabio Cannavaro", is_correct: true },
      { text: "Andrea Pirlo", is_correct: false },
      { text: "Thierry Henry", is_correct: false },
    ],
    explanation:
      "Cannavaro, défenseur capitaine de l'Italie championne du monde 2006.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel joueur a remporté le Soulier d'Or de la CDM 1982 ?",
    answers: [
      { text: "Paolo Rossi", is_correct: true },
      { text: "Karl-Heinz Rummenigge", is_correct: false },
      { text: "Zico", is_correct: false },
      { text: "Diego Maradona", is_correct: false },
    ],
    explanation: "Rossi (Italie), 6 buts à la CDM 1982 (et MVP).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Quel pays Luka Modrić représente-t-il ?",
    answers: [
      { text: "Croatie", is_correct: true },
      { text: "Serbie", is_correct: false },
      { text: "Slovénie", is_correct: false },
      { text: "Bosnie", is_correct: false },
    ],
    explanation: "Modrić, capitaine et MVP de la Croatie en CDM 2018.",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Combien de buts Olivier Giroud a-t-il marqués en CDM 2022 ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
      { text: "4", is_correct: true },
      { text: "5", is_correct: false },
    ],
    explanation: "Giroud : 4 buts en CDM 2022 (Australie x1, Pologne x1, Pologne, Angleterre).",
  },
  {
    theme: "joueurs",
    difficulty: 3,
    question: "Quel joueur français a marqué en demi-finale CDM 2022 contre le Maroc ?",
    answers: [
      { text: "Théo Hernandez et Randal Kolo Muani", is_correct: true },
      { text: "Mbappé et Griezmann", is_correct: false },
      { text: "Giroud et Tchouaméni", is_correct: false },
      { text: "Dembélé et Pavard", is_correct: false },
    ],
    explanation: "France 2-0 Maroc, buts Théo Hernandez (5e) et Kolo Muani (79e).",
  },
  {
    theme: "joueurs",
    difficulty: 2,
    question: "Qui est le sélectionneur de la France à la CDM 2026 ?",
    answers: [
      { text: "Didier Deschamps", is_correct: true },
      { text: "Thierry Henry", is_correct: false },
      { text: "Zinédine Zidane", is_correct: false },
      { text: "Raymond Domenech", is_correct: false },
    ],
    explanation:
      "Deschamps, sélectionneur depuis 2012 — accord pour rester jusqu'à la CDM 2026.",
  },

  // ============== MATCHS ==============
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score de la finale CDM 2022 dans le temps réglementaire ?",
    answers: [
      { text: "2-2", is_correct: false },
      { text: "3-3 (4-2 tab)", is_correct: true },
      { text: "1-1 (4-3 tab)", is_correct: false },
      { text: "4-3", is_correct: false },
    ],
    explanation:
      "3-3 après prolongations, Argentine bat France 4-2 aux tirs au but.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel match va ouvrir la Coupe du Monde 2026 ?",
    answers: [
      { text: "USA vs. Mexique", is_correct: false },
      { text: "Match du Mexique à l'Estadio Azteca", is_correct: true },
      { text: "France vs. Brésil", is_correct: false },
      { text: "Canada vs. Mexique", is_correct: false },
    ],
    explanation:
      "Le match d'ouverture est traditionnellement joué par le pays hôte — ici, le Mexique à l'Azteca.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quelle est la plus grande victoire d'une CDM (en écart de buts) ?",
    answers: [
      { text: "Hongrie 10-1 Salvador (1982)", is_correct: true },
      { text: "Allemagne 8-0 Arabie Saoudite (2002)", is_correct: false },
      { text: "Yougoslavie 9-0 Zaïre (1974)", is_correct: false },
      { text: "Brésil 7-1 Allemagne (2014)", is_correct: false },
    ],
    explanation:
      "Hongrie 10-1 Salvador en 1982 — record absolu (9 buts d'écart).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Combien de matchs au total se joueront durant la CDM 2026 ?",
    answers: [
      { text: "64", is_correct: false },
      { text: "80", is_correct: false },
      { text: "104", is_correct: true },
      { text: "128", is_correct: false },
    ],
    explanation:
      "Avec 48 équipes et 12 groupes, le total passe à 104 matchs.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question:
      "Quelle équipe a éliminé le Brésil aux tirs au but en 1/4 CDM 2022 ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Croatie", is_correct: true },
      { text: "Maroc", is_correct: false },
      { text: "France", is_correct: false },
    ],
    explanation: "Croatie 1-1 Brésil (4-2 tab) en quart de finale CDM 2022.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quand a lieu la finale de la CDM 2026 ?",
    answers: [
      { text: "11 juin 2026", is_correct: false },
      { text: "19 juillet 2026", is_correct: true },
      { text: "14 juillet 2026", is_correct: false },
      { text: "27 juillet 2026", is_correct: false },
    ],
    explanation:
      "La finale aura lieu le 19 juillet 2026 au MetLife Stadium (New York/New Jersey).",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question:
      "Quel est le seul pays africain à avoir atteint les demi-finales de la CDM ?",
    answers: [
      { text: "Cameroun", is_correct: false },
      { text: "Sénégal", is_correct: false },
      { text: "Ghana", is_correct: false },
      { text: "Maroc", is_correct: true },
    ],
    explanation:
      "Le Maroc a atteint les demi-finales en 2022, une première historique.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Dans quel stade aura lieu la finale de la CDM 2026 ?",
    answers: [
      { text: "Estadio Azteca (Mexico)", is_correct: false },
      { text: "SoFi Stadium (Los Angeles)", is_correct: false },
      { text: "MetLife Stadium (New York/NJ)", is_correct: true },
      { text: "BMO Field (Toronto)", is_correct: false },
    ],
    explanation: "82 500 places, banlieue de New York côté New Jersey.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question:
      "Quel pays a réussi le plus de tirs au but consécutifs réussis en CDM ?",
    answers: [
      { text: "Allemagne", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation:
      "L'Allemagne a longtemps détenu une série record en séances de tirs au but.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question:
      "Quelle équipe a inscrit le plus de buts lors d'une finale de CDM ?",
    answers: [
      { text: "Brésil (1958, 5 buts)", is_correct: true },
      { text: "Argentine (2022, 3 buts)", is_correct: false },
      { text: "France (1998, 3 buts)", is_correct: false },
      { text: "Italie (1970, 4 buts)", is_correct: false },
    ],
    explanation: "Brésil 5-2 Suède en 1958, finale la plus prolifique pour un vainqueur.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score de la finale CDM 1998 (France-Brésil) ?",
    answers: [
      { text: "2-0", is_correct: false },
      { text: "3-0", is_correct: true },
      { text: "2-1", is_correct: false },
      { text: "1-0", is_correct: false },
    ],
    explanation: "Doublé Zidane (têtes sur corners) + but Petit dans le temps additionnel.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score d'Espagne-Pays-Bas en finale CDM 2010 ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "1-0 (Iniesta a.p.)", is_correct: true },
      { text: "2-0", is_correct: false },
      { text: "1-1 (tab)", is_correct: false },
    ],
    explanation: "Iniesta à la 116e minute, Espagne 1-0 Pays-Bas.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Combien de buts au total dans la finale CDM 2022 (avant les tab) ?",
    answers: [
      { text: "5", is_correct: false },
      { text: "6 (3-3)", is_correct: true },
      { text: "4", is_correct: false },
      { text: "7", is_correct: false },
    ],
    explanation: "Triplé Mbappé + doublé Messi + 1 Di María = 3-3.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a éliminé l'Espagne en huitième de finale CDM 2022 ?",
    answers: [
      { text: "Maroc (tab)", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Portugal", is_correct: false },
      { text: "France", is_correct: false },
    ],
    explanation: "Maroc bat l'Espagne 0-0 puis 3-0 aux tirs au but.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a éliminé le Portugal en quart de finale CDM 2022 ?",
    answers: [
      { text: "Maroc", is_correct: true },
      { text: "Suisse", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Brésil", is_correct: false },
    ],
    explanation: "Maroc 1-0 Portugal en quart (but En-Nesyri).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a éliminé la France en quart de finale CDM 2014 ?",
    answers: [
      { text: "Allemagne (1-0)", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Argentine", is_correct: false },
      { text: "Pays-Bas", is_correct: false },
    ],
    explanation: "But de Mats Hummels en 1/4, Allemagne 1-0 France à Rio.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel a été le score du match d'ouverture CDM 2002 France-Sénégal ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "1-0 Sénégal", is_correct: true },
      { text: "1-1", is_correct: false },
      { text: "0-0", is_correct: false },
    ],
    explanation: "But Bouba Diop, Sénégal 1-0 France (choc historique 2002).",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score d'Allemagne-Brésil en demi-finale CDM 2014 ?",
    answers: [
      { text: "5-0", is_correct: false },
      { text: "6-1", is_correct: false },
      { text: "7-1", is_correct: true },
      { text: "4-1", is_correct: false },
    ],
    explanation: "Le Mineirao, 8 juillet 2014 — humiliation historique du Brésil.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Combien de buts l'Allemagne a-t-elle marqués en moins de 30 minutes (Brésil 2014) ?",
    answers: [
      { text: "3 entre la 11e et la 23e", is_correct: false },
      { text: "5 dans la 1ère demi-heure", is_correct: true },
      { text: "4 entre la 30e et la 45e", is_correct: false },
      { text: "6 en première mi-temps", is_correct: false },
    ],
    explanation:
      "L'Allemagne marque 5 buts entre la 11e et la 29e minute (un avalanche).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score d'Argentine-Croatie en demi-finale CDM 2022 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-1", is_correct: false },
      { text: "3-0", is_correct: true },
      { text: "2-0", is_correct: false },
    ],
    explanation: "Argentine 3-0 Croatie (penalty Messi, doublé Álvarez).",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel pays a éliminé le Brésil en quart de finale CDM 2018 ?",
    answers: [
      { text: "Belgique (2-1)", is_correct: true },
      { text: "Uruguay", is_correct: false },
      { text: "France", is_correct: false },
      { text: "Croatie", is_correct: false },
    ],
    explanation: "Belgique 2-1 Brésil, buts Fernandinho (csc) et De Bruyne.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel pays est revenu de 0-2 à 3-2 en huitième CDM 2018 ?",
    answers: [
      { text: "Belgique (face au Japon)", is_correct: true },
      { text: "Croatie", is_correct: false },
      { text: "Russie", is_correct: false },
      { text: "Suisse", is_correct: false },
    ],
    explanation: "Belgique 3-2 Japon (but vainqueur Chadli, 94e), comeback historique.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score du France-Argentine 1/8 CDM 2018 ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "3-3", is_correct: false },
      { text: "4-3", is_correct: true },
      { text: "4-2", is_correct: false },
    ],
    explanation: "Doublé Mbappé, but Pavard (frappe lointaine du gauche), France 4-3.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a battu la France en finale CDM 2006 aux tirs au but ?",
    answers: [
      { text: "Italie", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Espagne", is_correct: false },
    ],
    explanation: "Italie 1-1 France puis Italie 5-3 aux tirs au but.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel a été le score d'Allemagne-France en demi-finale CDM 1982 ?",
    answers: [
      { text: "3-3 (RFA 5-4 tab)", is_correct: true },
      { text: "2-2 (tab)", is_correct: false },
      { text: "1-0 RFA", is_correct: false },
      { text: "3-2 RFA", is_correct: false },
    ],
    explanation:
      "Mémorable match 3-3 puis RFA 5-4 aux tab (incident Schumacher-Battiston).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score de France-Croatie en demi-finale CDM 1998 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-1", is_correct: true },
      { text: "3-2", is_correct: false },
      { text: "2-0", is_correct: false },
    ],
    explanation: "Doublé Thuram pour la France (1ers buts internationaux).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel défenseur français a marqué 2 buts en demi-finale CDM 1998 ?",
    answers: [
      { text: "Lilian Thuram", is_correct: true },
      { text: "Marcel Desailly", is_correct: false },
      { text: "Bixente Lizarazu", is_correct: false },
      { text: "Frank Lebœuf", is_correct: false },
    ],
    explanation:
      "Thuram, ses deux seuls buts en sélection (en demi contre la Croatie).",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score de France-Portugal en demi CDM 2006 ?",
    answers: [
      { text: "1-0 (penalty Zidane)", is_correct: true },
      { text: "2-1", is_correct: false },
      { text: "0-0 (tab)", is_correct: false },
      { text: "2-0", is_correct: false },
    ],
    explanation: "Zidane sur penalty à la 33e, France 1-0 Portugal.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score du match d'ouverture CDM 2022 Qatar-Équateur ?",
    answers: [
      { text: "0-2 (Équateur)", is_correct: true },
      { text: "1-1", is_correct: false },
      { text: "1-0 Qatar", is_correct: false },
      { text: "2-1 Équateur", is_correct: false },
    ],
    explanation: "Doublé Enner Valencia, Équateur 2-0 Qatar.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Combien de buts inscrits durant la CDM 2018 (au total) ?",
    answers: [
      { text: "145", is_correct: false },
      { text: "169", is_correct: true },
      { text: "180", is_correct: false },
      { text: "200", is_correct: false },
    ],
    explanation: "169 buts en CDM 2018 (Russie), 64 matchs.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Combien de buts inscrits durant la CDM 2022 au Qatar ?",
    answers: [
      { text: "145", is_correct: false },
      { text: "169", is_correct: false },
      { text: "172", is_correct: true },
      { text: "200", is_correct: false },
    ],
    explanation: "172 buts (record absolu) en CDM 2022 (Qatar), 64 matchs.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score d'Argentine-Pays-Bas en quart CDM 2022 ?",
    answers: [
      { text: "1-1 puis tab 4-3 Argentine", is_correct: false },
      { text: "2-2 puis tab 4-3 Argentine", is_correct: true },
      { text: "3-2 Argentine", is_correct: false },
      { text: "2-1 Argentine", is_correct: false },
    ],
    explanation:
      "Comeback Pays-Bas (Weghorst doublé), puis Argentine s'impose 4-3 aux tab.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Combien de tirs au but ont été tirés en finale CDM 2022 (Argentine-France) ?",
    answers: [
      { text: "6", is_correct: false },
      { text: "7", is_correct: false },
      { text: "8 (4 vs 4)", is_correct: true },
      { text: "10", is_correct: false },
    ],
    explanation:
      "Argentine 4 tirs réussis, France 2 (Coman et Tchouaméni manqués) — Argentine 4-2.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score de France-Uruguay en quart CDM 2018 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-0", is_correct: true },
      { text: "2-1", is_correct: false },
      { text: "3-1", is_correct: false },
    ],
    explanation: "But Varane (40e) + Griezmann (61e), France 2-0 Uruguay.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score de France-Australie en poules CDM 2022 ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "3-0", is_correct: false },
      { text: "4-1", is_correct: true },
      { text: "3-1", is_correct: false },
    ],
    explanation: "France 4-1 Australie (doublé Giroud, but Rabiot, Mbappé).",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel pays a éliminé l'Allemagne en poules CDM 2018 ?",
    answers: [
      { text: "Mexique", is_correct: false },
      { text: "Suède", is_correct: false },
      { text: "Corée du Sud", is_correct: true },
      { text: "Brésil", is_correct: false },
    ],
    explanation:
      "Corée du Sud 2-0 Allemagne au dernier match, élimination définitive.",
  },
  {
    theme: "matchs",
    difficulty: 1,
    question: "Quel a été le score de France-Maroc en demi CDM 2022 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-0", is_correct: true },
      { text: "3-1", is_correct: false },
      { text: "2-1", is_correct: false },
    ],
    explanation: "France 2-0 Maroc (Théo Hernandez 5e, Kolo Muani 79e).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a remporté la finale CDM 1990 ?",
    answers: [
      { text: "Allemagne de l'Ouest (1-0)", is_correct: true },
      { text: "Argentine (1-0)", is_correct: false },
      { text: "Italie", is_correct: false },
      { text: "Brésil", is_correct: false },
    ],
    explanation:
      "RFA 1-0 Argentine, but Brehme sur penalty (85e), revanche de 1986.",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel pays a remporté la finale CDM 1994 ?",
    answers: [
      { text: "Brésil (tab 3-2 vs Italie)", is_correct: true },
      { text: "Italie", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation:
      "0-0 puis Brésil 3-2 aux tab (Baggio rate le dernier).",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel a été le score de Brésil-France quart CDM 1986 ?",
    answers: [
      { text: "1-1 puis France 4-3 aux tab", is_correct: true },
      { text: "2-1 France", is_correct: false },
      { text: "1-0 Brésil", is_correct: false },
      { text: "3-2 France", is_correct: false },
    ],
    explanation:
      "Match mythique : Platini égalise à 1-1, France gagne aux tab.",
  },
  {
    theme: "matchs",
    difficulty: 3,
    question: "Quel a été le score d'Italie-Brésil en finale CDM 1994 (tab) ?",
    answers: [
      { text: "Brésil 3-2 aux tab", is_correct: true },
      { text: "Brésil 4-3 aux tab", is_correct: false },
      { text: "Brésil 5-3 aux tab", is_correct: false },
      { text: "Brésil 5-4 aux tab", is_correct: false },
    ],
    explanation:
      "Roberto Baggio rate son penalty, Brésil 3-2 (Pasadena).",
  },
  {
    theme: "matchs",
    difficulty: 2,
    question: "Quel a été le score de France-Pologne 1/8 CDM 2022 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-1", is_correct: false },
      { text: "3-1", is_correct: true },
      { text: "4-2", is_correct: false },
    ],
    explanation: "Giroud (44e), doublé Mbappé (74e, 90+1), France 3-1 Pologne.",
  },

  // ============== CULTURE / DIVERS ==============
  {
    theme: "culture",
    difficulty: 1,
    question: "Quelles sont les mascottes officielles de la CDM 2026 ?",
    answers: [
      { text: "Zayu, Maple, Clutch", is_correct: true },
      { text: "Zabivaka, La'eeb, Fuleco", is_correct: false },
      { text: "Goleo, Naranjito, Striker", is_correct: false },
      { text: "Footix, Pique, Ato", is_correct: false },
    ],
    explanation:
      "Première CDM à trois mascottes : Zayu (Mexique), Maple (Canada), Clutch (USA).",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quel est le nom officiel du trophée de la Coupe du Monde ?",
    answers: [
      { text: "Coupe Jules Rimet", is_correct: false },
      { text: "Trophée FIFA World Cup", is_correct: true },
      { text: "Trophée Pelé", is_correct: false },
      { text: "Coupe d'Or", is_correct: false },
    ],
    explanation:
      "Le 'FIFA World Cup Trophy' a remplacé la Jules Rimet en 1974.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quel ballon officiel a été utilisé lors de la CDM 2022 ?",
    answers: [
      { text: "Telstar", is_correct: false },
      { text: "Jabulani", is_correct: false },
      { text: "Al Rihla", is_correct: true },
      { text: "Brazuca", is_correct: false },
    ],
    explanation:
      "'Al Rihla' (= 'le voyage' en arabe), conçu par Adidas pour le Qatar.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Qui a composé l'hymne officiel de la CDM 2010 'Waka Waka' ?",
    answers: [
      { text: "Shakira", is_correct: true },
      { text: "Pitbull", is_correct: false },
      { text: "Beyoncé", is_correct: false },
      { text: "Ricky Martin", is_correct: false },
    ],
    explanation:
      "'Waka Waka (This Time for Africa)' avec Freshlyground.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quelle est la couleur dominante du logo officiel de la CDM 2026 ?",
    answers: [
      { text: "Or et noir", is_correct: true },
      { text: "Rouge et bleu", is_correct: false },
      { text: "Vert et blanc", is_correct: false },
      { text: "Multicolore", is_correct: false },
    ],
    explanation:
      "Logo officiel dévoilé en 2023 : dégradés or sur fond sombre, avec '26' en gros.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Qui est le président actuel de la FIFA ?",
    answers: [
      { text: "Sepp Blatter", is_correct: false },
      { text: "Michel Platini", is_correct: false },
      { text: "Gianni Infantino", is_correct: true },
      { text: "Aleksander Čeferin", is_correct: false },
    ],
    explanation:
      "Gianni Infantino, président de la FIFA depuis 2016.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "Sur combien de stades la CDM 2026 se jouera-t-elle ?",
    answers: [
      { text: "8", is_correct: false },
      { text: "12", is_correct: false },
      { text: "16", is_correct: true },
      { text: "20", is_correct: false },
    ],
    explanation:
      "16 stades : 11 aux USA, 3 au Mexique, 2 au Canada.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Combien de villes hôtes US accueillent des matchs en 2026 ?",
    answers: [
      { text: "8", is_correct: false },
      { text: "10", is_correct: false },
      { text: "11", is_correct: true },
      { text: "14", is_correct: false },
    ],
    explanation:
      "11 villes US (Atlanta, Boston, Dallas, Houston, Kansas City, LA, Miami, NY/NJ, Philadelphie, San Francisco, Seattle).",
  },
  {
    theme: "culture",
    difficulty: 2,
    question:
      "Quel format de matchs est utilisé en cas d'égalité en phase à élimination directe en 2026 ?",
    answers: [
      { text: "Prolongations puis tirs au but", is_correct: true },
      { text: "Tirs au but directs", is_correct: false },
      { text: "But en or", is_correct: false },
      { text: "Replay 3 jours plus tard", is_correct: false },
    ],
    explanation:
      "Le format classique : 30 min de prolongations, puis tirs au but si encore à égalité.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quel est l'âge minimum pour participer à une CDM ?",
    answers: [
      { text: "16 ans", is_correct: false },
      { text: "Pas de limite officielle", is_correct: true },
      { text: "17 ans", is_correct: false },
      { text: "18 ans", is_correct: false },
    ],
    explanation:
      "La FIFA n'impose pas d'âge minimum, c'est aux sélectionneurs de décider.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quelle marque équipe le ballon officiel de la CDM depuis 1970 ?",
    answers: [
      { text: "Nike", is_correct: false },
      { text: "Adidas", is_correct: true },
      { text: "Puma", is_correct: false },
      { text: "Mitre", is_correct: false },
    ],
    explanation:
      "Adidas est partenaire officiel depuis le ballon Telstar (Mexique 1970).",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Comment s'appelait le ballon officiel de la CDM 2010 ?",
    answers: [
      { text: "Jabulani", is_correct: true },
      { text: "Brazuca", is_correct: false },
      { text: "Tango", is_correct: false },
      { text: "Telstar 18", is_correct: false },
    ],
    explanation:
      "Jabulani (= 'célébrer' en zoulou), CDM 2010 Afrique du Sud.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Comment s'appelait le ballon officiel de la CDM 2014 ?",
    answers: [
      { text: "Brazuca", is_correct: true },
      { text: "Jabulani", is_correct: false },
      { text: "Telstar", is_correct: false },
      { text: "Al Rihla", is_correct: false },
    ],
    explanation: "Brazuca, CDM 2014 Brésil — couleurs colorées du carnaval.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Comment s'appelait le ballon officiel de la CDM 2018 ?",
    answers: [
      { text: "Telstar 18", is_correct: true },
      { text: "Brazuca", is_correct: false },
      { text: "Jabulani", is_correct: false },
      { text: "Tango", is_correct: false },
    ],
    explanation:
      "Telstar 18 (clin d'œil au Telstar original de 1970), CDM Russie 2018.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Comment s'appelait la mascotte de la CDM 2022 ?",
    answers: [
      { text: "Zabivaka", is_correct: false },
      { text: "La'eeb", is_correct: true },
      { text: "Fuleco", is_correct: false },
      { text: "Footix", is_correct: false },
    ],
    explanation:
      "La'eeb (= 'joueur très talentueux' en arabe), mascotte CDM 2022.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Comment s'appelait la mascotte de la CDM 2018 en Russie ?",
    answers: [
      { text: "Fuleco", is_correct: false },
      { text: "Zabivaka", is_correct: true },
      { text: "La'eeb", is_correct: false },
      { text: "Striker", is_correct: false },
    ],
    explanation:
      "Zabivaka (= 'le buteur'), loup-mascotte de la CDM 2018.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Comment s'appelait la mascotte de la CDM 2014 ?",
    answers: [
      { text: "Fuleco", is_correct: true },
      { text: "Zakumi", is_correct: false },
      { text: "Striker", is_correct: false },
      { text: "Naranjito", is_correct: false },
    ],
    explanation: "Fuleco, tatou bleu, CDM 2014 au Brésil.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Comment s'appelait la mascotte de la CDM 1998 en France ?",
    answers: [
      { text: "Footix", is_correct: true },
      { text: "Zakumi", is_correct: false },
      { text: "Goleo", is_correct: false },
      { text: "Striker", is_correct: false },
    ],
    explanation: "Footix, coq bleu, mascotte CDM 1998 (logo emblématique).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quelle mascotte a été la 1ère de l'histoire de la CDM (1966) ?",
    answers: [
      { text: "World Cup Willie", is_correct: true },
      { text: "Tip and Tap", is_correct: false },
      { text: "Striker", is_correct: false },
      { text: "Naranjito", is_correct: false },
    ],
    explanation:
      "World Cup Willie, lion mascotte de la CDM 1966 en Angleterre (première mascotte).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Comment s'appelait la mascotte de la CDM 1994 aux USA ?",
    answers: [
      { text: "Striker (le chien)", is_correct: true },
      { text: "Goleo", is_correct: false },
      { text: "Footix", is_correct: false },
      { text: "Naranjito", is_correct: false },
    ],
    explanation:
      "Striker, chien-mascotte de la CDM 1994 aux États-Unis.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "Quel pays a accueilli la 1ère CDM diffusée en couleur ?",
    answers: [
      { text: "Mexique (1970)", is_correct: true },
      { text: "Angleterre (1966)", is_correct: false },
      { text: "Allemagne (1974)", is_correct: false },
      { text: "Suède (1958)", is_correct: false },
    ],
    explanation: "CDM 1970 Mexique, première diffusion en couleur.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quel est le poids du trophée de la CDM ?",
    answers: [
      { text: "4,5 kg", is_correct: false },
      { text: "6,175 kg", is_correct: true },
      { text: "8 kg", is_correct: false },
      { text: "10 kg", is_correct: false },
    ],
    explanation: "6,175 kg pour 36,8 cm de haut, en or massif 18 carats.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "En quel matériau est fait le trophée de la CDM ?",
    answers: [
      { text: "Argent", is_correct: false },
      { text: "Or 18 carats", is_correct: true },
      { text: "Bronze", is_correct: false },
      { text: "Or 24 carats", is_correct: false },
    ],
    explanation: "Or massif 18 carats, conçu par Silvio Gazzaniga.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Lors de quelle CDM la VAR a-t-elle été utilisée pour la 1ère fois ?",
    answers: [
      { text: "Russie 2018", is_correct: true },
      { text: "Brésil 2014", is_correct: false },
      { text: "Qatar 2022", is_correct: false },
      { text: "Allemagne 2006", is_correct: false },
    ],
    explanation: "L'assistance vidéo (VAR) débute en CDM 2018 en Russie.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "En quelle année la FIFA a-t-elle été fondée ?",
    answers: [
      { text: "1900", is_correct: false },
      { text: "1904", is_correct: true },
      { text: "1920", is_correct: false },
      { text: "1930", is_correct: false },
    ],
    explanation: "FIFA fondée le 21 mai 1904 à Paris.",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Qui a fondé la Coupe du Monde de football ?",
    answers: [
      { text: "Jules Rimet", is_correct: true },
      { text: "Sepp Blatter", is_correct: false },
      { text: "João Havelange", is_correct: false },
      { text: "Pierre de Coubertin", is_correct: false },
    ],
    explanation:
      "Jules Rimet, président de la FIFA 1921-1954, créateur de la CDM (1ère édition 1930).",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quel stade a accueilli la finale CDM 1998 en France ?",
    answers: [
      { text: "Stade de France (Saint-Denis)", is_correct: true },
      { text: "Vélodrome (Marseille)", is_correct: false },
      { text: "Parc des Princes (Paris)", is_correct: false },
      { text: "Stade Vélodrome (Lyon)", is_correct: false },
    ],
    explanation: "Stade de France, Saint-Denis, France 3-0 Brésil.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "En quelle année a eu lieu la CDM féminine au Canada ?",
    answers: [
      { text: "2007", is_correct: false },
      { text: "2011", is_correct: false },
      { text: "2015", is_correct: true },
      { text: "2019", is_correct: false },
    ],
    explanation: "CDM féminine 2015 au Canada, victoire des USA.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Combien d'équipes participent à la CDM féminine actuelle ?",
    answers: [
      { text: "16", is_correct: false },
      { text: "24", is_correct: false },
      { text: "32", is_correct: true },
      { text: "48", is_correct: false },
    ],
    explanation:
      "32 équipes depuis CDM féminine 2023 (Australie/Nouvelle-Zélande).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quel pays a remporté la 1ère CDM féminine en 1991 ?",
    answers: [
      { text: "USA", is_correct: true },
      { text: "Norvège", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Suède", is_correct: false },
    ],
    explanation:
      "USA championnes en 1991 (en Chine), première édition féminine officielle.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "En quelle année la FIFA est-elle passée à 32 équipes en CDM ?",
    answers: [
      { text: "1994", is_correct: false },
      { text: "1998", is_correct: true },
      { text: "2002", is_correct: false },
      { text: "1990", is_correct: false },
    ],
    explanation: "32 équipes depuis CDM 1998 en France.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "En quelle année la FIFA est-elle passée à 24 équipes en CDM ?",
    answers: [
      { text: "1978", is_correct: false },
      { text: "1982", is_correct: true },
      { text: "1986", is_correct: false },
      { text: "1990", is_correct: false },
    ],
    explanation: "Passage de 16 à 24 équipes en CDM 1982 (Espagne).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Combien de fédérations sont membres de la FIFA en 2026 ?",
    answers: [
      { text: "195", is_correct: false },
      { text: "211", is_correct: true },
      { text: "220", is_correct: false },
      { text: "180", is_correct: false },
    ],
    explanation:
      "211 fédérations membres de la FIFA (plus que de pays membres de l'ONU).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Combien d'années Sepp Blatter a-t-il été président de la FIFA ?",
    answers: [
      { text: "8 ans", is_correct: false },
      { text: "12 ans", is_correct: false },
      { text: "17 ans", is_correct: true },
      { text: "25 ans", is_correct: false },
    ],
    explanation: "Blatter président de 1998 à 2015 (17 ans).",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "Quel stade accueillera le match d'ouverture de la CDM 2026 ?",
    answers: [
      { text: "MetLife Stadium", is_correct: false },
      { text: "Estadio Azteca (Mexico)", is_correct: true },
      { text: "SoFi Stadium (LA)", is_correct: false },
      { text: "BMO Field (Toronto)", is_correct: false },
    ],
    explanation: "Estadio Azteca, Mexico, 11 juin 2026 — match d'ouverture.",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "Combien de stades accueillent des matchs au Mexique en 2026 ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3 (Mexico, Monterrey, Guadalajara)", is_correct: true },
      { text: "4", is_correct: false },
      { text: "5", is_correct: false },
    ],
    explanation:
      "3 stades : Mexico (Azteca), Monterrey (BBVA), Guadalajara (Akron).",
  },
  {
    theme: "culture",
    difficulty: 1,
    question: "Combien de stades accueillent des matchs au Canada en 2026 ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2 (Toronto, Vancouver)", is_correct: true },
      { text: "3", is_correct: false },
      { text: "4", is_correct: false },
    ],
    explanation:
      "2 stades canadiens : BMO Field (Toronto) et BC Place (Vancouver).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quelle organisation a remporté l'organisation de la CDM 2026 ?",
    answers: [
      { text: "United 2026 (USA-Canada-Mexique)", is_correct: true },
      { text: "Morocco 2026", is_correct: false },
      { text: "Vote nul", is_correct: false },
      { text: "Egypt-Saudi 2026", is_correct: false },
    ],
    explanation:
      "United 2026 a battu la candidature marocaine en juin 2018 (134 voix à 65).",
  },
  {
    theme: "culture",
    difficulty: 3,
    question: "Quel pays a remporté la 1ère Copa América en 1916 ?",
    answers: [
      { text: "Uruguay", is_correct: true },
      { text: "Argentine", is_correct: false },
      { text: "Brésil", is_correct: false },
      { text: "Chili", is_correct: false },
    ],
    explanation:
      "L'Uruguay remporte la 1ère Copa América (alors Campeonato Sudamericano) en 1916.",
  },
  {
    theme: "culture",
    difficulty: 2,
    question: "Quel nom porte le ballon officiel de la CDM 2026 ?",
    answers: [
      { text: "Trionda", is_correct: true },
      { text: "Brazuca 26", is_correct: false },
      { text: "Telstar 26", is_correct: false },
      { text: "Al Rihla 2", is_correct: false },
    ],
    explanation:
      "Trionda, le ballon officiel Adidas de la CDM 2026 (clin d'œil aux 3 pays hôtes).",
  },

  // ============== ÉQUIPE DE FRANCE ==============
  // ─── CDM 1998 (victoire à domicile) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Qui était le sélectionneur de la France championne du monde 1998 ?",
    answers: [
      { text: "Aimé Jacquet", is_correct: true },
      { text: "Roger Lemerre", is_correct: false },
      { text: "Raymond Domenech", is_correct: false },
      { text: "Michel Hidalgo", is_correct: false },
    ],
    explanation: "Aimé Jacquet, sélectionneur de 1993 à 1998.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel était le score de la finale France-Brésil en 1998 ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "3-0", is_correct: true },
      { text: "1-0", is_correct: false },
      { text: "3-2", is_correct: false },
    ],
    explanation: "Doublé de Zidane et but de Petit à la 90e.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Combien de buts Zidane a-t-il marqué en finale en 1998 ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: true },
      { text: "3", is_correct: false },
      { text: "0", is_correct: false },
    ],
    explanation: "Deux têtes sur corner, à la 27e et 45e+1.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a marqué le 3e but de la finale 1998 contre le Brésil ?",
    answers: [
      { text: "Emmanuel Petit", is_correct: true },
      { text: "Thierry Henry", is_correct: false },
      { text: "Youri Djorkaeff", is_correct: false },
      { text: "David Trezeguet", is_correct: false },
    ],
    explanation: "Contre-attaque finalisée par Emmanuel Petit à la 90e.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui était le gardien titulaire des Bleus en 1998 ?",
    answers: [
      { text: "Bernard Lama", is_correct: false },
      { text: "Fabien Barthez", is_correct: true },
      { text: "Lionel Charbonnier", is_correct: false },
      { text: "Ulrich Ramé", is_correct: false },
    ],
    explanation: "Barthez, le crâne chauve gratté par Laurent Blanc avant chaque match.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel match couperet la France a-t-elle remporté au but en or en demie 1998 ?",
    answers: [
      { text: "France-Paraguay", is_correct: false },
      { text: "France-Italie (quart)", is_correct: false },
      { text: "France-Croatie (demi)", is_correct: true },
      { text: "France-Danemark", is_correct: false },
    ],
    explanation: "Demi 2-1 grâce au doublé de Lilian Thuram, ses deux seuls buts en sélection.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Combien de buts a marqué Lilian Thuram en équipe de France en carrière ?",
    answers: [
      { text: "0", is_correct: false },
      { text: "2", is_correct: true },
      { text: "5", is_correct: false },
      { text: "10", is_correct: false },
    ],
    explanation: "Ses deux seuls buts : la demi-finale contre la Croatie en 1998.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel adversaire la France a-t-elle éliminé en 8e en 1998 ?",
    answers: [
      { text: "Paraguay", is_correct: true },
      { text: "Argentine", is_correct: false },
      { text: "Nigeria", is_correct: false },
      { text: "Italie", is_correct: false },
    ],
    explanation: "1-0 grâce au but en or de Laurent Blanc en prolongation.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Pourquoi Laurent Blanc n'a-t-il pas joué la finale 1998 ?",
    answers: [
      { text: "Blessure musculaire", is_correct: false },
      { text: "Suspendu (carton rouge en demi)", is_correct: true },
      { text: "Choix tactique d'Aimé Jacquet", is_correct: false },
      { text: "Forfait pour fièvre", is_correct: false },
    ],
    explanation: "Expulsé sur un coup de tête à Bilic en demi contre la Croatie.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Contre qui Zinédine Zidane a-t-il pris un rouge en phase de poules 1998 ?",
    answers: [
      { text: "Danemark", is_correct: false },
      { text: "Arabie Saoudite", is_correct: true },
      { text: "Afrique du Sud", is_correct: false },
      { text: "Paraguay", is_correct: false },
    ],
    explanation: "Coup de crampon sur Fouad Amin, suspendu 2 matchs.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de buts l'équipe de France a-t-elle encaissés sur l'ensemble de la CDM 1998 ?",
    answers: [
      { text: "0", is_correct: false },
      { text: "2", is_correct: true },
      { text: "4", is_correct: false },
      { text: "6", is_correct: false },
    ],
    explanation: "Défense en granit : seulement 2 buts en 7 matchs.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Comment la France a-t-elle gagné son quart France-Italie 1998 ?",
    answers: [
      { text: "0-0 puis 4-3 aux tirs au but", is_correct: true },
      { text: "1-0 (Djorkaeff)", is_correct: false },
      { text: "2-1 (Zidane et Trezeguet)", is_correct: false },
      { text: "But en or", is_correct: false },
    ],
    explanation: "Premier succès français contre l'Italie en CDM, aux TaB.",
  },

  // ─── CDM 2002 (élimination dès la phase de poules) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Où s'est déroulée la CDM 2002 ?",
    answers: [
      { text: "France et Belgique", is_correct: false },
      { text: "Corée du Sud et Japon", is_correct: true },
      { text: "Japon seul", is_correct: false },
      { text: "Chine", is_correct: false },
    ],
    explanation: "Première CDM organisée en Asie et co-organisée.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Comment la France a-t-elle terminé la CDM 2002 ?",
    answers: [
      { text: "Championne", is_correct: false },
      { text: "Demi-finaliste", is_correct: false },
      { text: "Éliminée en phase de poules sans marquer un but", is_correct: true },
      { text: "Éliminée en 8e", is_correct: false },
    ],
    explanation: "Désastre 2002 : 0 victoire, 0 but, éliminée dès le 1er tour.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle perdu son match d'ouverture en 2002 ?",
    answers: [
      { text: "Uruguay", is_correct: false },
      { text: "Danemark", is_correct: false },
      { text: "Sénégal", is_correct: true },
      { text: "Brésil", is_correct: false },
    ],
    explanation: "1-0 pour le Sénégal, but de Papa Bouba Diop. Cauchemar inaugural.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui blessé en amical avant la CDM 2002 a manqué les premiers matchs des Bleus ?",
    answers: [
      { text: "Thierry Henry", is_correct: false },
      { text: "Zinédine Zidane", is_correct: true },
      { text: "Patrick Vieira", is_correct: false },
      { text: "Marcel Desailly", is_correct: false },
    ],
    explanation: "Zidane blessé à la cuisse contre la Corée du Sud en amical.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel sélectionneur français a connu l'humiliation de 2002 ?",
    answers: [
      { text: "Roger Lemerre", is_correct: true },
      { text: "Aimé Jacquet", is_correct: false },
      { text: "Jacques Santini", is_correct: false },
      { text: "Raymond Domenech", is_correct: false },
    ],
    explanation: "Roger Lemerre, viré juste après. Successeur : Jacques Santini.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de buts la France a-t-elle marqué lors de la CDM 2002 ?",
    answers: [
      { text: "0", is_correct: true },
      { text: "1", is_correct: false },
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
    ],
    explanation: "Zéro but en 3 matchs (Sénégal, Uruguay, Danemark).",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur français a été expulsé contre l'Uruguay en 2002 ?",
    answers: [
      { text: "Thierry Henry", is_correct: true },
      { text: "Patrick Vieira", is_correct: false },
      { text: "Christophe Dugarry", is_correct: false },
      { text: "Bixente Lizarazu", is_correct: false },
    ],
    explanation: "Rouge à la 25e minute, déjà sans Zidane, la suite à 10 contre 11.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel score a fait la France contre le Danemark en 2002 ?",
    answers: [
      { text: "0-2", is_correct: true },
      { text: "1-0", is_correct: false },
      { text: "1-1", is_correct: false },
      { text: "2-0", is_correct: false },
    ],
    explanation: "0-2, Rommedahl et Tomasson, élimination consommée.",
  },

  // ─── CDM 2006 (finale perdue contre l'Italie) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Où la France a-t-elle joué la finale 2006 ?",
    answers: [
      { text: "Munich", is_correct: false },
      { text: "Berlin", is_correct: true },
      { text: "Francfort", is_correct: false },
      { text: "Hambourg", is_correct: false },
    ],
    explanation: "Olympiastadion de Berlin, perdue aux tirs au but contre l'Italie.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel score à la fin du temps réglementaire + prolongation France-Italie 2006 ?",
    answers: [
      { text: "1-1", is_correct: true },
      { text: "0-0", is_correct: false },
      { text: "2-1", is_correct: false },
      { text: "1-2", is_correct: false },
    ],
    explanation: "1-1 après 120 min, Italie gagne 5-3 aux TaB.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Qui a marqué l'unique but français en finale 2006 ?",
    answers: [
      { text: "Thierry Henry", is_correct: false },
      { text: "Franck Ribéry", is_correct: false },
      { text: "Zinédine Zidane (penalty)", is_correct: true },
      { text: "Patrick Vieira", is_correct: false },
    ],
    explanation: "Penalty Panenka audacieux à la 7e minute.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Pourquoi Zidane a-t-il été expulsé en finale 2006 ?",
    answers: [
      { text: "Coup de tête sur Materazzi", is_correct: true },
      { text: "Coup de pied sur Buffon", is_correct: false },
      { text: "Insultes à l'arbitre", is_correct: false },
      { text: "Crampon sur Cannavaro", is_correct: false },
    ],
    explanation: "À la 110e, mythique coup de boule sur Marco Materazzi.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a manqué son tir au but pour la France en finale 2006 ?",
    answers: [
      { text: "Sylvain Wiltord", is_correct: false },
      { text: "David Trezeguet", is_correct: true },
      { text: "Thierry Henry", is_correct: false },
      { text: "Willy Sagnol", is_correct: false },
    ],
    explanation: "Frappe sur la barre transversale qui rebondit en dehors.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel adversaire la France a-t-elle éliminé en demi-finale 2006 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Portugal", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "1-0, penalty Zidane à la 33e.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a sorti le Brésil de Ronaldinho en quart en 2006 ?",
    answers: [
      { text: "France", is_correct: true },
      { text: "Italie", is_correct: false },
      { text: "Allemagne", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "France 1-0 Brésil, but Thierry Henry sur coup franc de Zidane.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel sélectionneur a mené les Bleus à la finale 2006 ?",
    answers: [
      { text: "Raymond Domenech", is_correct: true },
      { text: "Jacques Santini", is_correct: false },
      { text: "Aimé Jacquet", is_correct: false },
      { text: "Laurent Blanc", is_correct: false },
    ],
    explanation: "Domenech (2004–2010), surnommé pour ses choix horoscopés.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel score lors du match d'ouverture France-Suisse 2006 ?",
    answers: [
      { text: "0-0", is_correct: true },
      { text: "1-0", is_correct: false },
      { text: "0-1", is_correct: false },
      { text: "1-1", is_correct: false },
    ],
    explanation: "Triste 0-0 inaugural, qui a fait douter avant la remontada.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Qui a marqué pour la France en 8e contre l'Espagne en 2006 ?",
    answers: [
      { text: "Ribéry, Vieira, Zidane", is_correct: true },
      { text: "Henry seul (3 fois)", is_correct: false },
      { text: "Trezeguet et Henry", is_correct: false },
      { text: "Wiltord seul", is_correct: false },
    ],
    explanation: "3-1 mémorable, élimination de la jeune Espagne post-Raul.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "À combien la moyenne d'âge tournait l'équipe de France en 2006 ?",
    answers: [
      { text: "23 ans", is_correct: false },
      { text: "26 ans", is_correct: false },
      { text: "30 ans (les vieux)", is_correct: true },
      { text: "33 ans", is_correct: false },
    ],
    explanation: "L'une des équipes les plus âgées de l'histoire de la CDM.",
  },

  // ─── CDM 2010 (Knysna) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Comment la France a-t-elle terminé la CDM 2010 ?",
    answers: [
      { text: "Demi-finaliste", is_correct: false },
      { text: "Éliminée en phase de poules (dernière)", is_correct: true },
      { text: "Quart de finaliste", is_correct: false },
      { text: "Championne", is_correct: false },
    ],
    explanation: "1 nul, 2 défaites, 1 but marqué : dernière du groupe A.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel pays accueillait la CDM 2010 ?",
    answers: [
      { text: "Brésil", is_correct: false },
      { text: "Afrique du Sud", is_correct: true },
      { text: "Allemagne", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "Première CDM africaine, remportée par l'Espagne.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel événement célèbre marque la CDM 2010 des Bleus ?",
    answers: [
      { text: "La grève de Knysna", is_correct: true },
      { text: "La main de Henry", is_correct: false },
      { text: "Le carton rouge de Vieira", is_correct: false },
      { text: "L'absence de Zidane", is_correct: false },
    ],
    explanation: "Les joueurs refusent l'entraînement après l'éviction d'Anelka.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel joueur a été renvoyé en cours de tournoi en 2010 ?",
    answers: [
      { text: "Patrice Evra", is_correct: false },
      { text: "Nicolas Anelka", is_correct: true },
      { text: "Yoann Gourcuff", is_correct: false },
      { text: "Franck Ribéry", is_correct: false },
    ],
    explanation: "Renvoyé pour insultes à Domenech à la mi-temps contre le Mexique.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel score lors du match France-Mexique en 2010 ?",
    answers: [
      { text: "0-2", is_correct: true },
      { text: "0-0", is_correct: false },
      { text: "1-1", is_correct: false },
      { text: "2-1", is_correct: false },
    ],
    explanation: "0-2, le tournant du fiasco.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel score lors du dernier match France-Afrique du Sud 2010 ?",
    answers: [
      { text: "1-2", is_correct: true },
      { text: "0-2", is_correct: false },
      { text: "2-2", is_correct: false },
      { text: "0-3", is_correct: false },
    ],
    explanation: "Défaite face au pays hôte, but français de Malouda.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Comment la France s'est-elle qualifiée pour la CDM 2010 ?",
    answers: [
      { text: "1ère du groupe", is_correct: false },
      { text: "Main de Henry contre l'Irlande en barrage", is_correct: true },
      { text: "Repêchée après forfait", is_correct: false },
      { text: "Tour préliminaire", is_correct: false },
    ],
    explanation: "Polémique mondiale, but Gallas après contrôle main de Henry.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Qui était le capitaine français pendant la grève de Knysna ?",
    answers: [
      { text: "Thierry Henry", is_correct: false },
      { text: "Patrice Evra", is_correct: true },
      { text: "William Gallas", is_correct: false },
      { text: "Franck Ribéry", is_correct: false },
    ],
    explanation: "Evra a refusé l'entraînement et lu le communiqué.",
  },

  // ─── CDM 2014 (quart) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Où la France a-t-elle été éliminée en 2014 ?",
    answers: [
      { text: "8e contre la Suisse", is_correct: false },
      { text: "Quart contre l'Allemagne", is_correct: true },
      { text: "Demi contre le Brésil", is_correct: false },
      { text: "Phase de poules", is_correct: false },
    ],
    explanation: "0-1, but Mats Hummels sur corner.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel sélectionneur dirigeait les Bleus en 2014 ?",
    answers: [
      { text: "Laurent Blanc", is_correct: false },
      { text: "Raymond Domenech", is_correct: false },
      { text: "Didier Deschamps", is_correct: true },
      { text: "Aimé Jacquet", is_correct: false },
    ],
    explanation: "Deschamps, en poste depuis 2012.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui était le meilleur buteur français lors de la CDM 2014 ?",
    answers: [
      { text: "Karim Benzema (3 buts)", is_correct: true },
      { text: "Olivier Giroud", is_correct: false },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Mathieu Valbuena", is_correct: false },
    ],
    explanation: "Benzema, qui sortait d'une grande saison au Real.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel score France-Suisse en phase de poules 2014 ?",
    answers: [
      { text: "2-0", is_correct: false },
      { text: "5-2", is_correct: true },
      { text: "3-1", is_correct: false },
      { text: "4-2", is_correct: false },
    ],
    explanation: "Festival : Giroud, Matuidi, Valbuena, Benzema, Sissoko.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel score lors du 8e France-Nigeria 2014 ?",
    answers: [
      { text: "1-0", is_correct: false },
      { text: "2-0", is_correct: true },
      { text: "3-2", is_correct: false },
      { text: "0-0 (TaB)", is_correct: false },
    ],
    explanation: "Pogba et un csc de Yobo en fin de match.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Qui a marqué le but qui élimine la France en quart 2014 ?",
    answers: [
      { text: "Mats Hummels", is_correct: true },
      { text: "Thomas Müller", is_correct: false },
      { text: "Miroslav Klose", is_correct: false },
      { text: "Bastian Schweinsteiger", is_correct: false },
    ],
    explanation: "Tête sur corner à la 13e minute. Maracanã.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur français a été écarté avant la CDM 2014 ?",
    answers: [
      { text: "Samir Nasri (non convoqué)", is_correct: true },
      { text: "Franck Ribéry", is_correct: false },
      { text: "Karim Benzema", is_correct: false },
      { text: "Yann M'Vila", is_correct: false },
    ],
    explanation: "Nasri non convoqué par Deschamps. Ribéry forfait sur blessure.",
  },

  // ─── CDM 2018 (victoire en Russie) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Contre qui la France a-t-elle gagné la finale 2018 ?",
    answers: [
      { text: "Belgique", is_correct: false },
      { text: "Croatie", is_correct: true },
      { text: "Angleterre", is_correct: false },
      { text: "Brésil", is_correct: false },
    ],
    explanation: "4-2 à Moscou contre les Croates de Modric.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel était le score de la finale France-Croatie 2018 ?",
    answers: [
      { text: "2-1", is_correct: false },
      { text: "4-2", is_correct: true },
      { text: "3-1", is_correct: false },
      { text: "3-3", is_correct: false },
    ],
    explanation: "4-2 final : Mandzukic csc, Griezmann pen, Pogba, Mbappé, puis Pogba(csc) et Mandzukic.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Qui était le capitaine des Bleus en 2018 ?",
    answers: [
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Paul Pogba", is_correct: false },
      { text: "Hugo Lloris", is_correct: true },
      { text: "Raphaël Varane", is_correct: false },
    ],
    explanation: "Lloris, capitaine de longue date.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel âge avait Kylian Mbappé lors du titre 2018 ?",
    answers: [
      { text: "17", is_correct: false },
      { text: "19", is_correct: true },
      { text: "21", is_correct: false },
      { text: "23", is_correct: false },
    ],
    explanation: "Né en décembre 1998, 19 ans tout pile pour la finale.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a marqué le premier but de la finale 2018 ?",
    answers: [
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Mario Mandzukic (csc)", is_correct: true },
      { text: "Paul Pogba", is_correct: false },
    ],
    explanation: "Tête contre son camp sur coup franc de Griezmann.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel joueur français a été élu meilleur jeune de la CDM 2018 ?",
    answers: [
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Paul Pogba", is_correct: false },
      { text: "Ousmane Dembélé", is_correct: false },
    ],
    explanation: "Mbappé, jeune phénomène de 19 ans.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle joué son 8e en 2018 ?",
    answers: [
      { text: "Argentine", is_correct: true },
      { text: "Uruguay", is_correct: false },
      { text: "Belgique", is_correct: false },
      { text: "Croatie", is_correct: false },
    ],
    explanation: "4-3 historique, doublé de Mbappé, but-bijou de Pavard.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a marqué le but du quart France-Uruguay 2018 ?",
    answers: [
      { text: "Varane et Griezmann", is_correct: true },
      { text: "Pogba seul", is_correct: false },
      { text: "Mbappé doublé", is_correct: false },
      { text: "Giroud (1)", is_correct: false },
    ],
    explanation: "2-0 : tête de Varane et bourde de Muslera sur frappe Griezmann.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle joué la demi 2018 ?",
    answers: [
      { text: "Croatie", is_correct: false },
      { text: "Belgique", is_correct: true },
      { text: "Angleterre", is_correct: false },
      { text: "Argentine", is_correct: false },
    ],
    explanation: "1-0, but de Samuel Umtiti sur corner.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui a marqué le but de la victoire en demi-finale 2018 ?",
    answers: [
      { text: "Olivier Giroud", is_correct: false },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Samuel Umtiti", is_correct: true },
      { text: "Paul Pogba", is_correct: false },
    ],
    explanation: "Tête piquée sur corner à la 51e contre la Belgique.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Comment Benjamin Pavard a-t-il marqué contre l'Argentine en 2018 ?",
    answers: [
      { text: "Frappe enroulée du droit (golazo)", is_correct: true },
      { text: "Tête plongeante", is_correct: false },
      { text: "Coup franc direct", is_correct: false },
      { text: "Penalty", is_correct: false },
    ],
    explanation: "But élu plus beau but de la CDM 2018.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de buts Antoine Griezmann a-t-il marqué pendant la CDM 2018 ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "4", is_correct: true },
      { text: "6", is_correct: false },
      { text: "1", is_correct: false },
    ],
    explanation: "4 buts (Australie, 2 vs Argentine, finale).",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur a marqué son premier but international en CDM 2018 ?",
    answers: [
      { text: "Benjamin Pavard", is_correct: true },
      { text: "Olivier Giroud", is_correct: false },
      { text: "N'Golo Kanté", is_correct: false },
      { text: "Hugo Lloris", is_correct: false },
    ],
    explanation: "Le fameux but contre l'Argentine.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur français était au Real Madrid en 2018 ?",
    answers: [
      { text: "Raphaël Varane", is_correct: true },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
      { text: "Paul Pogba", is_correct: false },
    ],
    explanation: "Varane, déjà 3 Ligues des Champions au moment de la CDM.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de buts marqués par les Bleus pendant toute la CDM 2018 ?",
    answers: [
      { text: "10", is_correct: false },
      { text: "14", is_correct: true },
      { text: "18", is_correct: false },
      { text: "8", is_correct: false },
    ],
    explanation: "14 buts en 7 matchs, l'une des meilleures attaques.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel score France-Danemark en phase de poules 2018 ?",
    answers: [
      { text: "0-0", is_correct: true },
      { text: "2-1", is_correct: false },
      { text: "1-1", is_correct: false },
      { text: "1-0", is_correct: false },
    ],
    explanation: "Match nul sans saveur, qualification déjà acquise.",
  },

  // ─── CDM 2022 (finale au Qatar) ───
  {
    theme: "france",
    difficulty: 1,
    question: "Contre qui la France a-t-elle perdu la finale 2022 ?",
    answers: [
      { text: "Croatie", is_correct: false },
      { text: "Argentine", is_correct: true },
      { text: "Brésil", is_correct: false },
      { text: "Maroc", is_correct: false },
    ],
    explanation: "3-3 puis 4-2 aux tirs au but pour l'Argentine de Messi.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Quel était le score à la fin de la prolongation France-Argentine 2022 ?",
    answers: [
      { text: "2-2", is_correct: false },
      { text: "3-3", is_correct: true },
      { text: "4-3", is_correct: false },
      { text: "1-2", is_correct: false },
    ],
    explanation: "Match de légende : 3-3, Argentine 4-2 aux TaB.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Combien de buts Kylian Mbappé a-t-il inscrit en finale 2022 ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2", is_correct: false },
      { text: "3", is_correct: true },
      { text: "4", is_correct: false },
    ],
    explanation: "Triplé légendaire en finale, le 3e en finale depuis Geoff Hurst en 1966.",
  },
  {
    theme: "france",
    difficulty: 1,
    question: "Qui a remporté le Soulier d'Or (meilleur buteur) en 2022 ?",
    answers: [
      { text: "Lionel Messi", is_correct: false },
      { text: "Olivier Giroud", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Julián Álvarez", is_correct: false },
    ],
    explanation: "Mbappé avec 8 buts, devant Messi (7).",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel joueur français a battu le record de buts en sélection lors de la CDM 2022 ?",
    answers: [
      { text: "Karim Benzema", is_correct: false },
      { text: "Olivier Giroud", is_correct: true },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: false },
    ],
    explanation: "Giroud a dépassé les 51 buts de Thierry Henry au Qatar.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle joué son 1er match en 2022 ?",
    answers: [
      { text: "Danemark", is_correct: false },
      { text: "Australie", is_correct: true },
      { text: "Pologne", is_correct: false },
      { text: "Tunisie", is_correct: false },
    ],
    explanation: "4-1 contre l'Australie, doublé de Giroud.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle joué le 8e en 2022 ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Pologne", is_correct: true },
      { text: "Maroc", is_correct: false },
      { text: "Angleterre", is_correct: false },
    ],
    explanation: "3-1, doublé Mbappé + Giroud.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel adversaire la France a-t-elle battu en quart 2022 ?",
    answers: [
      { text: "Pays-Bas", is_correct: false },
      { text: "Angleterre", is_correct: true },
      { text: "Suisse", is_correct: false },
      { text: "Portugal", is_correct: false },
    ],
    explanation: "2-1, Tchouaméni et Giroud. Kane manque un pénalty.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Contre qui la France a-t-elle joué la demi 2022 ?",
    answers: [
      { text: "Argentine", is_correct: false },
      { text: "Croatie", is_correct: false },
      { text: "Maroc", is_correct: true },
      { text: "Brésil", is_correct: false },
    ],
    explanation: "2-0 vs Maroc, Théo Hernandez et Kolo Muani.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quels grands absents l'équipe de France avait-elle avant la CDM 2022 ?",
    answers: [
      { text: "Aucun", is_correct: false },
      { text: "Pogba, Kanté, Benzema (notamment)", is_correct: true },
      { text: "Mbappé blessé léger", is_correct: false },
      { text: "Lloris forfait", is_correct: false },
    ],
    explanation: "Hécatombe : Pogba, Kanté, Kimpembe, Nkunku, Benzema tous absents.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de buts Mbappé a-t-il marqué pendant toute la CDM 2022 ?",
    answers: [
      { text: "5", is_correct: false },
      { text: "7", is_correct: false },
      { text: "8", is_correct: true },
      { text: "10", is_correct: false },
    ],
    explanation: "8 buts en 7 matchs, Soulier d'Or 2022.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Sur quel coup classique Mbappé a-t-il marqué son premier but de la finale 2022 ?",
    answers: [
      { text: "Penalty", is_correct: true },
      { text: "Coup franc", is_correct: false },
      { text: "Corner", is_correct: false },
      { text: "Action solitaire", is_correct: false },
    ],
    explanation: "Penalty à la 80e après faute sur Kolo Muani.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de secondes séparaient les 2 premiers buts de Mbappé en finale 2022 ?",
    answers: [
      { text: "97 secondes (~1'37)", is_correct: true },
      { text: "5 minutes", is_correct: false },
      { text: "30 secondes", is_correct: false },
      { text: "3 minutes", is_correct: false },
    ],
    explanation: "Penalty à la 80e, frappe enroulée à la 81e. Folie pure.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quels joueurs français ont manqué leur tir au but en finale 2022 ?",
    answers: [
      { text: "Mbappé", is_correct: false },
      { text: "Coman et Tchouaméni", is_correct: true },
      { text: "Giroud", is_correct: false },
      { text: "Griezmann", is_correct: false },
    ],
    explanation: "Coman stoppé, Tchouaméni à côté.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel match de poule a perdu la France en 2022 ?",
    answers: [
      { text: "Aucun", is_correct: false },
      { text: "Tunisie 0-1", is_correct: true },
      { text: "Australie 1-2", is_correct: false },
      { text: "Danemark 0-1", is_correct: false },
    ],
    explanation: "0-1 face à la Tunisie avec une équipe largement remaniée.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de Coupes du Monde la France a-t-elle remportées avant 2026 ?",
    answers: [
      { text: "1", is_correct: false },
      { text: "2 (1998, 2018)", is_correct: true },
      { text: "3", is_correct: false },
      { text: "0", is_correct: false },
    ],
    explanation: "1998 à domicile et 2018 en Russie.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Qui était le patron de la défense française en 2022 ?",
    answers: [
      { text: "Raphaël Varane", is_correct: true },
      { text: "Jules Koundé", is_correct: false },
      { text: "Lucas Hernandez", is_correct: false },
      { text: "Dayot Upamecano", is_correct: false },
    ],
    explanation: "Varane patron, Lucas Hernandez blessé au genou dès l'Australie.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quelle équipe africaine la France a-t-elle battu en demi de CDM 2022 ?",
    answers: [
      { text: "Maroc", is_correct: true },
      { text: "Sénégal", is_correct: false },
      { text: "Cameroun", is_correct: false },
      { text: "Ghana", is_correct: false },
    ],
    explanation: "Le Maroc fut le 1er pays africain demi-finaliste, battu par les Bleus.",
  },

  // ─── Records & faits français généraux ───
  {
    theme: "france",
    difficulty: 1,
    question: "Combien de finales de Coupe du Monde la France a-t-elle disputées au total ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
      { text: "4 (1998, 2006, 2018, 2022)", is_correct: true },
      { text: "5", is_correct: false },
    ],
    explanation: "4 finales : 2 gagnées (98, 18), 2 perdues (06, 22).",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Combien de buts a marqué Olivier Giroud en sélection (record) ?",
    answers: [
      { text: "Moins de 40", is_correct: false },
      { text: "50", is_correct: false },
      { text: "57", is_correct: true },
      { text: "70", is_correct: false },
    ],
    explanation: "57 buts au compteur, record absolu en équipe de France.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel joueur détient le record de matchs joués en équipe de France ?",
    answers: [
      { text: "Lilian Thuram", is_correct: false },
      { text: "Hugo Lloris", is_correct: true },
      { text: "Didier Deschamps", is_correct: false },
      { text: "Marcel Desailly", is_correct: false },
    ],
    explanation: "Lloris, 145 sélections au moment de sa retraite internationale.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Quel joueur français a remporté le Ballon d'Or 1998 ?",
    answers: [
      { text: "Marcel Desailly", is_correct: false },
      { text: "Zinédine Zidane", is_correct: true },
      { text: "Didier Deschamps", is_correct: false },
      { text: "Lilian Thuram", is_correct: false },
    ],
    explanation: "Logique après la CDM, deuxième Ballon d'Or français après Platini.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de Ballons d'Or compte Karim Benzema en 2026 ?",
    answers: [
      { text: "0", is_correct: false },
      { text: "1 (2022)", is_correct: true },
      { text: "2", is_correct: false },
      { text: "3", is_correct: false },
    ],
    explanation: "Ballon d'Or 2022 récompensant sa saison épique au Real.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur français a marqué un quadruplé contre le Kazakhstan en éliminatoires 2022 ?",
    answers: [
      { text: "Olivier Giroud", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Wissam Ben Yedder", is_correct: false },
    ],
    explanation: "Mbappé a inscrit 4 buts contre le Kazakhstan en novembre 2021 (8-0).",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Qui était le dernier capitaine des Bleus début 2026 ?",
    answers: [
      { text: "Hugo Lloris", is_correct: false },
      { text: "Antoine Griezmann", is_correct: false },
      { text: "Kylian Mbappé", is_correct: true },
      { text: "Aurélien Tchouaméni", is_correct: false },
    ],
    explanation: "Mbappé désigné capitaine après la retraite internationale de Lloris.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Combien de fois Didier Deschamps a-t-il participé à une CDM comme sélectionneur (avant 2026) ?",
    answers: [
      { text: "2", is_correct: false },
      { text: "3 (2014, 2018, 2022)", is_correct: true },
      { text: "4", is_correct: false },
      { text: "5", is_correct: false },
    ],
    explanation: "3 participations : QF en 2014, champion 2018, finaliste 2022.",
  },
  {
    theme: "france",
    difficulty: 2,
    question: "Qui était l'entraîneur du Brésil que la France a battu en finale 1998 ?",
    answers: [
      { text: "Mario Zagallo", is_correct: true },
      { text: "Carlos Alberto Parreira", is_correct: false },
      { text: "Felipão", is_correct: false },
      { text: "Tite", is_correct: false },
    ],
    explanation: "Zagallo, légende du foot brésilien.",
  },
  {
    theme: "france",
    difficulty: 3,
    question: "Quel joueur a annoncé sa retraite internationale juste après la CDM 2022 ?",
    answers: [
      { text: "Karim Benzema", is_correct: true },
      { text: "Hugo Lloris", is_correct: false },
      { text: "Raphaël Varane", is_correct: false },
      { text: "Steve Mandanda", is_correct: false },
    ],
    explanation: "Benzema avait annoncé sa retraite internationale, polémique ensuite avec Deschamps.",
  },
];

export function countByTheme(theme: QuizTheme | "all"): number {
  if (theme === "all") return SEED_QUESTIONS.length;
  return SEED_QUESTIONS.filter((q) => q.theme === theme).length;
}

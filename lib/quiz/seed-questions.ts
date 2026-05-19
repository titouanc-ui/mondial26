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
    question: "Qui a marqué le 1000ème but de Cristiano Ronaldo en carrière ?",
    answers: [
      { text: "Personne — il ne l'a pas encore atteint", is_correct: false },
      { text: "Cristiano Ronaldo lui-même", is_correct: true },
      { text: "Lionel Messi", is_correct: false },
      { text: "Pelé", is_correct: false },
    ],
    explanation:
      "CR7 court après le cap des 1000 buts en carrière (clubs + sélection).",
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

  // ============== CULTURE / DIVERS ==============
  {
    theme: "culture",
    difficulty: 1,
    question: "Quelle est la mascotte de la CDM 2026 ?",
    answers: [
      { text: "Zayu, Maple, Clutch (trio)", is_correct: true },
      { text: "Zabivaka", is_correct: false },
      { text: "La'eeb", is_correct: false },
      { text: "Footix", is_correct: false },
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
];

export function countByTheme(theme: QuizTheme | "all"): number {
  if (theme === "all") return SEED_QUESTIONS.length;
  return SEED_QUESTIONS.filter((q) => q.theme === theme).length;
}

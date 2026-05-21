/**
 * Équipes participantes (et qualifiables) à la Coupe du Monde 2026.
 * Le tournoi passe à 48 équipes. La liste finale n'étant pas figée au 21 mai 2026,
 * on inclut largement les nations qualifiées + grandes nations de foot mondiales,
 * pour permettre à chacun de choisir son équipe favorite.
 *
 * `code` = code ISO 3166-1 alpha-3 (sauf exceptions FIFA comme ENG/SCO/WAL).
 * `flag` = emoji drapeau (rendu universel cross-platform).
 */
export interface Team {
  code: string;
  name: string;
  flag: string;
  confederation: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
}

export const TEAMS: Team[] = [
  // ── Pays hôtes (CONCACAF) ──
  { code: "USA", name: "États-Unis", flag: "🇺🇸", confederation: "CONCACAF" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", confederation: "CONCACAF" },
  { code: "MEX", name: "Mexique", flag: "🇲🇽", confederation: "CONCACAF" },

  // ── UEFA ──
  { code: "FRA", name: "France", flag: "🇫🇷", confederation: "UEFA" },
  { code: "ESP", name: "Espagne", flag: "🇪🇸", confederation: "UEFA" },
  { code: "GER", name: "Allemagne", flag: "🇩🇪", confederation: "UEFA" },
  { code: "ITA", name: "Italie", flag: "🇮🇹", confederation: "UEFA" },
  { code: "ENG", name: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", confederation: "UEFA" },
  { code: "NED", name: "Pays-Bas", flag: "🇳🇱", confederation: "UEFA" },
  { code: "BEL", name: "Belgique", flag: "🇧🇪", confederation: "UEFA" },
  { code: "CRO", name: "Croatie", flag: "🇭🇷", confederation: "UEFA" },
  { code: "POL", name: "Pologne", flag: "🇵🇱", confederation: "UEFA" },
  { code: "SUI", name: "Suisse", flag: "🇨🇭", confederation: "UEFA" },
  { code: "DEN", name: "Danemark", flag: "🇩🇰", confederation: "UEFA" },
  { code: "SWE", name: "Suède", flag: "🇸🇪", confederation: "UEFA" },
  { code: "NOR", name: "Norvège", flag: "🇳🇴", confederation: "UEFA" },
  { code: "AUT", name: "Autriche", flag: "🇦🇹", confederation: "UEFA" },
  { code: "TUR", name: "Turquie", flag: "🇹🇷", confederation: "UEFA" },
  { code: "SRB", name: "Serbie", flag: "🇷🇸", confederation: "UEFA" },
  { code: "UKR", name: "Ukraine", flag: "🇺🇦", confederation: "UEFA" },
  { code: "SCO", name: "Écosse", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA" },
  { code: "WAL", name: "Pays de Galles", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", confederation: "UEFA" },
  { code: "CZE", name: "Tchéquie", flag: "🇨🇿", confederation: "UEFA" },
  { code: "HUN", name: "Hongrie", flag: "🇭🇺", confederation: "UEFA" },
  { code: "GRE", name: "Grèce", flag: "🇬🇷", confederation: "UEFA" },
  { code: "IRL", name: "Irlande", flag: "🇮🇪", confederation: "UEFA" },
  { code: "ROU", name: "Roumanie", flag: "🇷🇴", confederation: "UEFA" },

  // ── CONMEBOL ──
  { code: "ARG", name: "Argentine", flag: "🇦🇷", confederation: "CONMEBOL" },
  { code: "BRA", name: "Brésil", flag: "🇧🇷", confederation: "CONMEBOL" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", confederation: "CONMEBOL" },
  { code: "COL", name: "Colombie", flag: "🇨🇴", confederation: "CONMEBOL" },
  { code: "ECU", name: "Équateur", flag: "🇪🇨", confederation: "CONMEBOL" },
  { code: "CHI", name: "Chili", flag: "🇨🇱", confederation: "CONMEBOL" },
  { code: "PER", name: "Pérou", flag: "🇵🇪", confederation: "CONMEBOL" },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾", confederation: "CONMEBOL" },
  { code: "VEN", name: "Venezuela", flag: "🇻🇪", confederation: "CONMEBOL" },
  { code: "BOL", name: "Bolivie", flag: "🇧🇴", confederation: "CONMEBOL" },

  // ── CAF ──
  { code: "MAR", name: "Maroc", flag: "🇲🇦", confederation: "CAF" },
  { code: "SEN", name: "Sénégal", flag: "🇸🇳", confederation: "CAF" },
  { code: "EGY", name: "Égypte", flag: "🇪🇬", confederation: "CAF" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", confederation: "CAF" },
  { code: "ALG", name: "Algérie", flag: "🇩🇿", confederation: "CAF" },
  { code: "TUN", name: "Tunisie", flag: "🇹🇳", confederation: "CAF" },
  { code: "CIV", name: "Côte d'Ivoire", flag: "🇨🇮", confederation: "CAF" },
  { code: "CMR", name: "Cameroun", flag: "🇨🇲", confederation: "CAF" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", confederation: "CAF" },
  { code: "RSA", name: "Afrique du Sud", flag: "🇿🇦", confederation: "CAF" },
  { code: "MLI", name: "Mali", flag: "🇲🇱", confederation: "CAF" },

  // ── AFC ──
  { code: "JPN", name: "Japon", flag: "🇯🇵", confederation: "AFC" },
  { code: "KOR", name: "Corée du Sud", flag: "🇰🇷", confederation: "AFC" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", confederation: "AFC" },
  { code: "AUS", name: "Australie", flag: "🇦🇺", confederation: "AFC" },
  { code: "KSA", name: "Arabie Saoudite", flag: "🇸🇦", confederation: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", confederation: "AFC" },
  { code: "UAE", name: "Émirats arabes unis", flag: "🇦🇪", confederation: "AFC" },
  { code: "IRQ", name: "Irak", flag: "🇮🇶", confederation: "AFC" },
  { code: "UZB", name: "Ouzbékistan", flag: "🇺🇿", confederation: "AFC" },
  { code: "JOR", name: "Jordanie", flag: "🇯🇴", confederation: "AFC" },

  // ── CONCACAF (autres) ──
  { code: "CRC", name: "Costa Rica", flag: "🇨🇷", confederation: "CONCACAF" },
  { code: "JAM", name: "Jamaïque", flag: "🇯🇲", confederation: "CONCACAF" },
  { code: "PAN", name: "Panama", flag: "🇵🇦", confederation: "CONCACAF" },
  { code: "HON", name: "Honduras", flag: "🇭🇳", confederation: "CONCACAF" },

  // ── OFC ──
  { code: "NZL", name: "Nouvelle-Zélande", flag: "🇳🇿", confederation: "OFC" },
];

export const TEAMS_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t]),
);

export function getTeam(code: string | null | undefined): Team | null {
  if (!code) return null;
  return TEAMS_BY_CODE[code] ?? null;
}

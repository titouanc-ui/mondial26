# Mondial 26

Site Coupe du Monde 2026 entre potes — News, stats live, classements, et un quiz à la mécanique soignée pour défier ses amis.

## Stack

- **Next.js 16** (App Router, Turbopack par défaut) + **React 19.2** + **TypeScript**
- **Tailwind 4** + composants maison thématisés CDM 2026
- **Supabase** (Postgres + Auth Google + Realtime)
- **Vercel** pour le déploiement + cron jobs
- Adapter pattern pour les data providers : `mock` → `football-data-org` → `api-football` (RapidAPI)

## Démarrage local

```bash
npm install
cp .env.example .env.local   # déjà fait si tu lis ce README
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

En mode `FOOTBALL_PROVIDER=mock` (défaut), les classements et matchs sont des données factices — utile pour le dev sans clés API.

## Variables d'environnement

| Variable | Requis | Description |
|---|---|---|
| `FOOTBALL_PROVIDER` | non | `mock` (défaut) / `football-data-org` / `api-football` |
| `FOOTBALL_DATA_API_KEY` | si provider = football-data-org | Clé gratuite sur [football-data.org](https://www.football-data.org/client/register) |
| `RAPIDAPI_KEY` | si provider = api-football | Clé RapidAPI (plan payant) |
| `NEXT_PUBLIC_SUPABASE_URL` | pour le quiz | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pour le quiz | Clé publique anon |
| `SUPABASE_SERVICE_ROLE_KEY` | pour le quiz | Clé service role (anti-triche, persistance scores) |
| `QUIZ_SESSION_SECRET` | recommandé en prod | Secret HMAC pour signer les tokens de session quiz |
| `CRON_SECRET` | en prod | Bearer token attendu par les routes `/api/cron/*` |
| `NEXT_PUBLIC_SITE_URL` | recommandé | URL publique (`https://mondial26.app`) pour OG/metadata |

Sans Supabase configuré, le site tourne en **mode démo** : le quiz fonctionne (questions tirées du seed local) mais les scores ne sont pas sauvegardés.

## Setup Supabase

1. Crée un projet sur [supabase.com](https://supabase.com) (plan gratuit OK)
2. Ouvre **SQL Editor** et exécute le contenu de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
3. **Authentication > Providers** : active Google OAuth (client ID + secret depuis [Google Cloud Console](https://console.cloud.google.com/apis/credentials))
4. **Database > Replication** : active le realtime sur la table `quiz_sessions` (pour le leaderboard live)
5. Copie l'URL + anon key + service_role key dans `.env.local`

### URL de redirection Google OAuth

Dans Google Cloud Console, ajoute comme URI de redirection autorisée :
- `https://<ton-projet>.supabase.co/auth/v1/callback`

Dans **Supabase > Authentication > URL Configuration**, ajoute en redirect URL :
- `http://localhost:3000/auth/callback` (dev)
- `https://mondial26.app/auth/callback` (prod)

## Banque de questions

100+ questions sont seedées dans [`lib/quiz/seed-questions.ts`](lib/quiz/seed-questions.ts). En mode démo (sans Supabase), elles sont utilisées directement.

Pour les charger dans Supabase (= les réutiliser entre instances + permettre l'édition via Studio) :

```sql
-- À adapter selon ton workflow ; tu peux générer un script SQL depuis seed-questions.ts
-- ou les insérer manuellement via Supabase Studio (Table editor > quiz_questions > Insert row)
```

(Script d'import à automatiser dans une prochaine itération.)

## Architecture

```
app/
├── page.tsx                    # Home (hero + compte à rebours + cartes sections)
├── news/                       # Agrégation RSS
├── stats/                      # Stats live + détail match
├── classement/                 # Poules + phases finales
├── quiz/                       # Hub + jeu + résultat
├── classement-joueurs/         # Leaderboard
├── api/
│   ├── quiz/start              # POST → sessionToken + clientQuestions
│   ├── quiz/submit             # POST → score serveur, persistance
│   ├── profile/pseudo          # POST → upsert pseudo joueur
│   └── cron/                   # Refresh news + matches (Vercel Cron)
└── auth/callback               # OAuth callback Supabase
lib/
├── data-providers/             # ⭐ Adapter pattern (mock | football-data-org | api-football)
├── news/                       # Fetcher RSS (5 sources françaises)
├── quiz/                       # Engine + scoring serveur + seed + cookies + JWT-style token
└── supabase/                   # Clients browser / server / admin
components/
├── layout/                     # Header sticky, Footer
├── home/                       # Countdown
├── classement/                 # PouleTable, MatchCard
├── news/                       # ArticleCard
├── quiz/                       # QuizPlayer (timer, anti-triche), ResultView
├── leaderboard/                # LeaderboardTable (avec realtime)
└── auth/                       # GoogleSignInButton
supabase/migrations/0001_init.sql
vercel.json                     # Cron schedules
proxy.ts                        # (anciennement middleware) Refresh session Supabase
```

## Déploiement Vercel

1. Push sur GitHub
2. Importer le repo sur [vercel.com](https://vercel.com)
3. Ajouter les env vars dans Project Settings > Environment Variables
4. Deploy

Les cron jobs sont auto-configurés via [`vercel.json`](vercel.json) :
- `/api/cron/refresh-news` toutes les 15 min
- `/api/cron/refresh-matches` toutes les 10 min

Vercel envoie automatiquement `Authorization: Bearer $CRON_SECRET` sur ces routes.

## Switch vers RapidAPI

Quand tu veux passer de Football-Data.org à API-Football (RapidAPI) :

1. Ajoute `RAPIDAPI_KEY=...` dans les env vars Vercel
2. Change `FOOTBALL_PROVIDER=api-football`
3. Implémente `ApiFootballProvider` dans [`lib/data-providers/api-football.ts`](lib/data-providers/api-football.ts) (à créer en suivant la signature de [`FootballDataOrgProvider`](lib/data-providers/football-data-org.ts))
4. Ajoute le `case "api-football"` dans [`lib/data-providers/index.ts`](lib/data-providers/index.ts)

Aucun autre fichier à toucher — tout le reste passe par l'interface `FootballProvider`.

## Sécurité quiz (anti-triche)

- Le scoring est **calculé serveur** depuis un snapshot signé par HMAC
- Le client ne voit jamais `is_correct` pendant le quiz
- Le `sessionToken` a un TTL de 10 min
- `correctIndex` n'est révélé qu'à la soumission finale
- Pseudo validé par regex (alphanumérique + accents français)
- Insertion `quiz_sessions` uniquement via service role (RLS bloque le client)

## TODO post-MVP

- Boutique à points (badges, avatars, thèmes — réservé comptes Google)
- Questions auto-générées depuis l'API foot (résultats récents)
- Pronostics avec mini-ligues entre amis
- PWA installable
- Switch vers `ApiFootballProvider` quand le trafic le justifie

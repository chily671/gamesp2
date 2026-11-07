# Không gian 2 — The Digital Identity RPG

Không gian 2 is a touch-first educational RPG about protecting a fictional digital
identity. Player registration details and in-game character data are separate;
all profile values shown in the game are simulated.

## Architecture

- **Next.js App Router** renders the player experience and provides API Route
  Handlers in the same application.
- **JavaScript and React** are used throughout; TypeScript is not configured.
- **Tailwind CSS v4** handles component layout, with a small global stylesheet
  for the visual system, motion, and reduced-motion support.
- **MongoDB and Mongoose** store event players, fictional character profiles,
  legacy mission content, quiz questions, settings, and independent sessions.
- **Lucide React** supplies interface icons.
-   Server-side session and scoring logic validates submitted decisions; correct
  answers are not sent to a player before a decision is submitted.

### Versioned data model

| Model | Responsibility |
| --- | --- |
| `Player` | Event participant name, class, and opaque player code; never used as a public leaderboard identity. |
| `CharacterProfile` | Fictional identity and persona-specific opening, three-stage storyline, evidence, incident, endings, and Guardian prompts. |
| `Mission` | The four legacy question stages and their server-side answer evaluation; retained for existing legacy sessions. |
| `QuizQuestion` | Independently managed question bank used by new quiz sessions; answer keys are server-only. |
| `GameSettings` | Admin-configured number of questions per new game; defaults to four. |
| `GameSession` | Versioned run state. Legacy and RPG v2 sessions retain their flow; Quiz v3 sessions snapshot a random question set and answers. |

Game sessions reference a player and a fictional character. Admin access and participant data access are restricted to a separately
configured event administrator.

## Project structure

```text
src/
  app/                 App Router pages, layouts, styles, and API routes
  components/          Reusable UI grouped by feature
  lib/
    mongodb.js         Shared Mongoose connection
    game/              Session and mission logic
    scoring/           Server-side score evaluation
    utils/             Shared utilities
  models/              Mongoose models
  data/seed/           Fictional profile, legacy mission, and quiz seed data
```

Legacy missions, the quiz bank, and character profiles are stored separately.
New registrations use Quiz v3, which draws the admin-configured number of
questions at random from active questions (four by default). Existing Legacy
and RPG v2 sessions continue with their original flow and stored progress.

## Local setup

1. Install Node.js 20.9 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and set `MONGODB_URI` to a development
   MongoDB instance.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The MongoDB connection helper throws a clear error if `MONGODB_URI` is missing.
No database connection is required to render the Phase 1 landing page.

## Profile and storyline import

After setting `MONGODB_URI`, import the 20 fictional profiles and their
personalized storylines:

```bash
npm run seed:characters
npm run seed:missions
npm run seed:questions
```

The quiz import inserts 20 starter questions screened against the supplied
article list without overwriting existing admin edits; all remain flagged for
expert review. Registration asks only for a participant name and class. A short notice
explains why these details are stored; `DATA_RETENTION_DAYS` controls their
retention (default: 30 days, valid range: 1–3650). MongoDB TTL cleanup runs
asynchronously. `SESSION_DURATION_MINUTES` controls the active session length
(default: 5 minutes, valid range: 1–120); the session cookie and API reject an
expired session immediately, while its result data remains until the separate
retention deadline. The session token is stored as an HttpOnly, SameSite
cookie; only a hash is stored in MongoDB. There is no public participant-list
endpoint.

Character email addresses use the reserved `.invalid` domain; phone values are
masked with `x` and are not routable. Simulated passwords cannot be used to
sign in, and balances use fictional Pixel Coins. The import snapshots the five
replaced profile records into their retained legacy sessions before replacing
them, so old sessions keep their character and four-stage flow. The migration
is versioned and safe to rerun; after completion it leaves administrator edits
unchanged.

## Legal question content

The starter question bank references Articles 3, 4, 7, 9, 10, 12, 16, and 19
of Vietnam's Personal Data Protection Law No. 91/2025/QH15, following the
articles supplied in the project brief. Question explanations avoid treating
all data processing as consent-based or declaring conduct unlawful without
context. Every starter question remains marked for legal expert review.

## Delivery phases

1. **Project setup:** shared layout, database connection, and landing experience.
2. **Registration and profiles:** isolated player sessions and 20 persona-specific profiles.
3. **Legacy gameplay:** existing sessions continue through four connected missions.
4. **RPG v2 gameplay:** existing sessions continue three linked stages with personalized content and evidence.
5. **Quiz v3 gameplay:** new sessions receive a random, snapshotted subset of active questions.
6. **Scoring and results:** server-side answers, configurable question count, and version-aware results.
7. **Admin and event operations:** question/profile CRUD, quiz settings, analytics, timeout, reset, and retention.
8. **Verification:** production build, responsive checks, seed integrity, and versioned gameplay checks.

### Admin setup

Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` (8–72 UTF-8 bytes), and an
independent random value of at least 32 bytes in `ADMIN_JWT_SECRET` in
`.env.local` or your production environment. The password is read directly
from the server environment and is never stored in MongoDB or sent to clients;
`bcryptjs` creates an in-memory verifier on first use, while `jsonwebtoken`
signs the HTTP-only admin cookie. Do not commit credentials to the repository.
Generate the JWT secret with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
The JWT admin cookie is HTTP-only, SameSite strict, and expires after eight
hours. Do not expose the admin service publicly without network restrictions
and rate limiting; use it only on a trusted event network. The admin interface
shows participant identity and therefore must stay restricted.

The admin overview reports completion rate, average score, and duration over
retained sessions. Legacy accuracy and answer counts apply only to the old
four-mission flow. RPG v2 has separate session, Data Risk, Protection Score,
and evidence metrics; these are computed from recorded actions and are not
random. Mission legal-review flags are shown as a review status, not as a
compliance score.

Administrators can add and edit fictional profiles and their RPG story fields,
activate/deactivate profiles, and manage the four legacy missions and answer
keys. Each new RPG session snapshots its character storyline. Retained legacy
sessions use their own snapshots so replacing a profile does not change their
character or gameplay.

### Content authoring flow

Create or edit a fictional profile with its opening, Stage 01 service and
permission choice, conditional Stage 02 evidence, Stage 03 incident/outcomes,
and contextual AI Guardian dialogue. The profile editor also captures
lifestyle, digital footprints, and risk factors. Emails must use `.invalid`;
phone values must say `DEMO` or be masked with `x`, and simulated-password
values must be clearly marked `DEMO`.

The mission editor guides the author through (1) stage and scenario, (2) answer
choices and the exact correct answer set, (3) explanation, learning point, and
legal-review status, and (4) a player-facing preview. New registrations use
RPG v2: Stage 01 — THE BAIT, Stage 02 — THE BREACH, and Stage 03 — THE LAST
CHOICE. Stage 01 choices alter the app log in Stage 02; collected evidence and
earlier decisions affect Stage 03 actions and the ending. The four existing
missions remain available only to legacy sessions. New content remains subject
to expert legal review.

All four missions are seeded with explanations and a link to the official
source. Specific article-level legal citations remain marked for legal review:
the Government source confirms the signed document, but its PDF is image-based
in this environment, so exact provisions have not been independently verified.
The game explains privacy risks and does not declare every data request
unlawful.

The official source lists Law No. 91/2025/QH15 as issued on 26 June 2025 and
effective from 1 January 2026:
<https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=>.
Article-level citations in the missions require review against accessible legal
text by a qualified reviewer before public deployment.
#   g a m e s p 2  
 
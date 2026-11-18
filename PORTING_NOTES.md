# Porting notes: parity with openmausbot-teams

This branch (`feature/port-openmausbot-parity`) ports three things from the
[openmausbot-teams](https://github.com/milind-soni/openmausbot-teams) project (MIT) into this repository, with the
"openmaus"/"botmrr" identifiers renamed to "qaci-duo" ones — including the strings this repository's own code
parses and writes, not just prose. **If you only read one section, read "Format strings: old → new" below**: it is
a breaking change for anything that reads this repository's generated files.

## 1. Format strings: old → new (breaking change)

| What | Old (openmausbot-teams) | New (this repository, from now on) |
|---|---|---|
| Package frontmatter discriminator | bare key `botmrr: 1` | `format: qaci-duo.package` + `version: 1` |
| Team manifest (`team.mausteam.json`) `format` | `openmaus.team` | `qaci-duo.team` |
| Catalog (`catalog.json`) `format` | `openmaus.catalog` | `qaci-duo.catalog` |
| A routine's `runOn` value for the in-app runtime | `maus` | `duo` (`cloud` is unchanged) |

**This is a breaking change you must act on.** Confirmed by reading the real `qaci-duo` app's own source directly
(not just the comments here): `shared/package-format.ts` still exports `PACKAGE_FORMAT = "openmaus.package"` (used
for **both** package v1 and v2, and `botmrr: 1` is still the live Markdown-v1 discriminator it checks via
`markdownDocument()`); `server/team-manifest.ts` exports `TEAM_MANIFEST_FORMAT = "openmaus.team"`; and
`server/team-library.ts`'s `parseTeamCatalog()` checks the literal `"openmaus.catalog"` (that file is what currently
fetches the *external* openmausbot-teams repository for the "paste a GitHub link" / Team Library panel feature — a
separate surface from the official Templates tab). Unless that parser is updated to also accept the new strings
above, it will fail to import anything the `library` branch generates from this branch onward. This was an explicit,
informed choice (see the task this branch was built from), not an oversight — but it means **do not merge this to
`main` until the app side is updated**, or coordinate a dual-read window in the app first.

Where this is implemented: `scripts/lib.mjs` (`PACKAGE_FORMAT`, `TEAM_FORMAT`, `CATALOG_FORMAT`, `ROUTINE_RUNTIMES`
constants, used by `validatePackage`, `workerPackage`, `workerLibraryFiles`, `buildCatalog`). Also updated:
`tests/validate.test.mjs`, `FORMAT.md`, `README.md`, `CONTRIBUTING.md`, the comment in `scripts/repo.mjs`.

One thing that **deliberately did not** change: the generated manifest's file name,
`teams/<id>/team.mausteam.json`, keeps its `.mausteam.json` extension. The task's rebrand instructions called out
format *discriminator strings* (the `format`/`version`/`botmrr` fields — what code actually parses) and named
components/types (`MausAvatar`), not file-extension conventions; renaming the extension would be a bigger,
unrequested structural change (every consumer that globs for `*.mausteam.json` would also need updating) for a
cosmetic string that nothing in this repository's own code treats as meaningful. Flagging this as a judgment call
in case the repository owner wants it renamed too.

Also renamed, not part of the wire format: `components/MausAvatar.tsx` → `components/DuoAvatar.tsx`
(`MAUS_COLORS`/`MausColor` → `DUO_COLORS`/`DuoColor`). `components/CursorAvatar.tsx` is an unrelated, generic
silhouette-agnostic mascot animation engine (named after a "cursor" shape, nothing to do with "Maus") and is
unchanged.

Prose mentions of "OpenMausBot"/"BotMRR" were reworded to credit the project as prior art (e.g. "the validation
approach is adapted from the openmausbot-teams project (MIT)") rather than carrying the name as a live product
reference. `LICENSE`'s MIT attribution line is left as-is — it is the actual legal notice for the reused code, not
a format identifier.

## 2. What was ported

- **The public browsing website** (`app/`, `components/`, `lib/`, `next.config.ts`, `tsconfig.json`,
  `next-env.d.ts`). Lists this repository's real Digital Workers (`workers/*.md`) instead of BotMRR's "bot teams",
  at `/workers/[slug]` instead of `/bots/[slug]`. It reads the repository through `lib/repository.ts`, a thin typed
  wrapper around the *same* `loadRepository()` / `workerPackage()` (`scripts/repo.mjs`, `scripts/lib.mjs`) that
  `npm test` and `npm run build` already use — not a second, ad hoc parser. Run it with `npm run site:dev`
  (`npm run site:build` / `npm run site:start` for production). **`npm run build` keeps its existing meaning**
  (`node scripts/build.mjs dist`, what `.github/workflows/publish.yml` runs) — the Next.js app's scripts are all
  under the `site:*` prefix so they don't collide with it.
- **Multi-agent, rooms and routines** for `workers/<id>.md` (optional, backward compatible — see
  `scripts/lib.mjs`'s `validateWorker`/`workerPackage`/`workerLibraryFiles`, `FORMAT.md`, `templates/worker.md`).
  All four existing worker files validate and build with zero changes, because the extension only adds optional
  fields (`agents`, `chiefOfStaff`, `rooms`, `routines`) alongside the worker's own existing single-agent fields;
  a worker that sets none of them behaves exactly as before.
- **Declarative JSON Schema** (`schema/worker.schema.json`, `schema/playbook.schema.json`,
  `schema/package.schema.json`), documenting what the hand-written validators in `scripts/lib.mjs` check. These are
  editor/tooling documentation, not an enforcement mechanism — `scripts/lib.mjs` stays the one thing CI actually
  runs. `schema/team.schema.json`-style `additionalProperties: false` is only used where the real validator itself
  exhaustively rejects unknown keys (`workers/<id>.md` and `playbooks/<name>/SKILL.md` frontmatter); elsewhere it is
  left permissive to stay honest about what `validatePackage`/`validateWorker` actually enforce.

## 3. What was deliberately adapted, not copied verbatim

- **`/methodology` and `/publish`.** BotMRR's versions pitched its own revenue-claim-free "package" product and
  linked to `github.com/milind-soni/openmausbot-teams` (an unrelated public repository, and the wrong contribution
  flow for a private one). Both pages were rewritten using this repository's own `CONTRIBUTING.md`/`FORMAT.md`/
  `SECURITY.md` content: `/methodology` explains the real validate → review → merge → publish pipeline and what CI
  refuses; `/publish` explains the real private-repo contribution flow (ask a code owner for access, write
  `workers/<id>.md` / `playbooks/<name>/SKILL.md` from the templates, `npm test` locally, open a pull request).
- **`/sponsor` was dropped, not adapted**, along with the ten-slot sponsor rail in the directory
  (`components/Directory.tsx`'s `SponsorCard`/`<aside>` rails and the now-unused sponsor CSS). This is a private,
  unmonetized internal library, not a paid public directory — there is no genuine analog to invent content for, so
  the honest choice was to remove the feature rather than reskin a sponsorship program nobody runs.
- **The "evidence ledger" (`lib/proof.ts` + `lib/research.ts`).** `lib/research.ts` (curated field notes and claim
  reviews about *other products'* launches) was **not ported at all**: it is fabricated BotMRR marketing/case-study
  content that, checked against the live app, is not even imported by any page or component there — porting it
  would mean inventing an equivalent set of fake QACI Duo case studies, which the task explicitly ruled out.
  `lib/proof.ts` (two small pure functions operating on a package's optional `proof` field) **was** ported, along
  with the `proof` field's type in `lib/repository.ts`'s `WorkerPackage`, and the conditional rendering in the
  directory card and detail page that already no-ops when `proof` is absent. No QACI Duo Digital Worker carries a
  revenue claim, so `proof` is always `undefined` here — the mechanism is present and structurally wired, but
  inert, exactly as instructed, rather than fabricated.
- **No image assets.** BotMRR's `/og.png`, `public/app-icon.png` and `app/icon.png` are binaries; this
  repository's own CI (`scripts/validate.mjs`) already refuses binary files repository-wide (see `SECURITY.md`),
  and the task said not to fabricate content, which a fake OG card or a placeholder icon would be. Rather than add
  a binary, add an exception to the no-binaries rule, or fabricate an icon, the site ships with no favicon and no
  Open Graph image — `app/layout.tsx`'s metadata also drops the `metadataBase`/`openGraph.images`/`twitter.images`
  fields BotMRR's version had, rather than guess at a public domain this repository doesn't have yet. The mascot
  (`DuoAvatar`/`CursorAvatar`, inline SVG) is unaffected since it was never a raster asset.
- **`InstallButton`** no longer points at a custom `openmausbot://install?url=...` URI scheme — QACI Duo has no
  known public deep link like that. It now copies the generated package to the clipboard instead, with the real
  install path from this repository's own `README.md` ("+ → Templates → Community templates → Load → Add team").
- **`components/ConnectorIcon.tsx`**'s domain lookup table was trimmed: BotMRR-specific/brand-specific slugs
  (`grok`, `grok-bot`, `polymarket`, `robinhood`, `servicetitan`, `quo`) and the two entries that pointed at the
  literal `openmausbot.com` domain were dropped. The component already falls back to a letter badge for any
  unmapped slug, so this is a safe trim, not a behavior change for any app this repository's workers actually
  declare (currently only `github`).

## 4. Later addition: package v2 (soul, connections, embedded skills)

A follow-up commit on this same branch upgraded the generated package from `version: 1` to `version: 2` (still
`format: qaci-duo.package`) and extended the authoring format in `workers/<id>.md` so it can express what QACI
Duo's own real official playbooks (`qaciduo-adlc`, `qaciduo-app-rebuild`) actually need, matching the real app's
`packageDocumentSchema` (v2) in `shared/package-format.ts`:

- `soul` (worker-level and `agents[].soul`) — a standing system prompt, under 24,000 bytes, separate from
  `description`.
- A nested `team: {name, leader, brief}` object replaces the flat `chiefOfStaff` package field (the real v1 schema
  keeps `chiefOfStaff` flat; v2 nests it, and `connections` only exists in v2 — which is why the jump to v2 was
  necessary, not optional). The authoring field is still called `chiefOfStaff` in `workers/<id>.md` for
  familiarity; the generator maps it to `team.leader`. A new `teamBrief` authoring field maps to `team.brief`.
  **The worker's own top-level identity never gets a `connections` subset of its own** — only `agents[]` entries
  can, since in practice a sensitive connection goes to one named specialist, not the generic lead.
- `connections[]` (worker-level pool) and `agents[].connections` (per-agent subset, **no default** — unlike
  playbooks/skills, where an agent gets all of the worker's own by default, a connection is only handed to an
  agent that explicitly lists it). A connection slot never carries a secret value, only an address and the names
  of header values an installer will supply.
- `skills`/`agents[].skills`: a worker-level `skills:` list (parallel to `playbooks:`) that embeds a
  `playbooks/<name>/SKILL.md` file **whole**, verbatim, into `package.skills.entries[]` — matching QACI Duo's own
  Skills-library format exactly — instead of parsing it into the lighter `package.playbooks[]` shape
  (key/name/summary/triggers/instructions only). The real `qaciduo-adlc` package uses only `skills[]`, no
  `playbooks[]` at all, so a worker can now use `skills` alone, `playbooks` alone, or both; it needs at least one.

## 5. Later addition: `workers/adlc.md` and `workers/craft.md` from the real source

A further commit wrote the two workers this was all leading up to, reading the real, already-built
`docs/playbooks/qaciduo-adlc.json` (release 4.0.2) and `qaciduo-app-rebuild.json` (release 1.1.1) found
uncommitted in the `qaci-duo-team-switcher` worktree (`features/dw-team-switcher`) — not the `qaci_duo_v2/qaci-duo`
checkout used for the rest of this branch, which had changed to a branch (`features/dw-update`) that doesn't have
these files at all.

Both workers carry their agents' **real `soul` text verbatim** (ADLC: `pm`/`lead`/`engineer`/`deployer`; App
Rebuild: `analyst`/`engineer`/`checker`/`deployer`), including the `{{agent:<key>}}`/`{{team}}` placeholders the
real app's runtime resolves — which is exactly why every one of those four agents keeps its real key (`pm`, not
something renamed): a soul's self-reference like `Bạn là **{{agent:pm}}**` only resolves correctly if an agent
keyed `pm` actually exists in the package. ADLC's `qaci-data` MCP connection (a real, live
`casanos-connector-prod.ptatien.com` URL, held only by `pm`, not any other agent) and all 20 real skills
(12 `adlc-*` + `deploy-github`/`deploy-railway`, shared byte-for-byte between both workers, + 6 `rebuild-*` for
App Rebuild) came across the same way, as `playbooks/<name>/SKILL.md` files carried via `skills:`, not `playbooks:`
(matching the real packages, which use `skills[]` only).

One necessary compromise: this repository's worker format always makes the worker's own top-level identity
(`id`/`name`/`title`/`description`/`color`) one of the generated package's agents — there is no way to opt out of
that. Since the real ADLC/App Rebuild packages have no such "generic installed identity" (their Chief of Staff,
`pm`/`analyst`, already uses the file's own slug conceptually), `workers/adlc.md`/`workers/craft.md` end up with
**one extra agent beyond the real four** — a nameless "QACI Duo ADLC"/"QACI Duo App Rebuild" wrapper that is
`chiefOfStaff`-overridden away from being the lead and deliberately left out of the shared room's `members`, so it
has no real function. The alternative (reusing the worker's own identity *as* `pm`/`analyst` by renaming that
agent's key to `adlc`/`craft`) was rejected: it would break every `{{agent:pm}}`/`{{agent:analyst}}` self-reference
baked into that agent's own real soul text. Flagging this for the repository owner in case a cleaner resolution
(e.g. letting a worker's top-level identity be purely nominal, with no forced agent of its own, when it declares
`agents`) is wanted later — that would be a further schema change, not done here.

A small, unrelated fix landed alongside this: `validatePlaybook()` no longer caps a playbook *file's* body at
24,000 characters — `adlc-paper-prototype`'s real skill is ~26 KB, which is fine as an embedded `skills:` entry
(capped at 256 KB) but was being rejected by a check that only makes sense for the lightweight `playbooks:` shape
(which still enforces its own real 24,000-character cap, in `validatePackage`, at the point a playbook is actually
used that way).

## 6. Verification

- `npm ci --ignore-scripts` then `npm test` → 4 Digital Workers, 12 playbooks valid, all unit tests pass (including
  two new ones for the multi-agent/rooms/routines extension).
- `npm run build` (unchanged meaning) → builds `dist/` with the renamed format strings; spot-checked
  `dist/catalog.json` (`"format": "qaci-duo.catalog"`) and `dist/teams/literature-scout/team.mausteam.json`
  (`"format": "qaci-duo.team"`).
- `npm run typecheck` (`tsc --noEmit`) → no errors.
- `npm run site:build` (`next build`) → compiles and statically generates `/`, `/methodology`, `/publish`, and
  `/workers/[slug]` for all four real workers, reading them through `lib/repository.ts`. Then ran
  `npm run site:start` and curled `/`, `/workers/literature-scout`, `/methodology` and `/publish` to confirm real
  content renders, and a nonexistent worker route 404s.
- `.github/workflows/validate.yml` (`npm ci --ignore-scripts && npm test && npm run build`) is unchanged and still
  the only thing CI runs; it was not extended to also run `npm run site:build` — that was run manually for this
  verification, not wired into CI, so adding it (and any Next.js-specific CI concerns, like build caching) is left
  for the repository owner to decide.
- Re-run after dropping the four sample workers and adding `workers/adlc.md`/`workers/craft.md`: `npm test` → 2
  Digital Workers, 20 playbooks valid (67 files scanned for secrets, none found in the real Vietnamese soul/skill
  text carried over). `npm run build`, `npm run typecheck` and `npm run site:build` all pass with `/workers/adlc`
  and `/workers/craft` statically generated; `site:start` + curl confirmed both pages render with the real
  content (checked via `validateWorker`/`workerPackage`/`validatePackage` programmatically before writing the
  files, not just by eyeballing them).

# File format

## Playbook — `playbooks/<name>/SKILL.md`

A standard [SKILL.md](https://agentskills.io) with a few extra fields. QACI Duo's Skills library reads each
frontmatter field from **one line**, so do not use YAML lists or multi-line values: separate list items with commas,
and put a value that contains `": "` in double quotes.

| Field | Required | Meaning |
|---|---|---|
| `name` | yes | Equal to the folder name; lowercase letters, digits and single hyphens, at most 64 characters |
| `title` | yes | Display name in QACI Duo, at most 100 characters |
| `description` | yes | One sentence: what the worker achieves and hands back. At most 300 characters |
| `triggers` | yes | 1–30 comma-separated phrases a user would say when they need this playbook |
| `tags` | no | Up to 8 lowercase comma-separated words |
| `license` | yes | For example `MIT` |
| `author` | yes | Person or team that wrote it |
| `compatibility` | no | Environment notes |

The body is the procedure, at most 24,000 characters, with these sections:

| Section | Purpose |
|---|---|
| `# <Title>` and a short intro | The outcome and who it is for |
| `## When to use` | Situations that call for it, and a **Not for:** line pointing to other playbooks |
| `## Inputs` | A table of what to ask before starting, required or not, and defaults |
| `## Procedure` | Numbered steps, each concrete, with a *Check:* line where it matters |
| `## Output` | The exact shape of the result, usually as a Markdown template |
| `## Quality checklist` | Checkboxes the worker runs before handing back |
| `## Guardrails` | **Never** and **Ask first** lists |
| `## Example` | One realistic request and an outline of the response |

CI refuses unknown fields, long base64-like strings, `curl … | sh`, invisible Unicode characters, and anything that
looks like a secret.

## Digital Worker — `workers/<id>.md`

YAML frontmatter followed by a Markdown body.

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Equal to the file name |
| `release` | yes | Semantic version such as `1.0.0`; bump it whenever the worker or one of its playbooks changes |
| `name`, `title` | yes | Worker name and role |
| `tagline` | yes | One sentence, at most 160 characters; shown on the Templates card |
| `description` | yes | What the worker does and never does, at most 2,000 characters; becomes the bot's description |
| `category`, `license`, `author.name` | yes | |
| `color` | yes | `green`, `blue`, `red`, `orange`, `purple`, `cyan`, `pink`, `yellow`, `teal` or `coral` |
| `outcomes` | yes | 1–12 results the user gets |
| `playbooks` | yes | 1–30 folder names from `playbooks/` |
| `apps` | no | Apps the worker can use: `slug`, `label`, `reason`, `optional`. Declared only, never with credentials |
| `tags`, `featured`, `setupMinutes` | no | `featured: true` lists the worker first |

The body needs three sections: `## Mission`, `## Working rules` (including which playbook to use when) and
`## Completion rule`.

### Optional: more than one agent, a shared room, paused routines

A worker is always its own agent (`id`/`name`/`title`/`description`/`color` above). These fields let it carry a
whole small team instead of a single bot. **All of them are optional and purely additive** — a worker file with
none of them behaves exactly as it did before this extension, and every worker in this repository today uses none
of them.

| Field | Required | Meaning |
|---|---|---|
| `agents` | no | Up to 49 extra teammates (50 agents total): `key`, `name`, `title`, `description`, `color`, and an optional `playbooks` subset of this worker's own `playbooks` (defaults to all of them) |
| `chiefOfStaff` | no | The lead agent's key — this worker's own `id`, or one of `agents[].key`. Defaults to this worker's `id` |
| `rooms` | no | Up to 30 shared chat rooms between agents: `key`, `name`, `bulletin`, `members` (agent keys), `defaultResponder` (`{kind: agent, agent: <key>}`, `{kind: everyone}` or `{kind: mentions}`) |
| `routines` | no | Up to 50 scheduled automations: `key`, `name`, `agent`, `prompt`, `runOn` (`duo` or `cloud`), `durationMinutes` (5-240), `schedule` (`{type: daily, time: "HH:MM", weekdays: [0-6]}` or `{type: once, at: <epoch ms>}`), and `enabledAfterInstall: false` — **always `false`**: a routine installs paused and its owner turns it on |

See [`templates/worker.md`](templates/worker.md) for a commented example and
[`schema/worker.schema.json`](schema/worker.schema.json) for the declarative shape.

## Declarative schema

[`schema/worker.schema.json`](schema/worker.schema.json), [`schema/playbook.schema.json`](schema/playbook.schema.json)
and [`schema/package.schema.json`](schema/package.schema.json) describe the shapes above as JSON Schema, for editors
and other tooling. They document the hand-written validators in `scripts/lib.mjs`; that file remains the source of
truth and the only gate CI actually enforces, so treat a difference between the two as a bug in the schema.

## The `library` branch (generated)

After each merge the workflow builds, for every worker, a QACI Duo package v1 file (`packages/<id>.md`, YAML
frontmatter `format: qaci-duo.package` / `version: 1`) whose agents are the worker's own agent plus any `agents` it
declares, carrying the worker's playbooks, with any `rooms` and `routines` it declares. It also writes the
`catalog.json` (`format: qaci-duo.catalog`) that QACI Duo reads, each worker's team manifest
(`teams/<id>/team.mausteam.json`, `format: qaci-duo.team`), and a copy of every `playbooks/<name>/SKILL.md` for
individual import.

> **Format rename.** This repository's package/manifest/catalog format is adapted from the
> [openmausbot-teams](https://github.com/milind-soni/openmausbot-teams) project (MIT); see
> [PORTING_NOTES.md](PORTING_NOTES.md) for the exact old → new discriminator strings and why the real QACI Duo app's
> parser needs updating to read files generated from `main` onward.

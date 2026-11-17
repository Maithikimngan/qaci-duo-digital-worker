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

## The `library` branch (generated)

After each merge the workflow builds, for every worker, a BotMRR Markdown v1 package (`packages/<id>.md`) with one
agent whose skills are the worker's playbooks — no group chat and no routine. It also writes the `catalog.json` that
QACI Duo reads and a copy of every `playbooks/<name>/SKILL.md` for individual import.

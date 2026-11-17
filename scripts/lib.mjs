// Shared rules for QACI Duo Digital Workers and playbooks: parse, validate, scan for secrets and build the library.
// A playbook is one SKILL.md (one capability); a Digital Worker (workers/<id>.md) is one bot that carries playbooks.
// The checks follow QACI Duo's own parsers (shared/skill-md.ts, shared/package-format.ts). The validation approach —
// and the "qaci-duo.package" / "qaci-duo.team" / "qaci-duo.catalog" package format this file reads and writes — is
// adapted from the openmausbot-teams project (https://github.com/milind-soni/openmausbot-teams, MIT), whose own
// discriminator strings ("botmrr", "openmaus.team", "openmaus.catalog") were renamed here; see PORTING_NOTES.md.
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export const REQUIRED_SECTIONS = ["Activation", "Mission", "Outcomes", "Connections", "Team", "Chief of Staff", "Completion rule"];
export const COLORS = new Set(["green", "blue", "red", "orange", "purple", "cyan", "pink", "yellow", "teal", "coral"]);
export const MAX_PACKAGE_BYTES = 1_000_000; // QACI Duo refuses larger playbook files
export const MAX_CATALOG_BYTES = 256_000;
export const PACKAGE_FORMAT = "qaci-duo.package"; // was "botmrr" (bare `botmrr: 1` key) in openmausbot-teams
export const TEAM_FORMAT = "qaci-duo.team"; // was "openmaus.team"
export const CATALOG_FORMAT = "qaci-duo.catalog"; // was "openmaus.catalog"
export const ROUTINE_RUNTIMES = new Set(["duo", "cloud"]); // was ["maus", "cloud"]
const KEY = /^[a-z0-9][a-z0-9_-]*$/;
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const CREDENTIAL_FIELD = /^(token|access[_-]?token|password|passwd|secret|client[_-]?secret|api[_-]?key|credentials?|private[_-]?key)$/i;

const text = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const list = (value, max) => Array.isArray(value) && value.length <= max;

/** The YAML frontmatter and the readable body of a playbook file. */
export function splitPackage(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("the YAML frontmatter between two --- lines is missing at the top of the file");
  let metadata;
  try {
    metadata = parseYaml(match[1]);
  } catch (error) {
    throw new Error(`the YAML frontmatter cannot be read: ${error.message.split("\n")[0]}`);
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error("the YAML frontmatter must be a mapping");
  return { metadata, body: markdown.slice(match[0].length) };
}

function credentialFields(value, path, out) {
  if (Array.isArray(value)) value.forEach((item, index) => credentialFields(item, `${path}[${index}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const at = path ? `${path}.${key}` : key;
      if (CREDENTIAL_FIELD.test(key)) out.push(at);
      credentialFields(child, at, out);
    }
  }
  return out;
}

/** Every reason a playbook file would not install safely in QACI Duo; empty when it is fine. */
export function validatePackage(markdown, slug) {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (Buffer.byteLength(markdown) > MAX_PACKAGE_BYTES) return ["the file is larger than 1 MB"];
  if (!SLUG.test(slug)) fail(`the file name "${slug}.md" must use lowercase letters, digits and hyphens`);
  let pkg;
  let body;
  try {
    ({ metadata: pkg, body } = splitPackage(markdown));
  } catch (error) {
    return [...errors, error.message];
  }
  if (pkg.format !== PACKAGE_FORMAT || pkg.version !== 1) fail(`\`format: ${PACKAGE_FORMAT}\` and \`version: 1\` are required (QACI Duo package v1)`);
  for (const heading of REQUIRED_SECTIONS) {
    if (!new RegExp(`^## ${heading.replace(/ /g, "\\s+")}\\s*$`, "m").test(body)) fail(`the body is missing the \`## ${heading}\` section`);
  }
  for (const field of credentialFields(pkg, "", [])) fail(`the field \`${field}\` looks like a credential; a playbook never carries tokens or passwords`);

  if (pkg.id !== slug) fail(`id must match the file name: \`id: ${slug}\``);
  if (!text(pkg.name, 100)) fail("name is required (at most 100 characters)");
  if (!text(pkg.tagline, 160)) fail("tagline is required (at most 160 characters)");
  if (!text(pkg.summary, 2000)) fail("summary is required (at most 2000 characters)");
  if (!/^\d+\.\d+\.\d+$/.test(String(pkg.release ?? ""))) fail("release must be a semantic version such as 1.0.0");
  if (!text(pkg.category, 80)) fail("category is required");
  if (!text(pkg.author?.name, 100)) fail("author.name is required");
  if (!text(pkg.license, 80)) fail("license is required");
  if (!list(pkg.outcomes, 12) || pkg.outcomes.length === 0 || pkg.outcomes.some((value) => !text(value, 240))) {
    fail("outcomes needs 1-12 lines of at most 240 characters");
  }
  if (!Number.isInteger(pkg.setupMinutes) || pkg.setupMinutes < 1 || pkg.setupMinutes > 240) fail("setupMinutes must be a whole number of minutes from 1 to 240");

  const requirements = pkg.requirements;
  if (!requirements || !list(requirements.apps ?? [], 30) || !list(requirements.capabilities ?? [], 20)) {
    fail("requirements is invalid (at most 30 apps and 20 capabilities)");
  }
  for (const [index, app] of (requirements?.apps ?? []).entries()) {
    if (!text(app?.slug, 80) || !KEY.test(app.slug) || !text(app?.label, 100) || !text(app?.reason, 240)) {
      fail(`requirements.apps[${index}] needs slug, label and reason`);
    }
  }

  if (!Array.isArray(pkg.agents) || pkg.agents.length === 0 || pkg.agents.length > 50) {
    fail("agents needs 1-50 entries");
    return errors;
  }
  const agentKeys = new Set();
  for (const [index, agent] of pkg.agents.entries()) {
    const at = `agents[${index}]`;
    if (!text(agent?.key, 64) || !KEY.test(agent.key)) fail(`${at}.key is invalid`);
    else if (agentKeys.has(agent.key)) fail(`${at}.key bị trùng: ${agent.key}`);
    else agentKeys.add(agent.key);
    if (!text(agent?.name, 100)) fail(`${at}.name is required`);
    if (typeof agent?.title !== "string" || agent.title.length > 200) fail(`${at}.title is required (at most 200 characters)`);
    if (typeof agent?.description !== "string" || agent.description.length > 4000) fail(`${at}.description is required (at most 4000 characters)`);
    if (!COLORS.has(agent?.appearance?.color)) fail(`${at}.appearance.color must be one of: ${[...COLORS].join(", ")}`);
  }
  if (pkg.chiefOfStaff !== undefined && !agentKeys.has(pkg.chiefOfStaff)) fail(`chiefOfStaff "${pkg.chiefOfStaff}" is not an agent key`);

  const playbookKeys = new Set();
  if (!list(pkg.playbooks, 80) || pkg.playbooks.length === 0) fail("playbooks needs 1-80 entries");
  for (const [index, playbook] of (Array.isArray(pkg.playbooks) ? pkg.playbooks : []).entries()) {
    const at = `playbooks[${index}]`;
    if (!text(playbook?.key, 64) || !KEY.test(playbook.key)) fail(`${at}.key is invalid`);
    else if (playbookKeys.has(playbook.key)) fail(`${at}.key bị trùng: ${playbook.key}`);
    else playbookKeys.add(playbook.key);
    if (!text(playbook?.name, 100) || !text(playbook?.summary, 300) || !text(playbook?.instructions, 24_000)) {
      fail(`${at} needs name, summary and instructions`);
    }
    if (!list(playbook?.triggers, 30) || playbook.triggers.length === 0 || playbook.triggers.some((value) => !text(value, 100))) {
      fail(`${at}.triggers needs 1-30 phrases`);
    }
  }
  for (const agent of pkg.agents) {
    for (const key of agent?.playbooks ?? []) {
      if (!playbookKeys.has(key)) fail(`agent ${agent.key} uses playbook "${key}", which is not in playbooks`);
    }
  }

  const roomKeys = new Set();
  if (!list(pkg.rooms ?? [], 30)) fail("rooms allows at most 30 entries");
  for (const [index, room] of (pkg.rooms ?? []).entries()) {
    const at = `rooms[${index}]`;
    if (!text(room?.key, 64) || roomKeys.has(room.key)) fail(`${at}.key is invalid or repeated`);
    else roomKeys.add(room.key);
    if (!text(room?.name, 100) || typeof room?.bulletin !== "string" || room.bulletin.length > 12_000) fail(`${at} needs name and bulletin`);
    if (!list(room?.members, 50) || room.members.length === 0 || room.members.some((key) => !agentKeys.has(key))) {
      fail(`${at}.members names an agent that does not exist`);
    }
    const responder = room?.defaultResponder;
    if (!responder || !["agent", "everyone", "mentions"].includes(responder.kind)) fail(`${at}.defaultResponder.kind must be agent, everyone or mentions`);
    else if (responder.kind === "agent" && !room.members?.includes(responder.agent)) fail(`${at}.defaultResponder must be a member of the room`);
  }

  const routineKeys = new Set();
  if (!list(pkg.routines ?? [], 50)) fail("routines allows at most 50 entries");
  for (const [index, routine] of (pkg.routines ?? []).entries()) {
    const at = `routines[${index}]`;
    if (!text(routine?.key, 64) || !KEY.test(routine.key) || routineKeys.has(routine.key)) fail(`${at}.key is invalid or repeated`);
    else routineKeys.add(routine.key);
    if (!text(routine?.name, 80) || !text(routine?.prompt, 20_000) || !agentKeys.has(routine?.agent)) fail(`${at} needs name, prompt and an existing agent`);
    if (routine?.enabledAfterInstall !== false) fail(`${at}: a routine must install switched off (\`enabledAfterInstall: false\`); its owner turns it on`);
    if (!ROUTINE_RUNTIMES.has(routine?.runOn)) fail(`${at}.runOn must be ${[...ROUTINE_RUNTIMES].join(" or ")}`);
    if (!Number.isInteger(routine?.durationMinutes) || routine.durationMinutes < 5 || routine.durationMinutes > 240) {
      fail(`${at}.durationMinutes must be from 5 to 240`);
    }
    const schedule = routine?.schedule;
    if (schedule?.type === "daily") {
      const days = schedule.weekdays;
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.time ?? "")) fail(`${at}.schedule.time must be HH:MM, for example "09:00"`);
      if (!Array.isArray(days) || days.length === 0 || days.length > 7 || days.some((day) => !Number.isInteger(day) || day < 0 || day > 6) || new Set(days).size !== days.length) {
        fail(`${at}.schedule.weekdays must be distinct numbers 0-6 (0 = Sunday)`);
      }
    } else if (schedule?.type !== "once" || !Number.isInteger(schedule.at)) {
      fail(`${at}.schedule must be daily (time + weekdays) or once (at)`);
    }
  }
  return errors;
}

const SECRET_PATTERNS = [
  ["a private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Anthropic/OpenAI key", /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["Azure key / connection string", /\b(?:AccountKey|SharedAccessKey)=[A-Za-z0-9+/=]{20,}/],
  ["a URL with a password in it", /\bhttps?:\/\/[^\s/:@]+:[^\s/@]+@/],
  ["an assigned password or token", /\b(?:password|passwd|pwd|token|api[_-]?key|secret|mat_?khau)\s*[:=]\s*["']?[A-Za-z0-9+/_\-.]{8,}/i],
];

/** Lines that look like a credential, as {line, label}. */
export function scanSecrets(content) {
  const hits = [];
  content.split(/\r?\n/).forEach((line, index) => {
    for (const [label, pattern] of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        hits.push({ line: index + 1, label });
        break;
      }
    }
  });
  return hits;
}


// ---------------------------------------------------------------------------------------------------------------
// Playbooks: playbooks/<name>/SKILL.md, one capability each.

export const PLAYBOOK_MAX_BYTES = 256 * 1024; // QACI Duo's SKILL.md limit
export const PLAYBOOK_BODY_MAX = 24_000; // a package playbook's instructions limit
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG = /^[a-z0-9][a-z0-9-]{0,23}$/;
const PLAYBOOK_FIELDS = new Set(["name", "title", "description", "triggers", "tags", "license", "author", "compatibility"]);
export const commaList = (value) => String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);

/** The `key: value` lines of a SKILL.md frontmatter, read as QACI Duo's Skills library reads them (one line each). */
export function readSkillFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const fields = {};
  const stray = [];
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) stray.push(line);
    else fields[kv[1].toLowerCase()] = kv[2].trim();
  }
  return { fields, stray, yaml: match[1], body: match[2] ?? "" };
}

/** Every reason a playbook would not import into QACI Duo (as a bot skill or into the Skills library). */
export function validatePlaybook(raw, folder) {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (Buffer.byteLength(raw) > PLAYBOOK_MAX_BYTES) return ["SKILL.md is larger than 256 KB"];
  if (!SKILL_NAME.test(folder) || folder.length > 64) fail(`the folder name "${folder}" must use lowercase letters, digits and single hyphens (at most 64 characters)`);
  const front = readSkillFrontmatter(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
  if (!front) return [...errors, "the frontmatter between two --- lines is missing at the top of SKILL.md"];
  if (front.stray.length) fail("every frontmatter field must sit on one `key: value` line (QACI Duo does not read YAML lists or multi-line values)");
  let parsed;
  try {
    parsed = parseYaml(front.yaml) ?? {};
  } catch (error) {
    return [...errors, `the frontmatter is not valid YAML: ${error.message.split("\n")[0]}; put a value containing ": " in double quotes`];
  }
  for (const [key, value] of Object.entries(parsed)) {
    if (!PLAYBOOK_FIELDS.has(key)) fail(`the field \`${key}\` is not supported; use only: ${[...PLAYBOOK_FIELDS].join(", ")}`);
    else if (typeof value !== "string") fail(`\`${key}\` must be one line of text (separate list items with commas)`);
  }
  const field = (key) => (typeof parsed[key] === "string" ? parsed[key].trim() : "");
  if (field("name") !== folder) fail(`name must match the folder name: \`name: ${folder}\``);
  if (!text(field("title"), 100)) fail("title is required (the display name, at most 100 characters)");
  if (!text(field("description"), 300)) fail("description is required (one sentence, at most 300 characters)");
  const triggers = commaList(field("triggers"));
  if (triggers.length === 0 || triggers.length > 30 || triggers.some((trigger) => trigger.length > 100)) {
    fail("triggers needs 1-30 comma-separated phrases of at most 100 characters");
  }
  const tags = commaList(field("tags"));
  if (tags.length > 8 || tags.some((tag) => !TAG.test(tag))) fail("tags allows at most 8 lowercase comma-separated words");
  if (!text(field("license"), 200)) fail("license is required");
  if (!text(field("author"), 100)) fail("author is required");
  const body = front.body.trim();
  if (body.length < 100) fail("the body must describe the procedure (at least 100 characters)");
  if (body.length > PLAYBOOK_BODY_MAX) fail(`the body allows at most ${PLAYBOOK_BODY_MAX} characters`);
  // QACI Duo shows these to the reviewer as warnings; here they block the merge.
  if (/[A-Za-z0-9+/]{120,}={0,2}/.test(raw)) fail("contains a long base64-like string, a common way to hide instructions");
  if (/\b(curl|wget)\b[^\n]{0,200}\|\s*(ba|z|da)?sh\b/.test(raw)) fail("pipes a download straight into a shell (curl | sh)");
  if (/[​-‏‪-‮⁠-⁤﻿]/.test(raw.slice(1))) fail("contains invisible Unicode characters (zero-width or bidi controls)");
  return errors;
}

/** A valid playbook's fields, as the generated package and the catalog use them. */
export function readPlaybook(raw) {
  const front = readSkillFrontmatter(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
  const meta = parseYaml(front.yaml);
  return {
    name: meta.name.trim(),
    title: meta.title.trim(),
    description: meta.description.trim(),
    triggers: commaList(meta.triggers),
    body: front.body.trim(),
    raw,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Digital Workers: workers/<id>.md, one bot each, carrying playbooks.

export const WORKER_SECTIONS = ["Mission", "Working rules", "Completion rule"];
const WORKER_FIELDS = new Set([
  "id", "release", "name", "title", "tagline", "description", "category", "author", "license", "tags", "color",
  "featured", "outcomes", "setupMinutes", "apps", "playbooks",
  // Optional multi-agent extension (backward compatible: a worker with none of these behaves exactly as before).
  "agents", "chiefOfStaff", "rooms", "routines",
]);

/** The text under one `## heading` of a Markdown body. */
export function section(body, heading) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^##\\s+${heading.replace(/ /g, "\\s+")}\\s*$`).test(line));
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && /^##?\s/.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

/** Every reason a Digital Worker file would not install; `playbookNames` are the playbooks in the repository. */
export function validateWorker(markdown, slug, playbookNames) {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (!SLUG.test(slug)) fail(`the file name "${slug}.md" must use lowercase letters, digits and hyphens`);
  let worker;
  let body;
  try {
    ({ metadata: worker, body } = splitPackage(markdown));
  } catch (error) {
    return [...errors, error.message];
  }
  for (const key of Object.keys(worker)) if (!WORKER_FIELDS.has(key)) fail(`the field \`${key}\` is not supported`);
  for (const at of credentialFields(worker, "", [])) fail(`the field \`${at}\` looks like a credential; a Digital Worker never carries tokens or passwords`);
  for (const heading of WORKER_SECTIONS) if (!section(body, heading)) fail(`the body is missing a non-empty \`## ${heading}\` section`);

  if (worker.id !== slug) fail(`id must match the file name: \`id: ${slug}\``);
  if (!/^\d+\.\d+\.\d+$/.test(String(worker.release ?? ""))) fail("release must be a semantic version such as 1.0.0");
  if (!text(worker.name, 100)) fail("name is required (at most 100 characters)");
  if (!text(worker.title, 200)) fail("title is required (the role, at most 200 characters)");
  if (!text(worker.tagline, 160)) fail("tagline is required (at most 160 characters)");
  if (!text(worker.description, 2000)) fail("description is required (what the worker does and does not do, at most 2000 characters)");
  if (!text(worker.category, 80)) fail("category is required");
  if (!text(worker.author?.name, 100)) fail("author.name is required");
  if (!text(worker.license, 80)) fail("license is required");
  if (worker.tags !== undefined && (!list(worker.tags, 30) || worker.tags.some((tag) => !text(tag, 80)))) fail("tags allows at most 30 entries");
  if (!COLORS.has(worker.color)) fail(`color must be one of: ${[...COLORS].join(", ")}`);
  if (worker.featured !== undefined && typeof worker.featured !== "boolean") fail("featured must be true or false");
  if (!list(worker.outcomes, 12) || worker.outcomes.length === 0 || worker.outcomes.some((value) => !text(value, 240))) {
    fail("outcomes needs 1-12 lines of at most 240 characters");
  }
  if (worker.setupMinutes !== undefined && (!Number.isInteger(worker.setupMinutes) || worker.setupMinutes < 1 || worker.setupMinutes > 240)) {
    fail("setupMinutes must be a whole number of minutes from 1 to 240");
  }
  if (worker.apps !== undefined && !list(worker.apps, 30)) fail("apps allows at most 30 entries");
  for (const [index, app] of (Array.isArray(worker.apps) ? worker.apps : []).entries()) {
    if (!text(app?.slug, 64) || !KEY.test(app.slug) || !text(app?.label, 100) || !text(app?.reason, 240)) fail(`apps[${index}] needs slug, label and reason`);
  }
  if (!list(worker.playbooks, 30) || worker.playbooks.length === 0) fail("playbooks needs 1-30 entries");
  else {
    const seen = new Set();
    for (const name of worker.playbooks) {
      if (seen.has(name)) fail(`playbook "${name}" is listed twice`);
      seen.add(name);
      if (!playbookNames.has(name)) fail(`playbook "${name}" does not exist as playbooks/${name}/SKILL.md`);
    }
  }
  const workerPlaybooks = new Set(Array.isArray(worker.playbooks) ? worker.playbooks : []);

  // Optional multi-agent extension. A worker is always the primary agent `worker.id` (name/title/description/color
  // above); `agents` lists its teammates, `rooms` are shared chat rooms between them, and `routines` are scheduled
  // automations (always installed paused). A worker with none of these fields behaves exactly as before.
  const agentKeys = new Set([worker.id]);
  if (worker.agents !== undefined) {
    if (!list(worker.agents, 49)) fail("agents allows at most 49 teammates in addition to the worker itself (50 agents total)");
    for (const [index, agent] of (Array.isArray(worker.agents) ? worker.agents : []).entries()) {
      const at = `agents[${index}]`;
      if (!text(agent?.key, 64) || !KEY.test(agent.key) || agent.key === worker.id) fail(`${at}.key is invalid`);
      else if (agentKeys.has(agent.key)) fail(`${at}.key is listed twice: ${agent.key}`);
      else agentKeys.add(agent.key);
      if (!text(agent?.name, 100)) fail(`${at}.name is required`);
      if (typeof agent?.title !== "string" || agent.title.length > 200) fail(`${at}.title is required (at most 200 characters)`);
      if (typeof agent?.description !== "string" || agent.description.length > 4000) fail(`${at}.description is required (at most 4000 characters)`);
      if (!COLORS.has(agent?.color)) fail(`${at}.color must be one of: ${[...COLORS].join(", ")}`);
      if (agent?.playbooks !== undefined && (!list(agent.playbooks, 30) || agent.playbooks.some((name) => !workerPlaybooks.has(name)))) {
        fail(`${at}.playbooks must be a subset of this worker's own playbooks`);
      }
    }
  }
  if (worker.chiefOfStaff !== undefined && !agentKeys.has(worker.chiefOfStaff)) fail(`chiefOfStaff "${worker.chiefOfStaff}" is not an agent key`);

  if (worker.rooms !== undefined) {
    if (!list(worker.rooms, 30)) fail("rooms allows at most 30 entries");
    const roomKeys = new Set();
    for (const [index, room] of (Array.isArray(worker.rooms) ? worker.rooms : []).entries()) {
      const at = `rooms[${index}]`;
      if (!text(room?.key, 64) || roomKeys.has(room.key)) fail(`${at}.key is invalid or repeated`);
      else roomKeys.add(room.key);
      if (!text(room?.name, 100) || typeof room?.bulletin !== "string" || room.bulletin.length > 12_000) fail(`${at} needs name and bulletin`);
      if (!list(room?.members, 50) || room.members.length === 0 || room.members.some((key) => !agentKeys.has(key))) {
        fail(`${at}.members names an agent that does not exist`);
      }
      const responder = room?.defaultResponder;
      if (!responder || !["agent", "everyone", "mentions"].includes(responder.kind)) fail(`${at}.defaultResponder.kind must be agent, everyone or mentions`);
      else if (responder.kind === "agent" && !room.members?.includes(responder.agent)) fail(`${at}.defaultResponder must be a member of the room`);
    }
  }

  if (worker.routines !== undefined) {
    if (!list(worker.routines, 50)) fail("routines allows at most 50 entries");
    const routineKeys = new Set();
    for (const [index, routine] of (Array.isArray(worker.routines) ? worker.routines : []).entries()) {
      const at = `routines[${index}]`;
      if (!text(routine?.key, 64) || !KEY.test(routine.key) || routineKeys.has(routine.key)) fail(`${at}.key is invalid or repeated`);
      else routineKeys.add(routine.key);
      if (!text(routine?.name, 80) || !text(routine?.prompt, 20_000) || !agentKeys.has(routine?.agent)) fail(`${at} needs name, prompt and an existing agent`);
      if (routine?.enabledAfterInstall !== false) fail(`${at}: a routine must install switched off (\`enabledAfterInstall: false\`); its owner turns it on`);
      if (!ROUTINE_RUNTIMES.has(routine?.runOn)) fail(`${at}.runOn must be ${[...ROUTINE_RUNTIMES].join(" or ")}`);
      if (!Number.isInteger(routine?.durationMinutes) || routine.durationMinutes < 5 || routine.durationMinutes > 240) {
        fail(`${at}.durationMinutes must be from 5 to 240`);
      }
      const schedule = routine?.schedule;
      if (schedule?.type === "daily") {
        const days = schedule.weekdays;
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.time ?? "")) fail(`${at}.schedule.time must be HH:MM, for example "09:00"`);
        if (!Array.isArray(days) || days.length === 0 || days.length > 7 || days.some((day) => !Number.isInteger(day) || day < 0 || day > 6) || new Set(days).size !== days.length) {
          fail(`${at}.schedule.weekdays must be distinct numbers 0-6 (0 = Sunday)`);
        }
      } else if (schedule?.type !== "once" || !Number.isInteger(schedule.at)) {
        fail(`${at}.schedule must be daily (time + weekdays) or once (at)`);
      }
    }
  }

  return errors;
}

const yamlBlock = (value) => stringifyYaml(value, { lineWidth: 0 }).trimEnd();

/** The QACI Duo package v1 file QACI Duo installs: a worker is one or more agents sharing the worker's playbooks. */
export function workerPackage(markdown, playbooksByName) {
  const { metadata: worker, body } = splitPackage(markdown);
  const playbooks = worker.playbooks.map((name) => playbooksByName.get(name));
  const apps = worker.apps ?? [];
  const extraAgents = worker.agents ?? [];
  const playbooksFor = (agent) => (agent?.playbooks?.length ? agent.playbooks : worker.playbooks);
  const agents = [
    {
      key: worker.id,
      name: worker.name,
      title: worker.title,
      description: worker.description,
      appearance: { color: worker.color },
      playbooks: playbooksFor(undefined),
    },
    ...extraAgents.map((agent) => ({
      key: agent.key,
      name: agent.name,
      title: agent.title,
      description: agent.description,
      appearance: { color: agent.color },
      playbooks: playbooksFor(agent),
    })),
  ];
  const chiefOfStaff = worker.chiefOfStaff ?? worker.id;
  const rooms = (worker.rooms ?? []).map((room) => ({
    key: room.key, name: room.name, members: room.members, bulletin: room.bulletin, defaultResponder: room.defaultResponder,
  }));
  const routines = (worker.routines ?? []).map((routine) => ({
    key: routine.key, name: routine.name, agent: routine.agent, prompt: routine.prompt, runOn: routine.runOn,
    schedule: routine.schedule, durationMinutes: routine.durationMinutes, enabledAfterInstall: false,
  }));
  const pkg = {
    format: PACKAGE_FORMAT,
    version: 1,
    id: worker.id,
    release: String(worker.release),
    name: worker.name,
    tagline: worker.tagline,
    summary: worker.description,
    category: worker.category,
    author: worker.author,
    license: worker.license,
    ...(worker.featured === true ? { featured: true } : {}),
    ...(worker.tags ? { tags: worker.tags } : {}),
    outcomes: worker.outcomes,
    setupMinutes: worker.setupMinutes ?? 5,
    requirements: { apps, capabilities: [], platforms: ["any"] },
    agents,
    chiefOfStaff,
    ...(rooms.length ? { rooms } : {}),
    ...(routines.length ? { routines } : {}),
    playbooks: playbooks.map((playbook) => ({
      key: playbook.name,
      name: playbook.title,
      summary: playbook.description,
      triggers: playbook.triggers,
      instructions: playbook.body,
    })),
  };
  const teamSection = agents.map((agent) => `- **${agent.name} — ${agent.title}.** ${agent.description}`).join("\n");
  const chiefName = agents.find((agent) => agent.key === chiefOfStaff)?.name ?? worker.name;
  const chiefOfStaffSection = agents.length > 1
    ? `\`${chiefOfStaff}\` (${chiefName}) is the Chief of Staff: it takes the request, delegates to the right teammate and returns one answer to the user.`
    : `\`${worker.id}\` (${worker.name}) is the only agent: it takes the request, picks the right playbook and answers the user.`;
  const roomsSection = rooms.length
    ? ["", "## Shared rooms", "", ...rooms.map((room) =>
        `- **${room.name}** (\`${room.key}\`) — members: ${room.members.map((key) => `\`${key}\``).join(", ")}.${room.bulletin ? ` ${room.bulletin}` : ""}`)]
    : [];
  const routinesSection = routines.length
    ? ["", "## Suggested routines", "", ...routines.map((routine) =>
        `- **${routine.name}** (\`${routine.key}\`), owned by \`${routine.agent}\` — installs paused; its owner turns it on.`)]
    : [];
  return [
    "---",
    yamlBlock(pkg),
    "---",
    "",
    `# ${worker.name}`,
    "",
    worker.tagline,
    "",
    `> A QACI Duo Digital Worker, generated from \`workers/${worker.id}.md\` and \`playbooks/*/SKILL.md\`. Do not edit this file; open a pull request against \`main\`.`,
    "",
    "## Activation",
    "",
    section(body, "Working rules"),
    "",
    "## Mission",
    "",
    section(body, "Mission"),
    "",
    "## Outcomes",
    "",
    ...worker.outcomes.map((outcome) => `- ${outcome}`),
    "",
    "## Connections",
    "",
    ...(apps.length ? apps.map((app) => `- **${app.label}**${app.optional ? " (optional)" : ""}: ${app.reason}`) : ["No app connections are needed."]),
    "",
    "## Team",
    "",
    teamSection,
    "",
    "## Chief of Staff",
    "",
    chiefOfStaffSection,
    ...roomsSection,
    ...routinesSection,
    "",
    "## Playbooks",
    "",
    ...playbooks.map((playbook) => `- **${playbook.title}** (\`${playbook.name}\`): ${playbook.description}`),
    "",
    "## Completion rule",
    "",
    section(body, "Completion rule"),
    "",
  ].join("\n");
}

const oneLine = (value, max) => {
  const line = String(value ?? "").replace(/\s+/g, " ").trim();
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
};

/** Everything the team-library catalog expects for one worker: package, team manifest, README, skills. */
export function workerLibraryFiles(markdown, playbooksByName) {
  const { metadata: worker } = splitPackage(markdown);
  const id = worker.id;
  const playbooks = worker.playbooks.map((name) => playbooksByName.get(name));
  const extraAgents = worker.agents ?? [];
  const members = [
    { key: id, name: worker.name, title: worker.title, description: worker.description, appearance: { color: worker.color } },
    ...extraAgents.map((agent) => ({ key: agent.key, name: agent.name, title: agent.title, description: agent.description, appearance: { color: agent.color } })),
  ];
  const chiefOfStaff = worker.chiefOfStaff ?? id;
  const configuredRoom = (worker.rooms ?? [])[0];
  const room = configuredRoom
    ? {
        name: configuredRoom.name,
        bulletin: configuredRoom.bulletin,
        defaultResponder: configuredRoom.defaultResponder.kind === "agent"
          ? { kind: "member", member: configuredRoom.defaultResponder.agent }
          : { kind: configuredRoom.defaultResponder.kind },
      }
    : { name: worker.name, bulletin: "", defaultResponder: { kind: "member", member: chiefOfStaff } };
  const manifest = {
    format: TEAM_FORMAT,
    version: 1,
    team: { name: worker.name, description: oneLine(worker.tagline, 500), members, room },
  };
  const skills = playbooks.map((playbook) => ({ path: `teams/${id}/skills/${playbook.name}/SKILL.md`, content: playbook.raw }));
  const readme = [
    `# ${worker.name}`,
    "",
    `**${worker.title}.** ${worker.tagline}`,
    "",
    worker.description,
    "",
    "## Playbook",
    "",
    ...playbooks.map((playbook) => `- **${playbook.title}** — ${playbook.description} ([SKILL.md](../../playbooks/${playbook.name}/SKILL.md))`),
    "",
    `Source: \`workers/${id}.md\` on \`main\`.`,
    "",
  ].join("\n");
  const entry = {
    slug: id,
    name: worker.name,
    summary: oneLine(worker.tagline, 300),
    category: worker.category,
    // No `outcome`: the Templates card then shows the summary, which is the worker's tagline.
    setupMinutes: worker.setupMinutes ?? 5,
    ...(worker.featured === true ? { featured: true } : {}),
    package: `packages/${id}.md`,
    manifest: `teams/${id}/team.mausteam.json`,
    readme: `teams/${id}/README.md`,
    members: members.length,
    skills: skills.map((skill) => skill.path),
    requires: { apps: (worker.apps ?? []).map((app) => app.label) },
  };
  return {
    entry,
    files: [
      { path: entry.package, content: workerPackage(markdown, playbooksByName) },
      { path: entry.manifest, content: `${JSON.stringify(manifest, null, 2)}\n` },
      { path: entry.readme, content: readme },
      ...skills,
    ],
  };
}

/** The catalog QACI Duo reads, workers ordered featured first, then by name. */
export function buildCatalog(entries) {
  const teams = [...entries].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
  return { format: CATALOG_FORMAT, version: 1, teams };
}

const ALLOWED_FILES = [
  /^workers\/[a-z0-9][a-z0-9-]*\.md$/,
  /^playbooks\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/,
  /^templates\/(?:worker\.md|playbook\/SKILL\.md)$/,
  /^scripts\/[a-z0-9-]+\.mjs$/,
  /^tests\/[a-z0-9.-]+\.mjs$/,
  // Declarative JSON Schema documenting the hand-written validators above; see PORTING_NOTES.md.
  /^schema\/[a-z0-9.-]+\.schema\.json$/,
  /^\.github\/(?:CODEOWNERS|PULL_REQUEST_TEMPLATE\.md|workflows\/[a-z0-9-]+\.yml|ISSUE_TEMPLATE\/[a-z0-9-]+\.yml)$/,
  /^(?:README|CONTRIBUTING|FORMAT|SECURITY|PORTING_NOTES)\.md$/,
  /^(?:LICENSE|package\.json|package-lock\.json|\.gitignore|next\.config\.ts|tsconfig\.json|next-env\.d\.ts)$/,
  // The public browsing website (Next.js App Router); see PORTING_NOTES.md.
  /^app\/(?:[a-z0-9_.[\]-]+\/)*[a-z0-9_.[\]-]+\.(?:tsx|ts|css|svg)$/,
  /^components\/[A-Za-z0-9.-]+\.tsx$/,
  /^lib\/[a-z0-9.-]+\.ts$/,
];

/** Files a pull request may not add: anything outside the known layout (binaries, scripts beside a playbook, …). */
export function disallowedFiles(paths) {
  return paths.filter((path) => !ALLOWED_FILES.some((pattern) => pattern.test(path)));
}

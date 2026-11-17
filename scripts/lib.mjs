// Shared rules for QACI Duo Digital Workers and playbooks: parse, validate, scan for secrets and build the library.
// A playbook is one SKILL.md (one capability); a Digital Worker (workers/<id>.md) is one bot that carries playbooks.
// The checks follow QACI Duo's own parsers (shared/skill-md.ts, shared/package-format.ts) and the validator of
// github.com/milind-soni/openmausbot-teams (MIT), so a file that passes here imports in the app.
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export const REQUIRED_SECTIONS = ["Activation", "Mission", "Outcomes", "Connections", "Team", "Chief of Staff", "Completion rule"];
export const COLORS = new Set(["green", "blue", "red", "orange", "purple", "cyan", "pink", "yellow", "teal", "coral"]);
export const MAX_PACKAGE_BYTES = 1_000_000; // QACI Duo refuses larger playbook files
export const MAX_CATALOG_BYTES = 256_000;
const KEY = /^[a-z0-9][a-z0-9_-]*$/;
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const CREDENTIAL_FIELD = /^(token|access[_-]?token|password|passwd|secret|client[_-]?secret|api[_-]?key|credentials?|private[_-]?key)$/i;

const text = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const list = (value, max) => Array.isArray(value) && value.length <= max;

/** The YAML frontmatter and the readable body of a playbook file. */
export function splitPackage(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("thiếu phần YAML (frontmatter) giữa hai dòng --- ở đầu file");
  let metadata;
  try {
    metadata = parseYaml(match[1]);
  } catch (error) {
    throw new Error(`phần YAML không đọc được: ${error.message.split("\n")[0]}`);
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error("phần YAML phải là một object");
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
  if (Buffer.byteLength(markdown) > MAX_PACKAGE_BYTES) return ["file lớn hơn 1 MB"];
  if (!SLUG.test(slug)) fail(`tên file "${slug}.md" phải là chữ thường, số và dấu gạch ngang`);
  let pkg;
  let body;
  try {
    ({ metadata: pkg, body } = splitPackage(markdown));
  } catch (error) {
    return [...errors, error.message];
  }
  if (pkg.botmrr !== 1) fail("thiếu dòng `botmrr: 1` (định dạng BotMRR Markdown v1)");
  for (const heading of REQUIRED_SECTIONS) {
    if (!new RegExp(`^## ${heading.replace(/ /g, "\\s+")}\\s*$`, "m").test(body)) fail(`thiếu mục \`## ${heading}\` trong phần thân`);
  }
  for (const field of credentialFields(pkg, "", [])) fail(`trường \`${field}\` trông như thông tin đăng nhập; playbook không được mang token hay mật khẩu`);

  if (pkg.id !== slug) fail(`id phải trùng tên file: \`id: ${slug}\``);
  if (!text(pkg.name, 100)) fail("name là bắt buộc (tối đa 100 ký tự)");
  if (!text(pkg.tagline, 160)) fail("tagline là bắt buộc (tối đa 160 ký tự)");
  if (!text(pkg.summary, 2000)) fail("summary là bắt buộc (tối đa 2000 ký tự)");
  if (!/^\d+\.\d+\.\d+$/.test(String(pkg.release ?? ""))) fail("release phải theo dạng 1.0.0");
  if (!text(pkg.category, 80)) fail("category là bắt buộc");
  if (!text(pkg.author?.name, 100)) fail("author.name là bắt buộc");
  if (!text(pkg.license, 80)) fail("license là bắt buộc");
  if (!list(pkg.outcomes, 12) || pkg.outcomes.length === 0 || pkg.outcomes.some((value) => !text(value, 240))) {
    fail("outcomes cần 1-12 dòng, mỗi dòng tối đa 240 ký tự");
  }
  if (!Number.isInteger(pkg.setupMinutes) || pkg.setupMinutes < 1 || pkg.setupMinutes > 240) fail("setupMinutes phải là số phút từ 1 đến 240");

  const requirements = pkg.requirements;
  if (!requirements || !list(requirements.apps ?? [], 30) || !list(requirements.capabilities ?? [], 20)) {
    fail("requirements không hợp lệ (apps tối đa 30, capabilities tối đa 20)");
  }
  for (const [index, app] of (requirements?.apps ?? []).entries()) {
    if (!text(app?.slug, 80) || !KEY.test(app.slug) || !text(app?.label, 100) || !text(app?.reason, 240)) {
      fail(`requirements.apps[${index}] cần slug, label và reason`);
    }
  }

  if (!Array.isArray(pkg.agents) || pkg.agents.length === 0 || pkg.agents.length > 50) {
    fail("agents cần 1-50 DW");
    return errors;
  }
  const agentKeys = new Set();
  for (const [index, agent] of pkg.agents.entries()) {
    const at = `agents[${index}]`;
    if (!text(agent?.key, 64) || !KEY.test(agent.key)) fail(`${at}.key không hợp lệ`);
    else if (agentKeys.has(agent.key)) fail(`${at}.key bị trùng: ${agent.key}`);
    else agentKeys.add(agent.key);
    if (!text(agent?.name, 100)) fail(`${at}.name là bắt buộc`);
    if (typeof agent?.title !== "string" || agent.title.length > 200) fail(`${at}.title là bắt buộc (tối đa 200 ký tự)`);
    if (typeof agent?.description !== "string" || agent.description.length > 4000) fail(`${at}.description là bắt buộc (tối đa 4000 ký tự)`);
    if (!COLORS.has(agent?.appearance?.color)) fail(`${at}.appearance.color phải là một trong: ${[...COLORS].join(", ")}`);
  }
  if (pkg.chiefOfStaff !== undefined && !agentKeys.has(pkg.chiefOfStaff)) fail(`chiefOfStaff "${pkg.chiefOfStaff}" không phải key của DW nào`);

  const playbookKeys = new Set();
  if (!list(pkg.playbooks, 80) || pkg.playbooks.length === 0) fail("playbooks cần ít nhất 1 quy trình (tối đa 80)");
  for (const [index, playbook] of (Array.isArray(pkg.playbooks) ? pkg.playbooks : []).entries()) {
    const at = `playbooks[${index}]`;
    if (!text(playbook?.key, 64) || !KEY.test(playbook.key)) fail(`${at}.key không hợp lệ`);
    else if (playbookKeys.has(playbook.key)) fail(`${at}.key bị trùng: ${playbook.key}`);
    else playbookKeys.add(playbook.key);
    if (!text(playbook?.name, 100) || !text(playbook?.summary, 300) || !text(playbook?.instructions, 24_000)) {
      fail(`${at} cần name, summary và instructions`);
    }
    if (!list(playbook?.triggers, 30) || playbook.triggers.length === 0 || playbook.triggers.some((value) => !text(value, 100))) {
      fail(`${at}.triggers cần 1-30 cụm từ`);
    }
  }
  for (const agent of pkg.agents) {
    for (const key of agent?.playbooks ?? []) {
      if (!playbookKeys.has(key)) fail(`DW ${agent.key} dùng playbook "${key}" không có trong playbooks`);
    }
  }

  const roomKeys = new Set();
  if (!list(pkg.rooms ?? [], 30)) fail("rooms tối đa 30 phòng");
  for (const [index, room] of (pkg.rooms ?? []).entries()) {
    const at = `rooms[${index}]`;
    if (!text(room?.key, 64) || roomKeys.has(room.key)) fail(`${at}.key không hợp lệ hoặc bị trùng`);
    else roomKeys.add(room.key);
    if (!text(room?.name, 100) || typeof room?.bulletin !== "string" || room.bulletin.length > 12_000) fail(`${at} cần name và bulletin`);
    if (!list(room?.members, 50) || room.members.length === 0 || room.members.some((key) => !agentKeys.has(key))) {
      fail(`${at}.members có DW không tồn tại`);
    }
    const responder = room?.defaultResponder;
    if (!responder || !["agent", "everyone", "mentions"].includes(responder.kind)) fail(`${at}.defaultResponder.kind phải là agent, everyone hoặc mentions`);
    else if (responder.kind === "agent" && !room.members?.includes(responder.agent)) fail(`${at}.defaultResponder phải là thành viên của phòng`);
  }

  const routineKeys = new Set();
  if (!list(pkg.routines ?? [], 50)) fail("routines tối đa 50 lịch chạy");
  for (const [index, routine] of (pkg.routines ?? []).entries()) {
    const at = `routines[${index}]`;
    if (!text(routine?.key, 64) || !KEY.test(routine.key) || routineKeys.has(routine.key)) fail(`${at}.key không hợp lệ hoặc bị trùng`);
    else routineKeys.add(routine.key);
    if (!text(routine?.name, 80) || !text(routine?.prompt, 20_000) || !agentKeys.has(routine?.agent)) fail(`${at} cần name, prompt và agent có thật`);
    if (routine?.enabledAfterInstall !== false) fail(`${at}: lịch chạy phải tắt khi cài (\`enabledAfterInstall: false\`); chủ của DW tự bật`);
    if (!["maus", "cloud"].includes(routine?.runOn)) fail(`${at}.runOn phải là maus hoặc cloud`);
    if (!Number.isInteger(routine?.durationMinutes) || routine.durationMinutes < 5 || routine.durationMinutes > 240) {
      fail(`${at}.durationMinutes phải từ 5 đến 240`);
    }
    const schedule = routine?.schedule;
    if (schedule?.type === "daily") {
      const days = schedule.weekdays;
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.time ?? "")) fail(`${at}.schedule.time phải dạng HH:MM, ví dụ "09:00"`);
      if (!Array.isArray(days) || days.length === 0 || days.length > 7 || days.some((day) => !Number.isInteger(day) || day < 0 || day > 6) || new Set(days).size !== days.length) {
        fail(`${at}.schedule.weekdays là các số 0-6 không trùng (0 = Chủ nhật)`);
      }
    } else if (schedule?.type !== "once" || !Number.isInteger(schedule.at)) {
      fail(`${at}.schedule phải là daily (time + weekdays) hoặc once (at)`);
    }
  }
  return errors;
}

const SECRET_PATTERNS = [
  ["khóa riêng (private key)", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Anthropic/OpenAI key", /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["Azure key / connection string", /\b(?:AccountKey|SharedAccessKey)=[A-Za-z0-9+/=]{20,}/],
  ["URL có kèm mật khẩu", /\bhttps?:\/\/[^\s/:@]+:[^\s/@]+@/],
  ["mật khẩu hoặc token gán giá trị", /\b(?:password|passwd|pwd|token|api[_-]?key|secret|mat_?khau)\s*[:=]\s*["']?[A-Za-z0-9+/_\-.]{8,}/i],
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
  if (Buffer.byteLength(raw) > PLAYBOOK_MAX_BYTES) return ["SKILL.md lớn hơn 256 KB"];
  if (!SKILL_NAME.test(folder) || folder.length > 64) fail(`tên thư mục "${folder}" phải là chữ thường, số và dấu gạch ngang (tối đa 64 ký tự)`);
  const front = readSkillFrontmatter(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
  if (!front) return [...errors, "thiếu phần frontmatter giữa hai dòng --- ở đầu SKILL.md"];
  if (front.stray.length) fail("mỗi trường trong frontmatter phải nằm trên một dòng `khoa: gia tri` (QACI Duo không đọc danh sách hay giá trị nhiều dòng)");
  let parsed;
  try {
    parsed = parseYaml(front.yaml) ?? {};
  } catch (error) {
    return [...errors, `frontmatter không đọc được như YAML: ${error.message.split("\n")[0]}; đặt giá trị có dấu ": " trong dấu nháy kép`];
  }
  for (const [key, value] of Object.entries(parsed)) {
    if (!PLAYBOOK_FIELDS.has(key)) fail(`trường \`${key}\` không được hỗ trợ; chỉ dùng: ${[...PLAYBOOK_FIELDS].join(", ")}`);
    else if (typeof value !== "string") fail(`\`${key}\` phải là một dòng chữ (danh sách thì cách nhau bằng dấu phẩy)`);
  }
  const field = (key) => (typeof parsed[key] === "string" ? parsed[key].trim() : "");
  if (field("name") !== folder) fail(`name phải trùng tên thư mục: \`name: ${folder}\``);
  if (!text(field("title"), 100)) fail("title là bắt buộc (tên hiển thị, tối đa 100 ký tự)");
  if (!text(field("description"), 300)) fail("description là bắt buộc (một câu, tối đa 300 ký tự)");
  const triggers = commaList(field("triggers"));
  if (triggers.length === 0 || triggers.length > 30 || triggers.some((trigger) => trigger.length > 100)) {
    fail("triggers cần 1-30 cụm từ cách nhau bằng dấu phẩy, mỗi cụm tối đa 100 ký tự");
  }
  const tags = commaList(field("tags"));
  if (tags.length > 8 || tags.some((tag) => !TAG.test(tag))) fail("tags tối đa 8 từ chữ thường, cách nhau bằng dấu phẩy");
  if (!text(field("license"), 200)) fail("license là bắt buộc");
  if (!text(field("author"), 100)) fail("author là bắt buộc");
  const body = front.body.trim();
  if (body.length < 100) fail("phần thân cần mô tả quy trình (ít nhất 100 ký tự)");
  if (body.length > PLAYBOOK_BODY_MAX) fail(`phần thân tối đa ${PLAYBOOK_BODY_MAX} ký tự`);
  // QACI Duo shows these to the reviewer as warnings; here they block the merge.
  if (/[A-Za-z0-9+/]{120,}={0,2}/.test(raw)) fail("có chuỗi giống base64 dài, cách thường dùng để giấu chỉ dẫn");
  if (/\b(curl|wget)\b[^\n]{0,200}\|\s*(ba|z|da)?sh\b/.test(raw)) fail("tải file rồi chạy thẳng bằng shell (curl | sh)");
  if (/[​-‏‪-‮⁠-⁤﻿]/.test(raw.slice(1))) fail("có ký tự Unicode vô hình (zero-width hoặc bidi)");
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
  if (!SLUG.test(slug)) fail(`tên file "${slug}.md" phải là chữ thường, số và dấu gạch ngang`);
  let worker;
  let body;
  try {
    ({ metadata: worker, body } = splitPackage(markdown));
  } catch (error) {
    return [...errors, error.message];
  }
  for (const key of Object.keys(worker)) if (!WORKER_FIELDS.has(key)) fail(`trường \`${key}\` không được hỗ trợ`);
  for (const at of credentialFields(worker, "", [])) fail(`trường \`${at}\` trông như thông tin đăng nhập; DW không được mang token hay mật khẩu`);
  for (const heading of WORKER_SECTIONS) if (!section(body, heading)) fail(`thiếu mục \`## ${heading}\` (có nội dung) trong phần thân`);

  if (worker.id !== slug) fail(`id phải trùng tên file: \`id: ${slug}\``);
  if (!/^\d+\.\d+\.\d+$/.test(String(worker.release ?? ""))) fail("release phải theo dạng 1.0.0");
  if (!text(worker.name, 100)) fail("name là bắt buộc (tối đa 100 ký tự)");
  if (!text(worker.title, 200)) fail("title là bắt buộc (vai trò, tối đa 200 ký tự)");
  if (!text(worker.tagline, 160)) fail("tagline là bắt buộc (tối đa 160 ký tự)");
  if (!text(worker.description, 2000)) fail("description là bắt buộc (DW làm gì và không làm gì, tối đa 2000 ký tự)");
  if (!text(worker.category, 80)) fail("category là bắt buộc");
  if (!text(worker.author?.name, 100)) fail("author.name là bắt buộc");
  if (!text(worker.license, 80)) fail("license là bắt buộc");
  if (worker.tags !== undefined && (!list(worker.tags, 30) || worker.tags.some((tag) => !text(tag, 80)))) fail("tags tối đa 30 từ");
  if (!COLORS.has(worker.color)) fail(`color phải là một trong: ${[...COLORS].join(", ")}`);
  if (worker.featured !== undefined && typeof worker.featured !== "boolean") fail("featured là true hoặc false");
  if (!list(worker.outcomes, 12) || worker.outcomes.length === 0 || worker.outcomes.some((value) => !text(value, 240))) {
    fail("outcomes cần 1-12 dòng, mỗi dòng tối đa 240 ký tự");
  }
  if (worker.setupMinutes !== undefined && (!Number.isInteger(worker.setupMinutes) || worker.setupMinutes < 1 || worker.setupMinutes > 240)) {
    fail("setupMinutes phải là số phút từ 1 đến 240");
  }
  if (worker.apps !== undefined && !list(worker.apps, 30)) fail("apps tối đa 30 ứng dụng");
  for (const [index, app] of (Array.isArray(worker.apps) ? worker.apps : []).entries()) {
    if (!text(app?.slug, 64) || !KEY.test(app.slug) || !text(app?.label, 100) || !text(app?.reason, 240)) fail(`apps[${index}] cần slug, label và reason`);
  }
  if (!list(worker.playbooks, 30) || worker.playbooks.length === 0) fail("playbooks cần 1-30 playbook");
  else {
    const seen = new Set();
    for (const name of worker.playbooks) {
      if (seen.has(name)) fail(`playbook "${name}" bị lặp`);
      seen.add(name);
      if (!playbookNames.has(name)) fail(`playbook "${name}" không có trong playbooks/${name}/SKILL.md`);
    }
  }
  return errors;
}

const yamlBlock = (value) => stringifyYaml(value, { lineWidth: 0 }).trimEnd();

/** The BotMRR Markdown v1 file QACI Duo installs: one bot whose skills are the worker's playbooks. */
export function workerPackage(markdown, playbooksByName) {
  const { metadata: worker, body } = splitPackage(markdown);
  const playbooks = worker.playbooks.map((name) => playbooksByName.get(name));
  const apps = worker.apps ?? [];
  const pkg = {
    botmrr: 1,
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
    agents: [{
      key: worker.id,
      name: worker.name,
      title: worker.title,
      description: worker.description,
      appearance: { color: worker.color },
      playbooks: playbooks.map((playbook) => playbook.name),
    }],
    chiefOfStaff: worker.id,
    playbooks: playbooks.map((playbook) => ({
      key: playbook.name,
      name: playbook.title,
      summary: playbook.description,
      triggers: playbook.triggers,
      instructions: playbook.body,
    })),
  };
  return [
    "---",
    yamlBlock(pkg),
    "---",
    "",
    `# ${worker.name}`,
    "",
    worker.tagline,
    "",
    `> Digital Worker của QACI Duo, sinh tự động từ \`workers/${worker.id}.md\` và \`playbooks/*/SKILL.md\`. Đừng sửa file này; mở pull request vào \`main\`.`,
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
    ...(apps.length ? apps.map((app) => `- **${app.label}**${app.optional ? " (tùy chọn)" : ""}: ${app.reason}`) : ["Không cần kết nối ứng dụng."]),
    "",
    "## Team",
    "",
    `- **${worker.name} — ${worker.title}.** ${worker.description}`,
    "",
    "## Chief of Staff",
    "",
    `\`${worker.id}\` (${worker.name}) là DW duy nhất: nhận việc, chọn playbook phù hợp và trả lời người dùng.`,
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

/** Everything the team-library catalog expects for one worker: package, legacy team file, README, skills. */
export function workerLibraryFiles(markdown, playbooksByName) {
  const { metadata: worker } = splitPackage(markdown);
  const id = worker.id;
  const playbooks = worker.playbooks.map((name) => playbooksByName.get(name));
  const manifest = {
    format: "openmaus.team",
    version: 1,
    team: {
      name: worker.name,
      description: oneLine(worker.tagline, 500),
      members: [{ key: id, name: worker.name, title: worker.title, description: worker.description, appearance: { color: worker.color } }],
      room: { name: worker.name, bulletin: "", defaultResponder: { kind: "member", member: id } },
    },
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
    `Nguồn: \`workers/${id}.md\` trên nhánh \`main\`.`,
    "",
  ].join("\n");
  const entry = {
    slug: id,
    name: worker.name,
    summary: oneLine(worker.tagline, 300),
    category: worker.category,
    outcome: oneLine(worker.outcomes[0], 300),
    setupMinutes: worker.setupMinutes ?? 5,
    ...(worker.featured === true ? { featured: true } : {}),
    package: `packages/${id}.md`,
    manifest: `teams/${id}/team.mausteam.json`,
    readme: `teams/${id}/README.md`,
    members: 1,
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
  return { format: "openmaus.catalog", version: 1, teams };
}

const ALLOWED_FILES = [
  /^workers\/[a-z0-9][a-z0-9-]*\.md$/,
  /^playbooks\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/,
  /^templates\/(?:worker\.md|playbook\/SKILL\.md)$/,
  /^scripts\/[a-z0-9-]+\.mjs$/,
  /^tests\/[a-z0-9.-]+\.mjs$/,
  /^\.github\/(?:CODEOWNERS|PULL_REQUEST_TEMPLATE\.md|workflows\/[a-z0-9-]+\.yml|ISSUE_TEMPLATE\/[a-z0-9-]+\.yml)$/,
  /^(?:README|CONTRIBUTING|FORMAT|SECURITY)\.md$/,
  /^(?:LICENSE|package\.json|package-lock\.json|\.gitignore)$/,
];

/** Files a pull request may not add: anything outside the known layout (binaries, scripts beside a playbook, …). */
export function disallowedFiles(paths) {
  return paths.filter((path) => !ALLOWED_FILES.some((pattern) => pattern.test(path)));
}

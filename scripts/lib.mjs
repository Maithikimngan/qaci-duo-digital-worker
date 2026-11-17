// Shared rules for QACI Duo playbooks: parse, validate, scan for secrets and build the published library.
// The package checks follow QACI Duo's own BotMRR Markdown v1 parser (shared/package-format.ts) and the
// validator of github.com/milind-soni/openmausbot-teams (MIT), so a file that passes here installs in the app.
import { parse as parseYaml } from "yaml";

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

const ALLOWED_FILES = [
  /^packages\/[a-z0-9][a-z0-9-]*\.md$/,
  /^templates\/[a-z0-9-]+\.md$/,
  /^scripts\/[a-z0-9-]+\.mjs$/,
  /^tests\/[a-z0-9.-]+\.mjs$/,
  /^\.github\/(?:CODEOWNERS|PULL_REQUEST_TEMPLATE\.md|workflows\/[a-z0-9-]+\.yml|ISSUE_TEMPLATE\/[a-z0-9-]+\.yml)$/,
  /^(?:README|CONTRIBUTING|FORMAT|SECURITY)\.md$/,
  /^(?:LICENSE|package\.json|package-lock\.json|\.gitignore)$/,
];

/** Files a pull request may not add: anything outside the known layout (binaries, scripts in packages/, …). */
export function disallowedFiles(paths) {
  return paths.filter((path) => !ALLOWED_FILES.some((pattern) => pattern.test(path)));
}

const yamlString = (value) => JSON.stringify(String(value).replace(/\s+/g, " ").trim());
const oneLine = (value, max) => {
  const line = String(value ?? "").replace(/\s+/g, " ").trim();
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
};

/** The legacy team file, README and one SKILL.md per playbook that the team-library catalog expects. */
export function libraryFiles(slug, markdown) {
  const { metadata: pkg } = splitPackage(markdown);
  const chief = pkg.chiefOfStaff ?? pkg.agents[0].key;
  const room = pkg.rooms?.[0];
  const manifest = {
    format: "openmaus.team",
    version: 1,
    team: {
      name: pkg.name,
      description: oneLine(pkg.tagline, 500),
      members: pkg.agents.map((agent) => ({
        key: agent.key,
        name: agent.name,
        title: agent.title ?? "",
        description: agent.description ?? "",
        appearance: { color: agent.appearance.color, ...(agent.appearance.mascotExpression ? { mascotExpression: agent.appearance.mascotExpression } : {}) },
      })),
      room: {
        name: room?.name ?? pkg.name,
        bulletin: room?.bulletin ?? "",
        defaultResponder: { kind: "member", member: chief },
      },
    },
  };
  const skills = pkg.playbooks.map((playbook) => ({
    path: `teams/${slug}/skills/${playbook.key}/SKILL.md`,
    content: [
      "---",
      `name: ${playbook.key}`,
      `description: ${yamlString(playbook.summary)}`,
      "---",
      "",
      `# ${playbook.name}`,
      "",
      "## Use this when",
      "",
      ...playbook.triggers.map((trigger) => `- ${trigger}`),
      "",
      "## Process",
      "",
      playbook.instructions.trim(),
      "",
    ].join("\n"),
  }));
  const owner = (key) => pkg.agents.find((agent) => agent.key === key)?.name ?? key;
  const readme = [
    `# ${pkg.name}`,
    "",
    pkg.tagline,
    "",
    pkg.summary,
    "",
    "## DW trong team",
    "",
    ...pkg.agents.map((agent) => `- **${agent.name}**${agent.title ? ` — ${agent.title}` : ""}${agent.key === chief ? " (Chief of Staff)" : ""}`),
    "",
    "## Playbook",
    "",
    ...pkg.playbooks.map((playbook) => `- **${playbook.name}:** ${playbook.summary}`),
    "",
    ...(pkg.routines?.length
      ? ["## Lịch chạy gợi ý", "", ...pkg.routines.map((routine) => `- **${routine.name}** (${owner(routine.agent)}): tắt khi cài, chủ của DW tự bật.`), ""]
      : []),
    "## Kết nối",
    "",
    ...((pkg.requirements?.apps ?? []).length
      ? pkg.requirements.apps.map((app) => `- **${app.label}**${app.optional ? " (tùy chọn)" : ""}: ${app.reason}`)
      : ["Không cần kết nối ứng dụng."]),
    "",
    `Nguồn: [packages/${slug}.md](../../packages/${slug}.md)`,
    "",
  ].join("\n");
  const entry = {
    slug,
    name: pkg.name,
    summary: oneLine(pkg.tagline, 300),
    category: pkg.category,
    outcome: oneLine(pkg.outcomes[0], 300),
    setupMinutes: pkg.setupMinutes,
    ...(pkg.featured === true ? { featured: true } : {}),
    package: `packages/${slug}.md`,
    manifest: `teams/${slug}/team.mausteam.json`,
    readme: `teams/${slug}/README.md`,
    members: pkg.agents.length,
    skills: skills.map((skill) => skill.path),
    requires: { apps: (pkg.requirements?.apps ?? []).map((app) => app.label) },
  };
  return {
    entry,
    files: [
      { path: `packages/${slug}.md`, content: markdown },
      { path: entry.manifest, content: `${JSON.stringify(manifest, null, 2)}\n` },
      { path: entry.readme, content: readme },
      ...skills,
    ],
  };
}

/** The catalog QACI Duo reads, teams ordered featured first, then by name. */
export function buildCatalog(entries) {
  const teams = [...entries].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
  return { format: "openmaus.catalog", version: 1, teams };
}

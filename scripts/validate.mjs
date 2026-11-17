// npm test: checks every playbook and Digital Worker, the repository layout, secrets, and the library to publish.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MAX_CATALOG_BYTES, buildCatalog, disallowedFiles, readPlaybook, scanSecrets, splitPackage, validatePackage, validatePlaybook, validateWorker, workerLibraryFiles, workerPackage } from "./lib.mjs";
import { loadRepository } from "./repo.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function trackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch {
    const workers = readdirSync(join(root, "workers")).map((name) => `workers/${name}`);
    const playbooks = readdirSync(join(root, "playbooks")).map((name) => `playbooks/${name}/SKILL.md`);
    return [...workers, ...playbooks];
  }
}

const files = trackedFiles();
for (const path of disallowedFiles(files)) {
  errors.push(`${path}: file này không được phép (DW nằm ở workers/<id>.md, playbook ở playbooks/<ten>/SKILL.md)`);
}
for (const path of files) {
  let content;
  try {
    content = readFileSync(join(root, path), "utf8");
  } catch {
    continue;
  }
  if (content.includes("\0")) {
    errors.push(`${path}: file nhị phân không được phép`);
    continue;
  }
  for (const hit of scanSecrets(content)) errors.push(`${path}:${hit.line}: trông như ${hit.label}; xoá nó và dùng kết nối ứng dụng của QACI Duo`);
}

const { playbooks, workers, errors: contentErrors } = loadRepository(root, files);
errors.push(...contentErrors);

// The templates must stay valid so a contributor always starts from a file that passes.
const templatePlaybook = readFileSync(join(root, "templates/playbook/SKILL.md"), "utf8");
for (const problem of validatePlaybook(templatePlaybook, "ten-playbook")) errors.push(`templates/playbook/SKILL.md: ${problem}`);
const templateWorker = readFileSync(join(root, "templates/worker.md"), "utf8");
const templateProblems = validateWorker(templateWorker, "ten-dw", new Set(["ten-playbook"]));
for (const problem of templateProblems) errors.push(`templates/worker.md: ${problem}`);
if (templateProblems.length === 0 && errors.every((error) => !error.startsWith("templates/playbook"))) {
  const generated = workerPackage(templateWorker, new Map([["ten-playbook", readPlaybook(templatePlaybook)]]));
  for (const problem of validatePackage(generated, "ten-dw")) errors.push(`templates/worker.md: gói sinh ra không hợp lệ: ${problem}`);
}

const catalog = JSON.stringify(buildCatalog(workers.map((worker) => workerLibraryFiles(worker.markdown, playbooks).entry)));
if (Buffer.byteLength(catalog) > MAX_CATALOG_BYTES) errors.push("catalog.json sẽ vượt 256 KB; QACI Duo không đọc được");

if (errors.length > 0) {
  console.error(`Có ${errors.length} lỗi:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const used = new Set(workers.flatMap((worker) => splitPackage(worker.markdown).metadata.playbooks));
  const loose = [...playbooks.keys()].filter((name) => !used.has(name));
  console.log(`OK: ${workers.length} Digital Worker, ${playbooks.size} playbook hợp lệ, ${files.length} file đã quét secret.`);
  if (loose.length) console.log(`Playbook chưa gắn DW nào (vẫn import được qua Skills library): ${loose.join(", ")}`);
}

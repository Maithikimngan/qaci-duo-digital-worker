// npm test: checks every playbook, the repository layout, secrets, and the library that would be published.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MAX_CATALOG_BYTES, buildCatalog, disallowedFiles, libraryFiles, scanSecrets, validatePackage } from "./lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function trackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch {
    return ["packages", "templates"].flatMap((dir) => readdirSync(join(root, dir)).map((name) => `${dir}/${name}`));
  }
}

const files = trackedFiles();
for (const path of disallowedFiles(files)) {
  errors.push(`${path}: file này không được phép trong repo (playbook chỉ nằm ở packages/<ten-playbook>.md)`);
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

const entries = [];
const packages = files.filter((path) => /^packages\/[^/]+\.md$/.test(path)).sort();
for (const path of packages) {
  const slug = path.slice("packages/".length, -".md".length);
  const markdown = readFileSync(join(root, path), "utf8");
  const problems = validatePackage(markdown, slug);
  for (const problem of problems) errors.push(`${path}: ${problem}`);
  if (problems.length === 0) entries.push(libraryFiles(slug, markdown).entry);
}
for (const path of files.filter((path) => path.startsWith("templates/"))) {
  const markdown = readFileSync(join(root, path), "utf8");
  const id = markdown.match(/^id:\s*(\S+)/m)?.[1] ?? "";
  for (const problem of validatePackage(markdown, id)) errors.push(`${path}: ${problem}`);
}

const catalog = JSON.stringify(buildCatalog(entries));
if (Buffer.byteLength(catalog) > MAX_CATALOG_BYTES) errors.push("catalog.json sẽ vượt 256 KB; QACI Duo không đọc được");

if (errors.length > 0) {
  console.error(`Có ${errors.length} lỗi:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${packages.length} playbook hợp lệ, ${files.length} file đã quét secret.`);
}

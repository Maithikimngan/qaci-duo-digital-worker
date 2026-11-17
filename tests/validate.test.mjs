// Each safety rule refuses the file it is meant to refuse. Fake secrets are assembled at run time so the
// repository itself never contains a token-shaped string.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse as parseYaml } from "yaml";
import { buildCatalog, disallowedFiles, libraryFiles, scanSecrets, validatePackage } from "../scripts/lib.mjs";

const good = readFileSync(new URL("../packages/release-readiness-desk.md", import.meta.url), "utf8");
const slug = "release-readiness-desk";
const has = (errors, part) => assert.ok(errors.some((error) => error.includes(part)), `expected an error with "${part}", got ${JSON.stringify(errors)}`);

test("the sample playbook passes", () => {
  assert.deepEqual(validatePackage(good, slug), []);
});

test("the template passes so contributors start from a valid file", () => {
  const template = readFileSync(new URL("../templates/playbook.md", import.meta.url), "utf8");
  assert.deepEqual(validatePackage(template, "ten-playbook"), []);
});

test("a routine that would start enabled is refused", () => {
  has(validatePackage(good.replace("enabledAfterInstall: false", "enabledAfterInstall: true"), slug), "enabledAfterInstall: false");
});

test("a missing readable section is refused", () => {
  has(validatePackage(good.replace("## Completion rule", "## Done"), slug), "## Completion rule");
});

test("the id must match the file name", () => {
  has(validatePackage(good, "other-name"), "id phải trùng tên file");
});

test("an agent using an unknown playbook is refused", () => {
  has(validatePackage(good.replace("      - regression-check\n", "      - not-a-playbook\n"), slug), "not-a-playbook");
});

test("weekdays outside 0-6 are refused", () => {
  has(validatePackage(good.replace("        - 4\n", "        - 7\n"), slug), "weekdays");
});

test("a credential field in the frontmatter is refused", () => {
  has(validatePackage(good.replace("      optional: true\n", "      optional: true\n      token: x\n"), slug), "thông tin đăng nhập");
});

test("token-shaped strings are found", () => {
  const github = "gh" + "p_" + "a".repeat(36);
  const aws = "AK" + "IA" + "ABCDEFGHIJKLMNOP";
  const assigned = "pass" + "word: " + "hunter2hunter2";
  const key = "-----BEGIN " + "RSA PRIVATE KEY-----";
  for (const line of [github, aws, assigned, key, "https://user:" + "pw@example.com/repo"]) {
    assert.equal(scanSecrets(`text\n${line}\n`).length, 1, line);
  }
  assert.deepEqual(scanSecrets(good), []);
  assert.deepEqual(scanSecrets("Không bao giờ xin mật khẩu hay token dán vào chat."), []);
});

test("only the known layout is allowed", () => {
  assert.deepEqual(disallowedFiles(["packages/a-b.md", "README.md", "scripts/lib.mjs", ".github/workflows/validate.yml"]), []);
  assert.deepEqual(disallowedFiles(["packages/run.sh", "packages/x/y.md", "image.png", "packages/Upper.md"]), [
    "packages/run.sh", "packages/x/y.md", "image.png", "packages/Upper.md",
  ]);
});

test("the published library has the files the catalog points at", () => {
  const { entry, files } = libraryFiles(slug, good);
  const paths = new Set(files.map((file) => file.path));
  for (const path of [entry.package, entry.manifest, entry.readme, ...entry.skills]) assert.ok(paths.has(path), path);
  assert.equal(entry.members, 3);
  assert.equal(entry.skills.length, 4);
  const manifest = JSON.parse(files.find((file) => file.path === entry.manifest).content);
  assert.equal(manifest.format, "openmaus.team");
  assert.equal(manifest.team.members.length, 3);
  assert.deepEqual(manifest.team.room.defaultResponder, { kind: "member", member: "lead" });
  for (const skill of files.filter((file) => file.path.endsWith("SKILL.md"))) {
    const front = parseYaml(skill.content.match(/^---\n([\s\S]*?)\n---/)[1]);
    assert.ok(front.name && front.description, skill.path);
  }
  const catalog = buildCatalog([entry]);
  assert.equal(catalog.format, "openmaus.catalog");
  assert.equal(catalog.teams[0].package, "packages/release-readiness-desk.md");
});

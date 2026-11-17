import type { Metadata } from "next";
import Link from "next/link";

// Ported from openmausbot-teams' app/methodology/page.tsx, rewritten: that page explained BotMRR's own
// revenue-claim-free "package" product pitch. There is no QACI Duo analog to that, so instead of carrying
// BotMRR's business content over, this page explains the real review pipeline documented in this
// repository's CONTRIBUTING.md / FORMAT.md / SECURITY.md. See PORTING_NOTES.md.
export const metadata: Metadata = {
  title: "How QACI Duo playbooks work",
  description: "How a submission becomes a validated, reviewed, published QACI Duo Digital Worker.",
};

const principles = [
  ["01", "One capability per file", "A playbook is a standard SKILL.md — one procedure that produces a result. A Digital Worker (workers/<id>.md) is a role that carries several playbooks. Any playbook can be added to any worker."],
  ["02", "CI checks it before a human does", "node scripts/validate.mjs rejects an unknown field, a missing section, a secret-shaped string, and common ways to hide instructions (long base64-like runs, curl | sh, invisible Unicode) — before a reviewer ever reads it."],
  ["03", "A code owner reads the content", "Is each step specific enough to repeat? Does the playbook ask for its inputs before guessing? Does evidence stay separate from inference? Do sending, submitting, deleting and costly actions wait for approval?"],
  ["04", "Published automatically, nothing by hand", "Merging to main regenerates the library branch within about a minute. QACI Duo reads only that generated branch through a read-only GitHub API token — main itself is never read directly."],
];

export default function MethodologyPage() {
  return (
    <main className="methodology-page simple-page">
      <section className="methodology-hero simple-page-hero">
        <p className="overline">HOW QACI DUO PLAYBOOKS WORK</p>
        <h1>From pull request to Digital Worker.</h1>
        <p>Every worker and playbook in this library went through the same four steps — nothing is added by hand.</p>
        <div className="detail-actions"><Link href="/" className="button button-primary">Browse workers</Link><Link href="/publish" className="button button-secondary">Contribute one</Link></div>
      </section>

      <section className="methodology-grid" aria-label="Review pipeline">
        {principles.map(([number, title, body]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></article>)}
      </section>

      <section className="package-anatomy">
        <div><span className="section-kicker">THE PIPELINE</span><h2>Pull request &rarr; published.</h2><p>Every step runs the same two commands a contributor runs locally first: npm test, then npm run build.</p></div>
        <pre><code>{`workers/<id>.md
playbooks/<name>/SKILL.md
  │
  ├── npm test        (CI: validate.yml)
  │     format, layout, secrets,
  │     hidden-instruction tricks
  ├── code owner review
  ├── merge to main
  ├── npm run build   (CI: publish.yml)
  │     dist/packages, catalog.json,
  │     teams/<id>/...
  └── force-pushed to \`library\``}</code></pre>
      </section>

      <section className="never-package">
        <span className="section-kicker">WHAT CI REFUSES</span><h2>A submission is instructions — never access.</h2>
        <div><span>Tokens or passwords</span><span>Credential-shaped fields</span><span>Binaries or extra files</span><span>curl | sh</span><span>Invisible Unicode</span><span>Long base64 runs</span></div>
        <p className="boundary-note">QACI Duo treats every imported file as untrusted: it reads the description and the procedure only, grants no permissions, and connects no apps. A routine always installs paused — its owner switches it on.</p>
      </section>
    </main>
  );
}

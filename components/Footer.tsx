import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Digital Workers and playbooks for QACI Duo. Reviewed by a code owner, generated, then published.</p>
      <div>
        <Link href="/methodology">How it works</Link>
        <a href="https://github.com/vanhaito/qaci-duo-playbooks" target="_blank" rel="noreferrer">Source on GitHub</a>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>That worker wandered off.</h1>
      <p>The playbook may have moved, or it is not in the library yet.</p>
      <Link href="/" className="button button-primary">Back to the library</Link>
    </main>
  );
}

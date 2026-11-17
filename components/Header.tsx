import Link from "next/link";
import DuoAvatar from "@/components/DuoAvatar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="header-inner" aria-label="Primary navigation">
        <Link href="/" className="brand-lockup" aria-label="QACI Duo playbooks home">
          <DuoAvatar color="green" expression="happy" size={28} />
          <span>QACI Duo playbooks</span>
        </Link>
        <div className="header-links">
          <Link href="/">Browse</Link>
          <Link href="/methodology">How it works</Link>
          <Link href="/publish">Contribute</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

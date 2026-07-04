import Link from "next/link";
import { Dumbbell } from "lucide-react";

const links = [
  ["Home", "/#home"],
  ["Plans", "/#plans"],
  ["Timings", "/#timings"],
  ["Register", "/#register"]
];

export function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">
          <Dumbbell size={22} /> BEAST FORCE
        </Link>
        <nav className="nav-links">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link className="button" href="/register">Join Now</Link>
        </nav>
      </div>
    </header>
  );
}

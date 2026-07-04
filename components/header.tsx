import Link from "next/link";
import { Dumbbell } from "lucide-react";

const links = [
  ["About", "/about"],
  ["Plans", "/plans"],
  ["Facilities", "/facilities"],
  ["Gallery", "/gallery"],
  ["Payment", "/payment"],
  ["Contact", "/contact"],
  ["Dashboard", "/dashboard"]
];

export function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">
          <Dumbbell size={22} /> Beast Force
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

import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container grid grid-3">
        <div>
          <strong>{siteConfig.name}</strong>
          <p className="muted">{siteConfig.tagline}</p>
        </div>
        <div>
          <strong>Hours</strong>
          {siteConfig.timings.map((item) => <p className="muted" key={item.label}>{item.label}: {item.value}</p>)}
        </div>
        <div>
          <strong>Contact</strong>
          <p className="muted">{siteConfig.phone}</p>
          <p className="muted">{siteConfig.email}</p>
        </div>
      </div>
    </footer>
  );
}

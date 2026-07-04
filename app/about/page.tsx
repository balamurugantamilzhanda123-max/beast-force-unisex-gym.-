import { siteConfig } from "@/lib/config";

export default function AboutPage() {
  return (
    <main className="dashboard-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">About</span>
          <h1 className="section-title">A Stronger Space For Everyone</h1>
          <p className="muted">{siteConfig.name} is a unisex fitness club designed for strength, confidence, and sustainable routines.</p>
        </div>
        <div className="card">
          <h2>Our Promise</h2>
          <p className="muted">Premium equipment, focused batches, respectful coaching, and clear membership management from registration to renewal.</p>
        </div>
      </section>
    </main>
  );
}

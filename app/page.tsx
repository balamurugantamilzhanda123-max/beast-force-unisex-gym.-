import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Trophy, Users } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { PlanCards } from "@/components/plan-cards";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function HomePage() {
  return (
    <main>
      <div className="logo-loader"><div className="loader-mark">Beast Force</div></div>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">Premium Unisex Gym</span>
          <h1>Build Your Strongest Self</h1>
          <p>{siteConfig.tagline} Elite equipment, focused coaching, and memberships built for serious progress.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="button" href="/register">Start Membership <ArrowRight size={18} /></Link>
            <Link className="button secondary" href="/plans">View Plans</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <div className="card"><Trophy color="var(--gold)" /><div className="stat">365</div><p className="muted">Days of structured fitness support.</p></div>
          <div className="card"><Users color="var(--mint)" /><div className="stat">1:1</div><p className="muted">Trainer guidance for beginners and advanced members.</p></div>
          <div className="card"><ShieldCheck color="var(--blue)" /><div className="stat">100%</div><p className="muted">Secure payments and protected member data.</p></div>
        </div>
      </section>

      <section className="section" id="plans">
        <div className="container">
          <span className="eyebrow">Memberships</span>
          <h2 className="section-title">Choose Your Fight Plan</h2>
          <PlanCards />
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Gym Timings</span>
            <h2 className="section-title">Train Before Or After Work</h2>
          </div>
          <div className="card">
            <Clock color="var(--gold)" />
            {siteConfig.timings.map((item) => (
              <p key={item.label}><strong>{item.label}</strong><br /><span className="muted">{item.value}</span></p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Facilities</span>
          <h2 className="section-title">Built For Power And Consistency</h2>
          <div className="grid grid-3">
            {siteConfig.facilities.map((item) => <div className="card" key={item}><h3>{item}</h3><p className="muted">A focused space for safe, measurable fitness progress.</p></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Gallery</span>
          <h2 className="section-title">Inside The Beast Zone</h2>
          <div className="grid grid-3">
            {[
              "photo-1571902943202-507ec2618e8f",
              "photo-1599058917212-d750089bc07e",
              "photo-1581009146145-b5ef050c2e1e"
            ].map((id) => <div className="gallery-tile" key={id} style={{ backgroundImage: `url(https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80)` }} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Members Speak</span>
            <h2 className="section-title">Energy That Keeps You Showing Up</h2>
          </div>
          <div className="grid">
            <blockquote className="card">“The trainers helped me stay consistent from week one.”<br /><span className="muted">- Priya S.</span></blockquote>
            <blockquote className="card">“Clean equipment, premium vibe, and great evening batches.”<br /><span className="muted">- Arjun M.</span></blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Contact</span>
            <h2 className="section-title">Book A Visit</h2>
            <p className="muted">{siteConfig.address}</p>
          </div>
          <ContactForm />
        </div>
      </section>
      <WhatsAppButton />
    </main>
  );
}

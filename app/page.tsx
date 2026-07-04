import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  CreditCard,
  Dumbbell,
  Flame,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { PlanCards } from "@/components/plan-cards";
import { RegistrationForm } from "@/components/registration-form";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function HomePage() {
  const featureCopy = [
    "Unisex strength floor with safe lifting zones",
    "Cardio, HIIT, and functional fitness support",
    "Beginner-friendly coaching with progress checks",
    "Clean lockers, recovery space, and member care",
    "Flexible batches for students and professionals",
    "Secure online registration and payment tracking"
  ];

  return (
    <main>
      <div className="logo-loader">
        <div className="loader-ring" />
        <div className="loader-mark">Beast Force</div>
      </div>

      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="container hero-grid">
          <div className="hero-copy reveal-up">
            <span className="eyebrow">Premium Unisex Gym</span>
            <h1>Forge Your Beast Mode</h1>
            <p>{siteConfig.tagline} Premium equipment, electric coaching energy, and memberships built for real transformation.</p>
            <div className="hero-actions">
              <Link className="button button-xl" href="#register">Start Membership <ArrowRight size={18} /></Link>
              <Link className="button secondary button-xl" href="#plans">View Plans</Link>
            </div>
          </div>
          <div className="hero-panel reveal-up delay-1">
            <div className="pulse-badge"><Flame size={18} /> Beast Force</div>
            <div className="hero-metric">
              <span>05:30 AM</span>
              <strong>Doors Open</strong>
            </div>
            <div className="hero-metric">
              <span>Unisex</span>
              <strong>Strength + Cardio</strong>
            </div>
            <div className="hero-metric">
              <span>Razorpay</span>
              <strong>Secure Online Pay</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why Choose Beast Force</span>
              <h2 className="section-title">More Than A Workout Floor</h2>
            </div>
          </div>
          <div className="grid grid-3 stats-strip">
            <div className="card stat-card"><Trophy color="var(--gold)" /><div className="stat">365</div><p className="muted">Days of structured fitness support.</p></div>
            <div className="card stat-card"><Users color="var(--orange)" /><div className="stat">1:1</div><p className="muted">Trainer guidance for beginners and advanced members.</p></div>
            <div className="card stat-card"><ShieldCheck color="var(--hot)" /><div className="stat">100%</div><p className="muted">Secure payments and protected member data.</p></div>
          </div>
        </div>
      </section>

      <section className="section split-section">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Gym Timings</span>
            <h2 className="section-title">Train Before Or After Work</h2>
            <p className="muted wide-copy">High-energy morning and evening batches designed for consistency, discipline, and strong weekly rhythm.</p>
          </div>
          <div className="card schedule-card">
            <Clock color="var(--gold)" />
            {siteConfig.timings.map((item) => (
              <div className="schedule-row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="plans">
        <div className="container section-head">
          <div>
            <span className="eyebrow">Memberships</span>
            <h2 className="section-title">Choose Your Fight Plan</h2>
          </div>
          <Link className="button secondary" href="#register">Register Today</Link>
        </div>
        <div className="container">
          <PlanCards />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Unisex Gym Features</span>
              <h2 className="section-title">Built For Power And Consistency</h2>
            </div>
          </div>
          <div className="grid grid-3 feature-grid">
            {featureCopy.map((item, index) => (
              <div className="card feature-card" key={item}>
                {index % 3 === 0 && <Dumbbell color="var(--gold)" />}
                {index % 3 === 1 && <Zap color="var(--orange)" />}
                {index % 3 === 2 && <BadgeCheck color="var(--hot)" />}
                <h3>{item}</h3>
                <p className="muted">A focused space for safe, measurable fitness progress.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2 trainer-section">
          <div className="trainer-photo" />
          <div>
            <span className="eyebrow">Trainer / Facilities</span>
            <h2 className="section-title">Coaching That Keeps You Accountable</h2>
            <p className="muted wide-copy">Certified trainers, clean strength equipment, functional rigs, cardio stations, and a motivating floor culture for every body and every level.</p>
            <div className="facility-list">
              {siteConfig.facilities.map((item) => (
                <span key={item}><Sparkles size={15} /> {item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Payment CTA</span>
            <h2 className="section-title">Lock Your Slot With Secure Payment</h2>
            <p className="muted wide-copy">Register online, complete Razorpay checkout, and activate your membership after server-side verification.</p>
          </div>
          <div className="cta-actions">
            <Link className="button button-xl" href="#register"><CreditCard size={18} /> Register & Pay</Link>
            <Link className="button secondary button-xl" href="/payment"><LockKeyhole size={18} /> Payment Info</Link>
            <Link className="admin-link" href="/admin">Admin Access</Link>
          </div>
        </div>
      </section>

      <section className="section" id="register">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Customer Registration</span>
            <h2 className="section-title">Start Your Membership</h2>
            <p className="muted wide-copy">Submit your details, choose a plan, and move straight into the secure checkout flow without leaving the Beast Force system.</p>
            <div className="address-card">
              <strong>{siteConfig.address}</strong>
              <span>{siteConfig.phone}</span>
            </div>
          </div>
          <RegistrationForm />
        </div>
      </section>
      <WhatsAppButton />
    </main>
  );
}

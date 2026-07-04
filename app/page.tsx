import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  CreditCard,
  Crown,
  Dumbbell,
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { PlanCards } from "@/components/plan-cards";
import { RegistrationForm } from "@/components/registration-form";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function HomePage() {
  const stats: { value: string; label: string; Icon: LucideIcon }[] = [
    { value: "5:30 AM", label: "Opening", Icon: Clock },
    { value: "Unisex", label: "Gym", Icon: Users },
    { value: "Mon to Sat", label: "Training Days", Icon: BadgeCheck },
    { value: "Premium", label: "Training", Icon: Crown }
  ];

  const reasons: { title: string; copy: string; Icon: LucideIcon }[] = [
    { title: "Strength Training", copy: "Heavy-duty free weights, machines, and guided lifting for serious strength.", Icon: Dumbbell },
    { title: "Weight Loss", copy: "Cardio, conditioning, and habit-focused coaching for visible fat-loss progress.", Icon: Flame },
    { title: "Personal Coaching", copy: "Trainer support for form, consistency, confidence, and progression.", Icon: Trophy },
    { title: "Modern Equipment", copy: "Clean, powerful, and well-planned facilities for focused daily training.", Icon: Zap }
  ];

  return (
    <main>
      <div className="logo-loader">
        <div className="loader-ring" />
        <div className="loader-mark">BEAST FORCE</div>
      </div>

      <section className="hero gothic-poster" id="home">
        <div className="smoke-layer" />
        <div className="grain-layer" />
        <div className="container hero-grid">
          <div className="hero-copy reveal-up">
            <span className="eyebrow">Premium Gothic Unisex Gym</span>
            <h1>FORGE YOUR BEAST MODE</h1>
            <p>Unisex Gym • Strength Training • Fat Loss • Muscle Gain</p>
            <div className="hero-actions">
              <Link className="button button-xl" href="#register">Join Now <ArrowRight size={18} /></Link>
              <Link className="button secondary button-xl" href="#plans">View Plans</Link>
            </div>
          </div>
          <div className="hero-panel reveal-up delay-1">
            <div className="pulse-badge"><Flame size={18} /> BEAST FORCE</div>
            <div className="hero-metric">
              <span>5:30 AM</span>
              <strong>Gym Opening</strong>
            </div>
            <div className="hero-metric">
              <span>Mon-Sat</span>
              <strong>Morning + Evening Batches</strong>
            </div>
            <div className="hero-metric">
              <span>Unisex</span>
              <strong>Strength Training Floor</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-4 stats-strip">
          {stats.map(({ value, label, Icon }) => (
            <div className="card stat-card" key={label}>
              <Icon color="var(--gold)" />
              <div className="stat">{value}</div>
              <p className="muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why Choose Beast Force</span>
              <h2 className="section-title">Train In The Dark. Rise In Power.</h2>
            </div>
          </div>
          <div className="grid grid-4">
            {reasons.map(({ title, copy, Icon }) => (
              <div className="card feature-card" key={title}>
                <Icon color="var(--orange)" />
                <h3>{title}</h3>
                <p className="muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section split-section" id="timings">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Gym Timings</span>
            <h2 className="section-title">Open For The Relentless</h2>
            <p className="muted wide-copy">Monday to Saturday training windows for early lifters, evening warriors, and everyone building discipline.</p>
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
            <span className="eyebrow">Membership Plans</span>
            <h2 className="section-title">Choose Your Oath</h2>
          </div>
          <Link className="button secondary" href="#register">Join Now</Link>
        </div>
        <div className="container">
          <PlanCards />
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2 trainer-section">
          <div className="trainer-photo" />
          <div>
            <span className="eyebrow">Facilities</span>
            <h2 className="section-title">Built Like A Strength Cathedral</h2>
            <p className="muted wide-copy">Modern equipment, clean training zones, strength machines, cardio stations, functional rigs, lockers, and coaching support for every member.</p>
            <div className="facility-list">
              {siteConfig.facilities.map((item) => (
                <span key={item}><Sparkles size={15} /> {item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="register">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Customer Registration</span>
            <h2 className="section-title">Enter The Force</h2>
            <p className="muted wide-copy">Register your details, choose your membership plan, and continue into the secure online payment flow.</p>
            <div className="address-card">
              <strong>{siteConfig.address}</strong>
              <span>{siteConfig.phone}</span>
            </div>
          </div>
          <RegistrationForm />
        </div>
      </section>

      <section className="section cta-band">
        <div className="container grid grid-2">
          <div>
            <span className="eyebrow">Payment CTA</span>
            <h2 className="section-title">Complete Your Membership With Secure Online Payment</h2>
            <p className="muted wide-copy">Your payment is processed through Razorpay and verified by the server before membership activation.</p>
          </div>
          <div className="cta-actions">
            <Link className="button button-xl" href="/payment"><CreditCard size={18} /> Proceed to Payment</Link>
            <Link className="button secondary button-xl" href="#register"><ShieldCheck size={18} /> Register First</Link>
          </div>
        </div>
      </section>

      <section className="section admin-section">
        <div className="container admin-panel">
          <span className="eyebrow">Admin Access</span>
          <h2 className="section-title">Command The Member Dashboard</h2>
          <Link className="button button-xl" href="/admin">Admin Access</Link>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}

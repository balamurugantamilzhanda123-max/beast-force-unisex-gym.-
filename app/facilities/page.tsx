import { Award, Dumbbell, HeartPulse, Lock, Timer, Users } from "lucide-react";
import { siteConfig } from "@/lib/config";

const icons = [Dumbbell, HeartPulse, Award, Timer, Lock, Users];

export default function FacilitiesPage() {
  return (
    <main className="dashboard-shell">
      <section className="container">
        <span className="eyebrow">Trainers / Facilities</span>
        <h1 className="section-title">Everything You Need To Train Better</h1>
        <div className="grid grid-3">
          {siteConfig.facilities.map((facility, index) => {
            const Icon = icons[index];
            return <article className="card" key={facility}><Icon color="var(--gold)" /><h2>{facility}</h2><p className="muted">Designed for safe, repeatable progress across strength, cardio, and conditioning.</p></article>;
          })}
        </div>
      </section>
    </main>
  );
}

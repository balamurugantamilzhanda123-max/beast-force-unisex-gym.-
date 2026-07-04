import { PlanCards } from "@/components/plan-cards";

export default function PlansPage() {
  return (
    <main className="dashboard-shell">
      <section className="container">
        <span className="eyebrow">Plans</span>
        <h1 className="section-title">Membership Plans</h1>
        <PlanCards />
      </section>
    </main>
  );
}

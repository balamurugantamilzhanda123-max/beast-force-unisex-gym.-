import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function PlanCards() {
  return (
    <div className="grid grid-3">
      {siteConfig.plans.map((plan) => (
        <article className={`card ${plan.highlight ? "featured" : ""}`} key={plan.name}>
          <span className="eyebrow">{plan.durationDays} days</span>
          <h3>{plan.name}</h3>
          <div className="price">₹{plan.price.toLocaleString("en-IN")}</div>
          <p className="muted">Premium gym access, guided training support, and progress tracking.</p>
          <Link className="button" href="/register">Choose Plan</Link>
        </article>
      ))}
    </div>
  );
}

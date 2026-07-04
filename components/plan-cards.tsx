import Link from "next/link";
import { ArrowRight, Crown, Dumbbell, Flame } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function PlanCards() {
  return (
    <div className="grid grid-3">
      {siteConfig.plans.map((plan, index) => (
        <article className={`card plan-card ${plan.highlight ? "featured" : ""}`} key={plan.name}>
          <div className="plan-icon">
            {plan.highlight ? <Crown size={22} /> : index === 0 ? <Dumbbell size={22} /> : <Flame size={22} />}
          </div>
          <span className="eyebrow">{plan.durationDays} days</span>
          <h3>{plan.name} Plan</h3>
          <div className="price">Rs. {plan.price.toLocaleString("en-IN")}</div>
          <p className="muted">Premium gym access, guided training support, progress tracking, and a focused Beast Force floor.</p>
          <Link className="button" href="/register">{plan.highlight ? "Pay Now" : "Join Now"} <ArrowRight size={17} /></Link>
        </article>
      ))}
    </div>
  );
}

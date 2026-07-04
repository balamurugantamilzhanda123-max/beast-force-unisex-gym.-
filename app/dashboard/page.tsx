import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CustomerDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("status,start_date,expiry_date,membership_plans(name),members(full_name,email,phone)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="dashboard-shell">
      <section className="container">
        <span className="eyebrow">Customer Dashboard</span>
        <h1 className="section-title">Membership Status</h1>
        <div className="grid">
          {(memberships ?? []).map((membership: any) => (
            <article className="card" key={`${membership.start_date}-${membership.expiry_date}`}>
              <span className="badge">{membership.status}</span>
              <h2>{membership.membership_plans?.name} Plan</h2>
              <p className="muted">Start: {membership.start_date} | Expiry: {membership.expiry_date}</p>
              <p>{membership.members?.full_name}</p>
            </article>
          ))}
          {!memberships?.length && <p className="muted">No memberships found for this account.</p>}
        </div>
      </section>
    </main>
  );
}

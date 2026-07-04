import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, todayIso } from "@/lib/date";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: memberships }, { data: payments }, { data: messages }] = await Promise.all([
    supabase.from("memberships").select("status,start_date,expiry_date,members(full_name,email,phone),membership_plans(name)").order("expiry_date"),
    supabase.from("payments").select("amount_inr,status,created_at").eq("status", "paid"),
    supabase.from("contact_messages").select("name,email,phone,message,created_at").order("created_at", { ascending: false }).limit(8)
  ]);

  const totalRevenue = (payments ?? []).reduce((sum, payment) => sum + Number(payment.amount_inr), 0);
  const expiringSoon = (memberships ?? []).filter((m) => m.expiry_date <= addDays(todayIso(), 7) && m.status === "active");

  return (
    <main className="dashboard-shell">
      <section className="container">
        <span className="eyebrow">Admin</span>
        <h1 className="section-title">Command Center</h1>
        <div className="grid grid-3">
          <div className="card"><div className="stat">₹{totalRevenue.toLocaleString("en-IN")}</div><p className="muted">Total revenue</p></div>
          <div className="card"><div className="stat">{memberships?.filter((m) => m.status === "active").length ?? 0}</div><p className="muted">Active memberships</p></div>
          <div className="card"><div className="stat">{expiringSoon.length}</div><p className="muted">Expiring soon</p></div>
        </div>
        <div className="section">
          <h2>Members</h2>
          <div className="card">
            <table className="table">
              <thead><tr><th>Name</th><th>Plan</th><th>Status</th><th>Expiry</th></tr></thead>
              <tbody>
                {(memberships ?? []).map((m: any) => (
                  <tr key={`${m.members?.email}-${m.expiry_date}`}><td>{m.members?.full_name}</td><td>{m.membership_plans?.name}</td><td>{m.status}</td><td>{m.expiry_date}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="section">
          <h2>Recent Contact Messages</h2>
          <div className="grid">
            {(messages ?? []).map((message) => <article className="card" key={`${message.email}-${message.created_at}`}><strong>{message.name}</strong><p className="muted">{message.message}</p></article>)}
          </div>
        </div>
      </section>
    </main>
  );
}

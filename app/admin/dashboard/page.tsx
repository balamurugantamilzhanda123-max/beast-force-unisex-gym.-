import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminMembership = {
  id: string;
  status: string;
  payment_status: string;
  start_date: string;
  expiry_date: string;
  members: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  membership_plans: {
    name: string;
  } | null;
};

type SupabaseRelation<T> = T | T[] | null;

type RawAdminMembership = Omit<AdminMembership, "members" | "membership_plans"> & {
  members: SupabaseRelation<NonNullable<AdminMembership["members"]>>;
  membership_plans: SupabaseRelation<NonNullable<AdminMembership["membership_plans"]>>;
};

function firstRelation<T>(value: SupabaseRelation<T>) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin/login");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("id,status,payment_status,start_date,expiry_date,members(full_name,email,phone),membership_plans(name)")
    .order("expiry_date", { ascending: true });

  const rows = ((memberships ?? []) as RawAdminMembership[]).map((membership) => ({
    ...membership,
    members: firstRelation(membership.members),
    membership_plans: firstRelation(membership.membership_plans)
  }));
  const totalMembers = rows.length;
  const activeMemberships = rows.filter((item) => item.status === "active").length;
  const expiredMemberships = rows.filter((item) => item.status === "expired").length;
  const paidPayments = rows.filter((item) => item.payment_status === "paid").length;

  return (
    <main className="dashboard-shell admin-dashboard-shell">
      <section className="container">
        <span className="eyebrow">Private Admin Dashboard</span>
        <h1 className="section-title">Member Command Center</h1>

        <div className="grid grid-4 admin-stats">
          <div className="card stat-card"><Users color="var(--gold)" /><div className="stat">{totalMembers}</div><p className="muted">Total members</p></div>
          <div className="card stat-card"><ShieldCheck color="var(--orange)" /><div className="stat">{activeMemberships}</div><p className="muted">Active memberships</p></div>
          <div className="card stat-card"><RefreshCcw color="var(--hot)" /><div className="stat">{expiredMemberships}</div><p className="muted">Expired memberships</p></div>
          <div className="card stat-card"><CreditCard color="var(--gold)" /><div className="stat">{paidPayments}</div><p className="muted">Paid memberships</p></div>
        </div>

        <section className="section admin-table-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Customer List</span>
              <h2 className="section-title">Membership Tracking</h2>
            </div>
          </div>
          <div className="card table-card">
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Expiry Date</th>
                    <th>Renew</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((membership) => (
                    <tr key={membership.id}>
                      <td>{membership.members?.full_name ?? "Unknown"}</td>
                      <td>
                        <span>{membership.members?.phone ?? "-"}</span>
                        <br />
                        <span className="muted">{membership.members?.email ?? "-"}</span>
                      </td>
                      <td>{membership.membership_plans?.name ?? "Plan"}</td>
                      <td><span className={`badge badge-${membership.status}`}>{membership.status}</span></td>
                      <td><span className={`badge badge-${membership.payment_status}`}>{membership.payment_status}</span></td>
                      <td>{membership.expiry_date}</td>
                      <td>
                        {membership.status === "expired" ? (
                          <Link className="button table-button" href="/register">Renew</Link>
                        ) : (
                          <span className="muted">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && <p className="muted">No customer memberships found yet.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

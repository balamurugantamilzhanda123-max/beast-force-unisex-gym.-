import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "admin") redirect("/admin/dashboard");
  }

  return (
    <main className="dashboard-shell admin-auth-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">Private Admin Gate</span>
          <h1 className="section-title">BEAST FORCE Control Room</h1>
          <p className="muted wide-copy">This route is separate from the customer website. Admins can sign in manually to review members, payments, and membership expiry.</p>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  );
}

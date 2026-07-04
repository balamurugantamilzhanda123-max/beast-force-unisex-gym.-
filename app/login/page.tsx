import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="dashboard-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">Login</span>
          <h1 className="section-title">Member And Admin Access</h1>
          <p className="muted">Use your Supabase Auth email and password.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

import { RegistrationForm } from "@/components/registration-form";

export default function RegisterPage() {
  return (
    <main className="dashboard-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">Registration</span>
          <h1 className="section-title">Start Your Membership</h1>
          <p className="muted">Submit your details, choose a plan, then complete secure Razorpay payment.</p>
        </div>
        <RegistrationForm />
      </section>
    </main>
  );
}

import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";

export default function PaymentPage() {
  return (
    <main className="dashboard-shell">
      <section className="container grid grid-2">
        <div>
          <span className="eyebrow">Payment</span>
          <h1 className="section-title">Secure Membership Payment</h1>
          <p className="muted">Membership payments are processed through Razorpay and verified on the server before activation.</p>
          <Link className="button" href="/register"><CreditCard size={18} /> Register & Pay</Link>
        </div>
        <div className="card">
          <ShieldCheck color="var(--mint)" />
          <h2>What happens after payment?</h2>
          <p className="muted">Your payment signature is verified, your membership becomes active, confirmation email and WhatsApp messages are sent, and your dashboard is updated.</p>
        </div>
      </section>
    </main>
  );
}

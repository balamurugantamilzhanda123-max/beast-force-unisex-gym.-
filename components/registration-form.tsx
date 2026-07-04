"use client";

import { useState } from "react";
import { CalendarDays, CreditCard, Mail, MapPin, Phone, UserRound } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function RegistrationForm() {
  const [status, setStatus] = useState("");

  async function submit(formData: FormData) {
    setStatus("Creating membership...");
    const payload = Object.fromEntries(formData);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "Registration failed.");
      return;
    }

    setStatus("Opening secure payment...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const checkout = new window.Razorpay!({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Beast Force Gym",
        description: data.planName,
        order_id: data.razorpayOrderId,
        handler: async (response: Record<string, string>) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              paymentId: data.paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          });
          setStatus(verify.ok ? "Payment verified. Your membership is active." : "Payment verification failed. Contact admin.");
        },
        prefill: { name: payload.fullName, email: payload.email, contact: payload.phone },
        theme: { color: "#ff3d2e" }
      });
      checkout.open();
    };
    document.body.appendChild(script);
  }

  return (
    <form action={submit} className="card form-grid registration-card">
      <label className="field-shell"><UserRound size={18} /><input className="input" name="fullName" placeholder="Full name" required /></label>
      <label className="field-shell"><Phone size={18} /><input className="input" name="phone" placeholder="Phone number with country code" required /></label>
      <label className="field-shell"><Mail size={18} /><input className="input" name="email" type="email" placeholder="Email ID" required /></label>
      <input className="input" name="password" type="password" minLength={8} placeholder="Create password" required />
      <input className="input" name="age" type="number" min="12" max="90" placeholder="Age" required />
      <select className="input" name="gender" required defaultValue="">
        <option value="" disabled>Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="non_binary">Non-binary</option>
        <option value="prefer_not_to_say">Prefer not to say</option>
      </select>
      <select className="input" name="planId" required defaultValue="">
        <option value="" disabled>Membership plan</option>
        <option value="00000000-0000-0000-0000-000000000030">Monthly</option>
        <option value="00000000-0000-0000-0000-000000000090">Quarterly</option>
        <option value="00000000-0000-0000-0000-000000000365">Yearly</option>
      </select>
      <label className="field-shell"><CalendarDays size={18} /><input className="input" name="startDate" type="date" required /></label>
      <label className="field-shell span-2"><MapPin size={18} /><textarea className="input" name="address" placeholder="Address" required /></label>
      <button className="button span-2" type="submit"><CreditCard size={18} /> Register & Pay</button>
      <p className="muted span-2">{status}</p>
    </form>
  );
}

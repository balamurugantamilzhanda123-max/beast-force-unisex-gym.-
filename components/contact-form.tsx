"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  async function submit(formData: FormData) {
    setStatus("Sending...");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    setStatus(res.ok ? "Message sent. We will contact you shortly." : "Please check the form and try again.");
  }

  return (
    <form action={submit} className="card form-grid">
      <input className="input" name="name" placeholder="Full name" required />
      <input className="input" name="phone" placeholder="Phone number" required />
      <input className="input span-2" name="email" placeholder="Email address" type="email" required />
      <textarea className="input span-2" name="message" placeholder="Tell us your fitness goal" required />
      <button className="button" type="submit"><Send size={18} /> Send Message</button>
      <p className="muted">{status}</p>
    </form>
  );
}

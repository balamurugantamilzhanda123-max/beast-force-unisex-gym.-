"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [status, setStatus] = useState("");

  async function login(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus(error.message);
    else window.location.href = "/dashboard";
  }

  return (
    <form action={login} className="card grid">
      <input className="input" name="email" type="email" placeholder="Email" required />
      <input className="input" name="password" type="password" placeholder="Password" required />
      <button className="button" type="submit">Login</button>
      <p className="muted">{status}</p>
    </form>
  );
}

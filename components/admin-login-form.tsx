"use client";

import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const [status, setStatus] = useState("");

  async function login(formData: FormData) {
    setStatus("Checking admin access...");
    const supabase = createSupabaseBrowserClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      setStatus("Admin access only.");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <form action={login} className="card form-grid registration-card admin-login-card">
      <label className="field-shell span-2">
        <Mail size={18} />
        <input className="input" name="email" type="email" placeholder="Admin email" required />
      </label>
      <label className="field-shell span-2">
        <LockKeyhole size={18} />
        <input className="input" name="password" type="password" placeholder="Admin password" required />
      </label>
      <button className="button span-2" type="submit">Enter Admin Dashboard</button>
      <p className="muted span-2">{status}</p>
    </form>
  );
}

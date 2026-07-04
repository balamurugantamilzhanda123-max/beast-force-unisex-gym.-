import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const resources = {
  plans: "membership_plans",
  trainers: "trainers",
  facilities: "facilities",
  gallery: "gallery_items",
  messages: "contact_messages",
  content: "site_content",
  memberships: "memberships",
  payments: "payments"
} as const;

type Resource = keyof typeof resources;

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, authorized: false };
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, authorized: data?.role === "admin" };
}

function tableFor(resource: string) {
  return resources[resource as Resource];
}

export async function GET(_: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const table = tableFor(resource);
  if (!table) return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  const { supabase, authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const table = tableFor(resource);
  if (!table) return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  const { supabase, authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from(table).insert(await request.json()).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

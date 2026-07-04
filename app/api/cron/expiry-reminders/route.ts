import { NextResponse } from "next/server";
import { addDays, todayIso } from "@/lib/date";
import { sendWhatsApp } from "@/lib/notifications";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const reminderMessage = "Your gym membership subscription is going to end in 2 days. Please renew your membership to continue your fitness journey.";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const targetDate = addDays(todayIso(), 2);
  const { data: memberships, error } = await supabase
    .from("memberships")
    .select("id,member_id,expiry_date,members(id,phone)")
    .eq("status", "active")
    .eq("expiry_date", targetDate);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const membership of memberships ?? []) {
    const { data: existing } = await supabase
      .from("notification_logs")
      .select("id")
      .eq("member_id", membership.member_id)
      .eq("kind", "expiry_reminder")
      .eq("message", reminderMessage)
      .gte("created_at", `${todayIso()}T00:00:00.000Z`)
      .maybeSingle();

    if (existing) continue;
    await sendWhatsApp({
      memberId: membership.member_id,
      to: (membership.members as any).phone,
      body: reminderMessage,
      kind: "expiry_reminder"
    });
    sent += 1;
  }

  return NextResponse.json({ ok: true, targetDate, sent });
}

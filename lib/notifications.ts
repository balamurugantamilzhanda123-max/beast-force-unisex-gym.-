import { Resend } from "resend";
import twilio from "twilio";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

type NotificationKind = "membership_confirmation" | "expiry_reminder" | "manual";
type Channel = "email" | "whatsapp" | "voice";

async function logNotification(input: {
  memberId?: string;
  channel: Channel;
  kind: NotificationKind;
  recipient: string;
  status: "sent" | "failed" | "skipped";
  message: string;
  providerResponse?: unknown;
}) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("notification_logs").insert({
    member_id: input.memberId ?? null,
    channel: input.channel,
    kind: input.kind,
    recipient: input.recipient,
    status: input.status,
    message: input.message,
    provider_response: input.providerResponse ?? null
  });
}

export async function sendEmail(input: {
  memberId?: string;
  to: string;
  subject: string;
  html: string;
  kind: NotificationKind;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    await logNotification({ ...input, channel: "email", recipient: input.to, status: "skipped", message: input.subject });
    return;
  }

  try {
    const resend = new Resend(resendKey);
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `${siteConfig.name} <memberships@example.com>`,
      to: input.to,
      subject: input.subject,
      html: input.html
    });
    await logNotification({ ...input, channel: "email", recipient: input.to, status: "sent", message: input.subject, providerResponse: response });
  } catch (error) {
    await logNotification({ ...input, channel: "email", recipient: input.to, status: "failed", message: input.subject, providerResponse: { error: String(error) } });
  }
}

export async function sendWhatsApp(input: { memberId?: string; to: string; body: string; kind: NotificationKind }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    await logNotification({ ...input, channel: "whatsapp", recipient: input.to, status: "skipped", message: input.body });
    return;
  }

  try {
    const client = twilio(sid, token);
    const response = await client.messages.create({
      from,
      to: input.to.startsWith("whatsapp:") ? input.to : `whatsapp:${input.to}`,
      body: input.body
    });
    await logNotification({ ...input, channel: "whatsapp", recipient: input.to, status: "sent", message: input.body, providerResponse: response });
  } catch (error) {
    await logNotification({ ...input, channel: "whatsapp", recipient: input.to, status: "failed", message: input.body, providerResponse: { error: String(error) } });
  }
}

export async function sendConfirmation(member: { id: string; full_name: string; email: string; phone: string }, planName: string, expiryDate: string) {
  const message = `Welcome to ${siteConfig.name}, ${member.full_name}. Your ${planName} membership is active until ${expiryDate}.`;
  await Promise.all([
    sendEmail({
      memberId: member.id,
      to: member.email,
      subject: `${siteConfig.name} membership confirmed`,
      html: `<h1>Membership confirmed</h1><p>${message}</p>`,
      kind: "membership_confirmation"
    }),
    sendWhatsApp({ memberId: member.id, to: member.phone, body: message, kind: "membership_confirmation" })
  ]);
}

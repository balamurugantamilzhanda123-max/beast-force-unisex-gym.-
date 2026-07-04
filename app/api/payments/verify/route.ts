import { NextResponse } from "next/server";
import { sendConfirmation } from "@/lib/notifications";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { paymentVerifySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = paymentVerifySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment verification payload." }, { status: 400 });

  const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;
  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      provider_payment_id: razorpayPaymentId,
      provider_signature: razorpaySignature,
      paid_at: new Date().toISOString()
    })
    .eq("id", paymentId)
    .eq("provider_order_id", razorpayOrderId)
    .select("*, memberships(*, membership_plans(name)), members(*)")
    .single();

  if (error || !payment) return NextResponse.json({ error: error?.message ?? "Payment not found." }, { status: 404 });

  await supabase
    .from("memberships")
    .update({ status: "active", payment_status: "paid" })
    .eq("id", payment.membership_id);

  await sendConfirmation(payment.members, payment.memberships.membership_plans.name, payment.memberships.expiry_date);

  return NextResponse.json({ ok: true });
}

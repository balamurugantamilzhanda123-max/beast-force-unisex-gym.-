import { NextResponse } from "next/server";
import { addDays } from "@/lib/date";
import { getRazorpay } from "@/lib/payments/razorpay";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const payload = parsed.data;
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: { full_name: payload.fullName }
  });

  if (authError || !authUser.user) return NextResponse.json({ error: authError?.message ?? "Could not create customer account." }, { status: 500 });

  const { data: plan, error: planError } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", payload.planId)
    .eq("is_active", true)
    .single();

  if (planError || !plan) return NextResponse.json({ error: "Selected plan is not available." }, { status: 404 });

  const { data: member, error: memberError } = await supabase
    .from("members")
    .insert({
      user_id: authUser.user.id,
      full_name: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      age: payload.age,
      gender: payload.gender,
      address: payload.address
    })
    .select("*")
    .single();

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  const expiryDate = addDays(payload.startDate, plan.duration_days);
  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .insert({
      member_id: member.id,
      user_id: authUser.user.id,
      plan_id: plan.id,
      start_date: payload.startDate,
      expiry_date: expiryDate,
      status: "pending",
      payment_status: "pending"
    })
    .select("*")
    .single();

  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: plan.price_inr * 100,
    currency: "INR",
    receipt: membership.id,
    notes: { member_id: member.id, membership_id: membership.id }
  });

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      member_id: member.id,
      membership_id: membership.id,
      amount_inr: plan.price_inr,
      currency: "INR",
      status: "pending",
      provider: "razorpay",
      provider_order_id: order.id
    })
    .select("*")
    .single();

  if (paymentError) return NextResponse.json({ error: paymentError.message }, { status: 500 });

  return NextResponse.json({
    memberId: member.id,
    membershipId: membership.id,
    paymentId: payment.id,
    razorpayOrderId: order.id,
    amount: order.amount,
    planName: plan.name
  });
}

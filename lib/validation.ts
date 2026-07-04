import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  age: z.coerce.number().int().min(12).max(90),
  gender: z.enum(["female", "male", "non_binary", "prefer_not_to_say"]),
  address: z.string().min(8).max(500),
  planId: z.string().uuid(),
  startDate: z.string().date()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
  message: z.string().min(10).max(1500)
});

export const paymentVerifySchema = z.object({
  paymentId: z.string().uuid(),
  razorpayOrderId: z.string().min(6),
  razorpayPaymentId: z.string().min(6),
  razorpaySignature: z.string().min(20)
});

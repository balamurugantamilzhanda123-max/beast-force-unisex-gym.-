export type MembershipStatus = "pending" | "active" | "expired" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say";

export type MembershipPlan = {
  id: string;
  name: string;
  description: string | null;
  price_inr: number;
  duration_days: number;
  is_active: boolean;
  is_featured: boolean;
};

export type Member = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  age: number;
  gender: Gender;
  address: string;
};

export type RegistrationPayload = {
  fullName: string;
  phone: string;
  email: string;
  age: number;
  gender: Gender;
  address: string;
  planId: string;
  startDate: string;
};

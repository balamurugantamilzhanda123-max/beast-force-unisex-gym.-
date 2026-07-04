import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // This can happen when called from a Server Component.
          // Safe to ignore if middleware refreshes sessions.
        }
      }
    }
  });
}

export const createSupabaseServerClient = createClient;

export function createSupabaseAdminClient() {
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return createSupabaseJsClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

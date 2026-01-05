// lib/supabaseClient.ts  (or whatever your current file path is)

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// ✅ This stores the PKCE verifier in COOKIES so your /auth/callback route can exchange the code
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
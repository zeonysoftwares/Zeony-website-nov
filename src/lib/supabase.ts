import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://gidzpffxpxiygnkmddrk.supabase.co/",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcXF1dWt1enFweXVmZWN5aW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNDQyMTEsImV4cCI6MjEwNjkyMDIxMX0.NrrO8KeZMb78Q5vsPukYtkTpFgjM4j1dhLuJ0L_OhwE"
);
// lib/supabase/server-direct.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// This is a function to be used when you need direct access without going through the helper
export async function getSupabaseServer() {
  const cookieStore = cookies();
  
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}
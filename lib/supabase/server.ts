// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getSupabaseServer() {
  // Use an async function to properly await the cookies
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          try {
            // Get the cookie without parsing
            return cookieStore.get(name)?.value
          } catch (error) {
            console.error(`Error reading cookie ${name}:`, error)
            return undefined
          }
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error)
          }
        },
      },
    }
  )
}

// Helper function to fetch dashboard metrics
export async function fetchDashboardMetrics() {
  const supabase = await getSupabaseServer();
  
  // Get total cases count
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true });
    
  // Get pending verification count
  const { count: pendingVerification } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
    
  // Get verified cases count
  const { count: verifiedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'verified');
    
  // Get rejected cases count
  const { count: rejectedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');
    
  // Get total users count
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  return {
    total_cases: totalCases || 0,
    pending_verification: pendingVerification || 0,
    verified_cases: verifiedCases || 0,
    rejected_cases: rejectedCases || 0,
    total_users: totalUsers || 0,
  };
}

// Helper function to fetch county distribution data
export async function fetchCountyDistribution() {
  const supabase = await getSupabaseServer();
  
  const { data } = await supabase
    .from('cases')
    .select('county');
    
  if (!data) return [];
  
  // Group by county and count
  const countyCount: Record<string, number> = {};
  let totalCount = 0;
  
  data.forEach(item => {
    const county = item.county || 'Unknown';
    countyCount[county] = (countyCount[county] || 0) + 1;
    totalCount++;
  });
  
  // Convert to array with percentages
  const result = Object.entries(countyCount).map(([county, count]) => ({
    county,
    count,
    percentage: Math.round((count / totalCount) * 100)
  }));
  
  // Sort by count, descending
  return result.sort((a, b) => b.count - a.count);
}
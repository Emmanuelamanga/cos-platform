// app/(dashboard)/submit-case/page.tsx
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server'; // Updated import
import SubmitCaseClient from './submit-case-client';

export default async function SubmitCasePage() {
  // Use the new function name
  const supabase = await getSupabaseServer();
  
  try {
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return redirect('/sign-in');
    }
    
    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return redirect('/sign-in');
    }
    
    // Fetch reference data in parallel
    const [caseTypesResponse, countiesResponse] = await Promise.all([
      supabase
        .from('case_types')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('counties')
        .select('*')
        .order('created_at', { ascending: false })
    ]);
    
    const { data: caseTypes, error: caseTypesError } = caseTypesResponse;
    const { data: counties, error: countiesError } = countiesResponse;
    
    if (caseTypesError || countiesError) {
      console.error("Error fetching reference data:", caseTypesError, countiesError);
    }
    
    return (
      <SubmitCaseClient 
        profile={profile} 
        caseTypes={caseTypes || []} 
        counties={counties || []} 
        user={user} 
      />
    );
  } catch (error) {
    console.error("Error in submit case page:", error);
    return redirect('/sign-in');
  }
}
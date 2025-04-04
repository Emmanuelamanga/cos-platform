// app/(dashboard)/profile/page.tsx
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server'; // Updated import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCasesTable } from '@/components/dashboard/user-cases-table';
import { UserNotifications } from '@/components/dashboard/user-notifications';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import Link from 'next/link';
import { UserNav } from '@/components/dashboard/user-nav';
import { Profile } from '@/types';

export default async function ProfilePage() {
  // Use the new function name
  const supabase = await getSupabaseServer();
  
  try {
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return redirect('/sign-in');
    }
    
    // Rest of your code remains the same...
    const [
      profileResponse,
      totalCasesResponse,
      pendingCasesResponse,
      verifiedCasesResponse,
      rejectedCasesResponse
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', user.id),
      supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', user.id)
        .eq('status', 'pending'),
      supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', user.id)
        .eq('status', 'verified'),
      supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', user.id)
        .eq('status', 'rejected')
    ]);
    
    const { data: profile, error: profileError } = profileResponse;
    
    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return redirect('/sign-in');
    }
    
    const userStats = {
      totalCases: totalCasesResponse.count || 0,
      pendingCases: pendingCasesResponse.count || 0,
      verifiedCases: verifiedCasesResponse.count || 0,
      rejectedCases: rejectedCasesResponse.count || 0,
    };
    
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl">COS</span>
            </Link>
            <UserNav user={profile} />
          </div>
        </header>
        
        <main className="flex-1 py-8">
          <div className="container space-y-8">
            <DashboardHeader heading="My Profile" text="Manage your account and view your submissions.">
              <Link href="/submit-case">
                <Button>Submit New Case</Button>
              </Link>
            </DashboardHeader>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Submissions" value={userStats.totalCases} />
              <StatCard title="Pending Verification" value={userStats.pendingCases} />
              <StatCard title="Verified" value={userStats.verifiedCases} />
              <StatCard title="Rejected" value={userStats.rejectedCases} />
            </div>
            
            <ProfileTabs profile={profile} email={user.email || ''} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in profile page:", error);
    return redirect('/sign-in');
  }
}

// Helper component for statistic cards
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Helper component for profile tabs
function ProfileTabs({ profile, email }: { profile: Profile; email: string }) {
  return (
    <Tabs defaultValue="cases" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cases">My Cases</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="settings">Account Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="cases" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Case Submissions</CardTitle>
            <CardDescription>
              View all cases you have submitted and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserCasesTable userId={profile.id} />
          </CardContent>
          <CardFooter>
            <Link href="/submit-case" className="w-full">
              <Button variant="outline" className="w-full">
                Submit New Case
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Updates about your case submissions and verification status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserNotifications userId={profile.id} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <AccountSettingsCard profile={profile} email={email} />
      </TabsContent>
    </Tabs>
  );
}

// Helper component for account settings
function AccountSettingsCard({ profile, email }: { profile: Profile; email: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account details and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h3 className="font-medium text-sm">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium">{profile.full_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium">{profile.phone_number || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">County</p>
              <p className="text-sm font-medium">{profile.county}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-sm">Account Status</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
              Active
            </Badge>
            <p className="text-sm text-muted-foreground">
              Your account is in good standing
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Edit Profile</Button>
        <Button variant="default">Change Password</Button>
      </CardFooter>
    </Card>
  );
}
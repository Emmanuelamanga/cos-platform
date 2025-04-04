// app/(dashboard)/admin/cases/page.tsx
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCasesTable } from "@/components/dashboard/admin-cases-table";

export default async function AdminCasesPage() {
  const supabase = await getSupabaseServer();
  
  // Fetch case statistics
  let caseStats = {
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  };
  
  try {
    // Get total count
    const { count: totalCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true });
    
    // Get pending count
    const { count: pendingCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // Get verified count
    const { count: verifiedCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');
    
    // Get rejected count
    const { count: rejectedCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');
    
    caseStats = {
      total: totalCount || 0,
      pending: pendingCount || 0,
      verified: verifiedCount || 0,
      rejected: rejectedCount || 0
    };
  } catch (error) {
    console.error("Error fetching case statistics:", error);
    // Use default values in case of error
  }
  
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Cases Management" text="Review, verify, and manage submitted cases.">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardHeader>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.total}</div>
            <p className="text-xs text-muted-foreground">All submitted cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.pending}</div>
            <p className="text-xs text-muted-foreground">Cases awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.verified}</div>
            <p className="text-xs text-muted-foreground">Confirmed cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStats.rejected}</div>
            <p className="text-xs text-muted-foreground">Declined cases</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Cases</CardTitle>
          <CardDescription>
            Browse, filter, and manage all submitted cases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <AdminCasesTable filter="all" />
            </TabsContent>
            
            <TabsContent value="pending">
              <AdminCasesTable filter="pending" />
            </TabsContent>
            
            <TabsContent value="verified">
              <AdminCasesTable filter="verified" />
            </TabsContent>
            
            <TabsContent value="rejected">
              <AdminCasesTable filter="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
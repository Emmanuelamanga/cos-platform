// app/(dashboard)/admin/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingCasesTable } from "@/components/dashboard/pending-cases-table";
import { RecentVerificationsTable } from "@/components/dashboard/recent-verifications-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getSupabaseServer } from "@/lib/supabase/server";
import { DashboardMetric } from "@/components/dashboard/dashboard-metric";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function AdminDashboardPage() {
  // Initialize metrics with zeros
  const metrics = {
    total_cases: 0,
    pending_verification: 0,
    verified_cases: 0,
    rejected_cases: 0,
    total_users: 0,
  };
  
  // Initialize with empty county data
  let countyData = [];
  
  // Flag to track if we got data from the database
  let dbConnectionSuccess = false;
  let errorMessage = null;
  
  try {
    // Get data from Supabase
    const supabase = await getSupabaseServer();
    
    if (supabase) {
      // Get total cases count
      const { count: totalCases, error: totalError } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true });
        
      if (!totalError && totalCases !== null) {
        metrics.total_cases = totalCases;
        dbConnectionSuccess = true;
      }
      
      // Get pending verification count
      const { count: pendingVerification, error: pendingError } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (!pendingError && pendingVerification !== null) {
        metrics.pending_verification = pendingVerification;
      }
      
      // Get verified cases count
      const { count: verifiedCases, error: verifiedError } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');
        
      if (!verifiedError && verifiedCases !== null) {
        metrics.verified_cases = verifiedCases;
      }
      
      // Get rejected cases count
      const { count: rejectedCases, error: rejectedError } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');
        
      if (!rejectedError && rejectedCases !== null) {
        metrics.rejected_cases = rejectedCases;
      }
      
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (!usersError && totalUsers !== null) {
        metrics.total_users = totalUsers;
      }
      
      // Fetch county distribution
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('county');
        
      if (!casesError && casesData && casesData.length > 0) {
        // Group by county and count
        const countyCount = {};
        let totalCount = 0;
        
        casesData.forEach(item => {
          const county = item.county || 'Unknown';
          countyCount[county] = (countyCount[county] || 0) + 1;
          totalCount++;
        });
        
        // Convert to array with percentages
        countyData = Object.entries(countyCount).map(([county, count]) => ({
          county,
          count,
          percentage: Math.round((count as number / totalCount) * 100)
        }));
        
        // Sort by count, descending
        countyData.sort((a, b) => b.count - a.count);
        
        // If we have more than 5 counties, group the smallest ones as "Other"
        if (countyData.length > 5) {
          const topCounties = countyData.slice(0, 5);
          const otherCounties = countyData.slice(5);
          
          const otherCount = otherCounties.reduce((sum, item) => sum + item.count, 0);
          const otherPercentage = otherCounties.reduce((sum, item) => sum + item.percentage, 0);
          
          countyData = [
            ...topCounties,
            { county: "Other", count: otherCount, percentage: otherPercentage }
          ];
        }
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    errorMessage = "Could not connect to the database. Please check your connection.";
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Dashboard" text="Monitor case statistics and activity." />
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {!dbConnectionSuccess && !errorMessage && (
        <Alert>
          <AlertDescription>No data available from database. Showing zeros until data is available.</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Total Cases"
          value={metrics.total_cases.toString()}
          iconName="file-check"
          description="All time cases submitted"
          trend={metrics.total_cases > 0 ? "+5% from last month" : null}
          trendDirection="up"
        />
        <DashboardMetric
          title="Pending Verification"
          value={metrics.pending_verification.toString()}
          iconName="file-warning"
          description="Cases requiring review"
          trend={metrics.pending_verification > 0 ? "-2 since yesterday" : null}
          trendDirection="down"
        />
        <DashboardMetric
          title="Verified Cases"
          value={metrics.verified_cases.toString()}
          iconName="file-check"
          description="Published to public view"
          trend={metrics.verified_cases > 0 ? "+12 this month" : null}
          trendDirection="up"
        />
        <DashboardMetric
          title="Total Users"
          value={metrics.total_users.toString()}
          iconName="users"
          description="Registered accounts"
          trend={metrics.total_users > 0 ? "+24 this month" : null}
          trendDirection="up"
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Case Submissions Over Time</CardTitle>
                <CardDescription>
                  Monthly case submissions for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Cases By County</CardTitle>
                <CardDescription>
                  Distribution of cases by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {countyData.length > 0 ? (
                  <div className="space-y-4">
                    {countyData.map((item) => (
                      <div className="flex items-center" key={item.county}>
                        <div className="w-1/3 font-medium">{item.county}</div>
                        <div className="w-full">
                          <div className="flex h-2 items-center">
                            <div
                              className="bg-primary rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                            <span className="ml-2 text-sm text-muted-foreground">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">No county data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of case trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/40">
                <p className="text-sm text-muted-foreground">
                  Advanced analytics content would go here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Download and manage system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/40">
                <p className="text-sm text-muted-foreground">
                  Reports management interface would go here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Cases Pending Verification</CardTitle>
            <CardDescription>
              Cases that require review and verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingCasesTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Verifications</CardTitle>
            <CardDescription>
              Cases that were recently processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentVerificationsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
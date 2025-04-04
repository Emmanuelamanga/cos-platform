// app/(dashboard)/admin/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingCasesTable } from "@/components/dashboard/pending-cases-table";
import { RecentVerificationsTable } from "@/components/dashboard/recent-verifications-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createServerClient } from "@/lib/supabase/server";
import { BarChart, FileCheck, FileWarning, Users } from "lucide-react";
import { DashboardMetric } from "@/components/dashboard/dashboard-metric";
import { OverviewChart } from "@/components/dashboard/overview-chart";

export default async function AdminDashboardPage() {
  const supabase = createServerClient();
  
  // In a real implementation, we'd fetch actual data from Supabase
  // For now, using mock data
  const metrics = {
    total_cases: 124,
    pending_verification: 18,
    verified_cases: 98,
    rejected_cases: 8,
    total_users: 256,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Dashboard" text="Monitor case statistics and activity." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Total Cases"
          value={metrics.total_cases.toString()}
          icon={FileCheck}
          description="All time cases submitted"
          trend="+5% from last month"
          trendDirection="up"
        />
        <DashboardMetric
          title="Pending Verification"
          value={metrics.pending_verification.toString()}
          icon={FileWarning}
          description="Cases requiring review"
          trend="-2 since yesterday"
          trendDirection="down"
        />
        <DashboardMetric
          title="Verified Cases"
          value={metrics.verified_cases.toString()}
          icon={FileCheck}
          description="Published to public view"
          trend="+12 this month"
          trendDirection="up"
        />
        <DashboardMetric
          title="Total Users"
          value={metrics.total_users.toString()}
          icon={Users}
          description="Registered accounts"
          trend="+24 this month"
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
                <div className="space-y-4">
                  {[
                    { county: "Nairobi", count: 36, percentage: 29 },
                    { county: "Mombasa", count: 24, percentage: 19 },
                    { county: "Kisumu", count: 18, percentage: 15 },
                    { county: "Nakuru", count: 15, percentage: 12 },
                    { county: "Kiambu", count: 12, percentage: 10 },
                    { county: "Other", count: 19, percentage: 15 },
                  ].map((item) => (
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
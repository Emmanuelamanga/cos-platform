// components/landing/case-stats.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Users, Globe2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaseStats() {
  const [stats, setStats] = useState({
    totalCases: 0,
    verifiedCases: 0,
    totalUsers: 0,
    countiesCovered: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, fetch from Supabase
        // For now, using mock data
        setStats({
          totalCases: 1248,
          verifiedCases: 987,
          totalUsers: 582,
          countiesCovered: 42
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto text-center max-w-[800px] mb-8 md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Making an Impact
          </h2>
          <p className="mt-2 text-muted-foreground md:text-lg">
            See how citizens are driving transparency through verified reporting.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={<FileCheck className="h-5 w-5" />}
            title="Total Cases"
            value={stats.totalCases}
            loading={loading}
            description="Cases submitted"
            className="bg-blue-50"
            iconClassName="text-blue-600"
          />
          <StatCard 
            icon={<FileCheck className="h-5 w-5" />}
            title="Verified Cases"
            value={stats.verifiedCases}
            loading={loading}
            description="Successfully verified"
            className="bg-green-50"
            iconClassName="text-green-600"
          />
          <StatCard 
            icon={<Users className="h-5 w-5" />}
            title="Active Users"
            value={stats.totalUsers}
            loading={loading}
            description="Citizen reporters"
            className="bg-purple-50"
            iconClassName="text-purple-600"
          />
          <StatCard 
            icon={<MapPin className="h-5 w-5" />}
            title="Counties Covered"
            value={stats.countiesCovered}
            loading={loading}
            description="Geographic reach"
            className="bg-amber-50"
            iconClassName="text-amber-600"
          />
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  loading: boolean;
  description: string;
  className?: string;
  iconClassName?: string;
}

function StatCard({ icon, title, value, loading, description, className, iconClassName }: StatCardProps) {
  return (
    <Card className={cn("border-none shadow-sm", className)}>
      <CardContent className="p-6 flex items-start space-x-4">
        <div className={cn("rounded-full p-2 bg-background", iconClassName)}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium">{title}</h3>
          {loading ? (
            <div className="h-7 w-20 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
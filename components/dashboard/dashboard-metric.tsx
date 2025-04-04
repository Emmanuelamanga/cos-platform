"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, FileWarning, Users, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetricProps {
  title: string;
  value: string;
  iconName: "file-check" | "file-warning" | "users" | string;
  description: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export function DashboardMetric({
  title,
  value,
  iconName,
  description,
  trend,
  trendDirection = "neutral",
}: DashboardMetricProps) {
  // Map icon names to actual Lucide icon components
  const iconMap: Record<string, LucideIcon> = {
    "file-check": FileCheck,
    "file-warning": FileWarning,
    "users": Users,
  };
  
  const Icon = iconMap[iconName] || FileCheck;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "ml-2 text-xs",
                    trendDirection === "up" && "text-green-600",
                    trendDirection === "down" && "text-red-600",
                    trendDirection === "neutral" && "text-gray-500"
                  )}
                >
                  {trend}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div>
            <div className="rounded-md bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
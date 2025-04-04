// components/dashboard/dashboard-header.tsx


import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}

// components/dashboard/dashboard-metric.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardMetricProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export function DashboardMetric({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = "neutral",
}: DashboardMetricProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trendDirection === "up" && "text-green-500",
              trendDirection === "down" && "text-red-500",
              trendDirection === "neutral" && "text-muted-foreground"
            )}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

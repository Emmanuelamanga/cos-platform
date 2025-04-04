"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Case } from "@/types";

export function RecentCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('status', 'verified')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        setCases(data || []);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError("Failed to load recent cases");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-5/6 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-20 w-full" />
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p>{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.length > 0 ? (
        cases.map((caseItem) => (
          <Link href={`/cases/${caseItem.id}`} key={caseItem.id}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <Badge>{caseItem.case_type}</Badge>
                  <Badge variant="outline" className="capitalize">
                    {caseItem.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{caseItem.short_description}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {caseItem.county} County
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(caseItem.observation_date)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <div className="col-span-3 text-center p-8">
          <p className="text-muted-foreground">No verified cases found.</p>
        </div>
      )}
    </div>
  );
}
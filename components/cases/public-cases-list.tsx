"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Case } from "@/types";
import { CaseListProps } from "@/types/props";

export function PublicCasesList({
  cases = [],
  query = "",
  selectedCounty = "",
  selectedType = "",
  selectedDate = "",
  isLoading = false,
  error = null,
}: CaseListProps) {
  const [activeCases, setActiveCases] = useState<Case[]>(cases);

  // If the cases prop changes (e.g., when filters are applied), update the state
  useEffect(() => {
    setActiveCases(cases);
  }, [cases]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
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
      <div className="p-6 text-center border rounded-md bg-red-50 border-red-200">
        <p className="text-red-700 mb-2">Error loading cases.</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (activeCases.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md">
        <p className="text-muted-foreground mb-2">No cases found</p>
        <p className="text-sm text-muted-foreground mb-4">
          {(query || selectedCounty || selectedType || selectedDate) 
            ? "Try adjusting your filters."
            : "There are no verified cases available yet."}
        </p>
        {(query || selectedCounty || selectedType || selectedDate) && (
          <Link href="/cases">
            <Button variant="outline" size="sm">Clear All Filters</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeCases.map((caseItem) => (
        <Card key={caseItem.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge>{caseItem.case_type}</Badge>
              <span className="text-xs text-muted-foreground">
                Verified
              </span>
            </div>
            <CardTitle className="text-lg mt-2 line-clamp-1">
              {caseItem.short_description}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {caseItem.detailed_description}
            </p>
            <div className="flex flex-wrap gap-4">
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
          <CardFooter>
            <Link href={`/cases/${caseItem.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
// app/(marketing)/cases/page.tsx
import { Metadata } from "next";
import { PublicCasesFilter } from "@/components/cases/public-cases-filter";
import { PublicCasesList } from "@/components/cases/public-cases-list";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServer } from "@/lib/supabase/server"; // Updated import
import { MainLayout } from "@/components/layout/main-layout";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Browse Cases | Citizen Observatory System",
  description: "Browse verified cases submitted by citizens.",
};

export default async function CasesPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    county?: string;
    type?: string;
    date?: string;
  };
}) {
  // Use the new function name
  const supabase = await getSupabaseServer();

  try {
    // Get filter values from URL
    const query = searchParams?.q || "";
    const selectedCounty = searchParams?.county || "";
    const selectedType = searchParams?.type || "";
    const selectedDate = searchParams?.date || "";

    // Start building the query
    let casesQuery = supabase.from("cases").select("*").eq("status", "verified");

    // Apply filters conditionally
    if (query) {
      casesQuery = casesQuery.like("short_description", `%${query}%`);
    }

    if (selectedCounty) {
      casesQuery = casesQuery.eq("county", selectedCounty);
    }

    if (selectedType) {
      casesQuery = casesQuery.eq("case_type", selectedType);
    }

    // Only apply date filter if a date is actually provided
    if (selectedDate && selectedDate.trim() !== "") {
      // Convert date string to a date range for that day (beginning to end of day)
      const dateObj = new Date(selectedDate);
      const startOfDay = format(dateObj, "yyyy-MM-dd'T'00:00:00'Z'");
      const endOfDay = format(dateObj, "yyyy-MM-dd'T'23:59:59'Z'");
      
      casesQuery = casesQuery.gte("observation_date", startOfDay).lte("observation_date", endOfDay);
    }

    // Add sorting by observation date, descending
    casesQuery = casesQuery.order("observation_date", { ascending: false });

    // Fetch all data in parallel
    const [casesResponse, countiesResponse, caseTypesResponse] = await Promise.all([
      // Execute the cases query
      casesQuery,
      
      // Fetch counties
      supabase
        .from("counties")
        .select("*")
        .order("name", { ascending: true }),
        
      // Fetch case types
      supabase
        .from("case_types")
        .select("*")
        .order("name", { ascending: true })
    ]);

    const { data: cases, error } = casesResponse;
    const { data: counties, error: countiesError } = countiesResponse;
    const { data: caseTypes, error: caseTypesError } = caseTypesResponse;

    if (error) {
      console.error("Error fetching cases:", error);
    }

    if (countiesError || caseTypesError) {
      console.error(
        "Error fetching reference data:",
        countiesError,
        caseTypesError
      );
    }

    return (
      <MainLayout>
        <div className="container py-10">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse Cases</h1>
              <p className="text-muted-foreground mt-2">
                Explore verified cases from citizens across all counties.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardContent className="p-4">
                  <PublicCasesFilter
                    counties={counties || []}
                    caseTypes={caseTypes || []}
                    selectedCounty={selectedCounty}
                    selectedType={selectedType}
                    selectedDate={selectedDate}
                    query={query}
                  />
                </CardContent>
              </Card>

              <div className="md:col-span-3 space-y-4">
                <h2 className="text-xl font-semibold">Verified Cases</h2>
                <Separator />
                <PublicCasesList
                  cases={cases || []}
                  query={query}
                  selectedCounty={selectedCounty}
                  selectedType={selectedType}
                  selectedDate={selectedDate}
                  isLoading={false}
                  error={error ? error.message : null}
                />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error: any) {
    console.error("Error in cases page:", error);
    
    // Return a fallback UI for error cases
    return (
      <MainLayout>
        <div className="container py-10">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse Cases</h1>
              <p className="text-muted-foreground mt-2">
                Explore verified cases from citizens across all counties.
              </p>
            </div>
            <div className="p-4 rounded-md bg-red-50">
              <p className="text-red-700">
                There was an error loading the cases. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
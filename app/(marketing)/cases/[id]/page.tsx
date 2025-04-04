// app/(dashboard)/cases/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await getSupabaseServer();
  
  try {
    const { data: caseData } = await supabase
      .from("cases")
      .select("short_description")
      .eq("id", params.id)
      .single();
    
    if (!caseData) {
      return {
        title: "Case Not Found",
        description: "The requested case could not be found",
      };
    }
    
    return {
      title: `${caseData.short_description} | Case Details`,
      description: caseData.short_description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Case Details",
      description: "View case details",
    };
  }
}

export default async function CasePage({ params }: Props) {
  const supabase = await getSupabaseServer();
  
  try {
    // Check authentication first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      // We'll use notFound for now, but you could redirect to sign-in instead
      notFound();
    }

    // Fetch case with reporter profile - but don't filter by status
    // This allows users to view their own cases regardless of status
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select(`
        *,
        reporter:reporter_id(id, full_name, county)
      `)
      .eq("id", params.id)
      .single();
    
    if (caseError || !caseData) {
      console.error("Error fetching case:", caseError);
      notFound();
    }
    
    // Check if the user is the owner of this case
    // This allows users to view their own cases only
    if (caseData.reporter_id !== user.id) {
      console.error("User is not authorized to view this case");
      notFound();
    }
    
    // Fetch evidence files
    const { data: evidenceFiles, error: filesError } = await supabase
      .from("evidence_files")
      .select("*")
      .eq("case_id", params.id);
    
    if (filesError) {
      console.error("Error fetching evidence files:", filesError);
    }
    
    // Format the case data with its relationships
    const caseWithRelations = {
      ...caseData,
      reporter: caseData.reporter,
      evidenceFiles: evidenceFiles || [],
    };
    
    function formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Link href="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to My Cases
            </Link>
          </div>
          
          <div>
            <DashboardHeader 
              heading={caseWithRelations.short_description}
              text={`View details of your case submission`}
            >
              <div className="flex items-center space-x-2">
                <Badge>{caseWithRelations.case_type}</Badge>
                <Badge variant={
                  caseWithRelations.status === 'verified' ? 'success' :
                  caseWithRelations.status === 'rejected' ? 'destructive' : 'outline'
                } className="capitalize">
                  {caseWithRelations.status}
                </Badge>
              </div>
            </DashboardHeader>
            
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {caseWithRelations.county} County
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Observed: {formatDate(caseWithRelations.observation_date)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Submitted: {formatDate(caseWithRelations.created_at)}
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {caseWithRelations.detailed_description}
                  </p>
                </div>
                
                {caseWithRelations.location_details && (
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-muted-foreground">
                      {caseWithRelations.location_details.address || "No address provided"}
                    </p>
                    
                    {caseWithRelations.location_details.coordinates && (
                      <div className="mt-2 rounded-md border h-[200px] bg-muted flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Map would be displayed here
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {caseWithRelations.evidenceFiles.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Supporting Evidence</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {caseWithRelations.evidenceFiles.map((file) => (
                        <div key={file.id} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground px-2 text-center">
                              {file.file_type.includes('image') ? 'Image' : 'File'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {caseWithRelations.status === 'verified' && (
                  <div>
                    <h3 className="font-medium mb-2">Verification Information</h3>
                    <p className="text-muted-foreground">
                      This case has been verified and is publicly visible.
                    </p>
                    <div className="mt-4">
                      <Link href={`/cases/${params.id}`}>
                        <Button variant="outline">
                          View Public Page
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {caseWithRelations.status === 'rejected' && (
                  <div className="p-4 border rounded-md bg-red-50 border-red-200">
                    <h3 className="font-medium mb-2 text-red-800">Rejection Reasons</h3>
                    <p className="text-red-700">
                      This case was rejected and is not publicly visible. 
                      You may submit a new case with updated information.
                    </p>
                  </div>
                )}
                
                {caseWithRelations.status === 'pending' && (
                  <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200">
                    <h3 className="font-medium mb-2 text-yellow-800">Pending Verification</h3>
                    <p className="text-yellow-700">
                      This case is currently being reviewed by our team.
                      You will be notified when the status changes.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Link href="/profile">
              <Button variant="outline">Back to My Cases</Button>
            </Link>
            <Link href="/submit-case">
              <Button>Submit Another Case</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in case detail page:", error);
    notFound();
  }
}
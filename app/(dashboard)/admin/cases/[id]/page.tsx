// app/(dashboard)/admin/cases/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { CaseVerificationForm } from "@/components/dashboard/case-verification-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getSupabaseServer } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  let caseDetail = null;
  let errorMessage = null;
  
  try {
    // Try to connect to Supabase
    const supabase = await getSupabaseServer();
    
    if (supabase) {
      // Attempt to fetch the basic case data
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', params.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no match
        
      if (caseError) {
        console.log("Error fetching case data:", caseError.message);
        errorMessage = `Database error: ${caseError.message}`;
      } else if (caseData) {
        // If case was found, fetch the related data
        
        // Fetch the reporter information safely
        let reporterData = null;
        if (caseData.reporter_id) {
          const { data: reporter } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', caseData.reporter_id)
            .maybeSingle();
            
          if (reporter) reporterData = reporter;
        }
        
        // Fetch evidence files safely
        let evidenceFiles = [];
        const { data: files } = await supabase
          .from('evidence_files')
          .select('*')
          .eq('case_id', params.id);
          
        if (files && files.length > 0) evidenceFiles = files;
        
        // Fetch verification history safely
        let verificationHistory = [];
        const { data: history } = await supabase
          .from('verification_records')
          .select('*')
          .eq('case_id', params.id)
          .order('created_at', { ascending: false });
          
        if (history && history.length > 0) {
          // Get admin names in a separate query to avoid join issues
          const adminIds = history.map(record => record.admin_id).filter(Boolean);
          let adminMap = {};
          
          if (adminIds.length > 0) {
            const { data: admins } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', adminIds);
              
            if (admins) {
              adminMap = admins.reduce((map, admin) => {
                map[admin.id] = admin.full_name;
                return map;
              }, {});
            }
          }
          
          verificationHistory = history.map(record => ({
            id: record.id,
            status: record.status,
            notes: record.verification_notes,
            admin: adminMap[record.admin_id] || "Unknown Admin",
            timestamp: record.created_at
          }));
        }
        
        // Construct the full case detail object with safe defaults
        caseDetail = {
          id: caseData.id,
          case_type: caseData.case_type || "Unknown",
          county: caseData.county || "Unknown",
          short_description: caseData.short_description || "No description available",
          detailed_description: caseData.detailed_description || "No detailed description available",
          observation_date: caseData.observation_date || new Date().toISOString(),
          location_details: caseData.location_details || { address: "No location details available" },
          status: caseData.status || "pending",
          reporter: reporterData ? {
            id: reporterData.id,
            name: reporterData.full_name || "Unknown",
            phone: reporterData.phone_number || "N/A",
            email: reporterData.email || "N/A"
          } : {
            id: "unknown",
            name: "Unknown Reporter",
            phone: "N/A",
            email: "N/A"
          },
          evidence_files: evidenceFiles.map(file => ({
            id: file.id,
            filename: file.file_path ? file.file_path.split('/').pop() : "unknown_file.jpg",
            file_type: file.file_type || "image/jpeg",
            file_path: file.file_path || "/api/placeholder/800/600",
            uploaded_at: file.created_at || new Date().toISOString()
          })),
          verification_history: verificationHistory,
          created_at: caseData.created_at || new Date().toISOString(),
          updated_at: caseData.updated_at || new Date().toISOString()
        };
      } else {
        // No data found with this ID
        errorMessage = `No case found with ID: ${params.id}`;
      }
    } else {
      errorMessage = "Could not connect to the database";
    }
  } catch (error) {
    console.log("Failed to fetch case data:", error);
    errorMessage = "An error occurred while retrieving case data";
  }

  // If no case data was found, display a "not found" message
  if (!caseDetail && !errorMessage) {
    errorMessage = "Case not found";
  }

  // If we have an error but no data, show the error page
  if (!caseDetail) {
    return (
      <div className="flex flex-col gap-8">
        <DashboardHeader heading="Case Not Found">
          <div className="flex items-center gap-2">
            <Link href="/admin/cases">
              <Button variant="outline">Back to Cases</Button>
            </Link>
          </div>
        </DashboardHeader>

        <Alert variant="destructive">
          <AlertDescription>{errorMessage || "Case data could not be retrieved"}</AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icons.warning className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Case Data Available</h2>
              <p className="text-muted-foreground mb-6">
                The requested case could not be found or there was an error retrieving it.
              </p>
              <Link href="/admin/cases">
                <Button>
                  Browse All Cases
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading={`Case ${caseDetail.id.substring(0, 8)}`}>
        <div className="flex items-center gap-2">
          <Link href="/admin/cases">
            <Button variant="outline">Back to Cases</Button>
          </Link>
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Case Information</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted on {format(new Date(caseDetail.created_at), "PPP 'at' p")}
                  </p>
                </div>
                <Badge 
                  variant={
                    caseDetail.status === "verified" ? "success" : 
                    caseDetail.status === "rejected" ? "destructive" : 
                    "outline"
                  }
                  className="capitalize"
                >
                  {caseDetail.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">{caseDetail.short_description}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">{caseDetail.case_type}</Badge>
                  <span className="text-sm text-muted-foreground">{caseDetail.county} County</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Detailed Description</h4>
                <p className="text-sm">{caseDetail.detailed_description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Location Details</h4>
                <p className="text-sm">{caseDetail.location_details?.address || "Address not provided"}</p>
                <div className="mt-2 rounded-md border h-[200px] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Map would be displayed here</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Evidence Files</h4>
                {caseDetail.evidence_files.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {caseDetail.evidence_files.map((file) => (
                      <div key={file.id} className="border rounded-md overflow-hidden">
                        <img 
                          src={file.file_path} 
                          alt={file.filename} 
                          className="w-full h-[150px] object-cover"
                        />
                        <div className="p-2 bg-muted text-xs truncate">
                          {file.filename}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No evidence files attached</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <p className="text-sm">{caseDetail.reporter.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Contact Information</h4>
                <p className="text-sm">
                  <Icons.phone className="inline h-3 w-3 mr-1" />
                  {caseDetail.reporter.phone}
                </p>
                <p className="text-sm">
                  <Icons.mail className="inline h-3 w-3 mr-1" />
                  {caseDetail.reporter.email}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  <Icons.phone className="mr-2 h-4 w-4" />
                  Call Reporter
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Email Reporter
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <CaseVerificationForm caseId={caseDetail.id} initialStatus={caseDetail.status} />
          
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              {caseDetail.verification_history.length > 0 ? (
                <div className="space-y-4">
                  {caseDetail.verification_history.map((record, index) => (
                    <div key={record.id} className="border-l-2 pl-4 pb-4 border-muted">
                      <p className="text-sm font-medium capitalize">{record.status.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(record.timestamp), "PPP 'at' p")} by {record.admin}
                      </p>
                      {record.notes && (
                        <p className="text-sm mt-1">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No verification history available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
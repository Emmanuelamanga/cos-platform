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
import { createServerClient } from "@/lib/supabase/server";
import { format } from "date-fns";

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const supabase = createServerClient();
  
  // In a real implementation, we'd fetch from Supabase
  // For now, using mock data
  const caseDetail = {
    id: params.id,
    case_type: "Infrastructure",
    county: "Nairobi",
    short_description: "Broken water pipe on Moi Avenue",
    detailed_description: 
      "There is a major water pipe burst on Moi Avenue near the junction with Tom Mboya Street. " +
      "This has been leaking for about 3 days now, causing flooding on the road and wasting a lot of water. " +
      "The water company should be informed to fix this urgently as it's affecting traffic and pedestrians in the area.",
    observation_date: "2023-06-18T14:30:00Z",
    location_details: {
      coordinates: {
        lat: -1.286389,
        lng: 36.817223
      },
      address: "Moi Avenue, CBD, Nairobi"
    },
    status: "pending",
    reporter: {
      id: "user-123",
      name: "John Doe",
      phone: "+254712345678",
      email: "john.doe@example.com"
    },
    evidence_files: [
      {
        id: "file-001",
        filename: "broken_pipe_photo.jpg",
        file_type: "image/jpeg",
        file_path: "/api/placeholder/800/600",
        uploaded_at: "2023-06-18T14:35:00Z"
      },
      {
        id: "file-002",
        filename: "location_map.jpg",
        file_type: "image/jpeg",
        file_path: "/api/placeholder/800/600",
        uploaded_at: "2023-06-18T14:36:00Z"
      }
    ],
    verification_history: [
      {
        id: "ver-001",
        status: "pending_verification",
        notes: "Assigned for verification",
        admin: "System",
        timestamp: "2023-06-18T15:00:00Z"
      }
    ],
    created_at: "2023-06-18T14:40:00Z",
    updated_at: "2023-06-18T15:00:00Z"
  };

  // If case not found
  if (!caseDetail) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading={`Case ${caseDetail.id}`}>
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
                <p className="text-sm">{caseDetail.location_details.address}</p>
                <div className="mt-2 rounded-md border h-[200px] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Map would be displayed here</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Evidence Files</h4>
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
              <div className="space-y-4">
                {caseDetail.verification_history.map((record, index) => (
                  <div key={record.id} className="border-l-2 pl-4 pb-4 border-muted">
                    <p className="text-sm font-medium capitalize">{record.status.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(record.timestamp), "PPP 'at' p")} by {record.admin}
                    </p>
                    {record.notes && (
                      <p className="text-sm mt-1">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
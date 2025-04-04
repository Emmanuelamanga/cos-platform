"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploader } from "@/components/forms/file-uploader";
import Link from "next/link";
import { UserNav } from "@/components/dashboard/user-nav";
import { createClient } from "@/lib/supabase/client";

type CaseType = {
  id: string; // Changed from number to string for UUID
  name: string;
  description?: string;
};

type County = {
  id: string; // Changed from number to string for UUID
  name: string;
};

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  county?: string;
  [key: string]: any;
};

type User = {
  id: string;
  email: string;
  [key: string]: any;
};

interface SubmitCaseClientProps {
  profile: Profile;
  caseTypes: CaseType[];
  counties: County[];
  user: User;
}

export default function SubmitCaseClient({
  profile,
  caseTypes,
  counties,
  user,
}: SubmitCaseClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [caseType, setCaseType] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [detailedDescription, setDetailedDescription] = useState<string>("");
  const [observationDate, setObservationDate] = useState<Date | undefined>(
    undefined
  );
  const [locationAddress, setLocationAddress] = useState<string>("");
  const [locationCoordinates, setLocationCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [contactConsent, setContactConsent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!caseType) {
      setError("Please select a case type");
      setIsSubmitting(false);
      return;
    }

    if (!county) {
      setError("Please select a county");
      setIsSubmitting(false);
      return;
    }

    if (!shortDescription) {
      setError("Please enter a short description");
      setIsSubmitting(false);
      return;
    }

    if (!detailedDescription) {
      setError("Please enter a detailed description");
      setIsSubmitting(false);
      return;
    }

    if (!observationDate) {
      setError("Please select an observation date");
      setIsSubmitting(false);
      return;
    }

    if (!locationAddress) {
      setError("Please enter a location address");
      setIsSubmitting(false);
      return;
    }

    if (!contactConsent) {
      setError("You must agree to be contacted for verification purposes");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Insert the case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert([
          {
            case_type: caseType,
            county: county,
            short_description: shortDescription,
            detailed_description: detailedDescription,
            observation_date: observationDate.toISOString(),
            location_details: {
              address: locationAddress,
              coordinates: locationCoordinates
            },
            status: 'pending',
            reporter_id: profile.id // Use profile.id instead of user.id
          }
        ])
        .select('id')
        .single();

      if (caseError) {
        throw new Error(caseError.message || 'Error submitting case');
      }

      // Step 2: If there are files to upload, handle them after case is created
      if (files.length > 0 && caseData?.id) {
        // Upload each file
        const filePromises = files.map(async (file) => {
          // Create a unique file path for the storage
          const filePath = `evidence/${caseData.id}/${Date.now()}_${file.name}`;
          
          // Upload file to storage
          const { error: uploadError } = await supabase
            .storage
            .from('evidence-files')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return null;
          }
          
          // Create an entry in the evidence_files table
          const { error: fileRecordError } = await supabase
            .from('evidence_files')
            .insert([
              {
                case_id: caseData.id,
                file_path: filePath,
                file_type: file.type
              }
            ]);
            
          if (fileRecordError) {
            console.error('Error recording file in database:', fileRecordError);
            return null;
          }
          
          return filePath;
        });
        
        // Wait for all file uploads to complete
        await Promise.all(filePromises);
      }

      // Step 3: Success handling
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        router.push("/profile");
        router.refresh(); // Refresh the page data to show the new case
      }, 2000);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || "There was an error submitting your case");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl">COS</span>
          </Link>
          <UserNav user={profile} />
        </div>
      </header>
      <main className="container-fluid py-8">
        <div className=" space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Submit a New Case
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill out the form below to report a case for verification and
              publication.
            </p>
          </div>

          {isSuccess ? (
            <Alert className="bg-green-50 border-green-200">
              <Icons.check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Case Submitted Successfully
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Your case has been submitted and is pending verification. You
                will be redirected to your profile page.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                  <CardDescription>
                    Provide accurate details about the case you want to report.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <Icons.alertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="case-type">Case Type</Label>
                      <Select value={caseType} onValueChange={setCaseType}>
                        <SelectTrigger id="case-type">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          {caseTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                              {type.description && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  - {type.description}
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county">County</Label>
                      <Select value={county} onValueChange={setCounty}>
                        <SelectTrigger id="county">
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.map((county) => (
                            <SelectItem key={county.id} value={county.name}>
                              {county.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short-description">Short Description</Label>
                    <Input
                      id="short-description"
                      placeholder="Brief summary of the case"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      {shortDescription.length}/100 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detailed-description">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="detailed-description"
                      placeholder="Provide a detailed description of the case"
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="observation-date">
                        Date of Observation
                      </Label>
                      <DatePicker
                        date={observationDate}
                        setDate={setObservationDate}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Location Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="location-address">
                          Address / Description
                        </Label>
                        <Input
                          id="location-address"
                          placeholder="E.g., Road name, landmark, area"
                          value={locationAddress}
                          onChange={(e) => setLocationAddress(e.target.value)}
                          required
                        />
                      </div>

                      <div className="rounded-md border h-[200px] bg-muted flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Map would be displayed here to select location
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Supporting Evidence</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload photos, videos, or documents to support your case
                      (up to 5 files, 10MB each)
                    </p>
                    <FileUploader
                      files={files}
                      setFiles={setFiles}
                      maxFiles={5}
                      maxSize={10}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="contact-consent"
                      checked={contactConsent}
                      onCheckedChange={(value) => setContactConsent(!!value)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="contact-consent"
                        className="text-sm font-medium leading-none"
                      >
                        Contact consent
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I agree to be contacted for verification purposes
                        regarding this case.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="flex items-center justify-end p-6 pt-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      "Submit Case"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
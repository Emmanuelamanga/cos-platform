"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CaseVerificationFormProps {
  caseId: string;
  initialStatus: string;
}

export function CaseVerificationForm({ caseId, initialStatus }: CaseVerificationFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"verified" | "rejected">(
    initialStatus === "verified" || initialStatus === "rejected" 
      ? initialStatus 
      : "verified"
  );
  const [notes, setNotes] = useState("");
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | "none">("none");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  // Disable the form if the case is already verified or rejected
  const isDisabled = initialStatus === "verified" || initialStatus === "rejected";
  
  const handleSubmit = async () => {
    if (isDisabled) return;
    
    try {
      setSubmitting(true);
      setAlert(null);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAlert({
          type: "error",
          message: "You must be logged in to verify cases"
        });
        return;
      }
      
      // Create verification record
      const { data: verificationRecord, error: verificationError } = await supabase
        .from('verification_records')
        .insert({
          case_id: caseId,
          admin_id: user.id,
          verification_notes: notes,
          contact_method: contactMethod,
          status: status
        })
        .select('id')
        .single();
        
      if (verificationError) {
        throw verificationError;
      }
      
    console.log(verificationRecord);
      
      
      // Update case status
      const { error: caseError } = await supabase
        .from('cases')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', caseId);
        
      if (caseError) {
        throw caseError;
      }
      
      setAlert({
        type: "success",
        message: `The case has been marked as ${status}`
      });
      
      // Refresh the page to show the updated status
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error verifying case:", error);
      setAlert({
        type: "error",
        message: "There was an error processing your verification. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Case</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alert && (
          <Alert variant={alert.type === "success" ? "default" : "destructive"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        
        {isDisabled ? (
          <div className="rounded-md bg-muted p-3 text-sm">
            This case has already been {initialStatus} and cannot be modified.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Verification Status</Label>
              <RadioGroup 
                value={status} 
                onValueChange={(value) => setStatus(value as "verified" | "rejected")}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="verified" id="verified" />
                  <Label htmlFor="verified" className="flex items-center cursor-pointer">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Verify Case
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected" className="flex items-center cursor-pointer">
                    <X className="h-4 w-4 mr-2 text-red-600" />
                    Reject Case
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Verification Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter verification details or rejection reason"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Contact Method Used</Label>
              <RadioGroup 
                value={contactMethod} 
                onValueChange={(value) => setContactMethod(value as "phone" | "email" | "none")}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="cursor-pointer">Phone Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="cursor-pointer">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="cursor-pointer">No Contact Made</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isDisabled || submitting || notes.trim().length === 0}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : status === "verified" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Verify Case
            </>
          ) : (
            <>
              <X className="mr-2 h-4 w-4" />
              Reject Case
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
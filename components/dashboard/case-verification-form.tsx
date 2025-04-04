"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseVerificationFormProps {
  caseId: string;
  initialStatus: string;
}

export function CaseVerificationForm({ caseId, initialStatus }: CaseVerificationFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState("");
  const [contactMethod, setContactMethod] = useState<string>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, send to Supabase
      // For now, just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update UI optimistically
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Verify Case</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Verification Status</Label>
            <RadioGroup
              value={status}
              onValueChange={setStatus}
              className="grid grid-cols-1 gap-2"
            >
              <Label
                htmlFor="status-pending"
                className={cn(
                  "flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  status === "pending_verification" && "border-primary"
                )}
              >
                <RadioGroupItem value="pending_verification" id="status-pending" />
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="font-medium">Pending Verification</p>
                  <p className="text-xs text-muted-foreground">Case requires more investigation</p>
                </div>
              </Label>
              <Label
                htmlFor="status-more-info"
                className={cn(
                  "flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  status === "more_information" && "border-primary"
                )}
              >
                <RadioGroupItem value="more_information" id="status-more-info" />
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">More Information Required</p>
                  <p className="text-xs text-muted-foreground">Need to contact reporter for details</p>
                </div>
              </Label>
              <Label
                htmlFor="status-verified"
                className={cn(
                  "flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  status === "verified" && "border-primary"
                )}
              >
                <RadioGroupItem value="verified" id="status-verified" />
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Verified</p>
                  <p className="text-xs text-muted-foreground">Case confirmed as authentic</p>
                </div>
              </Label>
              <Label
                htmlFor="status-rejected"
                className={cn(
                  "flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  status === "rejected" && "border-primary"
                )}
              >
                <RadioGroupItem value="rejected" id="status-rejected" />
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">Rejected</p>
                  <p className="text-xs text-muted-foreground">Case deemed inauthentic or invalid</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-method">Contact Method</Label>
            <RadioGroup
              value={contactMethod}
              onValueChange={setContactMethod}
              className="grid grid-cols-2 gap-2"
            >
              <Label
                htmlFor="contact-none"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  contactMethod === "none" && "border-primary"
                )}
              >
                <RadioGroupItem value="none" id="contact-none" />
                <span>None</span>
              </Label>
              <Label
                htmlFor="contact-phone"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  contactMethod === "phone" && "border-primary"
                )}
              >
                <RadioGroupItem value="phone" id="contact-phone" />
                <span>Phone</span>
              </Label>
              <Label
                htmlFor="contact-email"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  contactMethod === "email" && "border-primary"
                )}
              >
                <RadioGroupItem value="email" id="contact-email" />
                <span>Email</span>
              </Label>
              <Label
                htmlFor="contact-both"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted",
                  contactMethod === "both" && "border-primary"
                )}
              >
                <RadioGroupItem value="both" id="contact-both" />
                <span>Both</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-notes">Verification Notes</Label>
            <Textarea
              id="verification-notes"
              placeholder="Add any notes about the verification process"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Case Status"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
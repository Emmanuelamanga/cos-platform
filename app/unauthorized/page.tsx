// app/unauthorized/page.tsx
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Unauthorized Access</h1>
        
        <p className="mb-6 text-muted-foreground">
          You don&apos;t have permission to access this page. If you believe this is an error, please contact your administrator.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
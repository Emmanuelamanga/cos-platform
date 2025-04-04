// app/(dashboard)/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerClient();
  
  // Check if user is authenticated and is an admin
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/sign-in");
  }
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (!profile || profile.role !== "admin") {
    redirect("/");
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
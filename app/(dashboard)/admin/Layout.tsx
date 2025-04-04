// app/(dashboard)/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await getSupabaseServer();
  
  // Authentication checks...
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/sign-in");
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();
    
    if (!profile || profile.role !== "admin") redirect("/");
    
    // Simple, robust layout with proper overflow handling
    return (
      <div className="flex h-screen">
        {/* Sidebar - fixed width, full height, scrollable */}
        <aside className="w-64 h-screen overflow-y-auto bg-white border-r border-gray-200 flex-shrink-0">
          <AdminSidebar />
        </aside>
        
        {/* Main content - takes remaining width, full height, scrollable */}
        <main className="flex-1 h-screen overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in admin layout:", error);
    redirect("/sign-in?error=auth");
  }
}
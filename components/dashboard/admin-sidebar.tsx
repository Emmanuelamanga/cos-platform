// components/dashboard/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  FileText, 
  Home, 
  LogOut, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Cases",
    href: "/admin/cases",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-muted/40 h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-14 items-center px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-bold text-xl">COS</span>
            <span className="font-medium">Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto">
            <span className="font-bold text-xl">COS</span>
          </Link>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sm font-medium",
            collapsed && "justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign out"}
        </Button>
      </div>
    </div>
  );
}
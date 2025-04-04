// components/dashboard/admin-sidebar.tsx
// This is a suggested implementation if you need to modify your sidebar component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Users, 
  Settings,
  LogOut
} from "lucide-react"; // Assuming you're using lucide-react for icons

export function AdminSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold px-4">Admin Dashboard</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>
            <Link 
              href="/admin" 
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("/admin") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home size={18} />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/cases" 
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("/admin/cases") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText size={18} />
              <span>Case Management</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/users" 
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("/admin/users") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={18} />
              <span>User Management</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/settings" 
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("/admin/settings") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="py-4 border-t border-gray-200">
        <Link 
          href="/api/auth/signout" 
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
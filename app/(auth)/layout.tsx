// app/(auth)/layout.tsx
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-4 md:px-6 border-b">
        <div className="container flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl">COS</span>
          </Link>
          <nav className="flex gap-4 items-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-10 px-4 md:px-6">
        {children}
      </main>
      
      <footer className="py-6 px-4 md:px-6 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} Citizen Observatory System. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
// components/layout/main-layout.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl">COS</span>
            </Link>
            <nav className="hidden md:flex gap-6 ml-6">
              <Link
                href="/about"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                About
              </Link>
              <Link
                href="/cases"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Browse Cases
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" passHref>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
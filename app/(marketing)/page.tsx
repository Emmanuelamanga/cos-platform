// app/(marketing)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentCases } from "@/components/landing/recent-cases";
import { CaseStats } from "@/components/landing/case-stats";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { Footer } from "@/components/landing/footer";
import { LangSwitcher } from "@/components/landing/lang-switcher";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl">COS</span>
            </Link>
            <nav className="hidden md:flex gap-6 ml-6">
              <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
                About
              </Link>
              <Link href="/cases" className="text-sm font-medium hover:underline underline-offset-4">
                Browse Cases
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <Link href="/sign-in" passHref>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button size="sm">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <CaseStats />
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid items-center gap-6 md:max-w-6xl md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Help Build Transparency
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our Citizen Observatory System enables citizens to report cases, which are then verified
                and published to create a transparent repository of information.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link href="/sign-up" passHref>
                  <Button className="w-full sm:w-auto">
                    Submit a Case
                  </Button>
                </Link>
                <Link href="/cases" passHref>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Browse Cases
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold">How It Works</h3>
              <ul className="mt-4 grid gap-4">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Register an account</h4>
                    <p className="text-sm text-muted-foreground">
                      Create an account to start submitting cases
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Submit your case</h4>
                    <p className="text-sm text-muted-foreground">
                      Provide all required details and any supporting evidence
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Verification process</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team verifies the authenticity of your submission
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Case publication</h4>
                    <p className="text-sm text-muted-foreground">
                      Verified cases are published on our platform
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <FeatureSection />
        <section className="container py-12 md:py-24 lg:py-32 border-t">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Recent Verified Cases
          </h2>
          <RecentCases />
          <div className="mt-12 flex justify-center">
            <Link href="/cases" passHref>
              <Button size="lg" variant="outline" className="cursor-pointer">
                View All Cases
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
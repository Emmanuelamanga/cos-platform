// app/(marketing)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentCases } from "@/components/landing/recent-cases";
import { CaseStats } from "@/components/landing/case-stats";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { MainLayout } from "@/components/layout/main-layout";

export default function HomePage() {
  return (
    <MainLayout>
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
    </MainLayout>
  );
}
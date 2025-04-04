// components/landing/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-2 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Citizen Observatory System
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Empowering citizens to report, verify and track issues that matter in their communities.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/sign-up" passHref>
                <Button size="lg" className="w-full min-[400px]:w-auto cusor-pointer">
                  Get Started
                </Button>
              </Link>
              <Link href="/cases" passHref>
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto cursor-pointer">
                  Browse Cases
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:ml-auto">
            <div className="aspect-video overflow-hidden rounded-xl bg-background shadow-lg">
              <img 
                src="/truth-concept-composition-detective-desk.jpg" 
                alt="Citizens collaborating to report cases" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
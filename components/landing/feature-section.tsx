// components/landing/feature-section.tsx
import { Shield, FileCheck, Search, BarChart4 } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Platform Features
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our Citizen Observatory System provides powerful tools for citizens to report, track and analyze cases.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-12">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure Reporting"
            description="Submit cases securely with full control over your personal information."
          />
          <FeatureCard
            icon={<FileCheck className="h-10 w-10 text-primary" />}
            title="Verification Process"
            description="All cases go through a thorough verification process to ensure authenticity."
          />
          <FeatureCard
            icon={<Search className="h-10 w-10 text-primary" />}
            title="Case Tracking"
            description="Track the status of your submitted cases from submission to resolution."
          />
          <FeatureCard
            icon={<BarChart4 className="h-10 w-10 text-primary" />}
            title="Analytics & Insights"
            description="Gain valuable insights from verified cases with powerful analytics tools."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
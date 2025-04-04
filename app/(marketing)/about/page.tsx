// app/(marketing)/about/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/landing/footer";
import { MainLayout } from "@/components/layout/main-layout";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Citizen Observatory System",
  description: "Learn about our mission to empower citizens through transparent reporting.",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Citizen Observatory System
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Empowering citizens to create transparency through verified reporting
              </p>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                  The Citizen Observatory System (COS) was created with a clear mission: to empower citizens to report cases of various types, which are then verified and published to create a transparent repository of information.
                </p>
                <p className="text-muted-foreground">
                  We believe that when citizens are given the tools to report issues that affect their communities, and when those reports are verified and made publicly accessible, it creates accountability and drives positive change.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">How It Works</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        1
                      </div>
                      <CardTitle className="mt-2">Submit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Citizens register and submit cases with supporting evidence and details.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        2
                      </div>
                      <CardTitle className="mt-2">Verify</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Our team verifies the authenticity of cases through a rigorous process.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        3
                      </div>
                      <CardTitle className="mt-2">Publish</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Verified cases are published for public awareness and action.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Values</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Transparency</h3>
                    <p className="text-sm text-muted-foreground">
                      We believe in complete transparency in our processes and the information we publish.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Accountability</h3>
                    <p className="text-sm text-muted-foreground">
                      We hold ourselves and relevant stakeholders accountable through verified reporting.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Citizen Empowerment</h3>
                    <p className="text-sm text-muted-foreground">
                      We empower citizens to actively participate in improving their communities.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Data Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      We respect and protect the privacy of all users while enabling verification.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Join Our Effort</h2>
                <p className="text-muted-foreground">
                  We invite all citizens to join our platform and contribute to creating transparent, accountable communities. Your reports matter and can drive real change.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-up" passHref>
                    <Button className="w-full sm:w-auto">
                      Register Now
                    </Button>
                  </Link>
                  <Link href="/cases" passHref>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Browse Cases
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-2xl font-bold text-center">Our Team</h2>
              <p className="text-center text-muted-foreground">
                The Citizen Observatory System is run by a dedicated team committed to transparency and civic engagement.
              </p>
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-24 w-24 rounded-full bg-background overflow-hidden">
                    <Image 
                    width={150}
                    height={150}
                    src="/api/placeholder/150/150" alt="Team member" className="object-cover w-full h-full" />
                  </div>
                  <h3 className="font-bold">Sarah Kamau</h3>
                  <p className="text-sm text-muted-foreground text-center">Executive Director</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-24 w-24 rounded-full bg-background overflow-hidden">
                    <Image width={150}
                    height={150} src="/api/placeholder/150/150" alt="Team member" className="object-cover w-full h-full" />
                  </div>
                  <h3 className="font-bold">Daniel Ochieng</h3>
                  <p className="text-sm text-muted-foreground text-center">Technical Lead</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-24 w-24 rounded-full bg-background overflow-hidden">
                    <Image width={150}
                    height={150} src="/api/placeholder/150/150" alt="Team member" className="object-cover w-full h-full" />
                  </div>
                  <h3 className="font-bold">Amina Hassan</h3>
                  <p className="text-sm text-muted-foreground text-center">Verification Manager</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
              <div className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How are cases verified?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our verification team reviews all submitted cases by checking the provided evidence, contacting the reporter for more information if needed, and cross-referencing with other sources when applicable. We aim to maintain a high standard of accuracy and authenticity.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my personal information protected?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, we take data protection seriously. While we need contact information to verify cases, we do not publish personal details without consent. You can also choose what information is shared publicly with your verified case.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I submit anonymous reports?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      While you must register to submit a case (for verification purposes), you can choose to have your identity kept confidential when the case is published. However, completely anonymous submissions cannot be verified and thus cannot be published.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How long does verification take?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Typically, our verification process takes 2-5 business days, depending on the complexity of the case and how quickly we can verify the information provided. You can track the status of your case through your user profile.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MainLayout>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Footer } from "@/components/landing/footer";
import { Icons } from "@/components/ui/icons";
import { Mail, MapPin, Phone } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

export default function ContactPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real implementation, send to backend
      // For now, just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.log(error);
      setError("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Contact Us
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Have questions, feedback, or need assistance? We&apos;re here to
                help.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Fill out the form and our team will get back to you as soon as
                  possible.
                </p>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      info@citizenobservatory.org
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      For general inquiries
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+254 712 345 678</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monday-Friday, 9AM-5PM EAT
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-muted-foreground">Nairobi CBD, Kenya</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Visit by appointment only
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden h-64 mt-6">
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Map would be displayed here
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>
                      Send us a message and we&apos;ll respond as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {isSuccess && (
                        <Alert className="bg-green-50 border-green-200">
                          <Icons.check className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800">
                            Message Sent
                          </AlertTitle>
                          <AlertDescription className="text-green-700">
                            Thank you for your message. We&apos;ll get back to you
                            shortly.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          disabled={isSubmitting || isSuccess}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          disabled={isSubmitting || isSuccess}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={subject}
                          onValueChange={setSubject}
                          disabled={isSubmitting || isSuccess}
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select a subject</SelectLabel>
                              <SelectItem value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem value="support">
                                Technical Support
                              </SelectItem>
                              <SelectItem value="verification">
                                Verification Question
                              </SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="partnership">
                                Partnership Opportunity
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Your message"
                          disabled={isSubmitting || isSuccess}
                          required
                          rows={5}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || isSuccess}
                      >
                        {isSubmitting ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
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
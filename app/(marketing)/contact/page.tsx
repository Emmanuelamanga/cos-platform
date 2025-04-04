// app/(marketing)/contact/page.tsx
import { Metadata } from "next";
import ContactPageClient from "./client";

export const metadata: Metadata = {
  title: "Contact | Citizen Observatory System",
  description: "Get in touch with the Citizen Observatory System team.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
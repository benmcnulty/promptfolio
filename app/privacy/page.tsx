// app/privacy/PrivacyPolicyPage.tsx
import { Policy } from "@/components/Policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Promptfolio handles hosting records, local theme preferences, and links to external services.",
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return <Policy />;
}

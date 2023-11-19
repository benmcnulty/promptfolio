// app/privacy/PrivacyPolicyPage.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Policy } from "@/components/Policy";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <Policy />
      <Footer />
    </main>
  );
}

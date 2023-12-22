// app/about/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About us and our mission",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <About />
      <Footer />
    </main>
  );
}

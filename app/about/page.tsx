// app/about/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Ben McNulty's AI prompt engineering expertise and Promptfolio's mission to create specialized GPT agents for work, chat, and creative applications.",
  keywords: ["Ben McNulty", "AI prompt engineer", "GPT specialist", "artificial intelligence", "custom GPTs"],
  openGraph: {
    title: "About Promptfolio - AI Prompt Engineering Expertise",
    description: "Learn about Ben McNulty's AI prompt engineering expertise and Promptfolio's mission to create specialized GPT agents for work, chat, and creative applications.",
    type: "website",
    url: "https://promptfolio.dev/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Promptfolio - AI Prompt Engineering Expertise",
    description: "Learn about Ben McNulty's AI prompt engineering expertise and Promptfolio's mission to create specialized GPT agents.",
  },
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

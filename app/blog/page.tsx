// app/blog/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogContents } from "@/components/BlogContents";
import { Metadata } from "next";
import { FeaturedListings } from "@/components/FeaturedListings";
export const metadata: Metadata = {
  title: "Blog",
  description: "Latest News & Articles on our Custom GPTs & Prompt Engineering",
  keywords: ["AI blog", "prompt engineering", "GPT development", "artificial intelligence articles", "machine learning"],
  openGraph: {
    title: "Promptfolio Blog - AI & Prompt Engineering Insights",
    description: "Latest News & Articles on our Custom GPTs & Prompt Engineering",
    type: "website",
    url: "https://promptfolio.dev/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptfolio Blog - AI & Prompt Engineering Insights",
    description: "Latest News & Articles on our Custom GPTs & Prompt Engineering",
  },
};

export default function BlogPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <BlogContents />
      <FeaturedListings />
      <Footer />
    </main>
  );
}

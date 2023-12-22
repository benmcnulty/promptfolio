// app/blog/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogContents } from "@/components/BlogContents";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { FeaturedListings } from "@/components/FeaturedListings";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest News & Articles on our Custom GPTs & Prompt Engineering",
};

export default function BlogPage() {
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const filenames = fs.readdirSync(blogDirectory);

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const title = slug.replace(/-/g, " ").replace(".mdx", "");
    return { slug, title };
  });

  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <BlogContents posts={posts} />
      <FeaturedListings />
      <Footer />
    </main>
  );
}

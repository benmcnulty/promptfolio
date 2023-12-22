// app/blog/[slug]/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogPost } from "@/components/BlogPost";
import fs from "fs";
import path from "path";
import { useMDXComponents } from "@/mdx-components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest News & Articles on our Custom GPTs & Prompt Engineering",
};

interface BlogPageProps {
  params: { slug: string };
}

export default function SlugPage({ params }: BlogPageProps) {
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const fullPath = path.join(blogDirectory, `${params.slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const mdxContent = { source: fileContents };
  const components = useMDXComponents({});

  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <BlogPost content={mdxContent} components={components} />
      <Footer />
    </main>
  );
}

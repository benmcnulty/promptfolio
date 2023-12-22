// app/blog/[slug]/page.tsx
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import fs from "fs";
import path from "path";

interface BlogPageProps {
  params: { slug: string };
}

export default function SlugPage({ params }: BlogPageProps) {
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const fullPath = path.join(blogDirectory, `${params.slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <article>
        <MDXRemote source={fileContents} />
      </article>
      <Footer />
    </main>
  );
}

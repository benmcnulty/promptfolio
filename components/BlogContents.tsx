// components/BlogContents.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/sparkle";
import fs from "fs";
import path from "path";

export function BlogContents() {
  const blogDirectory = path.join(process.cwd(), "app/blog/(content)");
  const directories = fs
    .readdirSync(blogDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const posts = directories.map((directoryName) => {
    const slug = directoryName;
    const title = slug.replace(/-/g, " ");
    return { slug, title };
  });

  return (
    <section className="my-8 p-6 text-center bg-card rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2 text-lg">
            <Button variant="default" asChild className="w-full h-[3rem]">
              <Link href={`/blog/${post.slug}`}>
                <Sparkle width="12%" className="flip sparkle shaded mx-4" />
                {post.title}
                <Sparkle width="12%" className="sparkle shaded mx-4" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

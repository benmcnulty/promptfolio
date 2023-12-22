// component/BlogContents.tsx
import React from "react";
import Link from "next/link";

interface BlogContentsProps {
  posts: { slug: string; title: string }[];
}

export function BlogContents({ posts }: BlogContentsProps) {
  return (
    <section className="my-8 p-6 bg-card rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2 text-lg">
            <Link
              href={`/blog/${post.slug}`}
              className="text-primary hover:text-accent underline-offset-2 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

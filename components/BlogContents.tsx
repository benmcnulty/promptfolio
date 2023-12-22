// component/BlogContents.tsx
import React from "react";
import Link from "next/link";

interface BlogContentsProps {
  posts: { slug: string; title: string }[];
}

export function BlogContents({ posts }: BlogContentsProps) {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

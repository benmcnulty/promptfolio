// components/BlogContents.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { blog } from "@/lib/blog";

export function BlogContents() {
  const posts = blog
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      publishDate: new Date(post.publishDate),
      categories: post.categories,
      description: post.description,
      imageUrl: post.imageUrl,
    }))
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

  return (
    <section className="sm:my-0 md:m-6 lg:my-8 p-6 text-center bg-card rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold text-foreground mb-6">
        Blog Posts
      </h2>
      <ul>
        {posts.map((post) => (
          <li
            key={post.slug}
            className="mb-4 text-lg bg-background rounded-lg p-4 hover:shadow-lg hover:outline-none transition duration-300 ease-in-out"
          >
            <div className="flex flex-col md:flex-row items-center gap-x-4">
              <div className="flex-shrink-0 w-48 h-48 rounded-md overflow-hidden">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={200}
                    height={200}
                    className="object-cover w-full md:w-48 h-48 rounded-md"
                  />
                </Link>
              </div>
              <div className="flex-grow md:px-6 mt-4 md:mt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-2xl font-semibold tracking-tight text-foreground hover:underline header-shadow"
                >
                  {post.title}
                </Link>
                <p className="mt-2">{post.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Published on {post.publishDate.toISOString().split("T")[0]} |
                  Categories: {post.categories.join(", ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

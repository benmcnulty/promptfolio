// component/BlogPost.tsx
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

interface BlogPostProps {
  content: any;
}

export function BlogPost({ content }: BlogPostProps) {
  return (
    <>
      <MDXRemote {...content} />
      <div className="mt-4">
        <Link href="/blog" passHref>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Blog
          </button>
        </Link>
      </div>
    </>
  );
}

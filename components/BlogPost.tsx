// component/BlogPost.tsx
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/sparkle";
import Link from "next/link";

interface BlogPostProps {
  content: any;
}

export function BlogPost({ content }: BlogPostProps) {
  return (
    <article className="w-full mx-auto my-8 p-6 bg-card shadow-md overflow-hidden text-center">
      <MDXRemote {...content} />
      <div className="mx-auto mt-4 w-[90%] sm:w-[45%] md:w-[40%] lg:w-[33%] xl:max-w-[25%]">
        <Button variant="default" asChild className="w-full h-[3rem]">
          <Link href="/blog">
            <Sparkle width="12%" className="flip sparkle shaded mx-4" />
            Back to Blog
            <Sparkle width="12%" className="sparkle shaded mx-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

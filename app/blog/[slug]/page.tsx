// app/blog/[slug]/page.tsx
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

const blogDirectory = path.join(process.cwd(), "content/blog");
console.log("Blog Directory: ", blogDirectory); // Log the blog directory

export async function loader({ params }: { params: { slug: string } }) {
  console.log("Loader params:", params); // This will log the params in the server terminal

  const fullPath = path.join(blogDirectory, `${params.slug}.mdx`);
  console.log("Full Path:", fullPath); // Log the full path in the server terminal

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    console.log("File Contents:", fileContents); // Log the file contents in the server terminal

    const mdxSource = await serialize(fileContents);
    console.log("Serialized MDX:", mdxSource); // Log the serialized MDX in the server terminal

    return { props: { source: mdxSource } };
  } catch (error) {
    console.error("Error in loader:", error); // Log any errors that occur
    throw error; // Re-throw the error to ensure it's visible
  }
}

export default function SlugPage({ source }: { source: any }) {
  console.log("Source in SlugPage: ", source); // Log the received source

  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <article>
        <MDXRemote {...source} />
      </article>
      <Footer />
    </main>
  );
}

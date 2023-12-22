// app/blog/[slug]/page.tsx
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import Test from "./hello-world.mdx";

const components = { Test };

export default function TestPage({ source }: { source: any }) {
  return (
    <div className="wrapper">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, anywhere
  const source = "./hello-world.mdx";
  const mdxSource = await serialize(source);
  return { props: { source: mdxSource } };
}

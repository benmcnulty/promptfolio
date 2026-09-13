import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="blog-post">
      <div className="article-topline" aria-hidden="true"><span>Promptfolio writing</span><span>✦</span></div>
      {children}
      <nav aria-label="Article" className="article-return">
        <Link href="/blog" className="text-link article-return-link">
          <span className="article-return-arrow" aria-hidden="true">←</span>
          <span>Back to writing</span>
        </Link>
      </nav>
    </article>
  );
}

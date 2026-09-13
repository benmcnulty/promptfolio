import Image from 'next/image';
import Link from 'next/link';
import { blog } from '@/lib/blog';
import { ExternalLinkIcon } from './ExternalLinkIcon';
import { PageMotifIcon } from './PageMotifIcon';

export function BlogContents() {
  const posts = [...blog].sort((a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate));
  return (
    <section className="page-section writing-page" aria-labelledby="writing-page-title">
      <div className="page-heading page-heading--writing"><div className="page-heading-copy"><p className="eyebrow">Notes · 2024–2026</p><h1 id="writing-page-title">Writing</h1><p>Case studies and essays documenting the thinking, experiments, and creative practice behind Promptfolio.</p></div><PageMotifIcon kind="writing" /></div>
      <div className="archive-note"><span aria-hidden="true">✦</span><p>Earlier essays preserve the project’s original 2024 context. Product capabilities mentioned in them have not been revalidated as current claims.</p></div>
      <div className="article-list">{posts.map((post, index) => (
        <article key={post.slug} className="article-card">
          <Link href={`/blog/${post.slug}`} className="article-image" aria-label={`Read ${post.title}`}><Image src={post.imageUrl} alt="" fill preload={index === 0} quality={80} sizes="(max-width: 620px) calc(100vw - 2rem), (max-width: 1200px) calc(50vw - 2rem), 560px" /></Link>
          <div className="article-card-copy"><div className="article-meta"><time dateTime={post.publishDate}>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.publishDate))}</time><span>{post.categories[0]}</span></div><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p><Link className="text-link article-read-link" href={`/blog/${post.slug}`}>Read article <ExternalLinkIcon /></Link></div>
        </article>
      ))}</div>
    </section>
  );
}

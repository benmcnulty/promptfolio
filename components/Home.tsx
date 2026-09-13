import Link from 'next/link';
import Image from 'next/image';
import { blog } from '@/lib/blog';
import { FeaturedListings } from './FeaturedListings';
import { HomeSectionIcon } from './HomeSectionIcon';
import { PrismaticMark } from './PrismaticMark';
import { CatalogLabelIcon } from './CatalogLabelIcon';
import { HeroActionMark } from './HeroActionMark';

function HeroArrow() {
  return (
    <svg className="hero-action-arrow" aria-hidden="true" viewBox="0 0 34 24">
      <path className="hero-action-arrow-echo" d="M2.5 16.5h12" />
      <path className="hero-action-arrow-line" d="M3 12h24" />
      <path className="hero-action-arrow-head" d="m21 5.5 6.5 6.5-6.5 6.5" />
      <circle className="hero-action-arrow-glint" cx="9" cy="12" r="1.75" />
    </svg>
  );
}

export function Home() {
  const recentWriting = [...blog].sort((a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate)).slice(0, 3);
  return (
    <>
      <section className="home-hero">
        <div className="hero-background-drift" aria-hidden="true">
          <Image className="hero-background" src="/hero-optimized.webp" alt="" fill preload quality={80} sizes="100vw" />
        </div>
        <div className="home-hero-content">
          <div className="hero-title">
            <p className="eyebrow">AI craft <span aria-hidden="true">×</span> software engineering</p>
            <h1><span>Purpose-built</span><em>AI assistants,</em><span className="hero-title-tail">designed with intent.</span></h1>
          </div>
          <PrismaticMark />
          <div className="hero-lower">
            <p className="hero-copy">Promptfolio is Ben McNulty’s catalog of Custom GPT experiments for focused work, thoughtful conversation, and visual creativity.</p>
            <div className="hero-actions">
              <Link href="/listing" className="hero-action hero-action--primary"><span><strong>Enter the catalog</strong><small>Explore all 39 GPTs</small></span><HeroActionMark kind="catalog" /><HeroArrow /></Link>
              <Link href="/about" className="hero-action hero-action--secondary"><span><strong>Behind the work</strong><small>Read the project story</small></span><HeroActionMark kind="process" /><HeroArrow /></Link>
            </div>
          </div>
        </div>
      </section>
      <FeaturedListings />
      <section className="discovery-section" aria-labelledby="discover-title">
        <div className="section-heading section-heading--with-icon"><div><p className="eyebrow">Find a starting point</p><h2 id="discover-title">Explore by intent</h2></div><HomeSectionIcon kind="compass" /></div>
        <div className="intent-grid">
          <Link href="/listing?filter=work"><span className="intent-card-mark" data-category-mark="work" aria-hidden="true"><CatalogLabelIcon label="work" /></span><strong>Work</strong><span>Planning, research, communication, and prototyping.</span></Link>
          <Link href="/listing?filter=chat"><span className="intent-card-mark" data-category-mark="chat" aria-hidden="true"><CatalogLabelIcon label="chat" /></span><strong>Conversation</strong><span>Reflection, learning, and collaborative thinking.</span></Link>
          <Link href="/listing?filter=art"><span className="intent-card-mark" data-category-mark="art" aria-hidden="true"><CatalogLabelIcon label="art" /></span><strong>Art</strong><span>Concepts, images, characters, and creative direction.</span></Link>
        </div>
      </section>
      <section className="writing-preview" aria-labelledby="writing-title">
        <div className="section-heading section-heading--with-icon"><div><p className="eyebrow">Notes from the archive</p><h2 id="writing-title">Writing about human–AI collaboration</h2><p>Historical essays from 2024, preserved as a record of the project’s ideas and experiments.</p></div><HomeSectionIcon kind="archive" /></div>
        <div className="writing-grid">{recentWriting.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`}><time dateTime={post.publishDate}>{post.publishDate}</time><strong>{post.title}</strong><span>{post.description}</span></Link>)}</div>
        <Link href="/blog" className="text-link section-exit-link">
          <span>Read all writing</span><span className="section-exit-arrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}

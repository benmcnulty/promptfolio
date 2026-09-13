import Link from 'next/link';
import { PageMotifIcon } from './PageMotifIcon';
import { AboutActionArrow, AboutActionIcon } from './AboutActionIcon';
import { AboutCardMark } from './AboutCardMark';

export function About() {
  return (
    <section className="about-page">
      <div className="page-heading page-heading--about"><div className="page-heading-copy"><p className="eyebrow">About the project</p><h1>Promptfolio</h1><p>A working archive of experiments at the intersection of language, interface design, and software engineering.</p></div><PageMotifIcon kind="about" /></div>
      <div className="about-grid">
        <article><AboutCardMark kind="collection" /><p className="about-card-label">The collection</p><h2>What it explores</h2><p>Promptfolio collects Custom GPTs designed around a clear role or creative constraint. The catalog shows how language, interaction design, and domain framing can shape a useful AI experience.</p></article>
        <article><AboutCardMark kind="foundation" /><p className="about-card-label">The foundation</p><h2>How it is built</h2><p>The site is a statically rendered Next.js application with typed catalog data, accessible interactions, responsive image delivery, and automated browser, API, and component regression tests.</p></article>
        <article><AboutCardMark kind="maker" /><p className="about-card-label">The maker</p><h2>About Ben McNulty</h2><p>Ben is a software engineer and technical writer focused on prompt and context engineering, agentic workflows, and QA automation. Promptfolio shows how he turns nuanced product intent into tested, accessible interfaces through careful orchestration, evaluation, and design review.</p></article>
      </div>
      <div className="about-actions" aria-label="Next steps">
        <Link href="/listing" className="about-action about-action--catalog"><span className="about-action-icon"><AboutActionIcon kind="catalog" /></span><span><strong>Browse the catalog</strong><small>Explore all 39 GPTs</small></span><AboutActionArrow /></Link>
        <a href="https://github.com/benmcnulty" target="_blank" rel="noopener noreferrer" className="about-action about-action--github"><span className="about-action-icon"><AboutActionIcon kind="github" /></span><span><strong>View GitHub</strong><small>Explore Ben’s other projects</small></span><AboutActionArrow external /></a>
        <a href="https://benlive.tv" target="_blank" rel="noopener noreferrer" className="about-action about-action--site"><span className="about-action-icon"><AboutActionIcon kind="site" /></span><span><strong>Visit BenLive.tv</strong><small>Ben’s personal site</small></span><AboutActionArrow external /></a>
      </div>
    </section>
  );
}

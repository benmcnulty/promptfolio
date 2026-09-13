import Link from 'next/link';
import { GitHubButton } from './GitHubButton';
import { ThreadsButton } from './ThreadsButton';
import { PoweredByOpenAIBadge } from './PoweredByOpenAI';
import { CraftedAgentIcon, CraftedHeartIcon } from './CraftedIcons';
import { AnimatedBrandMark } from './AnimatedBrandMark';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-lockup">
          <AnimatedBrandMark className="footer-mark" size={58} />
          <div><strong>Promptfolio</strong><p>Custom GPT experiments for work, conversation, and art.</p></div>
        </div>
      </div>
      <div className="footer-directory">
        <div className="footer-connect">
          <p className="footer-label">Connect</p>
          <div className="social-links"><GitHubButton /><ThreadsButton /></div>
        </div>
        <div className="footer-explore">
          <p className="footer-label">Explore</p>
          <nav aria-label="Footer navigation"><Link href="/listing">Catalog</Link><Link href="/blog">Writing</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav>
        </div>
      </div>
      <div className="footer-meta">
        <p className="crafted"><span>Crafted with</span> <CraftedAgentIcon /> <span aria-hidden="true">&amp;</span> <CraftedHeartIcon /><span className="sr-only">agentic AI and love</span></p>
        <PoweredByOpenAIBadge />
        <p className="copyright">© 2023–2026 <a href="https://benlive.tv" target="_blank" rel="noopener noreferrer">Ben McNulty</a></p>
      </div>
    </footer>
  );
}

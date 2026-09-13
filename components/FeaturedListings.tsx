import Link from 'next/link';
import catalog from '@/lib/catalog';
import { Persona } from './Persona';
import { HomeSectionIcon } from './HomeSectionIcon';

export function FeaturedListings() {
  const featured = catalog.filter((item) => item.labels.includes('featured'));
  return (
    <section className="featured-section" aria-labelledby="featured-title">
      <div className="section-heading section-heading--with-icon">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="featured-title">Featured GPTs</h2>
          <p>Six examples spanning practical tools, creative direction, and collaborative thinking.</p>
        </div>
        <HomeSectionIcon kind="agent" />
      </div>
      <div className="catalog-grid">{featured.map((item, index) => <Persona key={item.name} personaData={item} headingLevel={3} preload={index === 0} />)}</div>
      <Link href="/listing" className="text-link section-exit-link">
        <span>Explore all 39 GPTs</span><span className="section-exit-arrow" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

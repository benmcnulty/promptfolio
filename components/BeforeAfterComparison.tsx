import FullScreenImage from './FullScreenImage';

interface BeforeAfterComparisonProps {
  before: string;
  after: string;
  alt: string;
  beforeCaption: string;
  afterCaption: string;
  width?: number;
  height?: number;
}

export function BeforeAfterComparison({ before, after, alt, beforeCaption, afterCaption, width = 1440, height = 900 }: BeforeAfterComparisonProps) {
  return (
    <section className="before-after-comparison" aria-label={`${alt} before and after comparison`}>
      <div>
        <p className="comparison-label">Before</p>
        <FullScreenImage src={before} alt={`${alt} before modernization`} width={width} height={height} caption={beforeCaption} credit="Production screenshot captured September 12, 2026" />
      </div>
      <div>
        <p className="comparison-label">After</p>
        <FullScreenImage src={after} alt={`${alt} after modernization`} width={width} height={height} caption={afterCaption} credit="Local review build captured September 12, 2026" />
      </div>
    </section>
  );
}

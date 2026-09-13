/* eslint-disable @next/next/no-img-element -- ImageResponse requires plain embedded image elements. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

const homepageCapture = readFileSync(
  join(process.cwd(), 'public', 'promptfolio-redesign-2026', 'social-home-source.png'),
).toString('base64');
const homepageCaptureDataUrl = `data:image/png;base64,${homepageCapture}`;

export function createSocialImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: '#100c1c', color: '#f9f7ff', fontFamily: 'Arial, sans-serif' }}>
      <img
        src={homepageCaptureDataUrl}
        width={1200}
        height={630}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', backgroundImage: 'linear-gradient(180deg, rgba(10, 7, 18, .04) 54%, rgba(10, 7, 18, .62) 100%), linear-gradient(90deg, rgba(10, 7, 18, .2), transparent 24%, transparent 76%, rgba(10, 7, 18, .18))' }} />
      <div style={{ position: 'absolute', inset: 20, display: 'flex', border: '1px solid rgba(238, 220, 255, .28)', borderRadius: 28, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.16)' }} />
    </div>,
    { width: 1200, height: 630 },
  );
}

/* eslint-disable @next/next/no-img-element -- ImageResponse requires plain embedded image elements. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

const mark = readFileSync(join(process.cwd(), 'public', 'icons', 'promptfolio-512.png')).toString('base64');
const markDataUrl = `data:image/png;base64,${mark}`;

export function createSocialImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: '#100c1c', color: '#f9f7ff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', backgroundImage: 'radial-gradient(circle at 82% 20%, rgba(91, 214, 232, .22), transparent 26%), radial-gradient(circle at 70% 75%, rgba(190, 90, 255, .3), transparent 40%), linear-gradient(135deg, #100c1c, #24132f 62%, #15233c)' }} />
      <div style={{ position: 'absolute', top: 34, left: 34, width: 1132, height: 562, display: 'flex', border: '1px solid rgba(227, 205, 255, .2)', borderRadius: 34, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12)', padding: '58px 66px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 720, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#dca4ff', fontSize: 24, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase' }}>AI craft × software engineering</div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', fontSize: 72, lineHeight: .92, letterSpacing: -4, fontWeight: 800 }}>
            <span>Purpose-built</span>
            <span style={{ color: '#eab3ff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 500 }}>AI assistants,</span>
            <span style={{ fontSize: 54, marginTop: 8 }}>designed with intent.</span>
          </div>
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 16, color: '#c6bfd2', fontSize: 25 }}>
            <img src={markDataUrl} width={54} height={54} alt="" />
            <span><strong style={{ color: '#fff' }}>Promptfolio</strong> by Ben McNulty</span>
          </div>
        </div>
        <img src={markDataUrl} width={330} height={330} alt="" style={{ filter: 'drop-shadow(0 24px 42px rgba(121, 66, 201, .38))' }} />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

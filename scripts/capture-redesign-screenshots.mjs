import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const baseUrl = process.env.PROMPTFOLIO_CAPTURE_URL ?? 'http://127.0.0.1:4173';
const outputDirectory = new URL('../public/promptfolio-redesign-2026/', import.meta.url);
const captures = [
  { route: '/', file: 'after-home-redesign.webp', width: 1440, height: 800 },
  { route: '/listing', file: 'after-catalog-redesign.webp', width: 1440, height: 800, scrollY: 150 },
  { route: '/blog', file: 'after-writing-redesign.webp', width: 1440, height: 800 },
  { route: '/about', file: 'after-about-mobile-redesign.webp', width: 390, height: 780 },
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const capture of captures) {
    const page = await browser.newPage({
      viewport: { width: capture.width, height: capture.height },
      colorScheme: 'dark',
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto(`${baseUrl}${capture.route}`, { waitUntil: 'networkidle' });
    if (capture.scrollY) await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), capture.scrollY);
    await page.evaluate(async () => {
      await document.fonts.ready;
      const visibleImages = Array.from(document.images).filter((image) => {
        const bounds = image.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      });
      await Promise.all(visibleImages.map((image) => image.complete ? Promise.resolve() : image.decode()));
    });
    const png = await page.screenshot({ animations: 'disabled' });
    const webp = await sharp(png).webp({ quality: 88, smartSubsample: true }).toBuffer();
    await writeFile(new URL(capture.file, outputDirectory), webp);
    await page.close();
  }
} finally {
  await browser.close();
}

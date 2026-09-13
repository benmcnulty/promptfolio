import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile(new URL('../public/promptfolio-mark.svg', import.meta.url));
const iconDir = new URL('../public/icons/', import.meta.url);
await mkdir(iconDir, { recursive: true });
await writeFile(new URL('../app/icon.svg', import.meta.url), source);

const renderMark = (size) => sharp(source).resize(size, size).png().toBuffer();
const transparentIcon = async (size, markSize = size) => sharp({
  create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
}).composite([{ input: await renderMark(markSize), gravity: 'center' }]).png().toBuffer();

for (const size of [192, 512]) {
  await writeFile(new URL(`../public/icons/promptfolio-${size}.png`, import.meta.url), await transparentIcon(size));
}

const maskable = await sharp({ create: { width: 512, height: 512, channels: 4, background: '#171225' } })
  .composite([{ input: await renderMark(356), gravity: 'center' }]).png().toBuffer();
await writeFile(new URL('../public/icons/promptfolio-maskable-512.png', import.meta.url), maskable);

const apple = await sharp({ create: { width: 180, height: 180, channels: 4, background: '#171225' } })
  .composite([{ input: await renderMark(146), gravity: 'center' }]).png().toBuffer();
await writeFile(new URL('../app/apple-icon.png', import.meta.url), apple);

const faviconSizes = [16, 32, 48, 64, 128, 256];
const faviconImages = await Promise.all(faviconSizes.map((size) => transparentIcon(size, Math.max(16, Math.round(size * .94)))));
const directorySize = 6 + faviconImages.length * 16;
let offset = directorySize;
const directory = Buffer.alloc(directorySize);
directory.writeUInt16LE(0, 0);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(faviconImages.length, 4);
faviconImages.forEach((image, index) => {
  const size = faviconSizes[index];
  const entry = 6 + index * 16;
  directory.writeUInt8(size === 256 ? 0 : size, entry);
  directory.writeUInt8(size === 256 ? 0 : size, entry + 1);
  directory.writeUInt8(0, entry + 2);
  directory.writeUInt8(0, entry + 3);
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL('../app/favicon.ico', import.meta.url), Buffer.concat([directory, ...faviconImages]));

import fs from 'node:fs';
import path from 'node:path';
import catalog from '@/lib/catalog';
import { blog } from '@/lib/blog';

describe('content inventory', () => {
  const catalogOrder = [
    'Concept Artist', 'Communicator', 'Alchemist', 'Robot Photographer',
    'Art Collaborator', 'Fluffy Chaos Friends', 'Brainstormer', 'Strategy',
    'Management', 'Prompt Mentor', 'Interaction Designer', 'Graphic Designer',
    'Web App Prototyper', 'Stock Photographer', 'Automation', 'AI Collaborator',
    'Copy Writer', 'Prompt QA', 'Researcher', 'Red Team', 'Prompt Engineer',
    'Trainer', 'Social', 'Delulu Hallulu', 'Delver', 'Challenger', 'Rubber Ducky',
    'AGI Time Capsule', 'Time Traveler', 'Intergalactic Traveler', 'Emoji Artist',
    'Delvein', 'Opal', 'Joy', 'Clod', "Season's Gratings", 'Happy New Year',
    'Winter Holiday', 'Promptfolio',
  ];

  it('preserves the catalog and article inventory', () => {
    expect(catalog).toHaveLength(39);
    expect(blog).toHaveLength(10);
    expect(catalog.map(({ name }) => name)).toEqual(catalogOrder);
  });

  it('has unique GPT names and destinations', () => {
    expect(new Set(catalog.map(({ name }) => name)).size).toBe(catalog.length);
    expect(new Set(catalog.map(({ link }) => link)).size).toBe(catalog.length);
    expect(catalog.every(({ link }) => link.startsWith('https://chatgpt.com/g/'))).toBe(true);
  });

  it('references existing local images', () => {
    for (const image of [
      ...catalog.map((item) => item.image),
      ...blog.map((post) => post.imageUrl),
    ]) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', image))).toBe(true);
    }
  });

  it('keeps the generated brand asset set available', () => {
    for (const asset of [
      'public/promptfolio-mark.svg',
      'public/icons/promptfolio-192.png',
      'public/icons/promptfolio-512.png',
      'public/icons/promptfolio-maskable-512.png',
      'app/icon.svg',
      'app/apple-icon.png',
      'app/favicon.ico',
    ]) {
      expect(fs.existsSync(path.join(process.cwd(), asset))).toBe(true);
    }
    const favicon = fs.readFileSync(path.join(process.cwd(), 'app/favicon.ico'));
    expect(favicon.readUInt16LE(2)).toBe(1);
    expect(favicon.readUInt16LE(4)).toBe(6);
  });

  it('uses only supported labels and has six featured entries', () => {
    const labels = catalog.flatMap((item) => item.labels);
    expect(new Set(labels)).toEqual(new Set(['featured', 'work', 'chat', 'art']));
    expect(catalog.filter(({ labels: itemLabels }) => itemLabels.includes('featured'))).toHaveLength(6);
  });

  it('keeps valid, unique historical article metadata and URLs', () => {
    expect(new Set(blog.map(({ slug }) => slug)).size).toBe(blog.length);
    expect(blog.every(({ publishDate }) => !Number.isNaN(Date.parse(publishDate)))).toBe(true);
    expect(blog.map(({ publishDate }) => publishDate)).toEqual(
      [...blog].map(({ publishDate }) => publishDate).sort(),
    );
    for (const { slug } of blog) {
      expect(fs.existsSync(path.join(process.cwd(), 'app/blog/(content)', slug, 'page.mdx'))).toBe(true);
    }
  });
});

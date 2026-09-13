export const siteUrl = 'https://www.promptfolio.dev';
export const siteName = 'Promptfolio by Ben McNulty';
export const siteDescription = 'A curated portfolio of 39 Custom GPT experiments and writing about AI interaction design, built by Ben McNulty.';
export const siteUpdatedAt = '2026-09-12';

export const personSchema = {
  '@type': 'Person',
  '@id': `${siteUrl}/about#ben-mcnulty`,
  name: 'Ben McNulty',
  url: 'https://benlive.tv',
  sameAs: [
    'https://github.com/benmcnulty',
    'https://www.threads.com/@promptfolio.dev',
  ],
} as const;

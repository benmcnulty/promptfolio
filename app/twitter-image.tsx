import { createSocialImage } from '@/lib/social-image';

export const runtime = 'nodejs';
export const alt = 'Promptfolio by Ben McNulty — purpose-built AI assistants, designed with intent.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return createSocialImage();
}

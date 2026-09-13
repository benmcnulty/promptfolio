/** @jest-environment node */

import { GET as getListings } from '@/app/api/listing/route';
import { GET as getBlog } from '@/app/api/blogdata/route';
import { GET as getTime } from '@/app/api/time/route';

describe('public API contracts', () => {
  it('returns work GPTs with the stable response shape', async () => {
    const response = await getListings();
    const items = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(items).toHaveLength(20);
    for (const item of items) {
      expect(Object.keys(item)).toEqual(['name', 'description', 'link', 'image', 'alt']);
    }
  });

  it('returns blog posts newest first without changing the shared source', async () => {
    const response = await getBlog();
    const posts = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(posts).toHaveLength(10);
    expect(posts.map((post: { publishDate: string }) => post.publishDate)).toEqual(
      [...posts]
        .map((post: { publishDate: string }) => post.publishDate)
        .sort((a, b) => Date.parse(b) - Date.parse(a)),
    );
    expect(Object.keys(posts[0])).toEqual([
      'slug', 'title', 'publishDate', 'categories', 'description', 'imageUrl', 'url',
    ]);
  });

  it('returns a valid current ISO timestamp', async () => {
    const before = Date.now();
    const response = await getTime();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(data.message).toBe('Hello from the edge!');
    expect(Date.parse(data.time)).toBeGreaterThanOrEqual(before);
    expect(Date.parse(data.time)).toBeLessThanOrEqual(Date.now());
  });
});

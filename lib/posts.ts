import { readdir as read } from "fs";
import { promisify } from "util";

const readdir = promisify(read);

interface Post {
  slug: string;
  title: string;
  publishDate: string;
}

export async function getPosts(): Promise<Post[]> {
  // Retrieve slugs from post routes
  const slugs = (
    await readdir("../host/app/blog/(content)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());

  // Retrieve metadata from MDX files
  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(
        `../host/app/blog/(content)/${name}/page.mdx`
      );
      return { slug: name, ...metadata };
    })
  );

  // Sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return posts;
}

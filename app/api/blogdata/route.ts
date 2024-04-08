// app/api/blogdata/route.ts
import blog from "@/lib/blog";

export const runtime = "edge";

export async function GET() {
  // Sort blog posts in chronological order based on their publish date
  const sortedBlogPosts = blog.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Format the blog posts for the API response
  const formattedBlogPosts = sortedBlogPosts.map(
    ({ slug, title, publishDate, categories, description, imageUrl }) => ({
      slug,
      title,
      publishDate,
      categories,
      description,
      imageUrl,
      url: `https://www.promptfolio.dev/blog/${slug}`, // Construct the full URL
    })
  );

  return new Response(JSON.stringify(formattedBlogPosts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// app/api/listing/route.ts
import catalog from "@/lib/catalog";

export async function GET() {
  // Filter catalog to include only 'work' related listings
  const workRelatedListings = catalog.filter((item) =>
    item.labels.includes("work")
  );

  // Remove new fields for API response
  const formattedListings = workRelatedListings.map(
    ({ name, description, link, image, alt }) => ({
      name,
      description,
      link,
      image,
      alt,
    })
  );

  return new Response(JSON.stringify(formattedListings), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

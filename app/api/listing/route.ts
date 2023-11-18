// app/api/listing/route.ts
import Listing from "@/lib/gpts";

export const runtime = "edge";

export async function GET() {
  return new Response(JSON.stringify(Listing), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

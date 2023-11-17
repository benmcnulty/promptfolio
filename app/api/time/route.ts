// app/api/time/route.ts
export const runtime = "edge";

export async function GET() {
  const serverTime = new Date().toISOString();
  const message = "Hello from the edge!";
  return new Response(JSON.stringify({ time: serverTime, message: message }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

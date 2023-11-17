// app/api/time/route.ts
export const config = {
  runtime: "experimental-edge",
};

export async function GET() {
  const serverTime = new Date().toISOString();
  return new Response(JSON.stringify({ time: serverTime }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

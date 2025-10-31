import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const pathname = slug.join("/");
  const proxyURL = new URL(pathname, process.env.API_URL);
  const proxyRequest = new Request(proxyURL, request);
  try {
    return fetch(proxyRequest);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}

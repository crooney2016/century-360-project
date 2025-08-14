import { handler } from "@/graphql/server";
import type { NextRequest } from "next/server";

// Export the handler for both GET and POST requests
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

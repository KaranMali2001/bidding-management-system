import { getTokenServer } from "@/utils/getTokenServer";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getTokenServer();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Optional: Configure matcher to specify which routes this middleware should run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|projects).*)",
  ],
};

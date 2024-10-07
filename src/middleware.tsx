import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("accessAltern8User");
  const { pathname } = request.nextUrl;

  // change public pages, if you want to add or edit some public routes
  const publicPages = [
    "/login",
    "/register",
    "/dashboard",
    "/help",
    "/reset-password",
    "/dashboard/referral",
    "/dashboard/upload-file",
    "/dashboard/help",
    "/dashboard/rera-template",
    "/calendar",
    "/",
    "/dashboard/ledger",
  ];
  if (!cookie && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (cookie && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

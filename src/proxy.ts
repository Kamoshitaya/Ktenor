import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "@/i18n/config";

/**
 * Every page lives under /sk or /en. A request without a locale is sent to the
 * visitor's remembered choice, falling back to Slovak — never to a language
 * picker page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = remembered && isLocale(remembered) ? remembered : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip static assets, anything with a file extension, and /admin and /demo
  // — both live outside [locale] entirely and would otherwise get bounced to
  // a non-existent /sk/admin/... or /sk/demo/... path.
  matcher: ["/((?!_next|api|admin|demo|.*\\..*).*)"],
};

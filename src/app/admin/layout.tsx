import "../globals.css";

/**
 * `/admin` sits outside `[locale]`, which is the only place in this app that
 * currently provides `<html>/<body>` — so this route needs its own, the same
 * way `global-error.tsx` stands alone. It reuses the design tokens from
 * globals.css (imported once, Next dedupes it against the locale layout's
 * copy) but skips next/font, the theme cookie and the language machinery
 * entirely: this is an internal tool for one person, always dark, no reason
 * to carry the public site's bilingual/theming plumbing into it.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <body
        className="min-h-dvh bg-bg text-text antialiased"
        style={{ fontFamily: "-apple-system, Segoe UI, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}

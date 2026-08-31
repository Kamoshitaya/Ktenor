import localFont from "next/font/local";

/**
 * Self-hosted so the site makes zero third-party font requests.
 *
 * Only 400 and 500 ship. Nothing in the design uses 600 or 700, and preloaded
 * weights are paid for on the critical path whether or not a glyph is drawn —
 * dropping the three unused files takes the font payload from 133 KB to 79 KB.
 */
export const clashDisplay = localFont({
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
  src: [
    { path: "./ClashDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "./ClashDisplay-500.woff2", weight: "500", style: "normal" },
  ],
});

export const satoshi = localFont({
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
  src: [
    { path: "./Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./Satoshi-500.woff2", weight: "500", style: "normal" },
  ],
});

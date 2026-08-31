import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/** Rendered at build time — nothing here changes per request. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ktenor";

/**
 * Generated rather than hand-exported so it can never drift from the brand or
 * the copy. The renderer only understands TTF/OTF, so this uses the desktop
 * cut of Clash Display — it is read at build time and never sent to a browser.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(isLocale(locale) ? locale : "sk");

  const font = await readFile(
    join(process.cwd(), "src/assets/og/ClashDisplay-Medium.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0C11",
          padding: "72px",
          fontFamily: "Clash Display",
          color: "#EEEFF4",
        }}
      >
        {/* Soft accent bloom, echoing the hero object's cold highlight */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(110,143,196,0.30) 0%, rgba(11,12,17,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Compact mark: at this size the three bars collapse into a smudge
              against the leg, so they are dropped exactly as on the favicon. */}
          <svg width="55" height="60" viewBox="0 0 272 299">
            <path d="M0 0h41v299H0z" fill="#EEEFF4" />
            <path d="M187 0h57L75 173l-33-16z" fill="#EEEFF4" />
            <path d="M118 161l130 138h-59L79 182z" fill="#EEEFF4" />
            <circle cx="263.5" cy="263" r="8.5" fill="#6E8FC4" />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: 8, textTransform: "uppercase" }}>
            Ktenor
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.08, maxWidth: 900 }}>
            {t.hero.headline}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 44,
            }}
          >
            <div style={{ width: 8, height: 34, borderRadius: 999, background: "#6E8FC4" }} />
            <div style={{ width: 8, height: 34, borderRadius: 999, background: "#46618F" }} />
            <div style={{ width: 8, height: 34, borderRadius: 999, background: "#2A3A55" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Clash Display",
          data: font,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}

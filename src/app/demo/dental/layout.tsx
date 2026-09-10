import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import "./dental.css";

/**
 * Root & Bloom runs as its own document: this route declares its own <html>,
 * so nothing from the Ktenor site — tokens, theme, fonts, cursor, smooth
 * scroll — reaches it. A demo is only convincing if it is genuinely a
 * different brand rather than the studio's design in different colours.
 *
 * latin-ext is not optional here: without it every Slovak č, š, ž, ľ and ô
 * falls back to a system font mid-word.
 */
const display = Quicksand({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-dental-display",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-dental-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Root & Bloom Family Dental — Bratislava",
  description:
    "Demo build by Ktenor: a fictional family dental practice in Bratislava. Services and prices, the team, a live booking flow and a treatment cost estimator.",
  /*
   * Deliberately kept out of search results. The clinic does not exist, and an
   * indexed page with an address and a phone number would eventually be read
   * as a real business by someone who never saw the demo banner.
   */
  robots: { index: false, follow: false },
};

export default function DentalDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}

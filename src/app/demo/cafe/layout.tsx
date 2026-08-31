import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./cafe.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Standalone root for this route, same pattern as /admin: no shared globals,
 * no shared header/footer/theme with the main Ktenor site. It is its own
 * brand end to end. `noindex` because it's a fictional business — the
 * demo should stay browsable from Ktenor's portfolio, not show up in search
 * results as if it were a real Bratislava café.
 */
export const metadata: Metadata = {
  title: "Ember & Oak — Coffee House, Bratislava (Ktenor demo)",
  description:
    "A quiet coffee house in Staré Mesto, Bratislava — espresso, breakfast and pastry made in small batches every morning. A fictional demo project by Ktenor.",
  robots: { index: false, follow: true },
};

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

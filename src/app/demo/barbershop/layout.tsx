import type { Metadata } from "next";
import { Oswald, Work_Sans } from "next/font/google";
import "./barbershop.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["500", "600", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans-bb",
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Standalone root, same pattern as /admin and /demo/cafe: own fonts, own
 * palette, nothing shared with the main site or the other demo. `noindex`
 * because it's a fictional business, not a real Bratislava barbershop.
 */
export const metadata: Metadata = {
  title: "Forge & Blade — Barbershop, Bratislava (Ktenor demo)",
  description:
    "Precision fades, straight razor shaves and beard work in Staré Mesto, Bratislava. A fictional demo project by Ktenor.",
  robots: { index: false, follow: true },
};

export default function BarbershopLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

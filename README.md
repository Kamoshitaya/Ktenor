# Ktenor

Official website of Ktenor, a web studio based in Bratislava.
Live at [ktenor.online](https://ktenor.online).

Slovak and English, dark and light, built from scratch — no template, no page
builder.

## Stack

- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4, design tokens defined in `src/app/globals.css`
- Clash Display and Satoshi, self-hosted through `next/font/local`
- Lenis for smooth scrolling
- Postgres (via Neon) for reviews, through `@neondatabase/serverless`
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000` and redirects to the visitor's
language.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build locally |
| `npm run lint` | ESLint |
| `npm run media` | Re-encode the hero video and poster from `media-src/` |

`npm run media` is only needed when the source footage changes. It writes WebM
and MP4 at two widths plus a WebP poster into `public/media/`, which is what the
site actually ships.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Origin used for canonicals, sitemap, hreflang and the OG image |
| `RESEND_API_KEY` | for email | Sends the enquiry notification and the confirmation |
| `CONTACT_FROM_EMAIL` | for email | Verified sender address |
| `CONTACT_TO_EMAIL` | no | Where enquiries arrive; defaults to the address in `src/lib/site.ts` |
| `SHEET_WEBHOOK_URL` | for the log | Apps Script endpoint that appends an enquiry row |
| `SHEET_WEBHOOK_SECRET` | for the log | Shared secret checked by that script |
| `DATABASE_URL` | for reviews | Postgres connection string, set automatically when Postgres storage is provisioned from the Vercel dashboard |
| `ADMIN_PASSWORD` | for reviews | Gates `/admin/reviews`, the review moderation page |

Only `NEXT_PUBLIC_SITE_URL` is exposed to the browser. Everything else stays on
the server.

Full setup instructions are in [`docs/CONTACT-SETUP.md`](docs/CONTACT-SETUP.md)
and [`docs/REVIEWS-SETUP.md`](docs/REVIEWS-SETUP.md).

## Project notes

- [`docs/BRIEF.md`](docs/BRIEF.md) — the agreed specification: palette, pricing,
  voice, and the decisions behind them
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — what is done and what comes next

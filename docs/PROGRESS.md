# Progress

Last updated: 2026-08-08

## Done

**Foundation**
- [x] Project on `D:\ktenor`, npm cache on `D:\npm-cache`, remote `gwstge/Ktenor`
- [x] Next.js 16.3 + React 19.2 + TypeScript + Tailwind v4
- [x] Clash Display + Satoshi self-hosted (~133 KB, zero third-party requests)
- [x] Token system: both themes as designed counterparts, glass tiers with
      degradation, fluid type scale, motion and z-index scales, WCAG AA floor
- [x] Logo rebuilt as SVG from measured geometry; `icon.svg`, `favicon.ico`
      (16/32/48), compact cut for small sizes

**Structure**
- [x] `/sk` and `/en`, bare domain redirects to the remembered language
- [x] Typed dictionaries — a missing translation is a type error
- [x] Theme applied before first paint; choice persisted for a year
- [x] Weak-device probe drops the glass blur before anything renders
- [x] Header with focus-trapped mobile menu; extended footer

**Content**
- [x] Hero — dark in both themes, video attaches after mount
- [x] Work, Services (+ add-ons), Process, Principles, Advantages, FAQ,
      final CTA, Contact form
- [x] Testimonials built but gated behind `site.features.testimonials`
- [x] Intro screen — bars track real readiness, mark flies to the header

**Motion**
- [x] Lenis smooth scroll; scroll locking goes through it, never body overflow
- [x] Scroll reveals with an observer plus three independent fallbacks, so
      content can never be left permanently invisible
- [x] Quiet custom cursor: dot + lagging ring, real pointers only

**Edges**
- [x] Privacy Policy describing only what the site actually does
- [x] Branded 404 and 500, dependency-free global error page
- [x] sitemap.xml with per-locale alternates, robots.txt
- [x] OG image generated from the dictionary at build time

- [x] `favicon.ico` verified (200, correct geometry)
- [x] Responsive pass at 375 / 768 / 1440: no horizontal overflow, grids
      reflow 1/2/3 columns, headline scales 44 → 96px, mobile menu toggles
      `aria-expanded`, `aria-hidden` and `inert` correctly
- [x] Touch targets brought to the 44px floor
- [x] Pushed to GitHub — `origin/main` is in sync

- [x] Hero media re-encoded with `npm run media` (ffmpeg-static, dev only):
      VP9 + H.264 at 1920 and 1280, poster to WebP. **5156 KB → 204 KB** for
      the video and 1455 KB → 18 KB for the poster, at SSIM 0.993. Sources
      live in `media-src/` and never ship
- [x] Font payload 133 KB → 80 KB: 600 and 700 were preloaded but never drawn

**Reviews**
- [x] Star rating (required) + optional short quote, name required; stored in
      Postgres (Neon), starts `pending`, never shown until approved
- [x] `/admin/reviews` — password-gated, stateless signed-cookie session
      (7 days), approve/reject/edit/delete, plus adding one manually
- [x] Public `/sk/reviews` and `/en/reviews`: grid of approved reviews + the
      submission form, empty state when there are none yet
- [x] Homepage teaser (replaces the old "Coming soon" placeholder): up to 6
      reviews + "See all reviews", or the empty state + "Leave a review"
- [x] "Reviews" added to the header nav, pointing at the real page rather
      than an in-page anchor like the rest of the menu
- [x] Owner gets an emailed notification per submission (same Resend setup
      as the contact form) with a link straight to the admin page
- [x] Same anti-spam shape as the contact form: honeypot, minimum fill time,
      per-IP rate limit
- [x] Everything degrades honestly with no database configured: empty state
      everywhere reviews would show, submissions fail with a real error
      rather than a fake success — verified via a clean production build
      with no `DATABASE_URL` set

## Live

https://ktenor.online — apex is primary, `www` 308-redirects to it, `/` sends
visitors to their remembered locale. Verified in production: sitemap, robots,
canonicals and hreflang all resolve against the real domain, the OG image
renders (73 KB PNG), unknown paths return a real 404, and every media variant
is served with the right content type at its encoded weight.

## Resume here (next session)

1. **Connect the repo in Vercel** — owner action; the code is pushed and the
   production build is clean. Standard Vercel domain for now; the custom one
   is a single env var later.
2. Then: the four demo projects (cafe, store, dental, real estate). Structure
   of each is to be agreed separately, one at a time.

**Decided, do not raise again:** the owner has chosen not to have the Slovak
copy proof-read by a native speaker. The assessment was given — the risk sits
in the persuasive copy (hero headline, service descriptions, FAQ, principles)
rather than in interface labels — and the decision is his.

**Vercel:** `NEXT_PUBLIC_SITE_URL` must be set to the deployed URL, otherwise
canonicals, sitemap, hreflang and the OG image all resolve against the
placeholder domain. `ffmpeg-static` pulls an ~80 MB binary on install; if a
build ever fails on it, move it out of the dependency list — the encoded media
is committed and nothing at build time needs ffmpeg.

## Open questions

1. **Reviews has nowhere to store anything yet.** `DATABASE_URL` and
   `ADMIN_PASSWORD` are unset, so a submission currently fails honestly
   rather than pretending. See `REVIEWS-SETUP.md`.
2. **Slovak proof-read** — declined for now, see below.

## Conventions

- Nothing in `BRIEF.md` changes without the owner's approval.
- Each finished section gets its own commit.
- Prices, timelines and section ids live in `src/content/services.ts` — stated
  once, never duplicated into copy.
- Secrets are never committed. `.env.local` is ignored; production values live
  in the Vercel dashboard.

# KTENOR — agreed brief

Single source of truth. Every item below was confirmed with the owner before
implementation. Nothing here changes without his approval.

Last updated: 2026-08-08

---

## 1. Product

Official website of **Ktenor** — a one-person web studio. Written `KTENOR` in the
logo, `Ktenor` in copy.

Goal: the site itself is the proof of skill. A visitor should conclude within
seconds that this developer builds premium-grade websites.

Style: **Premium Minimalism**. Inspired by Apple's restraint, never a copy of it.

## 2. Stack

- Next.js 16 (App Router) · TypeScript · Tailwind v4
- npm. Project lives on `D:\ktenor`, npm cache redirected to `D:\npm-cache`
- Repo: https://github.com/gwstge/Ktenor (public) · deploy: Vercel
- Animation libraries allowed **only where they earn their place**: GSAP +
  ScrollTrigger, Lenis. Framer Motion deliberately not installed — CSS and GSAP
  cover the need at a fraction of the payload.
- i18n is hand-rolled (typed dictionaries + `[locale]` segment). No i18n
  dependency: minimal dependencies is an explicit priority.

## 3. Languages

Slovak (default) and English **only**. No Russian anywhere on the site.

- `/sk` and `/en`; the bare domain redirects to `/sk`
- Text switcher `SK / EN` in the header next to the theme toggle — no flags
- Choice persisted, so a returning visitor lands on their language
- Copy is written in EN + SK; Slovak would benefit from a native proof-read

## 4. Brand

### Colour

| Token | Dark (default) | Light |
|---|---|---|
| Background | `#0B0C11` | `#F3F4F7` |
| Raised surface | `#101319` | `#FAFBFC` |
| Text | `#EEEFF4` | `#14161C` |
| Text secondary | `#A2A8B6` | `#4A505E` |
| Text muted | `#767E8F` | `#656C7A` |
| Accent | `#6E8FC4` | `#35547F` |
| Accent strong | `#8AA7D6` | `#24405F` |

Never pure `#000` (smears on OLED during scroll) and never pure `#FFF` in light
mode. Light mode is a designed counterpart, not an inversion: graphite-white
background, graphite accents, light glass, soft shadows instead of glow.

All pairs meet **WCAG AA**. That is a hard floor, including for muted text.

### Typography

- Headings: **Clash Display** (400/500/600/700)
- Body: **Satoshi** (400/500/700)
- Self-hosted via `next/font/local`, ~133 KB total, zero third-party requests

### Logo

Geometric `K` + three bars + dot. Rebuilt by hand as SVG from the supplied JPG.

- Blue muted from the original `#5D86FF` to steel — it now reads as premium and
  rhymes with the cold highlights in the hero video
- Bars aligned to the K baseline; the slight overlap of the leg is kept
- Favicon uses a simplified mark (K + dot only) — bars turn to mush below 32 px
- Wordmark = mark + `KTENOR` set in Clash Display with wide tracking
- The three bars are a **system motif**: intro loader, list markers, active nav
  indicator, hover accents. Used sparingly.

### Liquid Glass

Restrained execution, explicitly not "cheap glassmorphism": low blur radius,
gradient hairline edge, glass reacts to what is behind it rather than glowing on
its own. Only where an element genuinely sits above something else.

Degrades automatically on weak devices to a translucent fill + hairline border
with no blur.

## 5. Sections

1. **Hero** — logo, headline, sub-headline, two CTAs, the 3D animation
2. **Portfolio** — 4 demo projects
3. **Services**
4. **Process** — cards that expand on hover
5. **Principles**
6. **Advantages**
7. **Testimonials** — built but hidden behind a flag
8. **FAQ**
9. **Final CTA**
10. **Contact form**
11. **Extended footer** — nav, contacts, language, theme, socials, copyright.
    No map, no address (there is no office).

Plus custom **404** and **500** pages, built in the polish phase.

## 6. Hero 3D

Supplied by the owner as a finished render — 1920×1080, 24 fps, 10 s,
H.264, 5.03 MB, poster PNG 1376×768. Commercial use confirmed by the owner.

- **No alpha channel**, black baked in → **the Hero stays dark in both themes**.
  This is a deliberate decision, not a bug. The dark-to-light boundary below the
  Hero gets a soft gradient feather in light mode.
- Must be re-encoded before shipping: AV1/VP9 WebM + H.264 fallback, mobile
  variants; poster to AVIF/WebP. The 5 MB original must never reach a visitor.
- It is a video, not a scene: no geometry-level interactivity. Parallax on
  scroll and a subtle cursor-driven shift of the whole layer only.
- The object sits in the left half of the frame; the right half is near-empty —
  copy is placed there on desktop.

## 7. Intro screen

Shown once per session. The mark is **one object**: it does not disappear at the
end, it flies to its place in the header while the black plane lifts.

| Time | Event |
|---|---|
| 0–150 ms | Black. Prevents a white flash. |
| 150–600 ms | `K` fades in, scale 0.96 → 1, blur to sharp |
| 400 ms → | Three bars ignite left to right, 120 ms apart |
| on ready | Dot pulses once |
| ~600 ms | Mark flies to the header, plane lifts |
| +100 ms | Hero copy enters, 60 ms stagger |

Progress is **honest** — bars track real readiness (fonts + first video frame).
Minimum 900 ms so it cannot flicker, hard ceiling of 4 s. No percentage counter,
no "Loading", no spinner, no sound. Scroll locked, focus handed to main content
afterwards. Reduced motion → 200 ms fade instead.

## 8. Services

Prices are starting points, in EUR, shown as `from … €`.

| Service | From | Timeline |
|---|---|---|
| Mini Website / Digital Menu | €200 | 2–5 working days |
| Landing Page | €400 | 5–7 working days |
| Portfolio Website | €700 | 1–2 weeks |
| Business / Multi-page Website | €900 | 2–4 weeks |
| Online Store | €2200 | 3–5 weeks |
| Custom Website | on request | on request |
| **Tell me about your project** | — | free-form enquiry card |

Order above is the display order. No "most popular" badge — there is no sales
history yet, so it would be fabricated.

**Included in the base price:** design from scratch, responsive across all
devices, baseline SEO, baseline performance, baseline animation and
micro-interactions, **2 rounds of revisions**.

**Charged separately (Add-ons block):** domain and hosting, copywriting, content
population, multilingual (from €150 per extra language), support (from €50/month),
extra features and integrations.

**Payment:** 50% up front / 50% on completion, before launch.

Disclaimer shown: *"Starting prices are indicative. The final price depends on
the project scope, functionality and requirements."* VAT is not mentioned.
Post-launch bug fixes do not count as revision rounds.

## 9. Portfolio

Four demo projects, each with its own distinct style, each bilingual, all living
inside this project:

| Demo | Direction |
|---|---|
| Cafe | warm, cosy palette |
| Online store | modern minimalism, real product photography |
| Dental clinic | clean white, professional |
| Real estate | expensive, strict, premium |

Built **after** the main site is finished and approved. Until then the section
shows four cards with previews and `Coming Soon`; links inactive.

Honestly labelled: `Demo Project` · `Concept — Design & Development` ·
`Not a client website`. They must never read as client work.

Imagery: openly licensed stock only, cleared for commercial use.

## 10. Voice

Ktenor is one person and the copy says so — framed as **value, not apology**:
the client talks directly to the person who designs, codes and ships, with no
managers, no handovers and no diluted accountability.

Three registers, placed deliberately:
- *One person. Start to finish.* → Advantages
- *Direct, without intermediaries.* → Principles
- *Fewer projects. Full attention.* → next to the enquiry form

**Never state years of experience.** No invented client counts, no fabricated
statistics. Advantages rest on quality, modern stack, performance,
responsiveness, SEO from day one and an individual approach.

## 11. Contact

- Email `ktenorstudio@gmail.com`
- Phone `+421 911 608 486` — also WhatsApp via `wa.me`
- Instagram `@kamoshitaya`
- **No Telegram anywhere on the site**

Form fields — required: name, email **or** phone, service type. Optional:
budget (ranges: `<€500`, `€500–1500`, `€1500–3000`, `€3000+`), project
description, desired timeline. A GDPR consent checkbox is present from the start.

**There is no backend yet, and the form must not fake a successful submission.**
The visible placeholder state is honest about it and offers direct contact
instead. Real submission is wired up in a later phase.

`Order` buttons on service cards scroll smoothly to the form and pre-select the
service.

## 12. SEO, privacy, analytics

- Domain not chosen yet → `NEXT_PUBLIC_SITE_URL` drives canonicals, sitemap,
  hreflang and OG. Swapping it later is a one-line change.
- `Bratislava / Slovakia` in meta tags and footer only — never in the Hero
  headline, so the positioning is not visually narrowed.
- Privacy Policy describes only what actually happens: local storage of language
  and theme, no analytics, no tracking, and form data once the form is live.
- **No cookie banner** — consent is required for analytics and tracking, and
  there is none. Architecture leaves room to add GA/Plausible + a banner later.

## 13. Anti-references

Never: template agency look · cheap glassmorphism · excessive glow · purple or
neon gradients · pill shapes everywhere · large decorative 3D with no purpose ·
overloaded animation · an aggressive custom cursor · visual noise · stock
corporate style · SaaS template look · "technical" effects for their own sake.

## 14. Performance

Lazy-load the 3D, static poster until the scene is ready, lighter variant or a
still frame on weak mobiles, `prefers-reduced-motion` honoured throughout.
Custom cursor stays restrained and reacts only to interactive elements.

import { writeFileSync } from "node:fs";

/**
 * Builds public/work/root-bloom.svg, the Root & Bloom portfolio tile.
 *
 * Usage: node scripts/work-tile-dental.mjs public/work/root-bloom.svg
 *
 * Not a screenshot — an illustration in the demo's own palette, showing the
 * thing the demo is actually about: a lower arch seen from above with one
 * crown picked out, and the treatment card that picking it opens. The arch is
 * generated rather than drawn, from real mesiodistal tooth widths, so the
 * molars are wide and the incisors narrow instead of sixteen identical blobs.
 *
 * No text: an SVG loaded through <img> cannot pull a webfont, so any lettering
 * would render in whatever the system supplies and break the brand on sight.
 * The card carries placeholder bars instead, which is how a UI reads at
 * thumbnail size anyway.
 */

const W = 1600;
const H = 1000;

const CREAM = "#fbf6ee";
const SAGE_900 = "#1f3d35";
const SAGE_500 = "#5b937f";
const SAGE_300 = "#a8ccbc";
const SAGE_200 = "#cfe3d9";
const CORAL = "#e8785c";
const CORAL_INK = "#b84a2e";

/* Half an arch, front to back, in millimetres. */
const WIDTHS_MM = [5.3, 5.7, 6.7, 7.1, 7.1, 11.2, 10.7, 10.7];
const DEPTHS_MM = [6.0, 6.3, 7.5, 7.7, 8.2, 10.5, 10.2, 9.8];

const CX = 452;
const CY = 396;
const RX = 366;
const RY = 298;
const PX_PER_MM = 9.2;
/** The half-arch spans this much angle, so tooth widths set their own share. */
const HALF_SWEEP = 105;

const halfSum = WIDTHS_MM.reduce((a, b) => a + b, 0);
const degPerMm = HALF_SWEEP / halfSum;

/** Angle of each tooth centre, measured from the midline. */
const centres = [];
{
  let walked = 0;
  for (const w of WIDTHS_MM) {
    centres.push((walked + w / 2) * degPerMm);
    walked += w;
  }
}

const rad = (deg) => (deg * Math.PI) / 180;
const point = (deg) => ({ x: CX + RX * Math.sin(rad(deg)), y: CY + RY * Math.cos(rad(deg)) });

/** Outward unit normal of the ellipse at that angle. */
const normal = (deg) => {
  const nx = Math.sin(rad(deg)) / RX;
  const ny = Math.cos(rad(deg)) / RY;
  const len = Math.hypot(nx, ny) || 1;
  return { x: nx / len, y: ny / len };
};

/** Tangent direction, which is the way a crown faces. */
const tangentDeg = (deg) => {
  const tx = RX * Math.cos(rad(deg));
  const ty = -RY * Math.sin(rad(deg));
  return (Math.atan2(ty, tx) * 180) / Math.PI;
};

/** Crown depth between tooth centres, so the gum can follow it smoothly. */
function depthAt(deg) {
  const a = Math.abs(deg);
  if (a <= centres[0]) return DEPTHS_MM[0] * PX_PER_MM;
  for (let i = 1; i < centres.length; i += 1) {
    if (a <= centres[i]) {
      const t = (a - centres[i - 1]) / (centres[i] - centres[i - 1]);
      return (DEPTHS_MM[i - 1] + (DEPTHS_MM[i] - DEPTHS_MM[i - 1]) * t) * PX_PER_MM;
    }
  }
  return DEPTHS_MM[DEPTHS_MM.length - 1] * PX_PER_MM;
}

const n2 = (v) => Math.round(v * 10) / 10;

/* The gum: one closed band whose width follows the crowns it holds. */
const GUM_PAD = 17;
const EDGE = HALF_SWEEP + 2;
const outer = [];
const inner = [];
for (let a = -EDGE; a <= EDGE; a += 2) {
  const p = point(a);
  const n = normal(a);
  const reach = depthAt(a) / 2 + GUM_PAD;
  outer.push(`${n2(p.x + n.x * reach)},${n2(p.y + n.y * reach)}`);
  inner.push(`${n2(p.x - n.x * reach)},${n2(p.y - n.y * reach)}`);
}
const gumPath = `M${outer.join("L")}L${inner.reverse().join("L")}Z`;

/* The crowns. */
const HIGHLIT = 4; // a right-side premolar, the one the card belongs to
const teeth = [];
let highlight = null;

for (const side of [-1, 1]) {
  centres.forEach((deg, index) => {
    const at = deg * side;
    const p = point(at);
    const w = WIDTHS_MM[index] * PX_PER_MM;
    const h = DEPTHS_MM[index] * PX_PER_MM;
    const r = Math.min(w, h) * 0.4;
    const rot = tangentDeg(at);
    const lit = side === 1 && index === HIGHLIT;
    if (lit) highlight = { ...p, w, h, rot };

    teeth.push(
      `<g transform="translate(${n2(p.x)} ${n2(p.y)}) rotate(${n2(rot)})">` +
        `<rect x="${n2(-w / 2)}" y="${n2(-h / 2)}" width="${n2(w)}" height="${n2(h)}" rx="${n2(r)}" ` +
        `fill="${lit ? "#ffffff" : CREAM}" stroke="${lit ? CORAL_INK : "#e3d8c8"}" ` +
        `stroke-width="${lit ? 7 : 3}"/>` +
        `</g>`,
    );
  });
}

/* The treatment card, in the same sage the real one uses. */
const CARD = { x: 946, y: 352, w: 520, h: 384, r: 46 };
const bar = (x, y, w, h, fill, opacity = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" opacity="${opacity}"/>`;

const lead = { x: highlight.x + 46, y: highlight.y - 24 };
const land = { x: CARD.x - 26, y: CARD.y + 96 };

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Root and Bloom dental demo: a lower dental arch with one tooth highlighted and its treatment card">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8f2e8"/>
      <stop offset="1" stop-color="#e7f0ea"/>
    </linearGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#1f3d35" flood-opacity="0.22"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>

  <!-- Decoration, cropped by the frame so the tile reads as part of something larger. -->
  <circle cx="176" cy="104" r="330" fill="${SAGE_200}" opacity="0.55"/>
  <circle cx="1488" cy="912" r="288" fill="${CORAL}" opacity="0.14"/>
  <circle cx="1344" cy="146" r="132" fill="none" stroke="${SAGE_300}" stroke-width="16" opacity="0.45"/>

  <!-- The arch sits on its own shadow rather than floating. -->
  <ellipse cx="${CX + 14}" cy="${CY + RY + 104}" rx="290" ry="48" fill="${SAGE_500}" opacity="0.15" filter="url(#soft)"/>

  <path d="${gumPath}" fill="${CORAL}" stroke="${CORAL_INK}" stroke-width="4" stroke-linejoin="round"/>

  ${teeth.join("\n  ")}

  <!-- The highlight: coral, not the white the live scene uses, because white
       enamel on a cream tile shows nothing. A blurred ring alone washed out at
       thumbnail size, so a hard ring carries the shape and a blurred ring
       warms the area around it. Both are strokes: a blurred fill sat on top
       of the crown and turned it into a brown smudge. -->
  <g transform="translate(${n2(highlight.x)} ${n2(highlight.y)}) rotate(${n2(highlight.rot)})">
    <rect x="${n2(-highlight.w / 2 - 18)}" y="${n2(-highlight.h / 2 - 18)}" width="${n2(highlight.w + 36)}" height="${n2(highlight.h + 36)}" rx="${n2(Math.min(highlight.w, highlight.h) * 0.4 + 18)}" fill="none" stroke="${CORAL_INK}" stroke-width="20" opacity="0.45" filter="url(#glow)"/>
    <rect x="${n2(-highlight.w / 2 - 12)}" y="${n2(-highlight.h / 2 - 12)}" width="${n2(highlight.w + 24)}" height="${n2(highlight.h + 24)}" rx="${n2(Math.min(highlight.w, highlight.h) * 0.4 + 12)}" fill="none" stroke="${CORAL_INK}" stroke-width="8"/>
  </g>

  <!-- Picked tooth, then what picking it opens. -->
  <path d="M${n2(lead.x)} ${n2(lead.y)} C ${n2(lead.x + 90)} ${n2(lead.y - 40)}, ${n2(land.x - 110)} ${n2(land.y - 30)}, ${n2(land.x)} ${n2(land.y)}" fill="none" stroke="${CORAL_INK}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 20" opacity="0.75"/>
  <circle cx="${n2(lead.x)}" cy="${n2(lead.y)}" r="13" fill="${CORAL_INK}"/>

  <g filter="url(#cardShadow)">
    <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" fill="${SAGE_900}"/>
  </g>
  ${bar(CARD.x + 56, CARD.y + 58, 118, 22, CORAL)}
  ${bar(CARD.x + 56, CARD.y + 112, 330, 26, CREAM, 0.95)}
  ${bar(CARD.x + 56, CARD.y + 160, 396, 16, SAGE_300, 0.65)}
  ${bar(CARD.x + 56, CARD.y + 192, 288, 16, SAGE_300, 0.65)}
  ${bar(CARD.x + 56, CARD.y + 244, 150, 24, CREAM, 0.9)}
  <rect x="${CARD.x + 56}" y="${CARD.y + 290}" width="196" height="56" rx="28" fill="${CREAM}"/>
  ${bar(CARD.x + 86, CARD.y + 310, 96, 15, SAGE_900, 0.85)}
  <path d="M${CARD.x + 196} ${CARD.y + 318} h22 m-8 -8 l8 8 l-8 8" fill="none" stroke="${SAGE_900}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
</svg>
`;

writeFileSync(process.argv[2] ?? "tile.svg", svg);
console.log("wrote", process.argv[2], `${(svg.length / 1024).toFixed(1)} KB`);

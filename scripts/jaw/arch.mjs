/**
 * The frame every stage of the segmentation works in: a centre inside the
 * horseshoe, and an angle that runs along the arch from one back molar to the
 * other. Teeth sit in order along that angle, which is what makes it a usable
 * cutting coordinate — unlike raw height, where a molar cusp and the tooth
 * next to it are indistinguishable.
 */
export function archFrame({ positions, vertexCount }) {
  let zMin = Infinity, zMax = -Infinity;
  for (let i = 0; i < vertexCount; i++) {
    const z = positions[i * 3 + 2];
    if (z < zMin) zMin = z;
    if (z > zMax) zMax = z;
  }
  const height = zMax - zMin;
  const crownCut = zMin + height * 0.62;

  let cx = 0, cy = 0, n = 0;
  for (let i = 0; i < vertexCount; i++) {
    if (positions[i * 3 + 2] < crownCut) continue;
    cx += positions[i * 3]; cy += positions[i * 3 + 1]; n++;
  }
  cx /= n; cy /= n;

  /* The opening of the horseshoe is the widest angle with no surface in it. */
  const PROBE = 2048;
  const seen = new Uint8Array(PROBE);
  for (let i = 0; i < vertexCount; i++) {
    const a = Math.atan2(positions[i * 3 + 1] - cy, positions[i * 3] - cx);
    seen[Math.floor(((a + Math.PI) / (Math.PI * 2)) * PROBE) % PROBE] = 1;
  }
  let bestRun = 0, bestStart = 0, run = 0, runStart = 0;
  for (let k = 0; k < PROBE * 2; k++) {
    const b = k % PROBE;
    if (!seen[b]) { if (run === 0) runStart = b; run++; if (run > bestRun) { bestRun = run; bestStart = runStart; } }
    else run = 0;
  }
  const a0 = ((bestStart + bestRun) / PROBE) * Math.PI * 2 - Math.PI;
  const aSpan = ((PROBE - bestRun) / PROBE) * Math.PI * 2;

  const angleOf = (i) => {
    let d = Math.atan2(positions[i * 3 + 1] - cy, positions[i * 3] - cx) - a0;
    while (d < 0) d += Math.PI * 2;
    while (d >= Math.PI * 2) d -= Math.PI * 2;
    return d;
  };

  return { cx, cy, a0, aSpan, zMin, zMax, height, crownCut, angleOf };
}

/**
 * The line the teeth actually sit on: the centre of the crowns at each angle
 * around the arch, smoothed. Cutting on angle alone works down the sides but
 * fails at the back, where the arch turns and the contact between two molars
 * no longer points at the centre — a radial ray slices diagonally across the
 * crown. A plane square to this curve does not.
 */
export function archCurve(mesh, frame, bins = 360, smooth = 14) {
  const { positions, vertexCount } = mesh;
  const sx = new Float64Array(bins);
  const sy = new Float64Array(bins);
  const count = new Int32Array(bins);

  for (let i = 0; i < vertexCount; i += 1) {
    if (positions[i * 3 + 2] < frame.crownCut) continue;
    const a = frame.angleOf(i);
    if (a > frame.aSpan) continue;
    const b = Math.min(bins - 1, Math.floor((a / frame.aSpan) * bins));
    sx[b] += positions[i * 3];
    sy[b] += positions[i * 3 + 1];
    count[b] += 1;
  }

  /* Empty bins borrow from their neighbours rather than collapsing to zero. */
  const rawX = new Float64Array(bins);
  const rawY = new Float64Array(bins);
  let lastX = frame.cx, lastY = frame.cy;
  for (let b = 0; b < bins; b += 1) {
    if (count[b]) { lastX = sx[b] / count[b]; lastY = sy[b] / count[b]; }
    rawX[b] = lastX; rawY[b] = lastY;
  }
  for (let b = bins - 1; b >= 0; b -= 1) {
    if (count[b]) { lastX = rawX[b]; lastY = rawY[b]; }
    else { rawX[b] = lastX; rawY[b] = lastY; }
  }

  const cx = new Float64Array(bins);
  const cy = new Float64Array(bins);
  for (let b = 0; b < bins; b += 1) {
    let ax = 0, ay = 0, c = 0;
    for (let d = -smooth; d <= smooth; d += 1) {
      const j = Math.min(bins - 1, Math.max(0, b + d));
      ax += rawX[j]; ay += rawY[j]; c += 1;
    }
    cx[b] = ax / c; cy[b] = ay / c;
  }

  const spanDeg = (frame.aSpan * 180) / Math.PI;
  /** Point and unit tangent on the curve at an angle along the arch. */
  const at = (deg) => {
    const t = Math.min(bins - 1.001, Math.max(0, (deg / spanDeg) * (bins - 1)));
    const b = Math.floor(t);
    const f = t - b;
    const x = cx[b] + (cx[b + 1] - cx[b]) * f;
    const y = cy[b] + (cy[b + 1] - cy[b]) * f;
    const lo = Math.max(0, b - 10), hi = Math.min(bins - 1, b + 11);
    let tx = cx[hi] - cx[lo], ty = cy[hi] - cy[lo];
    const len = Math.hypot(tx, ty) || 1;
    return { x, y, tx: tx / len, ty: ty / len };
  };

  return { bins, cx, cy, at, spanDeg };
}

/**
 * Which tooth a point falls in.
 *
 * The angle around the arch decides the sector, and the cut plane then
 * corrects points near its own boundary. Classifying by the planes alone does
 * not work: a plane is infinite, so the one standing between two back molars
 * also slices through the front of the arch, and summing how many a point
 * lies past gives nonsense on the far side. Applying each plane only to the
 * two sectors it separates keeps the correction where it belongs.
 */
export function planeSegmenter(frame, curve, cuts) {
  const planes = cuts.map((deg) => curve.at(deg));

  return (x, y) => {
    let d = Math.atan2(y - frame.cy, x - frame.cx) - frame.a0;
    while (d < 0) d += Math.PI * 2;
    const deg = (d * 180) / Math.PI;

    let seg = 0;
    while (seg < cuts.length && deg >= cuts[seg]) seg += 1;

    const past = (p) => (x - p.x) * p.tx + (y - p.y) * p.ty > 0;
    if (seg > 0 && !past(planes[seg - 1])) return seg - 1;
    if (seg < planes.length && past(planes[seg])) return seg + 1;
    return seg;
  };
}

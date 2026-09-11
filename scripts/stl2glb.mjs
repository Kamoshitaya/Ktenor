import { readFileSync, writeFileSync } from "node:fs";

/**
 * ASCII STL -> GLB, decimated and split into one mesh per tooth.
 *
 * The source is a ~575k-triangle dental scan: fine for a print, far too heavy
 * for a web page, and a single fused shell with no objects in it. Splitting is
 * the point of this script — with separate meshes the raycaster can hit one
 * tooth, and a silhouette outline has something to outline.
 *
 * Segmentation is two rules. Anything below the gum line is gum. Everything
 * above it joins the nearest crown tip, which follows the real shape of a
 * tooth far better than slicing the arch into equal angular wedges: the
 * boundary lands in the interdental gap, where the nearest tip genuinely
 * changes, instead of at an arbitrary angle.
 *
 * Usage: node stl2glb.mjs in.stl out.glb [targetTriangles] [toothCount]
 */

const [, , inputPath, outputPath, targetArg, teethArg] = process.argv;
const TARGET = Number(targetArg ?? 60000);
const TOOTH_COUNT = Number(teethArg ?? 16);

/* ---------- 1. Parse ------------------------------------------------------ */

const text = readFileSync(inputPath, "latin1");
const rawX = [];
const rawY = [];
const rawZ = [];

{
  const NEEDLE = "vertex ";
  let pos = 0;
  for (;;) {
    const at = text.indexOf(NEEDLE, pos);
    if (at === -1) break;
    let end = text.indexOf("\n", at);
    if (end === -1) end = text.length;
    const parts = text.slice(at + NEEDLE.length, end).trim().split(/\s+/);
    rawX.push(Number(parts[0]));
    rawY.push(Number(parts[1]));
    rawZ.push(Number(parts[2]));
    pos = end + 1;
  }
}

const rawVertexCount = rawX.length;
const sourceTriangles = rawVertexCount / 3;
console.log("source triangles:", sourceTriangles.toLocaleString());

const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < rawVertexCount; i += 1) {
  if (rawX[i] < min[0]) min[0] = rawX[i];
  if (rawY[i] < min[1]) min[1] = rawY[i];
  if (rawZ[i] < min[2]) min[2] = rawZ[i];
  if (rawX[i] > max[0]) max[0] = rawX[i];
  if (rawY[i] > max[1]) max[1] = rawY[i];
  if (rawZ[i] > max[2]) max[2] = rawZ[i];
}
const extent = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
console.log("extent (mm):", extent.map((v) => v.toFixed(1)).join(" x "));

/* ---------- 2. Decimate by clustering ------------------------------------- */

function cluster(cell) {
  const ids = new Map();
  const sumX = [];
  const sumY = [];
  const sumZ = [];
  const counts = [];
  const vertexOf = new Int32Array(rawVertexCount);

  for (let i = 0; i < rawVertexCount; i += 1) {
    const key = `${Math.round(rawX[i] / cell)},${Math.round(rawY[i] / cell)},${Math.round(rawZ[i] / cell)}`;
    let id = ids.get(key);
    if (id === undefined) {
      id = sumX.length;
      ids.set(key, id);
      sumX.push(0);
      sumY.push(0);
      sumZ.push(0);
      counts.push(0);
    }
    sumX[id] += rawX[i];
    sumY[id] += rawY[i];
    sumZ[id] += rawZ[i];
    counts[id] += 1;
    vertexOf[i] = id;
  }

  const indices = [];
  for (let t = 0; t < sourceTriangles; t += 1) {
    const a = vertexOf[t * 3];
    const b = vertexOf[t * 3 + 1];
    const c = vertexOf[t * 3 + 2];
    /* A triangle whose corners collapsed into one cell has no area left. */
    if (a === b || b === c || a === c) continue;
    indices.push(a, b, c);
  }

  return { count: sumX.length, sumX, sumY, sumZ, counts, indices };
}

let low = extent[0] / 400;
let high = extent[0] / 12;
let best = null;

for (let attempt = 0; attempt < 14; attempt += 1) {
  const cell = (low + high) / 2;
  const result = cluster(cell);
  const triangles = result.indices.length / 3;
  if (!best || Math.abs(triangles - TARGET) < Math.abs(best.triangles - TARGET)) {
    best = { ...result, cell, triangles };
  }
  if (triangles > TARGET) low = cell;
  else high = cell;
}

console.log(
  "decimated to:",
  best.triangles.toLocaleString(),
  "triangles /",
  best.count.toLocaleString(),
  "vertices",
);

/* ---------- 3. Centre and scale ------------------------------------------- */

const TARGET_WIDTH = 4.6;
const scale = TARGET_WIDTH / Math.max(...extent);
const centre = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];

const positions = new Float32Array(best.count * 3);
for (let i = 0; i < best.count; i += 1) {
  positions[i * 3] = (best.sumX[i] / best.counts[i] - centre[0]) * scale;
  positions[i * 3 + 1] = (best.sumY[i] / best.counts[i] - centre[1]) * scale;
  positions[i * 3 + 2] = (best.sumZ[i] / best.counts[i] - centre[2]) * scale;
}

/* ---------- 4. Normals, on the whole mesh --------------------------------- */

/* Computed before the split, deliberately: normals averaged per part would
   disagree along every cut and draw a visible seam between tooth and gum. */
const normals = new Float32Array(best.count * 3);
const indices = best.indices;

for (let t = 0; t < indices.length; t += 3) {
  const a = indices[t] * 3;
  const b = indices[t + 1] * 3;
  const c = indices[t + 2] * 3;

  const abx = positions[b] - positions[a];
  const aby = positions[b + 1] - positions[a + 1];
  const abz = positions[b + 2] - positions[a + 2];
  const acx = positions[c] - positions[a];
  const acy = positions[c + 1] - positions[a + 1];
  const acz = positions[c + 2] - positions[a + 2];

  const nx = aby * acz - abz * acy;
  const ny = abz * acx - abx * acz;
  const nz = abx * acy - aby * acx;

  for (const base of [a, b, c]) {
    normals[base] += nx;
    normals[base + 1] += ny;
    normals[base + 2] += nz;
  }
}

for (let i = 0; i < best.count; i += 1) {
  const x = normals[i * 3];
  const y = normals[i * 3 + 1];
  const z = normals[i * 3 + 2];
  const len = Math.hypot(x, y, z) || 1;
  normals[i * 3] = x / len;
  normals[i * 3 + 1] = y / len;
  normals[i * 3 + 2] = z / len;
}

/* ---------- 5. Segment into teeth ----------------------------------------- */

let zMin = Infinity;
let zMax = -Infinity;
for (let i = 0; i < best.count; i += 1) {
  const z = positions[i * 3 + 2];
  if (z < zMin) zMin = z;
  if (z > zMax) zMax = z;
}
const gumLine = zMin + (zMax - zMin) * 0.62;

/* Arch centre from the crowns only: the base slab runs deeper than the arch
   and would drag the centre backwards, skewing every angle measured from it. */
let sumX = 0;
let sumY = 0;
let crowns = 0;
for (let i = 0; i < best.count; i += 1) {
  if (positions[i * 3 + 2] < gumLine) continue;
  sumX += positions[i * 3];
  sumY += positions[i * 3 + 1];
  crowns += 1;
}
const centreX = sumX / crowns;
const centreY = sumY / crowns;

/* The widest gap between crown angles is the opening of the horseshoe. */
const angles = [];
for (let i = 0; i < best.count; i += 1) {
  if (positions[i * 3 + 2] < gumLine) continue;
  angles.push(Math.atan2(positions[i * 3 + 1] - centreY, positions[i * 3] - centreX));
}
angles.sort((a, b) => a - b);

let gapStart = angles[angles.length - 1];
let gapSize = angles[0] + Math.PI * 2 - gapStart;
for (let i = 1; i < angles.length; i += 1) {
  const size = angles[i] - angles[i - 1];
  if (size > gapSize) {
    gapSize = size;
    gapStart = angles[i - 1];
  }
}
const archStart = gapStart + gapSize;
const archSpan = Math.PI * 2 - gapSize;

/* One anchor per tooth: the highest crown vertex in each angular slice. */
const anchors = Array.from({ length: TOOTH_COUNT }, () => null);
const anchorZ = new Float32Array(TOOTH_COUNT).fill(-Infinity);

for (let i = 0; i < best.count; i += 1) {
  const z = positions[i * 3 + 2];
  if (z < gumLine) continue;
  const angle = Math.atan2(positions[i * 3 + 1] - centreY, positions[i * 3] - centreX);
  let offset = angle - archStart;
  while (offset < 0) offset += Math.PI * 2;
  if (offset > archSpan) continue;

  const bin = Math.min(TOOTH_COUNT - 1, Math.floor((offset / archSpan) * TOOTH_COUNT));
  if (z > anchorZ[bin]) {
    anchorZ[bin] = z;
    anchors[bin] = [positions[i * 3], positions[i * 3 + 1], z];
  }
}

const validAnchors = anchors.filter(Boolean);
console.log("tooth anchors found:", validAnchors.length, "/", TOOTH_COUNT);

/* Assign every triangle: below the gum line it is gum, above it joins the
   nearest crown tip. Horizontal distance only — comparing in 3D lets a tall
   incisor tip win over the molar the triangle actually sits on. */
const partOf = new Int32Array(indices.length / 3).fill(-1);

for (let t = 0; t < indices.length / 3; t += 1) {
  const a = indices[t * 3];
  const b = indices[t * 3 + 1];
  const c = indices[t * 3 + 2];
  const cx = (positions[a * 3] + positions[b * 3] + positions[c * 3]) / 3;
  const cy = (positions[a * 3 + 1] + positions[b * 3 + 1] + positions[c * 3 + 1]) / 3;
  const cz = (positions[a * 3 + 2] + positions[b * 3 + 2] + positions[c * 3 + 2]) / 3;

  if (cz < gumLine) continue; // stays gum

  let nearest = -1;
  let nearestDistance = Infinity;
  for (let bin = 0; bin < TOOTH_COUNT; bin += 1) {
    const anchor = anchors[bin];
    if (!anchor) continue;
    const dx = anchor[0] - cx;
    const dy = anchor[1] - cy;
    const distance = dx * dx + dy * dy;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = bin;
    }
  }
  partOf[t] = nearest;
}

/* ---------- 6. Build one part per tooth, plus the gum --------------------- */

function buildPart(name, triangleIds) {
  const remap = new Map();
  const partPositions = [];
  const partNormals = [];
  const partIndices = [];

  for (const t of triangleIds) {
    for (let corner = 0; corner < 3; corner += 1) {
      const v = indices[t * 3 + corner];
      let id = remap.get(v);
      if (id === undefined) {
        id = partPositions.length / 3;
        remap.set(v, id);
        partPositions.push(positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]);
        partNormals.push(normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]);
      }
      partIndices.push(id);
    }
  }

  return {
    name,
    positions: new Float32Array(partPositions),
    normals: new Float32Array(partNormals),
    indices: partIndices,
  };
}

const buckets = new Map();
for (let t = 0; t < partOf.length; t += 1) {
  const key = partOf[t];
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(t);
}

const parts = [];
const gumTriangles = buckets.get(-1) ?? [];
if (gumTriangles.length) parts.push(buildPart("Gum", gumTriangles));

for (let bin = 0; bin < TOOTH_COUNT; bin += 1) {
  const triangleIds = buckets.get(bin);
  if (!triangleIds?.length) {
    console.warn("  tooth", bin, "has no triangles — skipped");
    continue;
  }
  parts.push(buildPart(`Tooth_${String(bin).padStart(2, "0")}`, triangleIds));
}

console.log(
  "parts:",
  parts.map((p) => `${p.name} (${(p.indices.length / 3).toLocaleString()})`).join(", "),
);

/* ---------- 7. Write GLB -------------------------------------------------- */

const pad4 = (n) => (n + 3) & ~3;
const chunks = [];
let binLength = 0;

const bufferViews = [];
const accessors = [];
const meshes = [];
const nodes = [];

for (const part of parts) {
  const vertexCount = part.positions.length / 3;
  const indexArray =
    vertexCount > 65535 ? new Uint32Array(part.indices) : new Uint16Array(part.indices);

  const pushView = (typed, target) => {
    const offset = pad4(binLength);
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    chunks.push({ offset, bytes });
    binLength = offset + bytes.length;
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target });
    return bufferViews.length - 1;
  };

  const posView = pushView(part.positions, 34962);
  const nrmView = pushView(part.normals, 34962);
  const idxView = pushView(indexArray, 34963);

  const pMin = [Infinity, Infinity, Infinity];
  const pMax = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vertexCount; i += 1) {
    for (let c = 0; c < 3; c += 1) {
      const v = part.positions[i * 3 + c];
      if (v < pMin[c]) pMin[c] = v;
      if (v > pMax[c]) pMax[c] = v;
    }
  }

  accessors.push({
    bufferView: posView,
    componentType: 5126,
    count: vertexCount,
    type: "VEC3",
    min: pMin,
    max: pMax,
  });
  accessors.push({ bufferView: nrmView, componentType: 5126, count: vertexCount, type: "VEC3" });
  accessors.push({
    bufferView: idxView,
    componentType: vertexCount > 65535 ? 5125 : 5123,
    count: part.indices.length,
    type: "SCALAR",
  });

  const base = accessors.length - 3;
  meshes.push({
    name: part.name,
    primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
  });
  nodes.push({ mesh: meshes.length - 1, name: part.name });
}

binLength = pad4(binLength);
const bin = Buffer.alloc(binLength);
for (const chunk of chunks) chunk.bytes.copy(bin, chunk.offset);

const gltf = {
  asset: { version: "2.0", generator: "stl2glb (Ktenor dental demo)" },
  scene: 0,
  scenes: [{ nodes: nodes.map((_, i) => i) }],
  nodes,
  meshes,
  buffers: [{ byteLength: binLength }],
  bufferViews,
  accessors,
};

const jsonBuf = Buffer.from(JSON.stringify(gltf), "utf8");
const jsonPadded = Buffer.alloc(pad4(jsonBuf.length), 0x20);
jsonBuf.copy(jsonPadded);

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // "glTF"
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonPadded.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4); // "JSON"

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(bin.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4); // "BIN"

const glb = Buffer.concat([header, jsonHeader, jsonPadded, binHeader, bin]);
writeFileSync(outputPath, glb);

console.log("wrote:", outputPath, `${(glb.length / 1024 / 1024).toFixed(2)} MB`);

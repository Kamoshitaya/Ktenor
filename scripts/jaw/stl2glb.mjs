import { readFileSync, writeFileSync } from "node:fs";
import { archCurve, archFrame, planeSegmenter } from "./arch.mjs";
import { splitGum } from "./segment.mjs";

/**
 * ASCII STL -> GLB: a scanned mandible, decimated for the web and split into
 * one mesh per tooth plus the gum.
 *
 * The split is the whole point. As one fused shell the raycaster can only
 * report "the jaw", so the hover highlight had to be a blob around a guessed
 * point, which matched no tooth and bled onto its neighbours. With separate
 * meshes a hover resolves to exactly one tooth and the outline has a real
 * silhouette to trace.
 *
 * How the two boundaries are found is in arch.mjs and segment.mjs. The fifteen
 * contact angles below were read off a panoramic unwrap of this scan and then
 * checked tooth by tooth; they belong to this file, not to the algorithm.
 *
 * Usage: node scripts/jaw/stl2glb.mjs in.stl out.glb [targetTriangles]
 */

const [, , inputPath, outputPath, targetArg] = process.argv;
const TARGET = Number(targetArg ?? 140000);

/**
 * Where one crown ends and the next begins, in degrees along the arch,
 * starting from the back molar on the patient's right. Sixteen teeth.
 */
const CONTACT_ANGLES = [
  21.52, 34.98, 54.44, 76.75, 98.36, 117.33, 134.63, 146.22,
  160.96, 176.78, 193.78, 215.01, 233.28, 250.97, 258.93,
];

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
  best.triangles.toLocaleString(), "triangles /",
  best.count.toLocaleString(), "vertices",
);

/* ---------- 3. Centre and scale ------------------------------------------- */

const TARGET_WIDTH = 4.6;
const scale = TARGET_WIDTH / Math.max(...extent);
const centre = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];

const vertexCount = best.count;
const positions = new Float32Array(vertexCount * 3);
for (let i = 0; i < vertexCount; i += 1) {
  positions[i * 3] = (best.sumX[i] / best.counts[i] - centre[0]) * scale;
  positions[i * 3 + 1] = (best.sumY[i] / best.counts[i] - centre[1]) * scale;
  positions[i * 3 + 2] = (best.sumZ[i] / best.counts[i] - centre[2]) * scale;
}

/* ---------- 4. Normals, on the whole mesh --------------------------------- */

/* Computed before the split, deliberately: normals averaged per part would
   disagree along every cut and draw a visible seam between tooth and gum. */
const indices = best.indices;
const normals = new Float32Array(vertexCount * 3);

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
for (let i = 0; i < vertexCount; i += 1) {
  const x = normals[i * 3];
  const y = normals[i * 3 + 1];
  const z = normals[i * 3 + 2];
  const len = Math.hypot(x, y, z) || 1;
  normals[i * 3] = x / len;
  normals[i * 3 + 1] = y / len;
  normals[i * 3 + 2] = z / len;
}

/* ---------- 5. Segment ---------------------------------------------------- */

const mesh = { positions, normals, indices, vertexCount };
const frame = archFrame(mesh);
const curve = archCurve(mesh, frame);
const toothAt = planeSegmenter(frame, curve, CONTACT_ANGLES);
const { isGum, gumVertices } = splitGum(mesh);

const TOOTH_COUNT = CONTACT_ANGLES.length + 1;
const toothOf = new Int32Array(vertexCount).fill(-1);
for (let v = 0; v < vertexCount; v += 1) {
  if (isGum[v]) continue;
  toothOf[v] = Math.min(TOOTH_COUNT - 1, toothAt(positions[v * 3], positions[v * 3 + 1]));
}
console.log(
  "gum vertices:", gumVertices.toLocaleString(),
  `(${((gumVertices / vertexCount) * 100).toFixed(1)}%) | teeth:`, TOOTH_COUNT,
);

/*
 * Assigning triangles.
 *
 * A face with any corner on the gum goes to the gum, whatever the other two
 * corners say. Letting the majority win there drags the boundary a row of
 * triangles up over the cervical line, and a ring of gum-coloured enamel
 * around every crown is exactly the seam this is meant to remove.
 *
 * Between two teeth the rule has to be the opposite. Those faces have no gum
 * corner at all, and sending them to the gum for want of agreement painted a
 * pink stripe down every contact — sixteen crowns outlined in gum. They go to
 * whichever tooth holds two of the three corners.
 */
const partOf = new Int32Array(indices.length / 3).fill(-1);
for (let t = 0; t < partOf.length; t += 1) {
  const a = toothOf[indices[t * 3]];
  const b = toothOf[indices[t * 3 + 1]];
  const c = toothOf[indices[t * 3 + 2]];
  if (a === -1 || b === -1 || c === -1) continue;
  partOf[t] = a === b || a === c ? a : b === c ? b : a;
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

for (let tooth = 0; tooth < TOOTH_COUNT; tooth += 1) {
  const triangleIds = buckets.get(tooth);
  if (!triangleIds?.length) {
    console.warn("  tooth", tooth, "has no triangles — skipped");
    continue;
  }
  parts.push(buildPart(`Tooth_${String(tooth).padStart(2, "0")}`, triangleIds));
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
  const partVertices = part.positions.length / 3;
  const indexArray =
    partVertices > 65535 ? new Uint32Array(part.indices) : new Uint16Array(part.indices);

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
  for (let i = 0; i < partVertices; i += 1) {
    for (let c = 0; c < 3; c += 1) {
      const v = part.positions[i * 3 + c];
      if (v < pMin[c]) pMin[c] = v;
      if (v > pMax[c]) pMax[c] = v;
    }
  }

  accessors.push({
    bufferView: posView,
    componentType: 5126,
    count: partVertices,
    type: "VEC3",
    min: pMin,
    max: pMax,
  });
  accessors.push({ bufferView: nrmView, componentType: 5126, count: partVertices, type: "VEC3" });
  accessors.push({
    bufferView: idxView,
    componentType: partVertices > 65535 ? 5125 : 5123,
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

writeFileSync(outputPath, Buffer.concat([header, jsonHeader, jsonPadded, binHeader, bin]));
console.log("wrote:", outputPath);

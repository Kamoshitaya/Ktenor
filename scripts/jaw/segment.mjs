/**
 * Splitting the scan into sixteen crowns and a gum.
 *
 * Two independent cuts, because the two boundaries have nothing in common.
 *
 * Between teeth: a plane at each contact, placed along the dental arch. Height
 * alone cannot find these — the saddle between two molars sits barely below
 * their cusps, no deeper than the groove between two cusps of the same molar,
 * so every watershed either fuses neighbours or shatters one tooth into its
 * cusps. Position along the arch separates them trivially, and the fifteen
 * contact angles were read off a panoramic unwrap of the scan once.
 *
 * Between crown and gum: the gingival sulcus, the groove the gum makes where
 * it meets the tooth. It shows up cleanly as a ring of concave curvature
 * around every crown, so the gum is flooded up from the base of the model and
 * stopped at that ring. A height cut cannot do this job either: the gum line
 * is scalloped by a couple of millimetres, and any flat threshold leaves gum
 * painted onto the enamel on one tooth and enamel below the gum on the next.
 */

/** Vertex-to-vertex adjacency, CSR-style: one flat pair of arrays, no Sets. */
function adjacency(indices, vertexCount) {
  const degree = new Int32Array(vertexCount);
  for (let t = 0; t < indices.length; t += 3) {
    degree[indices[t]] += 2;
    degree[indices[t + 1]] += 2;
    degree[indices[t + 2]] += 2;
  }
  const offset = new Int32Array(vertexCount + 1);
  for (let i = 0; i < vertexCount; i += 1) offset[i + 1] = offset[i] + degree[i];
  const neighbours = new Int32Array(offset[vertexCount]);
  const cursor = Int32Array.from(offset.subarray(0, vertexCount));
  const link = (a, b) => { neighbours[cursor[a]++] = b; neighbours[cursor[b]++] = a; };
  for (let t = 0; t < indices.length; t += 3) {
    link(indices[t], indices[t + 1]);
    link(indices[t + 1], indices[t + 2]);
    link(indices[t + 2], indices[t]);
  }
  return { offset, neighbours };
}

/** How concave the surface is at each vertex; positive means a groove. */
export function concavity({ positions, normals, indices, vertexCount }, smoothing = 2) {
  const sum = new Float64Array(vertexCount);
  const count = new Int32Array(vertexCount);
  const pair = (a, b) => {
    const dx = positions[b * 3] - positions[a * 3];
    const dy = positions[b * 3 + 1] - positions[a * 3 + 1];
    const dz = positions[b * 3 + 2] - positions[a * 3 + 2];
    const len = Math.hypot(dx, dy, dz) || 1;
    sum[a] += (normals[a * 3] * dx + normals[a * 3 + 1] * dy + normals[a * 3 + 2] * dz) / len;
    count[a] += 1;
  };
  for (let t = 0; t < indices.length; t += 3) {
    const a = indices[t], b = indices[t + 1], c = indices[t + 2];
    pair(a, b); pair(b, a); pair(b, c); pair(c, b); pair(c, a); pair(a, c);
  }
  let conc = new Float64Array(vertexCount);
  for (let i = 0; i < vertexCount; i += 1) conc[i] = count[i] ? sum[i] / count[i] : 0;

  const { offset, neighbours } = adjacency(indices, vertexCount);
  for (let pass = 0; pass < smoothing; pass += 1) {
    const next = new Float64Array(vertexCount);
    for (let v = 0; v < vertexCount; v += 1) {
      let acc = conc[v], n = 1;
      for (let e = offset[v]; e < offset[v + 1]; e += 1) { acc += conc[neighbours[e]]; n += 1; }
      next[v] = acc / n;
    }
    conc = next;
  }
  return { conc, offset, neighbours };
}

/**
 * Flood the gum up from the base of the model, stopped by the sulcus ring.
 * Going up from the gum rather than down from the cusps matters: the fissures
 * across a molar biting surface are concave too, and a flood starting at the
 * crown would stop dead at every one of them.
 */
export function splitGum(mesh, {
  barrier = 0.016,
  baseFraction = 0.06,
  /** The flood may not climb past this, whatever the curvature says. */
  ceilingFraction = 0.6,
  /** An unflooded patch is only a crown if it reaches this high. */
  crownFraction = 0.72,
  smoothing = 2,
  /** Majority passes that take the sawtooth off the finished gum line. */
  smoothPasses = 3,
} = {}) {
  const { positions, vertexCount } = mesh;
  const { conc, offset, neighbours } = concavity(mesh, smoothing);

  let zMin = Infinity, zMax = -Infinity;
  for (let i = 0; i < vertexCount; i += 1) {
    const z = positions[i * 3 + 2];
    if (z < zMin) zMin = z;
    if (z > zMax) zMax = z;
  }
  const height = zMax - zMin;
  const baseZ = zMin + height * baseFraction;
  /* The scan is cut open behind the last molars, so the sulcus ring is not
     closed there and the flood would run straight up over the crown. The
     ceiling costs nothing — no gum reaches it — and stops that cold. */
  const ceilingZ = zMin + height * ceilingFraction;
  const crownZ = zMin + height * crownFraction;

  const blocked = (v) => conc[v] > barrier || positions[v * 3 + 2] > ceilingZ;

  const isGum = new Uint8Array(vertexCount);
  const stack = [];
  for (let v = 0; v < vertexCount; v += 1) {
    if (positions[v * 3 + 2] > baseZ || blocked(v)) continue;
    isGum[v] = 1;
    stack.push(v);
  }
  while (stack.length) {
    const v = stack.pop();
    for (let e = offset[v]; e < offset[v + 1]; e += 1) {
      const n = neighbours[e];
      if (isGum[n] || blocked(n)) continue;
      isGum[n] = 1;
      stack.push(n);
    }
  }

  /*
   * What the flood missed is not automatically a crown. Creases in the gum
   * are concave too and fence off patches of it, and the sulcus ring itself
   * is left over. A patch counts as enamel only if it reaches up to where
   * crowns actually are; everything else is gum.
   */
  const seen = new Uint8Array(vertexCount);
  for (let start = 0; start < vertexCount; start += 1) {
    if (isGum[start] || seen[start]) continue;
    const patch = [start];
    seen[start] = 1;
    let top = positions[start * 3 + 2];
    for (let head = 0; head < patch.length; head += 1) {
      const v = patch[head];
      for (let e = offset[v]; e < offset[v + 1]; e += 1) {
        const n = neighbours[e];
        if (seen[n] || isGum[n]) continue;
        seen[n] = 1;
        patch.push(n);
        if (positions[n * 3 + 2] > top) top = positions[n * 3 + 2];
      }
    }
    if (top < crownZ) for (const v of patch) isGum[v] = 1;
  }

  /*
   * Tidy the edge. The flood stops on individual vertices, so the gum line
   * comes out a sawtooth — single triangles of enamel hanging below it and
   * spurs of gum poking up between them. A vertex that disagrees with almost
   * all of its neighbours is one of those, and nothing else: a clear majority
   * is required, so the real line does not creep in either direction.
   */
  for (let pass = 0; pass < smoothPasses; pass += 1) {
    const next = Uint8Array.from(isGum);
    for (let v = 0; v < vertexCount; v += 1) {
      let same = 0;
      let total = 0;
      for (let e = offset[v]; e < offset[v + 1]; e += 1) {
        total += 1;
        if (isGum[neighbours[e]] === isGum[v]) same += 1;
      }
      if (total && same / total < 0.3) next[v] = isGum[v] ? 0 : 1;
    }
    isGum.set(next);
  }

  let gumVertices = 0;
  for (let v = 0; v < vertexCount; v += 1) if (isGum[v]) gumVertices += 1;
  return { isGum, conc, offset, neighbours, gumVertices };
}

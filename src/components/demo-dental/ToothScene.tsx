"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import {
  BackSide,
  Color,
  ShaderMaterial,
  type BufferGeometry,
  type Group,
  type Mesh,
  type Object3D,
} from "three";
import { TOOTH_COUNT } from "@/content/demo-dental/teeth";

const MODEL_URL = "/demo-dental/lower-jaw.glb";

/**
 * A real scanned mandible: a 575k-triangle ASCII STL decimated to 140k, split
 * into one mesh per tooth plus the gum, and written to GLB by scripts/jaw.
 *
 * The split is what makes this section work. While the scan was a single fused
 * shell the highlight had to be a distance field around a point, which drew a
 * round blob that did not match any tooth and bled onto its neighbours. With
 * separate meshes the raycaster resolves the exact tooth and the highlight can
 * be a true silhouette outline. Where the cuts come from — a plane at each
 * contact along the arch, and the gum line traced along the gingival sulcus —
 * is written up in scripts/jaw/arch.mjs and scripts/jaw/segment.mjs.
 *
 * The outline is an inverted hull: the tooth is drawn again, expanded along its
 * own normals, back faces only. The tooth then occludes all of it except the
 * rim that pokes past its silhouette — so the shape is the tooth's real outline
 * by construction, and anything in front still covers it, with no x-ray effect.
 * Two shells of decreasing opacity turn a hard line into a soft glow.
 *
 * A post-processing outline was built and measured against this, since it
 * blurs more smoothly: @react-three/postprocessing with a pair of Outline
 * effects, one per side of the crossfade. It was dropped. Mounting the
 * composer threw inside react-three-fiber and, worse, killed pointer picking
 * outright — no tooth ever reported a hover again. Two dependencies and a
 * broken raycaster is a poor trade for a softer edge, so the hull stayed.
 *
 * The glow is pure white and the viewport behind it is dark. White was the
 * brief from the start; over the original white card it was simply invisible,
 * white enamel on white, so the ground moved rather than the colour.
 */

/** Thin and bright, then wide and faint — together they read as a soft glow. */
const SHELLS = [
  { thickness: 0.013, alpha: 1 },
  { thickness: 0.04, alpha: 0.42 },
];

const OUTLINE_VERTEX = /* glsl */ `
  uniform float uThickness;
  void main() {
    vec3 expanded = position + normal * uThickness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(expanded, 1.0);
  }
`;

const OUTLINE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

/* Time constants, not durations: the fade is exponential, and it lands within
   a pixel of its target at roughly 3x these — so ~180ms in, ~165ms out. */
const FADE_IN = 0.06;
const FADE_OUT = 0.055;

function ToothOutline({ geometry, active }: { geometry: BufferGeometry; active: boolean }) {
  const group = useRef<Group>(null);
  const opacity = useRef(0);

  const materials = useMemo(
    () =>
      SHELLS.map(
        (shell) =>
          new ShaderMaterial({
            vertexShader: OUTLINE_VERTEX,
            fragmentShader: OUTLINE_FRAGMENT,
            uniforms: {
              uThickness: { value: shell.thickness },
              uColor: { value: new Color("#ffffff") },
              uOpacity: { value: 0 },
            },
            transparent: true,
            /* Back faces only, and no depth writing: the hull must not hide the
               tooth it belongs to, nor the shell behind it. */
            side: BackSide,
            depthWrite: false,
            /* The glow is a UI mark, not a surface. Tone mapping would pull
               its pure white down to grey along with the rest of the frame. */
            toneMapped: false,
          }),
      ),
    [],
  );

  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials]);

  useFrame((_, delta) => {
    const target = active ? 1 : 0;
    const tau = active ? FADE_IN : FADE_OUT;
    opacity.current += (target - opacity.current) * (1 - Math.exp(-delta / tau));

    /* Below this nobody can see it, and skipping the draw keeps fifteen idle
       outlines off the GPU. */
    const visible = opacity.current > 0.004;
    if (group.current) group.current.visible = visible;
    if (!visible) return;

    materials.forEach((material, index) => {
      material.uniforms.uOpacity!.value = opacity.current * SHELLS[index]!.alpha;
    });
  });

  return (
    <group ref={group} visible={false}>
      {materials.map((material, index) => (
        <mesh key={index} geometry={geometry} material={material} renderOrder={2} />
      ))}
    </group>
  );
}

function Jaw({
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  hovered: number | null;
  selected: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  const { nodes } = useGLTF(MODEL_URL);

  /* Touch devices report a hover that never ends, which would leave a tooth lit
     after the finger is gone. There, only a tap toggles. */
  const canHover = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
    [],
  );

  const { gum, teeth } = useMemo(() => {
    const record = nodes as unknown as Record<string, Object3D | undefined>;
    const geometryOf = (name: string) => (record[name] as Mesh | undefined)?.geometry ?? null;

    return {
      gum: geometryOf("Gum"),
      teeth: Array.from({ length: TOOTH_COUNT }, (_, index) =>
        geometryOf(`Tooth_${String(index).padStart(2, "0")}`),
      ),
    };
  }, [nodes]);

  /*
   * Hover wins over selection: the highlight belongs to whatever is under the
   * cursor right now. The selected tooth takes back over the moment the
   * pointer leaves — and on touch, where there is no hover at all, a tap is
   * the only thing that lights one up.
   */
  const active = hovered ?? selected;

  return (
    /* The scan is Z-up, as intraoral scanners export; three.js is Y-up. */
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {gum && (
        <mesh geometry={gum}>
          {/* Gum reads as gum through subsurface scattering, which is out of
              budget here. Sheen over a soft clearcoat fakes the same damp,
              slightly translucent surface for a fraction of the cost. */}
          <meshPhysicalMaterial
            color="#bd6a68"
            roughness={0.62}
            clearcoat={0.45}
            clearcoatRoughness={0.55}
            sheen={0.85}
            sheenRoughness={0.7}
            sheenColor="#f0a29c"
            envMapIntensity={0.55}
            metalness={0}
          />
        </mesh>
      )}

      {teeth.map((geometry, index) =>
        geometry ? (
          <group key={index}>
            <mesh
              geometry={geometry}
              onPointerOver={(event: ThreeEvent<PointerEvent>) => {
                if (!canHover) return;
                event.stopPropagation();
                onHover(index);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                if (!canHover) return;
                onHover(null);
                document.body.style.cursor = "";
              }}
              onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onSelect(index);
              }}
            >
              {/* Enamel is a glassy layer over a duller body, and the clearcoat
                  is that layer: sharp reflections of the environment on top
                  while the base stays soft enough not to look like plastic. */}
              <meshPhysicalMaterial
                color="#f4eee0"
                roughness={0.34}
                clearcoat={1}
                clearcoatRoughness={0.07}
                sheen={0.25}
                sheenColor="#fffaf0"
                envMapIntensity={1.15}
                metalness={0}
              />
            </mesh>

            <ToothOutline geometry={geometry} active={active === index} />
          </group>
        ) : null,
      )}
    </group>
  );
}

function Rig({
  paused,
  reduceMotion,
  ...rest
}: {
  paused: boolean;
  reduceMotion: boolean;
  hovered: number | null;
  selected: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  const group = useRef<Group>(null);

  /* A slow idle turn so the model reads as interactive before it is touched —
     stopped the moment anyone actually touches it, or it fights the drag. */
  useFrame((state, delta) => {
    if (!group.current || reduceMotion || paused) return;
    group.current.rotation.y += delta * 0.1;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
  });

  return (
    <group ref={group}>
      <Jaw {...rest} />
    </group>
  );
}

/**
 * A studio built out of emissive panels instead of an HDR file.
 *
 * Enamel only looks like enamel when its clearcoat has something to reflect,
 * and lights alone reflect nothing — lit by lamps only, the arch came out
 * flat and plastic. A downloaded environment map would fix that at the cost
 * of another request and a megabyte; four rectangles cost neither.
 */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#0d1c19"]} />
      {/* Broad key overhead: the long soft highlight down the face of a crown. */}
      <Lightformer
        form="rect"
        intensity={5}
        color="#ffffff"
        scale={[9, 5, 1]}
        position={[0, 6, 3]}
        rotation={[-Math.PI / 2.1, 0, 0]}
      />
      {/* Cool wrap from behind, so the arch separates from the dark card. */}
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#bfe0d6"
        scale={[7, 4, 1]}
        position={[-5, 2, -4]}
        rotation={[0, -Math.PI / 2.6, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#cfe6ff"
        scale={[7, 4, 1]}
        position={[5, 2, -4]}
        rotation={[0, Math.PI / 2.6, 0]}
      />
      {/* Bounce from below keeps the gum pink rather than grey. Barely tinted,
          deliberately: a saturated pink panel here is the one the enamel
          reflects, and every fissure across a molar came back coral. */}
      <Lightformer
        form="circle"
        intensity={0.8}
        color="#efdcd4"
        scale={[6, 6, 1]}
        position={[0, -4, 2]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Straight-on fill: the bright vertical catch down each crown. */}
      <Lightformer
        form="rect"
        intensity={1.7}
        color="#ffffff"
        scale={[5, 6, 1]}
        position={[0, 1, 7]}
      />
    </Environment>
  );
}

export type ToothSceneProps = {
  hovered: number | null;
  selected: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
};

export default function ToothScene({
  hovered,
  selected,
  onHover,
  onSelect,
  reduceMotion,
}: ToothSceneProps) {
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  const paused = touched || hovered !== null || selected !== null;

  return (
    <Canvas
      camera={{ position: [0, 3.2, 5.0], fov: 40 }}
      /* Capped so the scene never renders at 3x on a phone for no visible gain. */
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => setReady(true)}
      onPointerDown={() => setTouched(true)}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms ease" }}
    >
      {/* The environment does most of the shading now; these only shape it — a
          key from the front left for the enamel highlight, and a dim cool fill
          so nothing in shadow goes fully black. */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[-3.5, 6, 5]} intensity={1.1} />
      <directionalLight position={[5, 2.5, -4]} intensity={0.35} color="#cfe3d9" />

      <Suspense fallback={null}>
        <Studio />
        <Rig
          paused={paused}
          reduceMotion={reduceMotion}
          hovered={hovered}
          selected={selected}
          onHover={onHover}
          onSelect={onSelect}
        />
        {/* Grounds the arch. Without it the model floats in the dark, which is
            most of why the earlier render read as a loose game asset. */}
        <ContactShadows
          position={[0, -0.68, 0]}
          scale={7}
          resolution={512}
          blur={2.6}
          opacity={0.55}
          far={1.6}
          color="#04120e"
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3.2}
        maxDistance={9}
        /* Stops the model being tipped upside down or viewed from below. */
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.46}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);

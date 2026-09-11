"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
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
 * A real scanned mandible: a 575k-triangle ASCII STL decimated to 60k, split
 * into one mesh per tooth plus the gum, and written to GLB by
 * scripts/stl2glb.mjs.
 *
 * The split is what makes this section work. While the scan was a single fused
 * shell the highlight had to be a distance field around a point, which drew a
 * round blob that did not match any tooth and bled onto its neighbours. With
 * separate meshes the raycaster resolves the exact tooth and the highlight can
 * be a true silhouette outline.
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
          <meshPhysicalMaterial
            color="#c9756e"
            roughness={0.52}
            clearcoat={0.35}
            clearcoatRoughness={0.45}
            sheen={0.5}
            sheenColor="#e79a92"
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
              <meshPhysicalMaterial
                color="#f7f3e8"
                roughness={0.16}
                clearcoat={0.9}
                clearcoatRoughness={0.12}
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
      {/* Key from the front left for the enamel highlight, a cool rim behind to
          lift the arch off the card, and a warm bounce that keeps the gum pink
          rather than grey. */}
      {/* Tuned for the dark viewport: less ambient than a bright card wants,
          a stronger key, and a cool rim doing the work of lifting the arch off
          the ground behind it. */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3.5, 6, 5]} intensity={1.95} />
      <directionalLight position={[5, 2.5, -4]} intensity={0.62} color="#cfe3d9" />
      <directionalLight position={[0, -3.5, 2.5]} intensity={0.34} color="#f0a99f" />

      <Suspense fallback={null}>
        <Rig
          paused={paused}
          reduceMotion={reduceMotion}
          hovered={hovered}
          selected={selected}
          onHover={onHover}
          onSelect={onSelect}
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

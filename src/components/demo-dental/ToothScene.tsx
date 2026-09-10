"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { CatmullRomCurve3, Vector3, type Group } from "three";
import { hotspots, TOOTH_COUNT } from "@/content/demo-dental/teeth";

/**
 * A stylised lower arch, generated rather than modelled: sixteen teeth placed
 * around an ellipse. No .glb to download, no loader to wait on, and the shape
 * stays editable in code.
 *
 * Both the teeth and the gum are derived from the same parametric curve, which
 * is the only reliable way to keep them aligned — an independently positioned
 * torus drifts out of register the moment the arch proportions change.
 *
 * Roots are deliberately not drawn. Bare cones under the crowns read as a
 * diagram of an extraction, which is the opposite of what a family practice
 * wants on its home page.
 */

const ARCH_X = 2.3; // half-width
const ARCH_Z = 2.75; // depth
const GUM_Y = -0.22;

/** Angle for a tooth index, sweeping back-right to back-left. */
function angleAt(ratio: number): number {
  return Math.PI * (0.12 + ratio * 0.76);
}

function pointAt(ratio: number, y: number): Vector3 {
  const angle = angleAt(ratio);
  return new Vector3(-Math.cos(angle) * ARCH_X, y, Math.sin(angle) * ARCH_Z - 1.05);
}

type ToothPlacement = {
  index: number;
  position: [number, number, number];
  rotationY: number;
  width: number;
  depth: number;
  height: number;
  isHotspot: boolean;
};

function useArch() {
  return useMemo(() => {
    const hotspotIndexes = new Set(hotspots.flatMap((h) => [h.index, TOOTH_COUNT - 1 - h.index]));

    const placements: ToothPlacement[] = Array.from({ length: TOOTH_COUNT }, (_, index) => {
      const ratio = index / (TOOTH_COUNT - 1);
      const point = pointAt(ratio, 0);

      /* 0 at the front, 1 at the very back — drives the size ramp. */
      const backness = Math.abs(ratio - 0.5) * 2;

      return {
        index,
        position: [point.x, 0, point.z] as [number, number, number],
        rotationY: -angleAt(ratio) + Math.PI / 2,
        width: 0.3 + backness * 0.26,
        depth: 0.26 + backness * 0.22,
        height: 0.72 - backness * 0.16,
        isHotspot: hotspotIndexes.has(index),
      };
    });

    /* The gum follows the identical curve, a little wider and lower, so it
       always sits under the teeth no matter how the arch is retuned.
       It is extended past both ends: cut off exactly at the last tooth, the
       tube stops mid-molar and the back teeth look like they are falling off. */
    const gumCurve = new CatmullRomCurve3(
      Array.from({ length: 44 }, (_, step) => pointAt(-0.05 + (step / 43) * 1.1, GUM_Y)),
      false,
      "catmullrom",
      0.5,
    );

    return { placements, gumCurve };
  }, []);
}

function Tooth({
  placement,
  isHovered,
  isSelected,
  onHover,
  onSelect,
  reduceMotion,
}: {
  placement: ToothPlacement;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const active = isHovered || isSelected;

  useFrame((_, delta) => {
    if (!group.current) return;
    const step = Math.min(1, delta * 9);

    /* Lift and settle rather than snap — the whole brand is soft. */
    const targetY = active && !reduceMotion ? 0.2 : 0;
    group.current.position.y += (targetY - group.current.position.y) * step;

    const targetScale = active ? 1.07 : 1;
    const current = group.current.scale.x;
    group.current.scale.setScalar(current + (targetScale - current) * step);
  });

  /* Interactive teeth carry a warm tint at rest, so they read as the ones
     worth touching without a marker floating above them. */
  const colour = isSelected
    ? "#e8785c"
    : isHovered
      ? "#f6c9bb"
      : placement.isHotspot
        ? "#fdeee7"
        : "#ffffff";

  return (
    <group
      ref={group}
      position={placement.position}
      rotation={[0, placement.rotationY, 0]}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHover(placement.index);
        document.body.style.cursor = placement.isHotspot ? "pointer" : "default";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(placement.index);
      }}
    >
      <RoundedBox
        args={[placement.width, placement.height, placement.depth]}
        radius={0.1}
        smoothness={3}
        /* Sunk into the gum so no seam shows where the two meet. */
        position={[0, placement.height / 2 - 0.24, 0]}
      >
        <meshStandardMaterial color={colour} roughness={0.4} metalness={0.02} />
      </RoundedBox>
    </group>
  );
}

function Arch({
  hovered,
  selected,
  paused,
  onHover,
  onSelect,
  reduceMotion,
}: {
  hovered: number | null;
  selected: number | null;
  paused: boolean;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
}) {
  const { placements, gumCurve } = useArch();
  const group = useRef<Group>(null);

  /* A slow idle turn so the model reads as interactive before it is touched —
     stopped the moment anyone actually touches it, or it fights the drag. */
  useFrame((state, delta) => {
    if (!group.current || reduceMotion || paused) return;
    group.current.rotation.y += delta * 0.1;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        {/* Radius exceeds the widest molar, so no tooth overhangs the gum. */}
        <tubeGeometry args={[gumCurve, 64, 0.42, 12, false]} />
        <meshStandardMaterial color="#f2bcab" roughness={0.9} />
      </mesh>

      {placements.map((placement) => (
        <Tooth
          key={placement.index}
          placement={placement}
          isHovered={hovered === placement.index}
          isSelected={selected === placement.index}
          onHover={onHover}
          onSelect={onSelect}
          reduceMotion={reduceMotion}
        />
      ))}
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

export default function ToothScene(props: ToothSceneProps) {
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  const paused = touched || props.hovered !== null || props.selected !== null;

  return (
    <Canvas
      camera={{ position: [0, 3.6, 5.9], fov: 42 }}
      /* Capped so the scene never renders at 3x on a phone for no visible gain. */
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => setReady(true)}
      onPointerDown={() => setTouched(true)}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms ease" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 7, 5]} intensity={1.4} />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#cfe3d9" />

      <Arch {...props} paused={paused} />

      <OrbitControls
        enablePan={false}
        minDistance={4.2}
        maxDistance={9}
        /* Stops the model being tipped upside down or viewed from below. */
        minPolarAngle={Math.PI * 0.14}
        maxPolarAngle={Math.PI * 0.46}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, -0.4]}
      />
    </Canvas>
  );
}

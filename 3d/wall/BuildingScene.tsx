'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import WallDecorGroup from './WallDecorGroup';
import DeskGroup from '../deskandchair/DeskGroup';
import ProjectsRoom from './ProjectsRoom';

// ────────────────────────────────────────────────────
// CONSTANTS — Room & Building geometry
// ────────────────────────────────────────────────────
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 12;
const ROOM_DEPTH = 32;
const FLOOR_COUNT = 5;
const FLOOR_SLAB_THICKNESS = 0.4;
const FLOOR_SPACING = ROOM_HEIGHT + FLOOR_SLAB_THICKNESS; // 12.4 per floor

// The developer room (floor 0) has its center at Y=3 (floor at -3, ceiling at 9)
// In the building, floor 0 is the top floor.
// Floor i center Y = -i * FLOOR_SPACING
// Developer room floor is at the group-local Y=-3, ceiling Y=9 → center = 3
// We offset the building so developer room floor 0 aligns with original scene.
const BUILDING_TOP_Y = 3; // Y-center of floor 0 = developer room center

// ────────────────────────────────────────────────────
// Camera keyframes driven by scroll (0→1)
//
// Phase 1 (0.00 → 0.15): Hero — static inside room
// Phase 2 (0.15 → 0.45): Pull straight back through glass, reveal room
// Phase 3 (0.45 → 0.70): Move straight down to projects floor
// Phase 4 (0.70 → 1.00): Push straight forward into projects room
// ────────────────────────────────────────────────────

function lerpValue(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ────────────────────────────────────────────────────
// ScrollCamera — reads useScroll offset & animates
// ────────────────────────────────────────────────────
function ScrollCamera() {
  const { camera } = useThree();
  const scroll = useScroll();

  // Key positions
  const INSIDE_Z = 14;
  const OUTSIDE_Z = 26;      // 14 units outside the glass facade (at Z=16)
  const HERO_Y = 4.72;
  const LOOK_Y = 3.72;
  const PROJ_Y = -FLOOR_SPACING + HERO_Y;
  const PROJ_LOOK_Y = -FLOOR_SPACING + LOOK_Y;

  // Keyframes: continuous path, camera moves directly with scroll (no lerp lag)
  const keyframes = useMemo(() => [
    { s: 0.00, y: HERO_Y,  z: INSIDE_Z,  ly: LOOK_Y },         // inside room
    { s: 0.08, y: HERO_Y,  z: INSIDE_Z,  ly: LOOK_Y },         // hero hold (short)
    { s: 0.35, y: HERO_Y,  z: OUTSIDE_Z, ly: LOOK_Y - 1 },     // outside glass
    { s: 0.60, y: PROJ_Y,  z: OUTSIDE_Z, ly: PROJ_LOOK_Y },     // descended
    { s: 1.00, y: PROJ_Y,  z: INSIDE_Z,  ly: PROJ_LOOK_Y },     // inside projects
  ], [HERO_Y, LOOK_Y, PROJ_Y, PROJ_LOOK_Y, INSIDE_Z, OUTSIDE_Z]);

  useFrame(() => {
    const offset = scroll.offset;

    // Find keyframe segment
    let i = 0;
    for (let k = 0; k < keyframes.length - 1; k++) {
      if (offset >= keyframes[k].s) i = k;
    }

    const kf0 = keyframes[i];
    const kf1 = keyframes[Math.min(i + 1, keyframes.length - 1)];

    const segLen = kf1.s - kf0.s;
    const t = segLen > 0 ? Math.max(0, Math.min(1, (offset - kf0.s) / segLen)) : 0;

    const camY = kf0.y + (kf1.y - kf0.y) * t;
    const camZ = kf0.z + (kf1.z - kf0.z) * t;
    const lookY = kf0.ly + (kf1.ly - kf0.ly) * t;

    // Direct position — no lerp, moves exactly with scroll
    camera.position.set(0, camY, camZ);
    camera.lookAt(0, lookY, 0);
  });

  return null;
}

// ────────────────────────────────────────────────────
// GlassFacade — Full-height glass front of building
// ────────────────────────────────────────────────────
function GlassFacade() {
  const totalHeight = FLOOR_COUNT * FLOOR_SPACING;
  const facadeZ = ROOM_DEPTH / 2; // front face

  // Narrower glass — 70% of room width
  const GLASS_WIDTH = ROOM_WIDTH * 0.7; // 14 units wide
  const panesPerFloor = 3;
  const paneW = GLASS_WIDTH / panesPerFloor;

  const panes: JSX.Element[] = [];

  for (let floor = 0; floor < FLOOR_COUNT; floor++) {
    const floorBaseY = -floor * FLOOR_SPACING;

    for (let p = 0; p < panesPerFloor; p++) {
      const paneX = -GLASS_WIDTH / 2 + paneW / 2 + p * paneW;

      panes.push(
        <group key={`glass-${floor}-${p}`}>
          {/* Glass pane */}
          <mesh
            position={[paneX, floorBaseY + ROOM_HEIGHT / 2, facadeZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[paneW - 0.15, ROOM_HEIGHT - 0.3, 0.01]} />
            <meshPhysicalMaterial
              color="#88ccff"
              transmission={0.92}
              roughness={0.05}
              thickness={0.08}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.5}
              ior={1.5}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
              metalness={0.1}
            />
          </mesh>

          {/* Mullion (vertical frame between panes) */}
          {p < panesPerFloor - 1 && (
            <mesh
              position={[
                paneX + paneW / 2,
                floorBaseY + ROOM_HEIGHT / 2,
                facadeZ,
              ]}
              castShadow
            >
              <boxGeometry args={[0.12, ROOM_HEIGHT, 0.1]} />
              <meshStandardMaterial color="#303030" roughness={0.3} metalness={0.7} />
            </mesh>
          )}
        </group>
      );
    }

    {/* Horizontal mullion (floor divider strip) */}
    panes.push(
      <mesh
        key={`hmul-${floor}`}
        position={[0, floorBaseY - 0.05, facadeZ]}
        castShadow
      >
        <boxGeometry args={[GLASS_WIDTH + 0.2, FLOOR_SLAB_THICKNESS, 0.12]} />
        <meshStandardMaterial color="#404040" roughness={0.35} metalness={0.6} />
      </mesh>
    );
  }

  return <group>{panes}</group>;
}

// ────────────────────────────────────────────────────
// BuildingShell — Side & back walls, floor slabs
// ────────────────────────────────────────────────────
function BuildingShell() {
  const totalHeight = FLOOR_COUNT * FLOOR_SPACING;
  const ceramicColor = '#d5cfc5';

  const elements: JSX.Element[] = [];

  for (let floor = 0; floor < FLOOR_COUNT; floor++) {
    const baseY = -floor * FLOOR_SPACING;

    // Floor slab
    elements.push(
      <mesh
        key={`slab-${floor}`}
        position={[0, baseY, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[ROOM_WIDTH + 0.4, FLOOR_SLAB_THICKNESS, ROOM_DEPTH + 0.4]} />
        <meshStandardMaterial color="#808080" roughness={0.6} metalness={0.2} />
      </mesh>
    );

    // Left exterior wall
    elements.push(
      <mesh
        key={`left-${floor}`}
        position={[-ROOM_WIDTH / 2 - 0.15, baseY + ROOM_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[ROOM_DEPTH + 0.4, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={ceramicColor} roughness={0.85} metalness={0.05} />
      </mesh>
    );

    // Right exterior wall
    elements.push(
      <mesh
        key={`right-${floor}`}
        position={[ROOM_WIDTH / 2 + 0.15, baseY + ROOM_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[ROOM_DEPTH + 0.4, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={ceramicColor} roughness={0.85} metalness={0.05} />
      </mesh>
    );

    // Back exterior wall
    elements.push(
      <mesh
        key={`back-${floor}`}
        position={[0, baseY + ROOM_HEIGHT / 2, -ROOM_DEPTH / 2 - 0.15]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[ROOM_WIDTH + 0.6, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={ceramicColor} roughness={0.85} metalness={0.05} />
      </mesh>
    );
  }

  // Final bottom slab
  elements.push(
    <mesh
      key="bottom-slab"
      position={[0, -FLOOR_COUNT * FLOOR_SPACING, 0]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[ROOM_WIDTH + 0.4, FLOOR_SLAB_THICKNESS, ROOM_DEPTH + 0.4]} />
      <meshStandardMaterial color="#606060" roughness={0.6} metalness={0.2} />
    </mesh>
  );

  // Roof slab
  elements.push(
    <mesh
      key="roof"
      position={[0, ROOM_HEIGHT + FLOOR_SLAB_THICKNESS / 2, 0]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[ROOM_WIDTH + 0.8, FLOOR_SLAB_THICKNESS, ROOM_DEPTH + 0.8]} />
      <meshStandardMaterial color="#505050" roughness={0.5} metalness={0.3} />
    </mesh>
  );

  return <group>{elements}</group>;
}

// ────────────────────────────────────────────────────
// FloorModules — Duplicate room shells for floors 2–4
// ────────────────────────────────────────────────────
function EmptyFloorRoom({
  position,
  floorLabel,
}: {
  position: [number, number, number];
  floorLabel: string;
}) {
  const wallColor = '#eae6e1';

  return (
    <group position={position}>
      {/* Back wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2 + 0.1]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2 + 0.1, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Right wall */}
      <mesh position={[ROOM_WIDTH / 2 - 0.1, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#c4b498" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#f0ece8" roughness={0.9} metalness={0} />
      </mesh>
      {/* Interior light */}
      <pointLight
        position={[0, ROOM_HEIGHT - 1, 0]}
        intensity={0.4}
        color="#ffffff"
        distance={15}
        decay={2}
      />
    </group>
  );
}

// ────────────────────────────────────────────────────
// Scene Lighting — Minimal global, cinematic per-room
// ────────────────────────────────────────────────────
function BuildingLighting() {
  return (
    <>
      {/* Very low ambient — just enough to prevent pure black */}
      <ambientLight intensity={0.08} color="#e8f0ff" />

      {/* Sun light for building exterior */}
      <directionalLight
        position={[20, 40, 25]}
        intensity={0.8}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={40}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0003}
        shadow-radius={4}
      />

      {/* Sky/ground hemisphere for subtle outdoor bounce */}
      <hemisphereLight
        args={['#87CEEB', '#5a4a3a', 0.15]}
      />
    </>
  );
}

// ────────────────────────────────────────────────────
// Loading fallback
// ────────────────────────────────────────────────────
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
}

// ────────────────────────────────────────────────────
// BuildingScene — Main exported component
// ────────────────────────────────────────────────────
export default function BuildingScene() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#1a1a1a',
      }}
    >
      <Canvas
        shadows="soft"
        camera={{
          position: [0, 4.72, 14],
          fov: 50,
          near: 0.1,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', display: 'block' }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#87CEEB']} />

        {/* ScrollControls: 5 pages of scroll content */}
        <ScrollControls pages={5} damping={0.15}>
          <Suspense fallback={<LoadingFallback />}>
            <ScrollCamera />
            <BuildingLighting />

            {/* Soft HDRI environment for reflections */}
            <Environment preset="studio" background={false} environmentIntensity={0.35} />

            {/* ═══════════════════════════════════════════
                BUILDING GROUP
                Floor 0 = Developer Room (original scene)
                Floor 1 = Projects Room
                Floors 2–4 = Empty/furnished shells
            ════════════════════════════════════════════ */}
            <group>
              {/* ── Building exterior shell & floor slabs ── */}
              <BuildingShell />

              {/* ── Glass Facade (front) ── */}
              <GlassFacade />

              {/* ══ FLOOR 0: Developer Room (original) ══ */}
              <group position={[0, 0, 0]}>
                {/* Offset: the original WallDecorGroup has floor at Y=-3, center at Y=3
                    We place it so floor aligns with building slab at Y=0.
                    Original floor is at Y=-3, so shift group up by 3.
                    Extra +0.22 to clear the 0.4-thick structural slab (top at Y=0.2). */}
                <group position={[0, 3.22, 0]}>
                  <WallDecorGroup position={[0, 0, 0]} />
                </group>
                {/* DeskGroup was at [0, -3, 2] in original scene.
                    Shift same +3.22 → [0, 0.22, 2] */}
                <DeskGroup position={[0, 0.22, 2]} />

                {/* ═══════════════════════════════════════════
                    CINEMATIC 3-POINT LIGHTING SETUP
                ════════════════════════════════════════════ */}
                
                {/* KEY LIGHT — Warm, above-right of desk, main shadow caster */}
                <directionalLight
                  position={[4, 8, 5]}
                  intensity={1.8}
                  color="#FFD6A5"
                  castShadow
                  shadow-mapSize-width={4096}
                  shadow-mapSize-height={4096}
                  shadow-camera-far={25}
                  shadow-camera-left={-12}
                  shadow-camera-right={12}
                  shadow-camera-top={12}
                  shadow-camera-bottom={-6}
                  shadow-bias={-0.0004}
                  shadow-radius={6}
                />

                {/* FILL LIGHT — Cool, opposite side, soft */}
                <directionalLight
                  position={[-6, 5, 4]}
                  intensity={0.4}
                  color="#AFCBFF"
                />

                {/* RIM LIGHT — Behind character, subtle backlight */}
                <spotLight
                  position={[0, 4, -2]}
                  angle={0.6}
                  penumbra={0.8}
                  intensity={0.6}
                  color="#c8d8ff"
                  target-position={[0, 2, 3]}
                />

                {/* FACE FILL — Soft frontal light to illuminate character face */}
                <pointLight
                  position={[0, 4.5, 6]}
                  intensity={0.4}
                  color="#fff0e0"
                  distance={10}
                  decay={2}
                />

                {/* DESK AREA ACCENT — Bright spot on work area */}
                <spotLight
                  position={[1, 7, 3]}
                  angle={0.5}
                  penumbra={0.6}
                  intensity={0.8}
                  color="#fff8e8"
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-bias={-0.0003}
                  target-position={[0, 0, 2]}
                />

                {/* FLOOR LAMP — Warm practical light from LightStand */}
                <pointLight
                  position={[7.5, 5.5, 1.5]}
                  intensity={1.2}
                  color="#ffcc88"
                  distance={8}
                  decay={2}
                  castShadow
                  shadow-mapSize-width={512}
                  shadow-mapSize-height={512}
                />

                {/* SHELF ACCENT — Subtle highlight on shelf items */}
                <pointLight
                  position={[0, 6, -2.5]}
                  intensity={0.35}
                  color="#fff5e6"
                  distance={8}
                  decay={2}
                />

                {/* CORNER DARKENING — Negative fill (darker corners) via positioned dim lights away */}
                {/* Left corner dim warm bounce */}
                <pointLight
                  position={[-9, 1, -3]}
                  intensity={0.1}
                  color="#8b7355"
                  distance={6}
                  decay={2}
                />
                {/* Right corner dim bounce */}
                <pointLight
                  position={[9, 1, -3]}
                  intensity={0.1}
                  color="#8b7355"
                  distance={6}
                  decay={2}
                />

                {/* CONTACT SHADOWS — Under desk, chair, character */}
                <ContactShadows
                  position={[0, 0.23, 2]}
                  opacity={0.5}
                  scale={16}
                  blur={2.5}
                  far={4}
                  resolution={512}
                  color="#1a1510"
                />
              </group>

              {/* ══ FLOOR 1: Projects Room ══ */}
              <group position={[0, -FLOOR_SPACING, 0]}>
                <ProjectsRoom position={[0, 0.22, 0]} />
              </group>

              {/* ══ FLOORS 2–4: Empty shells ══ */}
              {[2, 3, 4].map((floorIdx) => (
                <group key={`floor-${floorIdx}`} position={[0, -floorIdx * FLOOR_SPACING, 0]}>
                  <EmptyFloorRoom
                    position={[0, 0.2, 0]}
                    floorLabel={`Floor ${floorIdx}`}
                  />
                </group>
              ))}
            </group>
          </Suspense>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

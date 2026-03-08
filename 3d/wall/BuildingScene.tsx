'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import WallDecorGroup from './WallDecorGroup';
import DeskGroup from '../deskandchair/DeskGroup';
import ProjectsRoom from '../ProjectRoom/ProjectsRoom';
import AboutRoom from './AboutRoom';
import ContactsRoom from './ContactsRoom';
import LiftPanel from './LiftPanel';

// ────────────────────────────────────────────────────
// CONSTANTS — Room & Building geometry
// ────────────────────────────────────────────────────
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 12;
const ROOM_DEPTH = 32;
const FLOOR_COUNT = 4; // 0: Dev, 1: Projects, 2: About, 3: Contacts
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
// Pages expanded to handle multiple rooms
// Each room transition: inside → outside → descend → to next room
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
  const OUTSIDE_Z = 26;
  const HERO_Y = 4.72;
  const LOOK_Y = 3.72;

  const keyframes = useMemo(() => {
    const kf = [];

    // Floor 0: Developer Room (0.00 -> 0.20)
    kf.push(
      { s: 0.00, y: HERO_Y, z: INSIDE_Z, ly: LOOK_Y }, // inside dev room
      { s: 0.10, y: HERO_Y, z: INSIDE_Z, ly: LOOK_Y }, // hero hold slightly longer
      { s: 0.20, y: HERO_Y, z: OUTSIDE_Z, ly: LOOK_Y - 1 } // outside dev room
    );

    // Transition to Floor 1: Projects Room (0.20 -> 0.33)
    kf.push(
      { s: 0.28, y: HERO_Y - FLOOR_SPACING, z: OUTSIDE_Z, ly: LOOK_Y - FLOOR_SPACING - 1 },
      { s: 0.33, y: HERO_Y - FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - FLOOR_SPACING }
    );

    // Floor 1: Projects Room - inside (0.33 -> 0.53)
    kf.push(
      { s: 0.33, y: HERO_Y - FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - FLOOR_SPACING },
      { s: 0.43, y: HERO_Y - FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - FLOOR_SPACING },
      { s: 0.53, y: HERO_Y - FLOOR_SPACING, z: OUTSIDE_Z, ly: LOOK_Y - FLOOR_SPACING - 1 }
    );

    // Transition to Floor 2: About Room (0.53 -> 0.66)
    kf.push(
      { s: 0.61, y: HERO_Y - 2 * FLOOR_SPACING, z: OUTSIDE_Z, ly: LOOK_Y - 2 * FLOOR_SPACING - 1 },
      { s: 0.66, y: HERO_Y - 2 * FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - 2 * FLOOR_SPACING }
    );

    // Floor 2: About Room - inside (0.66 -> 0.86)
    kf.push(
      { s: 0.66, y: HERO_Y - 2 * FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - 2 * FLOOR_SPACING },
      { s: 0.76, y: HERO_Y - 2 * FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - 2 * FLOOR_SPACING },
      { s: 0.86, y: HERO_Y - 2 * FLOOR_SPACING, z: OUTSIDE_Z, ly: LOOK_Y - 2 * FLOOR_SPACING - 1 }
    );

    // Transition to Floor 3: Contacts Room (0.86 -> 1.00)
    kf.push(
      { s: 0.94, y: HERO_Y - 3 * FLOOR_SPACING, z: OUTSIDE_Z, ly: LOOK_Y - 3 * FLOOR_SPACING - 1 },
      { s: 1.00, y: HERO_Y - 3 * FLOOR_SPACING, z: INSIDE_Z, ly: LOOK_Y - 3 * FLOOR_SPACING }
    );

    return kf;
  }, [HERO_Y, LOOK_Y, INSIDE_Z, OUTSIDE_Z]);

  useEffect(() => {
    // Check if '?contact=true' is in the URL when scene mounts
    if (typeof window !== 'undefined' && window.location.search.includes('contact=true')) {
      // Auto-scroll to the bottom of the ScrollControls element slowly
      setTimeout(() => {
        if (scroll.el) {
          scroll.el.scrollTo({
            top: scroll.el.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 500); // 500ms delay to let the initial scene render
    }
  }, [scroll.el]);

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

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, lookY, 0);
  });

  return null;
}

// ────────────────────────────────────────────────────
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
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2 + 0.1]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2 + 0.1, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Right wall */}
      <mesh position={[ROOM_WIDTH / 2 - 0.1, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#c4b498" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
      {/* Single ambient light for minimal GPU usage */}
      <ambientLight intensity={0.5} color="#ffffff" />
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
// NavigationController — Handles navigation sign clicks
// ────────────────────────────────────────────────────
function NavigationController() {
  const scroll = useScroll();

  useEffect(() => {
    const handleNavigation = (event: any) => {
      const { targetPage } = event.detail;
      // With 4 pages (0 to 3), the offsets are 0, 1/3, 2/3, 1
      const targetOffset = targetPage / 3;

      const scrollContainer = scroll.el;
      // Calculate target scrollTop. scroll.el is the scroll container.
      // Maximum scroll is at offset 1.
      const scrollMax = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const targetScrollTop = targetOffset * scrollMax;

      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    };

    window.addEventListener('navigationClicked', handleNavigation);
    return () => window.removeEventListener('navigationClicked', handleNavigation);
  }, [scroll]);

  return null;
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
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Canvas
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

          {/* ScrollControls: 4.5 pages to allow extra scroll buffer at the end */}
          <ScrollControls pages={4.5} damping={0.25}>
            <Suspense fallback={<LoadingFallback />}>
              <ScrollCamera />
              <NavigationController />
              <BuildingLighting />

              {/* Minimal environment - reduced GPU load */}
              <Environment preset="studio" background={false} environmentIntensity={0.1} />

              {/* ═══════════════════════════════════════════
                  BUILDING GROUP
                  Floor 0 = Developer Room (original scene)
                  Floor 1 = Projects Room
                  Floor 2 = About Me
                  Floor 3 = Contacts
                  Floors 4–5 = Empty/furnished shells
              ════════════════════════════════════════════ */}
              <group>
                {/* ── Building exterior shell & floor slabs ── */}
                <BuildingShell />

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


                  {/* Floor 0 Lights */}
                  <pointLight
                    position={[0, 9, 0]}
                    intensity={0.45}
                    color="#ffffff"
                    distance={12}
                    decay={2}
                  />
                  <pointLight
                    position={[-6, 5, 2]}
                    intensity={0.25}
                    color="#e0e8ff"
                    distance={10}
                    decay={2}
                  />

                  {/* ══ NAV: HOME (0) ══ */}
                  <LiftPanel
                    currentFloorIndex={0}
                    position={[9.2, 9.0, -3.8]}
                  />
                </group>

                {/* ══ FLOOR 1: Projects Room ══ */}
                <group position={[0, -FLOOR_SPACING, 0]}>
                  <ProjectsRoom position={[0, 0.22, 0]} />

                  {/* ══ NAV: PROJECTS (1) ══ */}
                  <LiftPanel
                    currentFloorIndex={1}
                    position={[9.2, 9.0, -3.8]}
                  />
                </group>

                {/* ══ FLOOR 2: About Me Room ══ */}
                <group position={[0, -2 * FLOOR_SPACING, 0]}>
                  <AboutRoom position={[0, 0.22, 0]} />

                  {/* ══ NAV: ABOUT (2) ══ */}
                  <LiftPanel
                    currentFloorIndex={2}
                    position={[9.2, 9.0, -3.8]}
                  />
                </group>

                {/* ══ FLOOR 3: Contacts Room ══ */}
                <group position={[0, -3 * FLOOR_SPACING, 0]}>
                  <ContactsRoom position={[0, 0.22, 0]} />

                  {/* ══ NAV: CONTACT (3) ══ */}
                  <LiftPanel
                    currentFloorIndex={3}
                    position={[9.2, 9.0, -3.8]}
                  />
                </group>
              </group>
            </Suspense>
          </ScrollControls>
        </Canvas>

        {/*
          PORTAL ROOT
          Provides a safe 2D DOM surface outside the WebGL/ScrollControls transformation matrix,
          preventing the ContactsRoom Html component from getting scaled to 0px or clipped.
        */}
        <div id="html-portal-root" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

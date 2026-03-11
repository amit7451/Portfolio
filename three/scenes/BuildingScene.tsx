'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import WallDecorGroup from '../models/wall/WallDecorGroup';
import DeskGroup from '../models/deskandchair/DeskGroup';
import ProjectsRoom from '../rooms/ProjectsRoom';
import AboutRoom from '../rooms/AboutRoom';
import ContactsRoom from '../rooms/ContactsRoom';
import LiftPanel from '../models/wall/LiftPanel';
import CanvasLoader from '../../components/CanvasLoader';

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

// ────────────────────────────────────────────────────
// ScrollCamera — reads useScroll offset & animates
// ────────────────────────────────────────────────────
function ScrollCamera() {
  const { camera } = useThree();
  const scroll = useScroll();

  const insideZ = 14;
  const outsideZ = 26;
  const heroY = 4.72;
  const lookY = 3.72;
  const floorsToTravel = FLOOR_COUNT - 1;

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
    const clampedOffset = Math.max(0, Math.min(1, scroll.offset));
    const floorProgress = clampedOffset * floorsToTravel;
    const localProgress = floorProgress - Math.floor(floorProgress);

    const transitionCurve = Math.sin(localProgress * Math.PI);
    const transitionStrength = transitionCurve * transitionCurve;

    const camY = heroY - floorProgress * FLOOR_SPACING;
    const camZ = insideZ + (outsideZ - insideZ) * transitionStrength;
    const targetLookY = lookY - floorProgress * FLOOR_SPACING - transitionCurve * 0.6;

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, targetLookY, 0);
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
// ────────────────────────────────────────────────────
// Scene Lighting — Minimal global, cinematic per-room
// ────────────────────────────────────────────────────
function BuildingLighting() {
  return (
    <>
      {/* Low-cost consistent room lighting rig */}
      <ambientLight intensity={0.45} color="#f7f8ff" />
      <directionalLight
        position={[10, 12, 8]}
        intensity={0.7}
        color="#fff5ea"
      />
      <directionalLight
        position={[-9, 7, -6]}
        intensity={0.3}
        color="#d9e6ff"
      />
    </>
  );
}

// ────────────────────────────────────────────────────
// Loading fallback
// ────────────────────────────────────────────────────
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
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = false;
          }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', display: 'block' }}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#87CEEB']} />

          {/* Tight damping for immediate scroll response */}
          <ScrollControls pages={4} damping={0.08}>
            <Suspense fallback={<CanvasLoader message="Loading 3D Assets" />}>
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

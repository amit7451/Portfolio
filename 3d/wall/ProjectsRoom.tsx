'use client';

import { useRef } from 'react';
import * as THREE from 'three';

/**
 * ProjectsRoom — A floor module representing the "Projects" showcase.
 * Similar structure to the developer room but themed for project display.
 */

interface ProjectsRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function ProjectsRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: ProjectsRoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Room dimensions (matching building room depth)
  const roomW = 20;
  const roomH = 12;
  const roomD = 32;
  const backWallZ = -4; // Decorative back wall (content is visible from camera at Z=14)
  const floorY = 0; // relative floor
  const ceilY = roomH;

  const wallColor = '#e8e4e0';
  const accentColor = '#2a6496';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, roomH / 2, backWallZ]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ═══ LEFT SIDE WALL (no front wall — glass facade) ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* ═══ CEILING ═══ */}
      <mesh position={[0, roomH - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color="#f0ece8" roughness={0.9} metalness={0} />
      </mesh>

      {/* ═══ "PROJECTS" TITLE ON BACK WALL ═══ */}
      <mesh position={[0, roomH - 2, backWallZ + 0.05]}>
        <planeGeometry args={[6, 1]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.4}
          metalness={0.2}
          emissive={accentColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* ═══ PROJECT DISPLAY BOARDS ═══ */}
      {/* Left Project Board */}
      <ProjectBoard
        position={[-6, roomH / 2 + 0.5, backWallZ + 0.1]}
        title="Project 1"
        color="#3a7ca5"
      />

      {/* Center Project Board */}
      <ProjectBoard
        position={[0, roomH / 2 + 0.5, backWallZ + 0.1]}
        title="Project 2"
        color="#d4a373"
      />

      {/* Right Project Board */}
      <ProjectBoard
        position={[6, roomH / 2 + 0.5, backWallZ + 0.1]}
        title="Project 3"
        color="#588157"
      />

      {/* ═══ PROJECT TABLES ═══ */}
      <ProjectTable position={[-5, 0, 1]} />
      <ProjectTable position={[0, 0, 1]} />
      <ProjectTable position={[5, 0, 1]} />

      {/* ═══ ACCENT LIGHTING ═══ */}
      <pointLight
        position={[0, roomH - 1, 0]}
        intensity={0.6}
        color="#ffffff"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-6, roomH - 1, 0]}
        intensity={0.3}
        color="#e0e8ff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[6, roomH - 1, 0]}
        intensity={0.3}
        color="#e0e8ff"
        distance={10}
        decay={2}
      />
    </group>
  );
}

/* ─── Sub-components ─── */

function ProjectBoard({
  position,
  title,
  color,
}: {
  position: [number, number, number];
  title: string;
  color: string;
}) {
  return (
    <group position={position}>
      {/* Board frame */}
      <mesh castShadow>
        <boxGeometry args={[4, 3, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Board surface */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Title bar */}
      <mesh position={[0, 1.05, 0.06]}>
        <planeGeometry args={[3, 0.4]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.8}
          metalness={0}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function ProjectTable({
  position,
}: {
  position: [number, number, number];
}) {
  const tableH = 1.5;
  const tableW = 3;
  const tableD = 1.2;

  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <boxGeometry args={[tableW, 0.06, tableD]} />
        <meshStandardMaterial color="#4a3828" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Legs */}
      {[
        [-tableW / 2 + 0.1, tableH / 2, -tableD / 2 + 0.1],
        [tableW / 2 - 0.1, tableH / 2, -tableD / 2 + 0.1],
        [-tableW / 2 + 0.1, tableH / 2, tableD / 2 - 0.1],
        [tableW / 2 - 0.1, tableH / 2, tableD / 2 - 0.1],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, tableH, 0.06]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
      {/* Laptop on table */}
      <group position={[0, tableH + 0.06, 0]}>
        {/* Laptop base */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.02, 0.45]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Laptop screen */}
        <mesh position={[0, 0.25, -0.2]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.68, 0.45, 0.01]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Screen display */}
        <mesh position={[0, 0.25, -0.19]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.6, 0.38]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#1a2a4a"
            emissiveIntensity={0.2}
            roughness={0.05}
            metalness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

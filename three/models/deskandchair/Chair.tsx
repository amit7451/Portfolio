'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface ChairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export default function Chair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#1a1a1a',
}: ChairProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Chair dimensions
  const seatW = 1.0;
  const seatD = 1.0;
  const seatH = 0.08;
  const seatY = 1.05; // seat height from ground

  const backH = 1.2;  // backrest height
  const backW = 0.95;
  const backThick = 0.06;

  const armH = 0.25;
  const armW = 0.06;
  const armD = 0.6;

  const baseMetal = '#333333';
  const cushionColor = color;
  const frameMetal = '#2a2a2a';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ 5-STAR BASE ═══ */}
      {/* Central column */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
        <meshStandardMaterial color={baseMetal} roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Gas lift cylinder */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
        <meshStandardMaterial color="#444" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* 5 star arms */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const armLen = 0.55;
        const cx = Math.sin(rad) * armLen * 0.5;
        const cz = Math.cos(rad) * armLen * 0.5;
        const ex = Math.sin(rad) * armLen;
        const ez = Math.cos(rad) * armLen;
        return (
          <group key={`star-${i}`}>
            {/* Arm bar */}
            <mesh
              position={[cx, 0.12, cz]}
              rotation={[0, -rad, 0]}
              castShadow
            >
              <boxGeometry args={[0.06, 0.06, armLen]} />
              <meshStandardMaterial color={baseMetal} roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Caster wheel */}
            <mesh position={[ex, 0.04, ez]} castShadow>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#222" roughness={0.3} metalness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* ═══ SEAT ═══ */}
      {/* Seat cushion */}
      <mesh position={[0, seatY, 0]} castShadow receiveShadow>
        <boxGeometry args={[seatW, seatH, seatD]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} metalness={0} />
      </mesh>

      {/* Seat cushion top (slight rounding illusion) */}
      <mesh position={[0, seatY + 0.04, 0]} castShadow>
        <boxGeometry args={[seatW - 0.06, 0.02, seatD - 0.06]} />
        <meshStandardMaterial color={cushionColor} roughness={0.85} metalness={0} />
      </mesh>

      {/* ═══ BACKREST ═══ */}
      {/* Main back panel */}
      <mesh position={[0, seatY + backH / 2 + 0.1, -seatD / 2 + 0.03]} castShadow>
        <boxGeometry args={[backW, backH, backThick]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} metalness={0} />
      </mesh>

      {/* Lumbar support bump */}
      <mesh position={[0, seatY + 0.35, -seatD / 2 + 0.07]} castShadow>
        <boxGeometry args={[backW - 0.15, 0.3, 0.04]} />
        <meshStandardMaterial color={cushionColor} roughness={0.85} metalness={0} />
      </mesh>

      {/* Back frame (visible behind cushion) */}
      <mesh position={[0, seatY + backH / 2 + 0.1, -seatD / 2 - 0.02]} castShadow>
        <boxGeometry args={[backW + 0.04, backH + 0.04, 0.03]} />
        <meshStandardMaterial color={frameMetal} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* ═══ ARMRESTS ═══ */}
      {/* Left armrest pad */}
      <mesh position={[-seatW / 2 + 0.02, seatY + armH + 0.08, -0.1]} castShadow>
        <boxGeometry args={[armW + 0.04, 0.04, armD]} />
        <meshStandardMaterial color={cushionColor} roughness={0.7} metalness={0} />
      </mesh>
      {/* Left armrest support */}
      <mesh position={[-seatW / 2 + 0.02, seatY + armH / 2 + 0.04, -0.1]} castShadow>
        <boxGeometry args={[armW, armH, 0.06]} />
        <meshStandardMaterial color={frameMetal} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Right armrest pad */}
      <mesh position={[seatW / 2 - 0.02, seatY + armH + 0.08, -0.1]} castShadow>
        <boxGeometry args={[armW + 0.04, 0.04, armD]} />
        <meshStandardMaterial color={cushionColor} roughness={0.7} metalness={0} />
      </mesh>
      {/* Right armrest support */}
      <mesh position={[seatW / 2 - 0.02, seatY + armH / 2 + 0.04, -0.1]} castShadow>
        <boxGeometry args={[armW, armH, 0.06]} />
        <meshStandardMaterial color={frameMetal} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

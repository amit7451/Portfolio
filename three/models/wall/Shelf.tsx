'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface ShelfProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  length?: number;
  thickness?: number;
  depth?: number;
  showLightStrip?: boolean;
  lightColor?: string;
  lightIntensity?: number;
}

export default function Shelf({
  position = [0, 2.5, 0.3],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#a08060',
  visible = true,
  length = 14,
  thickness = 0.08,
  depth = 0.5,
  showLightStrip = true,
  lightColor = '#fff5e6',
  lightIntensity = 0.8,
}: ShelfProps) {
  const shelfRef = useRef<THREE.Mesh>(null);

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Shelf Surface */}
      <mesh
        ref={shelfRef}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <boxGeometry args={[length, thickness, depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Shelf Front Edge */}
      <mesh
        position={[0, -thickness / 2 - 0.02, depth / 2 - 0.02]}
        castShadow
      >
        <boxGeometry args={[length, 0.04, 0.08]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Light Strip Under Shelf */}
      {showLightStrip && (
        <mesh position={[0, -thickness / 2 - 0.03, -depth / 4]}>
          <boxGeometry args={[length - 0.5, 0.02, 0.1]} />
          <meshStandardMaterial
            color={lightColor}
            emissive={lightColor}
            emissiveIntensity={lightIntensity}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Shelf Bracket Left */}
      <mesh
        position={[-length / 2 + 0.3, -0.15, -depth / 4]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial
          color="#666"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Shelf Bracket Right */}
      <mesh
        position={[length / 2 - 0.3, -0.15, -depth / 4]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial
          color="#666"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

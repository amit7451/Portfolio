'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface StickyNoteProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  size?: number;
  text?: string;
  randomRotation?: boolean;
}

export default function StickyNote({
  position = [0, 0, 0.05],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#fff740',
  visible = true,
  size = 0.4,
  text = '',
  randomRotation = true,
}: StickyNoteProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate slight random rotation for natural look
  const randomRot = useMemo(() => {
    if (!randomRotation) return rotation;
    return [
      rotation[0] + (Math.random() - 0.5) * 0.1,
      rotation[1] + (Math.random() - 0.5) * 0.1,
      rotation[2] + (Math.random() - 0.5) * 0.3,
    ] as [number, number, number];
  }, [rotation, randomRotation]);

  if (!visible) return null;

  return (
    <group position={position} rotation={randomRot} scale={scale}>
      {/* Main Note */}
      <mesh ref={meshRef}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shadow/Depth Effect - minimal */}
      <mesh position={[0.005, -0.005, -0.002]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Folded Corner Effect */}
      <mesh position={[size / 2 - 0.03, size / 2 - 0.03, 0.002]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshStandardMaterial
          color="#e6dc00"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Fake Text Lines */}
      {text === '' && (
        <>
          <mesh position={[0, size / 4, 0.001]}>
            <planeGeometry args={[size * 0.7, 0.015]} />
            <meshStandardMaterial color="#999" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, size / 4 - 0.06, 0.001]}>
            <planeGeometry args={[size * 0.5, 0.015]} />
            <meshStandardMaterial color="#999" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, size / 4 - 0.12, 0.001]}>
            <planeGeometry args={[size * 0.6, 0.015]} />
            <meshStandardMaterial color="#999" transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}

'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface WallBaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  width?: number;
  height?: number;
  roughness?: number;
  textureRepeatX?: number;
  textureRepeatY?: number;
}

export default function WallBase({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#f5f0e6',
  visible = true,
  width = 20,
  height = 12,
  roughness = 0.85,
  textureRepeatX = 3,
  textureRepeatY = 2,
}: WallBaseProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load wall texture
  const texture = useTexture('/textures/wall-texture.jpg');
  
  // Configure texture repeating
  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(textureRepeatX, textureRepeatY);
    texture.needsUpdate = true;
  }, [texture, textureRepeatX, textureRepeatY]);

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Wall - receives shadows from 3D text */}
      <mesh
        ref={meshRef}
        receiveShadow
        position={[0, 0, 0]}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          roughness={roughness}
          metalness={0.03}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

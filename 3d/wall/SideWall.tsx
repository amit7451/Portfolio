'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface SideWallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  width?: number;
  height?: number;
  roughness?: number;
  side?: 'left' | 'right';
  textureRepeatX?: number;
  textureRepeatY?: number;
}

export default function SideWall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#ece7db',
  visible = true,
  width = 8,
  height = 14,
  roughness = 0.85,
  side = 'left',
  textureRepeatX = 2,
  textureRepeatY = 2,
}: SideWallProps) {
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

  // Rotate based on side - left wall rotates right, right wall rotates left
  const sideRotation: [number, number, number] = side === 'left' 
    ? [rotation[0], rotation[1] + Math.PI / 2, rotation[2]]
    : [rotation[0], rotation[1] - Math.PI / 2, rotation[2]];

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={sideRotation}
      scale={scale}
      receiveShadow
      castShadow
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        color={color}
        roughness={roughness}
        metalness={0.02}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

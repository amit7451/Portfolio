'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface FloorBaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  width?: number;
  depth?: number;
  textureRepeatX?: number;
  textureRepeatY?: number;
}

export default function FloorBase({
  position = [0, -5.5, 2],
  rotation = [-Math.PI / 2, 0, 0],
  scale = [1, 1, 1],
  color = '#c4a574',
  visible = true,
  width = 20,
  depth = 6,
  textureRepeatX = 4,
  textureRepeatY = 3,
}: FloorBaseProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load floor texture
  const texture = useTexture('/textures/floor-texture.jpg');
  
  // Configure texture repeating
  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(textureRepeatX, textureRepeatY);
    texture.needsUpdate = true;
  }, [texture, textureRepeatX, textureRepeatY]);

  if (!visible) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      receiveShadow
    >
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={texture}
        color={color}
        roughness={0.7}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

'use client';

import { useRef } from 'react';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface WallTextProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  visible?: boolean;
  text?: string;
  fontSize?: number;
  depth?: number;
  roughness?: number;
  metalness?: number;
}

export default function WallText({
  position = [0, 4, 0.2],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#8b7355',
  visible = true,
  text = 'FULL STACK DEVELOPER',
  fontSize = 0.8,
  depth = 0.05,
  roughness = 1.0,
  metalness = 0,
}: WallTextProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={fontSize}
          height={depth}
          curveSegments={12}
          bevelEnabled={false}
          castShadow
        >
          {text}
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            envMapIntensity={0}
            flatShading={false}
          />
        </Text3D>
      </Center>
    </group>
  );
}

'use client';

import { useRef, useEffect } from 'react';
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
  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={fontSize}
          height={depth}
          curveSegments={4}
          bevelEnabled={false}
          castShadow={false}
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

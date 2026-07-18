'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface FrameProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  visible?: boolean;
  width?: number;
  height?: number;
  frameThickness?: number;
  frameDepth?: number;
  frameColor?: string;
  imageColor?: string;
  imageTexture?: THREE.Texture | null;
}

export default function Frame({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  visible = true,
  width = 1.2,
  height = 1.5,
  frameThickness = 0.08,
  frameDepth = 0.06,
  frameColor = '#5c4033',
  imageColor = '#2a2a2a',
  imageTexture = null,
}: FrameProps) {
  const groupRef = useRef<THREE.Group>(null);

  if (!visible) return null;

  const innerWidth = width - frameThickness * 2;
  const innerHeight = height - frameThickness * 2;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Frame Border - Top */}
      <mesh position={[0, height / 2 - frameThickness / 2, frameDepth / 2]} castShadow>
        <boxGeometry args={[width, frameThickness, frameDepth]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>

      {/* Frame Border - Bottom */}
      <mesh position={[0, -height / 2 + frameThickness / 2, frameDepth / 2]} castShadow>
        <boxGeometry args={[width, frameThickness, frameDepth]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>

      {/* Frame Border - Left */}
      <mesh position={[-width / 2 + frameThickness / 2, 0, frameDepth / 2]} castShadow>
        <boxGeometry args={[frameThickness, height - frameThickness * 2, frameDepth]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>

      {/* Frame Border - Right */}
      <mesh position={[width / 2 - frameThickness / 2, 0, frameDepth / 2]} castShadow>
        <boxGeometry args={[frameThickness, height - frameThickness * 2, frameDepth]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>

      {/* Back Panel / Mat */}
      <mesh position={[0, 0, 0.01]} receiveShadow>
        <planeGeometry args={[innerWidth + 0.02, innerHeight + 0.02]} />
        <meshLambertMaterial color="#e8e4de" />
      </mesh>

      {/* Image Placeholder */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[innerWidth - 0.1, innerHeight - 0.1]} />
        {imageTexture ? (
          <meshLambertMaterial map={imageTexture} />
        ) : (
          <meshLambertMaterial color={imageColor} />
        )}
      </mesh>

      {/* Glass Effect */}
      <mesh position={[0, 0, frameDepth / 2 + 0.005]}>
        <planeGeometry args={[innerWidth, innerHeight]} />
        <meshLambertMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

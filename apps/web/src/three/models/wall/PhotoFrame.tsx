'use client';

import { useRef, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PhotoFrameProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  imagePath: string;
  width?: number;
  height?: number;
  frameThickness?: number;
  frameDepth?: number;
  frameColor?: string;
}

// Inner component that loads texture
function PhotoFrameImage({ imagePath, innerWidth, innerHeight }: { imagePath: string; innerWidth: number; innerHeight: number }) {
  const texture = useTexture(imagePath);
  
  return (
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[innerWidth - 0.08, innerHeight - 0.08]} />
      <meshLambertMaterial 
        map={texture} 
      />
    </mesh>
  );
}

// Fallback when texture is loading
function PhotoFrameFallback({ innerWidth, innerHeight }: { innerWidth: number; innerHeight: number }) {
  return (
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[innerWidth - 0.08, innerHeight - 0.08]} />
      <meshLambertMaterial color="#3a5a4a" />
    </mesh>
  );
}

export default function PhotoFrame({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  imagePath,
  width = 1.5,
  height = 1.8,
  frameThickness = 0.1,
  frameDepth = 0.08,
  frameColor = '#3d2817',
}: PhotoFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  
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

      {/* Inner mat/border */}
      <mesh position={[0, 0, 0.02]} receiveShadow>
        <planeGeometry args={[innerWidth, innerHeight]} />
        <meshLambertMaterial color="#f5f0e6" />
      </mesh>

      {/* Image - with Suspense fallback */}
      <Suspense fallback={<PhotoFrameFallback innerWidth={innerWidth} innerHeight={innerHeight} />}>
        <PhotoFrameImage imagePath={imagePath} innerWidth={innerWidth} innerHeight={innerHeight} />
      </Suspense>

      {/* Glass reflection layer */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[innerWidth - 0.04, innerHeight - 0.04]} />
        <meshLambertMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05} 
        />
      </mesh>
    </group>
  );
}

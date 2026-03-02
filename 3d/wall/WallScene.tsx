'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import WallDecorGroup from './WallDecorGroup';

interface WallSceneProps {
  enableOrbitControls?: boolean;
  showEnvironment?: boolean;
}

// Responsive breakpoints
const BREAKPOINTS = {
  large: 1920,   // Full HD
  medium: 1440,  // Laptop
  small: 1366,   // Common laptop
  tablet: 1024,  // Tablet landscape
};

// Camera settings per breakpoint
function getCameraSettings(width: number, height: number) {
  const aspectRatio = width / height;
  
  // Base settings - camera positioned higher, looking at upper wall area
  // This ensures top of wall is always visible, allowing cuts at bottom only
  let cameraZ = 12;
  let cameraY = 3;
  let lookAtY = 2;
  let fov = 50;
  
  if (width >= BREAKPOINTS.large) {
    // 1920+ - Full HD and above
    cameraZ = 12;
    cameraY = 3;
    lookAtY = 2;
    fov = 50;
  } else if (width >= BREAKPOINTS.medium) {
    // 1440-1919 - Laptop large
    cameraZ = 13;
    cameraY = 3;
    lookAtY = 2;
    fov = 50;
  } else if (width >= BREAKPOINTS.small) {
    // 1366-1439 - Common laptop
    cameraZ = 14;
    cameraY = 3;
    lookAtY = 2;
    fov = 52;
  } else if (width >= BREAKPOINTS.tablet) {
    // 1024-1365 - Tablet landscape
    cameraZ = 15;
    cameraY = 3.5;
    lookAtY = 2.5;
    fov = 54;
  } else {
    // <1024 - Small screens
    cameraZ = 16;
    cameraY = 4;
    lookAtY = 3;
    fov = 56;
  }
  
  // Adjust for non-16:9 aspect ratios
  if (aspectRatio < 1.5) {
    // Taller screens - raise camera more to show top
    cameraZ += 2;
    cameraY += 1;
    lookAtY += 0.5;
    fov += 4;
  } else if (aspectRatio > 2) {
    // Ultra-wide screens
    cameraZ -= 1;
  }
  
  return { cameraZ, cameraY, lookAtY, fov };
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
}

// Responsive camera controller
function ResponsiveCamera() {
  const { camera, size } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 3, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 2, 0));
  
  useEffect(() => {
    const settings = getCameraSettings(size.width, size.height);
    targetPosition.current.set(0, settings.cameraY, settings.cameraZ);
    targetLookAt.current.set(0, settings.lookAtY, 0);
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = settings.fov;
      camera.updateProjectionMatrix();
    }
  }, [size.width, size.height, camera]);
  
  useFrame(() => {
    // Smooth camera position transition
    camera.position.lerp(targetPosition.current, 0.05);
    // Smooth lookAt transition
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);
  });
  
  return null;
}

function SceneLighting() {
  return (
    <>
      {/* Ambient Light - Soft overall illumination */}
      <ambientLight intensity={0.45} color="#fff8f0" />

      {/* Main Directional Light - Creates shadows on wall and floor */}
      <directionalLight
        position={[3, 10, 8]}
        intensity={1.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        shadow-radius={3}
      />

      {/* Secondary light for text shadows */}
      <directionalLight
        position={[0, 6, 6]}
        intensity={0.5}
        color="#fff5e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0002}
      />

      {/* Fill Light from left */}
      <directionalLight
        position={[-8, 3, 4]}
        intensity={0.3}
        color="#e8e4ff"
      />

      {/* Warm accent from right */}
      <directionalLight
        position={[10, 2, 4]}
        intensity={0.25}
        color="#ffd4a3"
      />

      {/* Point Light - Shelf area */}
      <pointLight
        position={[0, 2.5, -2]}
        intensity={0.5}
        color="#fff5e6"
        distance={8}
        decay={2}
      />

      {/* Floor illumination */}
      <pointLight
        position={[0, -2, 2]}
        intensity={0.2}
        color="#ffffff"
        distance={10}
        decay={2}
      />
    </>
  );
}

export default function WallScene({
  enableOrbitControls = false,
  showEnvironment = false,
}: WallSceneProps) {
  return (
    <section
      id="hero"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
      }}
    >
      <Canvas
        shadows="soft"
        camera={{
          position: [0, 0.8, 8],
          fov: 48,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          shadowMapType: THREE.PCFSoftShadowMap,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#1e1e1e']} />

        <Suspense fallback={<LoadingFallback />}>
          {/* Responsive camera controller */}
          <ResponsiveCamera />
          
          <SceneLighting />

          {showEnvironment && (
            <Environment preset="apartment" background={false} />
          )}

          {/* Wall system - main composition */}
          <group position={[0, 0, 0]}>
            <WallDecorGroup position={[0, 0, 0]} />
          </group>

          {/* Reserved space for future foreground layer (desk, character) */}
          {/* <ForegroundLayer position={[0, -2, 2]} /> */}

          {enableOrbitControls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={20}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 6}
              target={[0, 0.5, 0]}
            />
          )}
        </Suspense>
      </Canvas>
    </section>
  );
}

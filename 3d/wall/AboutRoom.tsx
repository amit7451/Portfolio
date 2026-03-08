'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import WallText from './WallText';

interface AboutRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function AboutRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: AboutRoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load textures
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.jpg');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.jpg');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.jpg');

  // Load certificate images
  const nosqlTexture = useTexture('/3d/AboutRoom/images/nosql.png');
  const cs50pTexture = useTexture('/3d/AboutRoom/images/cs50p.png');
  const nlpTexture = useTexture('/3d/AboutRoom/images/nlp.png');
  const aiTexture = useTexture('/3d/AboutRoom/images/ai.png');
  const awscloudTexture = useTexture('/3d/AboutRoom/images/awscloud.png');
  const mlTexture = useTexture('/3d/AboutRoom/images/ml.png');

  // Configure wall texture
  const wallTexture = useMemo(() => {
    const cloned = basePlasterTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(6, 3);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [basePlasterTexture]);

  // Configure ceiling texture
  const ceilingTexture = useMemo(() => {
    const cloned = baseCeilingTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(5, 5.5);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseCeilingTexture]);

  // Configure floor texture
  const floorTexture = useMemo(() => {
    const cloned = baseFloorTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(4, 11);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseFloorTexture]);

  const roomW = 20;
  const roomH = 12;
  const roomD = 32;
  const backWallZ = -4;
  const floorY = 0;
  const ceilY = roomH;

  // PhotoFrame Component
  const PhotoFrame = ({
    position,
    width,
    height,
    texture,
  }: {
    position: [number, number, number];
    width: number;
    height: number;
    texture?: THREE.Texture;
  }) => {
    const frameThickness = 0.15;

    return (
      <group position={position}>
        {/* Outer black frame */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
        {/* Inner content area with image */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry
            args={[width - frameThickness * 2, height - frameThickness * 2]}
          />
          {texture ? (
            <meshBasicMaterial map={texture} toneMapped={false} />
          ) : (
            <meshStandardMaterial
              color="#e8e4e0"
              metalness={0.1}
              roughness={0.8}
            />
          )}
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, roomH / 2, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial map={wallTexture} color="#e8e4e0" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ═══ LEFT SIDE WALL ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial
          map={wallTexture}
          color="#e8e4e0"
          roughness={0.9}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial
          map={wallTexture}
          color="#e8e4e0"
          roughness={0.9}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial map={floorTexture} color="#b8a88a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* ═══ CEILING ═══ */}
      <mesh position={[0, roomH - 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshBasicMaterial
          map={ceilingTexture}
          color="#f5f5f5"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ═══ "ABOUT ME" TITLE ═══ */}
      <WallText
        position={[0, roomH - 1.5, backWallZ + 0.1]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        color="#6b6560"
        text="ABOUT ME"
        fontSize={0.9}
        depth={0.06}
        roughness={0.85}
        metalness={0.05}
      />

      {/* ═══ PHOTO FRAMES GROUP ═══ */}
      <group position={[0, 0, backWallZ]}>
        {/* Frame 1: Left-Top Portrait - NoSQL Certificate */}
        <PhotoFrame position={[-5.2, 6, 0.03]} width={2.5} height={3.5} texture={nosqlTexture} />

        {/* Frame 2: Center-Top Large Landscape - CS50P Certificate */}
        <PhotoFrame position={[-1.57, 7.2, 0.03]} width={4.2} height={3} texture={cs50pTexture} />

        {/* Frame 3: Right-Top Small Portrait - NLP Certificate */}
        <PhotoFrame position={[1.85, 6.8, 0.03]} width={2} height={2.8} texture={nlpTexture} />

        {/* Frame 4: Center-Middle Landscape - AI Certificate */}
        <PhotoFrame position={[-1.65, 4.2, 0.03]} width={3.8} height={2.5} texture={aiTexture} />

        {/* Frame 5: Right-Middle Landscape - AWS Cloud Certificate */}
        <PhotoFrame position={[2.2, 4, 0.03]} width={3.5} height={2.3} texture={awscloudTexture} />

        {/* Frame 6: Center-Bottom Large Landscape - ML Certificate */}
        <PhotoFrame position={[5.0, 7, 0.03]} width={3.8} height={3} texture={mlTexture} />
      </group>

      {/* ═══ ACCENT LIGHTING ═══ */}
      {/* Optimized lighting setup */}
      <pointLight position={[0, roomH - 1, 0]} intensity={0.65} color="#ffffff" distance={20} decay={2} castShadow={false} />
      <pointLight position={[8, roomH / 2, 4]} intensity={0.4} color="#e0e8ff" distance={15} decay={2} castShadow={false} />
    </group>
  );
}

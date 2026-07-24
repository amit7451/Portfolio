'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import WallText from '../models/wall/WallText';
import { useResponsiveCanvas } from '../../hooks/useResponsive';

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
  const { mapLinear } = useResponsiveCanvas();

  // Load textures
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.webp');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.webp');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.webp');

  // Load certificate images
  const nosqlTexture = useTexture('/3d/AboutRoom/images/nosql.webp');
  const cs50pTexture = useTexture('/3d/AboutRoom/images/cs50p.webp');
  const nlpTexture = useTexture('/3d/AboutRoom/images/nlp.webp');
  const aiTexture = useTexture('/3d/AboutRoom/images/ai.webp');
  const awscloudTexture = useTexture('/3d/AboutRoom/images/awscloud.webp');
  const mlTexture = useTexture('/3d/AboutRoom/images/ml.webp');

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
          <meshLambertMaterial
            color="#000000"
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
            <meshLambertMaterial
              color="#e8e4e0"
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
        <meshLambertMaterial map={wallTexture} color="#e8e4e0" />
      </mesh>

      {/* ═══ LEFT SIDE WALL ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color="#e8e4e0"
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color="#e8e4e0"
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshLambertMaterial map={floorTexture} color="#b8a88a" />
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
      />

      {/* ═══ PHOTO FRAMES GROUP ═══ */}
      <group position={[0, 0, backWallZ]}>
        {/* Frame 1: Left-Top Portrait - NoSQL Certificate */}
        <PhotoFrame position={[mapLinear(-2.6, -5.2), 6, 0.03]} width={2.5} height={3.5} texture={nosqlTexture} />

        {/* Frame 2: Center-Top Large Landscape - CS50P Certificate */}
        <PhotoFrame position={[mapLinear(-0.8, -1.57), 7.2, 0.03]} width={4.2} height={3} texture={cs50pTexture} />

        {/* Frame 3: Right-Top Small Portrait - NLP Certificate */}
        <PhotoFrame position={[mapLinear(1.0, 1.85), 6.8, 0.03]} width={2} height={2.8} texture={nlpTexture} />

        {/* Frame 4: Center-Middle Landscape - AI Certificate */}
        <PhotoFrame position={[mapLinear(-0.8, -1.65), 4.2, 0.03]} width={3.8} height={2.5} texture={aiTexture} />

        {/* Frame 5: Right-Middle Landscape - AWS Cloud Certificate */}
        <PhotoFrame position={[mapLinear(1.2, 2.2), 4, 0.03]} width={3.5} height={2.3} texture={awscloudTexture} />

        {/* Frame 6: Center-Bottom Large Landscape - ML Certificate */}
        <PhotoFrame position={[mapLinear(2.6, 5.0), 7, 0.03]} width={3.8} height={3} texture={mlTexture} />
      </group>

      {/* ═══ ACCENT LIGHTING ═══ */}
      {/* Optimized lighting setup */}
    </group>
  );
}

'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import WallText from '../models/wall/WallText';
import GitHubFloorGraph from '../components/GitHubFloorGraph';
import LeetCodeFloorGraph from '../components/LeetCodeFloorGraph';
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
  const cs50pTexture = useTexture('/3d/AboutRoom/images/cs50p.webp');
  const aiTexture = useTexture('/3d/AboutRoom/images/ai.webp');
  const awscloudTexture = useTexture('/3d/AboutRoom/images/awscloud.webp');
  const awsMlAssociateTexture = useTexture('/3d/AboutRoom/images/awsmlassociate.webp');

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

  // Ultra-Smooth Premium PhotoFrame Component (Lerp Hover Scale + Instant In-Place Modal Opening)
  const PhotoFrame = ({
    position,
    width,
    height,
    texture,
    certId,
  }: {
    position: [number, number, number];
    width: number;
    height: number;
    texture?: THREE.Texture;
    certId: string;
  }) => {
    const frameRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const targetScale = useRef(1.0);
    const frameBorder = 0.08;

    useFrame((_, delta) => {
      if (!frameRef.current) return;
      targetScale.current = hovered ? 1.04 : 1.0;
      const currentS = frameRef.current.scale.x;
      const lerped = THREE.MathUtils.lerp(currentS, targetScale.current, Math.min(1, delta * 6));
      frameRef.current.scale.set(lerped, lerped, lerped);
    });

    return (
      <group
        ref={frameRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('openCertModal', { detail: { certId } })
            );
          }
        }}
      >
        {/* Layer 1: Solid Clean Dark Charcoal Outer Frame */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#08080a" toneMapped={false} />
        </mesh>

        {/* Layer 2: Certificate Image (100% High-Contrast Crisp Texture, Zero Edge Artifacts) */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry
            args={[width - frameBorder * 2, height - frameBorder * 2]}
          />
          {texture ? (
            <meshBasicMaterial map={texture} toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#e8e4e0" toneMapped={false} />
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

      {/* ═══ GITHUB CONTRIBUTION GRAPH ═══ */}
      <GitHubFloorGraph position={[-3.5, 0.05, 0]} />

      {/* ═══ LEETCODE STATS GRAPH ═══ */}
      <LeetCodeFloorGraph position={[5.25, 0.05, 0]} />

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
        {/* Frame 1: Top-Left - Smaller: AWS Cloud Certificate */}
        <PhotoFrame
          position={[mapLinear(-1.05, -1.75), mapLinear(7.15, 7.45), 0.03]}
          width={mapLinear(1.9, 3.2)}
          height={mapLinear(1.425, 2.4)}
          texture={awscloudTexture}
          certId="aws-cloud-practitioner"
        />

        {/* Frame 2: Top-Right - Bigger: CS50P Certificate */}
        <PhotoFrame
          position={[mapLinear(1.55, 2.55), mapLinear(7.45, 7.8), 0.03]}
          width={mapLinear(2.8, 4.8)}
          height={mapLinear(2.1, 3.6)}
          texture={cs50pTexture}
          certId="cs50-python"
        />

        {/* Frame 3: Bottom-Left - Bigger: AWS ML Associate Certificate */}
        <PhotoFrame
          position={[mapLinear(-1.55, -2.55), mapLinear(4.1, 4.3), 0.03]}
          width={mapLinear(2.8, 4.8)}
          height={mapLinear(2.1, 3.6)}
          texture={awsMlAssociateTexture}
          certId="aws-ml-associate"
        />

        {/* Frame 4: Bottom-Right - Smaller: AI Certificate */}
        <PhotoFrame
          position={[mapLinear(1.05, 1.75), mapLinear(4.4, 4.65), 0.03]}
          width={mapLinear(1.9, 3.2)}
          height={mapLinear(1.425, 2.4)}
          texture={aiTexture}
          certId="ai-for-everyone"
        />
      </group>

      {/* ═══ GALLERY ACCENT LIGHTING ═══ */}
      <spotLight
        position={[0, 9.5, backWallZ + 3.0]}
        intensity={1.2}
        angle={0.7}
        penumbra={0.5}
        color="#ffffff"
      />
    </group>
  );
}

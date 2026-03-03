'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import WallText from './WallText';
import RisingLaserLines from './RisingLaserLines';

interface ContactsRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function ContactsRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: ContactsRoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load textures
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.jpg');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.jpg');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.jpg');

  // Configure wall texture
  const wallTexture = useMemo(() => {
    const cloned = basePlasterTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(6, 3);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 16;
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
    cloned.anisotropy = 16;
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
    cloned.anisotropy = 16;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseFloorTexture]);

  const roomW = 20;
  const roomH = 12;
  const roomD = 32;
  const backWallZ = -4;
  const floorY = 0;
  const ceilY = roomH;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, roomH / 2, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial map={wallTexture} color="#e8e4e0" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Rising Laser Lines Effect */}
      <RisingLaserLines wallWidth={roomW} wallZ={backWallZ} />

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

      {/* ═══ "CONTACTS" TITLE ═══ */}
      <WallText
        position={[0, roomH - 2, backWallZ + 0.1]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        color="#6b6560"
        text="CONTACTS"
        fontSize={0.9}
        depth={0.06}
        roughness={0.85}
        metalness={0.05}
      />

      {/* ═══ ACCENT LIGHTING ═══ */}
      <pointLight
        position={[0, roomH - 1, 0]}
        intensity={0.45}
        color="#ffffff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[-6, roomH - 1, 0]}
        intensity={0.3}
        color="#e0e8ff"
        distance={8}
        decay={2}
      />
      <pointLight
        position={[6, roomH - 1, 0]}
        intensity={0.35}
        color="#e0e8ff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[8, roomH / 2, 4]}
        intensity={0.3}
        color="#ffffff"
        distance={10}
        decay={2}
      />
    </group>
  );
}

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export interface RoomShellProps {
  roomW?: number;
  roomH?: number;
  roomD?: number;
  backWallZ?: number;
  sideWallZ?: number;
  floorY?: number;
  ceilingY?: number;
  centerOffsetY?: number;
  wallColor?: string;
  sideWallColor?: string;
  floorColor?: string;
  ceilingColor?: string;
  wallRepeatX?: number;
  wallRepeatY?: number;
  ceilingRepeatX?: number;
  ceilingRepeatY?: number;
  floorRepeatX?: number;
  floorRepeatY?: number;
}

export default function RoomShell({
  roomW = 20,
  roomH = 12,
  roomD = 32,
  backWallZ = -4,
  sideWallZ = 0,
  floorY = 0.01,
  ceilingY,
  centerOffsetY,
  wallColor = '#e8e4e0',
  sideWallColor,
  floorColor = '#b8a88a',
  ceilingColor = '#f5f5f5',
  wallRepeatX = 6,
  wallRepeatY = 3,
  ceilingRepeatX = 5,
  ceilingRepeatY = 5.5,
  floorRepeatX = 4,
  floorRepeatY = 11,
}: RoomShellProps) {
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.webp');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.webp');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.webp');

  const wallTexture = useMemo(() => {
    const cloned = basePlasterTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(wallRepeatX, wallRepeatY);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [basePlasterTexture, wallRepeatX, wallRepeatY]);

  const ceilingTexture = useMemo(() => {
    const cloned = baseCeilingTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(ceilingRepeatX, ceilingRepeatY);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseCeilingTexture, ceilingRepeatX, ceilingRepeatY]);

  const floorTexture = useMemo(() => {
    const cloned = baseFloorTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(floorRepeatX, floorRepeatY);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseFloorTexture, floorRepeatX, floorRepeatY]);

  const wallY = centerOffsetY ?? roomH / 2;
  const actualCeilingY = ceilingY ?? roomH - 0.3;
  const sideColor = sideWallColor ?? wallColor;

  return (
    <group>
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, wallY, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshLambertMaterial map={wallTexture} color={wallColor} />
      </mesh>

      {/* ═══ LEFT SIDE WALL ═══ */}
      <mesh position={[-roomW / 2, wallY, sideWallZ]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color={sideColor}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, wallY, sideWallZ]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color={sideColor}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, floorY, sideWallZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshLambertMaterial map={floorTexture} color={floorColor} />
      </mesh>

      {/* ═══ CEILING ═══ */}
      <mesh position={[0, actualCeilingY, sideWallZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshBasicMaterial map={ceilingTexture} color={ceilingColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

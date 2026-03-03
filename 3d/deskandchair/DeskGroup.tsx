'use client';

import Desk from './Desk';
import Chair from './Chair';
import { Character } from '../character';

interface DeskGroupProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * DeskGroup — Composed layout of Desk + Chair.
 *
 * World placement guide (set via `position` prop):
 *   Wall back   → Z ≈ -4
 *   Desk group  → Z ≈  2   (6 units in front of wall)
 *   Chair local → Z = +0.6 (slightly behind desk, toward camera)
 *
 * Make sure the group position Y sits on the floor (Y = -3).
 */
export default function DeskGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: DeskGroupProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Desk — centred at local origin, scaled up for realism */}
      <Desk
        position={[0, 0, 0]}
        scale={[1.8, 1.8, 1.8]}
        color="#3a3028"
      />

      {/* Character — positioned to sit ON chair seat */}
      <Character
        position={[0, 1.0, -1.9]}
        rotation={[0, 0, 0]}
        scale={[1.4, 1.4, 1.4]}
      />

      {/* Chair — behind the character, angled toward monitor */}
      <Chair
        position={[0, 0, -3.5]}
        rotation={[0, Math.PI + 0.175, 0]}
        scale={[1.7, 1.7, 1.7]}
        color="#1a1a1a"
      />
    </group>
  );
}

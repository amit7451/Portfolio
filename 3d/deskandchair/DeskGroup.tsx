'use client';

import Desk from './Desk';
import Chair from './Chair';

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

      {/* Chair — on the far side of the desk (behind it, toward the wall).
          Z = -2.2 places it on the opposite side from the camera.
          Rotated 180° (Math.PI) so the chair faces the camera / the person sitting faces forward. */}
      <Chair
        position={[0, 0, -2.2]}
        rotation={[0, Math.PI, 0]}
        scale={[1.7, 1.7, 1.7]}
        color="#1a1a1a"
      />
    </group>
  );
}

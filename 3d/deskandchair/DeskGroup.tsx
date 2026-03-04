'use client';

import { RoundedBox } from '@react-three/drei';
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
  const boxStack = [
    { pos: [0.0, 0.14, 0.0] as [number, number, number], rot: [0, 0.32, 0] as [number, number, number], color: '#d8c8ad' },
    { pos: [0.06, 0.36, -0.02] as [number, number, number], rot: [0, -0.25, 0] as [number, number, number], color: '#cbb79a' },
    { pos: [-0.04, 0.58, 0.03] as [number, number, number], rot: [0, 0.18, 0] as [number, number, number], color: '#e1d3bb' },
    { pos: [0.03, 0.8, -0.02] as [number, number, number], rot: [0, -0.36, 0] as [number, number, number], color: '#bca789' },
  ];

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

      {/* Wooden circular stool — left of desk and right of drawer area */}
      <group position={[4.75, 0, 0.55]} scale={[1.42, 1.42, 1.42]}>
        {/* Seat top */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.62, 0.12, 32]} />
          <meshStandardMaterial color="#6e4a2f" roughness={0.72} metalness={0.04} />
        </mesh>

        {/* Seat underside ring */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.5, 0.06, 28]} />
          <meshStandardMaterial color="#5a3b26" roughness={0.76} metalness={0.03} />
        </mesh>

        {/* Legs */}
        {[
          [0.3, 0.4, 0.3],
          [-0.3, 0.4, 0.3],
          [0.3, 0.4, -0.3],
          [-0.3, 0.4, -0.3],
        ].map((legPos, idx) => (
          <mesh key={`stool-leg-${idx}`} position={legPos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.78, 18]} />
            <meshStandardMaterial color="#5a3b26" roughness={0.75} metalness={0.03} />
          </mesh>
        ))}

        {/* Bottom stabilizer */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.36, 0.05, 24]} />
          <meshStandardMaterial color="#4b301f" roughness={0.78} metalness={0.02} />
        </mesh>

        {/* 4 randomly stacked sq-circle cuboid boxes */}
        <group position={[0, 0.98, 0]}>
          {boxStack.map((box, index) => (
            <RoundedBox
              key={`stool-box-${index}`}
              args={[0.72, 0.18, 0.42]}
              radius={0.06}
              smoothness={4}
              position={box.pos}
              rotation={box.rot}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={box.color} roughness={0.62} metalness={0.05} />
            </RoundedBox>
          ))}
        </group>
      </group>
    </group>
  );
}

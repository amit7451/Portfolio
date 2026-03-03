'use client';

import { useRef} from 'react';
import * as THREE from 'three';

interface NavigationSignProps {
  position: [number, number, number];
  label: string;
  direction: 'up' | 'down'; // up for left wall (upper rooms), down for right wall (lower rooms)
  targetScrollPage: number; // which scroll page (0-5)
  side: 'left' | 'right'; // which wall
}

export default function NavigationSign({
  position,
  label,
  direction,
  targetScrollPage,
  side,
}: NavigationSignProps) {
  const groupRef = useRef<THREE.Group>(null);

  const handleClick = () => {
    // Dispatch custom event that the parent can listen to
    const event = new CustomEvent('navigationClicked', {
      detail: { targetPage: targetScrollPage },
    });
    window.dispatchEvent(event);
  };

  const handlePointerEnter = () => {
    if (groupRef.current) {
      groupRef.current.scale.set(1.1, 1.1, 1.1);
    }
  };

  const handlePointerLeave = () => {
    if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  };

  // Rotation for arrow direction
  const arrowRotation = direction === 'up' ? Math.PI / 4 : -Math.PI / 4;

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Wooden pole */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
        <meshStandardMaterial
          color="#8B6F47"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Wooden sign board */}
      <mesh
        position={[0, 0.4, 0]}
        rotation={[0, 0, arrowRotation]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[1.4, 0.5, 0.12]} />
        <meshStandardMaterial
          color="#A0826D"
          roughness={0.75}
          metalness={0.08}
        />
      </mesh>

      {/* Sign border/edge detail */}
      <mesh
        position={[0, 0.4, 0.08]}
        rotation={[0, 0, arrowRotation]}
      >
        <boxGeometry args={[1.45, 0.55, 0.02]} />
        <meshStandardMaterial
          color="#6B5D4F"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Arrow indicator - up or down */}
      <group position={[0, 0.4, 0.1]} rotation={[0, 0, arrowRotation]}>
        <mesh>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial
            color={direction === 'up' ? '#FFD700' : '#FFED4E'}
            roughness={0.4}
            metalness={0.6}
            emissive={direction === 'up' ? '#FFB700' : '#FFC700'}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Decorative nails/bolts on sign */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0.1]} rotation={[0, 0, arrowRotation]}>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 8]} />
          <meshStandardMaterial
            color="#5a4a3a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

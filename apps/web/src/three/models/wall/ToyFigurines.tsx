'use client';

import * as THREE from 'three';

// Tanjiro - Demon Slayer (green/black checkered haori)
export function TanjiroFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.12]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Body/Torso with checkered pattern (simplified as green) */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.14]} />
        <meshLambertMaterial color="#2d5a3d" />
      </mesh>
      
      {/* Haori pattern stripes */}
      <mesh position={[0.06, 0.65, 0.071]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.01]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.06, 0.65, 0.071]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.01]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshLambertMaterial color="#f5d0b0" />
      </mesh>
      
      {/* Hair - burgundy/dark red */}
      <mesh position={[0, 1.02, -0.02]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshLambertMaterial color="#8b2942" />
      </mesh>
      
      {/* Earrings (hanafuda) */}
      <mesh position={[0.13, 0.92, 0]} castShadow>
        <boxGeometry args={[0.02, 0.08, 0.01]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Sword on back */}
      <mesh position={[0.12, 0.6, -0.1]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshLambertMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}

// Zenitsu - Demon Slayer (yellow haori)
export function ZenitsuFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.12]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Body/Torso - yellow/orange haori */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.14]} />
        <meshLambertMaterial color="#f5a623" />
      </mesh>
      
      {/* Triangle pattern */}
      <mesh position={[0, 0.52, 0.071]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.01]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshLambertMaterial color="#f5d0b0" />
      </mesh>
      
      {/* Hair - spiky yellow */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshLambertMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0.06, 1.0, 0]} rotation={[0, 0, 0.5]} castShadow>
        <coneGeometry args={[0.05, 0.1, 6]} />
        <meshLambertMaterial color="#ffd700" />
      </mesh>
      <mesh position={[-0.06, 1.0, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.05, 0.1, 6]} />
        <meshLambertMaterial color="#ffd700" />
      </mesh>
      
      {/* Sword */}
      <mesh position={[-0.12, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.03, 0.45, 0.02]} />
        <meshLambertMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}

// Spider-Man Figurine
export function SpiderManFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs - red/blue */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e3a8a" />
      </mesh>
      
      {/* Body/Torso - red with black web lines */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.12]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      
      {/* Spider emblem */}
      <mesh position={[0, 0.68, 0.065]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Arms - red */}
      <mesh position={[-0.14, 0.7, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0.14, 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      
      {/* Head - red mask */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      
      {/* Eyes - large white */}
      <mesh position={[0.04, 0.96, 0.1]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.04, 0.96, 0.1]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Iron Man Figurine
export function IronManFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs - red/gold armor */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.09, 0.4, 0.1]} />
        <meshLambertMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.09, 0.4, 0.1]} />
        <meshLambertMaterial color="#b91c1c" />
      </mesh>
      
      {/* Body/Torso - gold chest plate */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.24, 0.35, 0.14]} />
        <meshLambertMaterial color="#b91c1c" />
      </mesh>
      
      {/* Arc reactor */}
      <mesh position={[0, 0.7, 0.075]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshLambertMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Arms - red/gold */}
      <mesh position={[-0.16, 0.68, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.08]} />
        <meshLambertMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.16, 0.68, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.08]} />
        <meshLambertMaterial color="#fbbf24" />
      </mesh>
      
      {/* Head - helmet */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.16]} />
        <meshLambertMaterial color="#b91c1c" />
      </mesh>
      
      {/* Face plate - gold */}
      <mesh position={[0, 0.93, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshLambertMaterial color="#fbbf24" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.03, 0.95, 0.09]} castShadow>
        <boxGeometry args={[0.03, 0.015, 0.01]} />
        <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.03, 0.95, 0.09]} castShadow>
        <boxGeometry args={[0.03, 0.015, 0.01]} />
        <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Captain America Figurine
export function CaptainAmericaFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Legs - blue */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      
      {/* Body/Torso - blue with stripes */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.12]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      
      {/* Star emblem */}
      <mesh position={[0, 0.7, 0.065]} rotation={[Math.PI / 2, 0, Math.PI / 10]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 5]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Red stripes */}
      <mesh position={[0, 0.55, 0.065]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.01]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      
      {/* Arms - blue */}
      <mesh position={[-0.14, 0.68, 0]} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.14, 0.68, 0]} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      
      {/* Shield on arm */}
      <mesh position={[-0.22, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
        <meshLambertMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-0.24, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.25, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      
      {/* Head with helmet */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshLambertMaterial color="#1e40af" />
      </mesh>
      
      {/* Face opening */}
      <mesh position={[0, 0.93, 0.08]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshLambertMaterial color="#f5d0b0" />
      </mesh>
      
      {/* A on helmet */}
      <mesh position={[0, 1.02, 0.05]} castShadow>
        <boxGeometry args={[0.04, 0.06, 0.01]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      {/* Wings on helmet */}
      <mesh position={[0.1, 0.98, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.01]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.1, 0.98, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.01]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

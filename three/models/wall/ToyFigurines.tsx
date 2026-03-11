'use client';

import * as THREE from 'three';

// Tanjiro - Demon Slayer (green/black checkered haori)
export function TanjiroFigurine({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} scale={[0.4, 0.4, 0.4]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Body/Torso with checkered pattern (simplified as green) */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.14]} />
        <meshStandardMaterial color="#2d5a3d" roughness={0.5} />
      </mesh>
      
      {/* Haori pattern stripes */}
      <mesh position={[0.06, 0.65, 0.071]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[-0.06, 0.65, 0.071]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      
      {/* Hair - burgundy/dark red */}
      <mesh position={[0, 1.02, -0.02]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#8b2942" roughness={0.7} />
      </mesh>
      
      {/* Earrings (hanafuda) */}
      <mesh position={[0.13, 0.92, 0]} castShadow>
        <boxGeometry args={[0.02, 0.08, 0.01]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </mesh>
      
      {/* Sword on back */}
      <mesh position={[0.12, 0.6, -0.1]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.5} />
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
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Body/Torso - yellow/orange haori */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.14]} />
        <meshStandardMaterial color="#f5a623" roughness={0.5} />
      </mesh>
      
      {/* Triangle pattern */}
      <mesh position={[0, 0.52, 0.071]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      
      {/* Hair - spiky yellow */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color="#ffd700" roughness={0.6} />
      </mesh>
      <mesh position={[0.06, 1.0, 0]} rotation={[0, 0, 0.5]} castShadow>
        <coneGeometry args={[0.05, 0.1, 6]} />
        <meshStandardMaterial color="#ffd700" roughness={0.6} />
      </mesh>
      <mesh position={[-0.06, 1.0, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.05, 0.1, 6]} />
        <meshStandardMaterial color="#ffd700" roughness={0.6} />
      </mesh>
      
      {/* Sword */}
      <mesh position={[-0.12, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.03, 0.45, 0.02]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.5} />
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
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      
      {/* Legs - red/blue */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
      </mesh>
      
      {/* Body/Torso - red with black web lines */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      
      {/* Spider emblem */}
      <mesh position={[0, 0.68, 0.065]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      
      {/* Arms - red */}
      <mesh position={[-0.14, 0.7, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>
      
      {/* Head - red mask */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      
      {/* Eyes - large white */}
      <mesh position={[0.04, 0.96, 0.1]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[-0.04, 0.96, 0.1]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
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
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      
      {/* Legs - red/gold armor */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.09, 0.4, 0.1]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.09, 0.4, 0.1]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Body/Torso - gold chest plate */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.24, 0.35, 0.14]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Arc reactor */}
      <mesh position={[0, 0.7, 0.075]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Arms - red/gold */}
      <mesh position={[-0.16, 0.68, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.08]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.68, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.08]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Head - helmet */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.16]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Face plate - gold */}
      <mesh position={[0, 0.93, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.03, 0.95, 0.09]} castShadow>
        <boxGeometry args={[0.03, 0.015, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.03, 0.95, 0.09]} castShadow>
        <boxGeometry args={[0.03, 0.015, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
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
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      
      {/* Legs - blue */}
      <mesh position={[-0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>
      
      {/* Body/Torso - blue with stripes */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.4} />
      </mesh>
      
      {/* Star emblem */}
      <mesh position={[0, 0.7, 0.065]} rotation={[Math.PI / 2, 0, Math.PI / 10]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      {/* Red stripes */}
      <mesh position={[0, 0.55, 0.065]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.01]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      
      {/* Arms - blue */}
      <mesh position={[-0.14, 0.68, 0]} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.68, 0]} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>
      
      {/* Shield on arm */}
      <mesh position={[-0.22, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[-0.24, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[-0.25, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
        <meshStandardMaterial color="#1e40af" roughness={0.3} />
      </mesh>
      
      {/* Head with helmet */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#1e40af" roughness={0.4} />
      </mesh>
      
      {/* Face opening */}
      <mesh position={[0, 0.93, 0.08]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      
      {/* A on helmet */}
      <mesh position={[0, 1.02, 0.05]} castShadow>
        <boxGeometry args={[0.04, 0.06, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      {/* Wings on helmet */}
      <mesh position={[0.1, 0.98, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[-0.1, 0.98, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
    </group>
  );
}

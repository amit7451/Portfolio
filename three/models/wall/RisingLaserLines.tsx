'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RisingLaserLinesProps {
    wallWidth: number;
    wallZ: number;
    density?: number;
    intensity?: number;
}

// Rising Laser Lines Effect Component
export default function RisingLaserLines({ wallWidth, wallZ, density = 1, intensity = 1 }: RisingLaserLinesProps) {
  const linesRef = useRef<THREE.Group>(null);
  
  // Generate laser line positions
  const laserLines = useMemo(() => {
    const lines = [];
    const numLines = Math.floor(55 * density); // Scaled density
    for (let i = 0; i < numLines; i++) {
        // Spread across wall width with some padding
      const x = (Math.random() - 0.5) * wallWidth * 0.9; 
      const height = 2 + Math.random() * 3; // Variable heights (2-5 units)
      const speed = 0.3 + Math.random() * 0.5; // Variable speeds
      const delay = Math.random() * Math.PI * 2; // Random start phase
      const color = Math.random() > 0.3 ? '#a855f7' : '#ec4899'; // Purple or pink
      const width = 0.02 + Math.random() * 0.03; // Thin lines
      
      lines.push({ x, height, speed, delay, color, width, id: i });
    }
    return lines;
  }, [wallWidth, density]);

  // Generate particles
  const particles = useMemo(() => {
    const parts = [];
    const numParticles = Math.floor(80 * density);
    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * wallWidth * 0.9;
      const speed = 0.4 + Math.random() * 0.6;
      const delay = Math.random() * Math.PI * 2;
      const size = 0.02 + Math.random() * 0.04;
      const color = Math.random() > 0.5 ? '#a855f7' : '#ec4899';
      
      parts.push({ x, speed, delay, size, color, id: i });
    }
    return parts;
  }, [wallWidth, density]);

  return (
    <group ref={linesRef}>
      {/* Floor glow strip */}
      <mesh position={[0, 0.05, wallZ + 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[wallWidth * 0.9, 0.3]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.3 * intensity}
          transparent
          opacity={0.6 * intensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated laser lines */}
      {laserLines.map((line) => (
        <AnimatedLaserLine
          key={line.id}
          x={line.x}
          height={line.height}
          speed={line.speed}
          delay={line.delay}
          color={line.color}
          width={line.width}
          wallZ={wallZ}
          intensity={intensity}
        />
      ))}

      {/* Animated particles */}
      {particles.map((particle) => (
        <AnimatedParticle
          key={particle.id}
          x={particle.x}
          speed={particle.speed}
          delay={particle.delay}
          size={particle.size}
          color={particle.color}
          wallZ={wallZ}
          intensity={intensity}
        />
      ))}
    </group>
  );
}

// Individual animated laser line
function AnimatedLaserLine({
  x,
  height,
  speed,
  delay,
  color,
  width,
  wallZ,
  intensity = 1,
}: {
  x: number;
  height: number;
  speed: number;
  delay: number;
  color: string;
  width: number;
  wallZ: number;
  intensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const cycle = (time * speed + delay) % 6;
      const y = cycle; // Rises from 0 to 6
      const opacity = cycle < 3 ? cycle / 3 : (6 - cycle) / 3; // Fade in/out
      
      meshRef.current.position.y = y;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = Math.max(0, opacity * 0.75 * intensity);
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0, wallZ + 0.03]}>
      <boxGeometry args={[width, height, 0.01]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5 * intensity}
        transparent
        opacity={0.75 * intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Individual animated particle
function AnimatedParticle({
  x,
  speed,
  delay,
  size,
  color,
  wallZ,
  intensity = 1,
}: {
  x: number;
  speed: number;
  delay: number;
  size: number;
  color: string;
  wallZ: number;
  intensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const cycle = (time * speed + delay) % 5;
      const y = cycle * 0.8; // Rises from 0 to 4
      const opacity = cycle < 2.5 ? cycle / 2.5 : (5 - cycle) / 2.5; // Fade in/out
      
      meshRef.current.position.y = y;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = Math.max(0, opacity * 0.8 * intensity);
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0, wallZ + 0.04]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3 * intensity}
        transparent
        opacity={0.9 * intensity}
      />
    </mesh>
  );
}

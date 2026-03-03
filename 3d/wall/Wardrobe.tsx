'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface WardrobeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function Wardrobe({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: WardrobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Dimensions
  // Wall width is 10, previous was 7.5. User wants 50% of the previous size.
  // 50% of 7.5 = 3.75
  const width = 3.75; 
  // Wall height is 12, 3/4 is 9. We want less than that. Let's say 8.
  const height = 8.5;
  const depth = 0.6; // Standard wardrobe depth

  // Wood material properties
  const woodColor = '#5c4033'; // Darker wood
  const woodRoughness = 0.7;
  const woodMetalness = 0.1;

  // Door detailing
  const doorGap = 0.005;
  // Reduced to 2 doors for better proportions at this width
  const doorWidth = (width / 2) - doorGap; 
  const doorHeight = height - 0.1; // Slightly shorter than frame

  // Handle properties
  const handleLength = 0.4;
  const handleWidth = 0.02;
  const handleDepth = 0.04;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      
      {/* Main Body (Frame) */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={woodColor} 
          roughness={woodRoughness} 
          metalness={woodMetalness} 
        />
      </mesh>

      {/* ═══ DOORS ═══ */}
      {/* 2 Vertical Doors (reduced from 3) */}
      {[
        -(width/4) - (doorGap/2), // Left door
        (width/4) + (doorGap/2)   // Right door
      ].map((xPos, index) => (
        <group key={`door-${index}`} position={[xPos, height / 2, depth / 2 + 0.01]}>
          {/* Door Panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, 0.02]} />
            <meshStandardMaterial 
              color="#6b4c3e" // Slightly lighter than frame
              roughness={0.6}
              metalness={0.05}
            />
          </mesh>

          {/* Door Detailing - Beveled edges simulation (Inset) */}
          <mesh position={[0, 0, 0.015]} receiveShadow>
             <boxGeometry args={[doorWidth - 0.1, doorHeight - 0.1, 0.005]} />
             <meshStandardMaterial color="#5e4134" roughness={0.7} />
          </mesh>

          {/* Handle - adjusted height for accessibility */}
          <mesh 
            position={[
              // Handles in center for double door look
              index === 1 ? -doorWidth/2 + 0.08 : doorWidth/2 - 0.08, 
              -1.0, // Lowered handle position (approx 1m from floor in real scale)
              0.03
            ]} 
            castShadow
          >
            <boxGeometry args={[handleWidth, handleLength, handleDepth]} />
            <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ═══ TOP MOULDING / CORNICE ═══ */}
      <mesh position={[0, height, 0.05]} castShadow>
        <boxGeometry args={[width + 0.1, 0.2, depth + 0.1]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.8} />
      </mesh>

      {/* ═══ BASE / LEGS ═══ */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[width - 0.1, 0.2, depth - 0.1]} />
        <meshStandardMaterial color="#3e2b22" roughness={0.9} />
      </mesh>


    </group>
  );
}

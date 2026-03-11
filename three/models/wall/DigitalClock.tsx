'use client';

import { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DigitalClockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  visible?: boolean;
}

export default function DigitalClock({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  visible = true,
}: DigitalClockProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState('00:00:00');
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const width = 2.6;
  const height = 0.9;
  const depth = 0.15;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Clock Body - Black rounded frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Inner frame border */}
      <mesh position={[0, 0, depth / 2 - 0.01]}>
        <boxGeometry args={[width - 0.06, height - 0.06, 0.02]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Display Screen - Dark background */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[width - 0.12, height - 0.12]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* AM/PM Indicator dot */}
      <mesh position={[-1.1, 0.28, depth / 2 + 0.01]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff2200"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Time Display - LED style red text */}
      <Text
        position={[0, 0, depth / 2 + 0.01]}
        fontSize={0.5}
        color="#ff2200"
        anchorX="center"
        anchorY="middle"
        characters="0123456789:"
        letterSpacing={0.08}
      >
        {time}
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff2200"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </Text>

      {/* Subtle glow behind text */}
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <planeGeometry args={[2.2, 0.6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Brand text area at bottom */}
      <Text
        position={[0.9, -0.32, depth / 2 + 0.01]}
        fontSize={0.07}
        color="#555555"
        anchorX="center"
        anchorY="middle"
      >
        digital clock
      </Text>
    </group>
  );
}

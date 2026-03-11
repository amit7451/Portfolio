'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeskCalendarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function DeskCalendar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: DeskCalendarProps) {
  // Create canvas and texture once
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 560;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return { canvas, texture };
  }, []);

  useFrame(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = new Date();
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;

    // 1. Clear & Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Styling defaults
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';

    // 3. Month & Year (Top)
    const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
    const year = now.getFullYear();
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#444444';
    ctx.fillText(`${month} ${year}`, centerX, 60);

    // 4. Day Number (Huge, center)
    const date = now.getDate();
    ctx.font = 'bold 220px Arial';
    ctx.fillStyle = '#111111';
    // Adjust Y slightly to visual center
    ctx.fillText(date.toString(), centerX, 260);

    // 5. Weekday (Bottom)
    const weekday = now.toLocaleString('default', { weekday: 'long' });
    ctx.font = 'bold 90px Arial';
    ctx.fillStyle = '#c41e3a'; // Red for day name
    ctx.fillText(weekday, centerX, 470);

    // 7. Divider lines
    ctx.strokeStyle = '#eeeeee';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 110);
    ctx.lineTo(width - 40, 110);
    ctx.stroke();

    // Notify Three.js that texture changed
    texture.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* --- STAND GEOMETRY --- */}
      
      {/* Base Foot */}
      <mesh position={[0, -0.45, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" roughness={0.6} />
      </mesh>

      {/* Back Support (Angled) */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]} receiveShadow>
        <boxGeometry args={[0.85, 1.0, 0.05]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>

      {/* --- CANVAS DISPLAY --- */}
      {/* Placed slightly in front of the back support */}
      <mesh position={[0, 0, 0.03]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.8, 0.9]} />
        {/* toneMapped={false} ensures colors are vibrant and not washed out by scene lights */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* --- BORDERS/BEZEL --- */}
      {/* Top Bezel */}
      <mesh position={[0, 0.47, 0.03]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.85, 0.06, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Bottom Bezel */}
      <mesh position={[0, -0.47, 0.03]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.85, 0.06, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

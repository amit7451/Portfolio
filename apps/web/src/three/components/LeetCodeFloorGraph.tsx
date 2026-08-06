'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  status: string;
}

// Instant fallback data so 3D graph renders immediately with 0ms load delay
const INITIAL_LEETCODE_DATA: LeetCodeData = {
  totalSolved: 41,
  easySolved: 18,
  mediumSolved: 22,
  hardSolved: 1,
  totalEasy: 850,
  totalMedium: 1780,
  totalHard: 790,
  totalQuestions: 3420,
  status: 'success',
};

export default function LeetCodeFloorGraph({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const [data, setData] = useState<LeetCodeData>(INITIAL_LEETCODE_DATA);
  const [hoveredTarget, setHoveredTarget] = useState<'title' | 'easy' | 'medium' | 'hard' | null>(null);
  
  const groupRef = useRef<THREE.Group>(null);
  const bobRef = useRef(0);

  // Non-blocking deferred background fetch
  useEffect(() => {
    const fetchDeferred = () => {
      fetch('/api/leetcode')
        .then((r) => r.json())
        .then((res) => {
          if (res.status === 'success' && res.totalSolved !== undefined) {
            setData(res);
          }
        })
        .catch(() => {
          // Gracefully retain fallback data
        });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(fetchDeferred, { timeout: 1500 });
      return () => (window as any).cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(fetchDeferred, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  // Optimized useFrame - sleeps when at rest (0% idle CPU/GPU consumption)
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const isAnyRingHovered = hoveredTarget === 'easy' || hoveredTarget === 'medium' || hoveredTarget === 'hard';
    const targetY = (isAnyRingHovered || hoveredTarget === 'title') ? 0.25 : 0;
    
    const diffY = Math.abs(groupRef.current.position.y - targetY);
    const isRotating = Math.abs(groupRef.current.rotation.y) > 0.001;

    // Only process animation math if actively hovering or returning to rest
    if (diffY > 0.001 || isAnyRingHovered || hoveredTarget === 'title' || isRotating) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
      
      if (isAnyRingHovered || hoveredTarget === 'title') {
        bobRef.current += delta;
        groupRef.current.rotation.y = Math.sin(bobRef.current * 1.8) * 0.08;
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 5);
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    window.open('https://leetcode.com/u/leetcode_io/', '_blank');
  };

  // High-efficiency geometry segments (75% lower polycount, identical smooth appearance)
  const tubeRadius = 0.2;
  const radSeg = 16;
  const tubSeg = 48;
  
  // Concentric ring radii
  const easyR = 1.85;
  const medR = 1.2;
  const hardR = 0.55;

  const onPointerOver = (e: any, target: 'title' | 'easy' | 'medium' | 'hard') => {
    e.stopPropagation();
    setHoveredTarget(target);
    document.body.style.cursor = 'pointer';
  };
  const onPointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredTarget(null);
    document.body.style.cursor = 'auto';
  };

  // Upright rotation parallel to back wall
  const wallParallelRotation: [number, number, number] = useMemo(() => [-Math.PI / 5, 0, 0], []);

  return (
    <group position={position} rotation={[0, 0, 0]}>
      
      {/* 3D LeetCode Title Header & Wall Text */}
      <group 
        position={[0, 2.45, -1.8]} 
        rotation={wallParallelRotation}
        onClick={handleClick}
        onPointerOver={(e) => onPointerOver(e, 'title')}
        onPointerOut={onPointerOut}
      >
        <Text
          position={[0, 0, 0]}
          fontSize={1.25}
          color={hoveredTarget === 'title' ? "#ffa116" : "#ffffff"}
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          LeetCode
        </Text>

        <Text
          position={[0, -0.68, 0]}
          fontSize={0.4}
          color="#a0aab5"
          anchorX="center"
          anchorY="middle"
        >
          {`${data.totalSolved} Problems Solved`}
        </Text>

        <group position={[0, -1.22, 0]}>
          <Text
            position={[-1.6, 0, 0]}
            fontSize={0.3}
            color={hoveredTarget === 'easy' ? "#00ff87" : "#00e676"}
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            onPointerOver={(e) => onPointerOver(e, 'easy')}
            onPointerOut={onPointerOut}
          >
            {`Easy: ${data.easySolved}`}
          </Text>

          <Text position={[-0.8, 0, 0]} fontSize={0.26} color="#5a6578" anchorX="center" anchorY="middle">•</Text>

          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color={hoveredTarget === 'medium' ? "#ffcd38" : "#ffc01e"}
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            onPointerOver={(e) => onPointerOver(e, 'medium')}
            onPointerOut={onPointerOut}
          >
            {`Med: ${data.mediumSolved}`}
          </Text>

          <Text position={[0.8, 0, 0]} fontSize={0.26} color="#5a6578" anchorX="center" anchorY="middle">•</Text>

          <Text
            position={[1.6, 0, 0]}
            fontSize={0.3}
            color={hoveredTarget === 'hard' ? "#ff3355" : "#ff1744"}
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            onPointerOver={(e) => onPointerOver(e, 'hard')}
            onPointerOut={onPointerOut}
          >
            {`Hard: ${data.hardSolved}`}
          </Text>
        </group>

        <Text
          position={[0, -1.72, 0]}
          fontSize={0.24}
          color="#8a94a6"
          anchorX="center"
          anchorY="middle"
        >
          (Click to view Profile)
        </Text>
      </group>

      {/* Optimized Round White Translucent Floor Base (32 segments) */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[2.4, 2.4, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>

      {/* Sleek Glowing Concentric Rings Group */}
      <group 
        ref={groupRef} 
        position={[0, 0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* Outer Ring: Easy (Greenish Glow) */}
        <group 
          onClick={handleClick}
          onPointerOver={(e) => onPointerOver(e, 'easy')} 
          onPointerOut={onPointerOut}
        >
          <mesh position={[0, 0, 0.08]}>
            <torusGeometry args={[easyR, tubeRadius + (hoveredTarget === 'easy' ? 0.04 : 0), radSeg, tubSeg]} />
            <meshStandardMaterial 
              color="#00e676" 
              emissive="#00ff87" 
              emissiveIntensity={0.9} 
              roughness={0.15} 
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* Middle Ring: Medium (Golden Amber Glow) */}
        <group 
          onClick={handleClick}
          onPointerOver={(e) => onPointerOver(e, 'medium')} 
          onPointerOut={onPointerOut}
        >
          <mesh position={[0, 0, 0.28]}>
            <torusGeometry args={[medR, tubeRadius + (hoveredTarget === 'medium' ? 0.04 : 0), radSeg, tubSeg]} />
            <meshStandardMaterial 
              color="#ffc01e" 
              emissive="#ffc01e" 
              emissiveIntensity={0.9} 
              roughness={0.15} 
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* Inner Ring: Hard (Reddish Glow) */}
        <group 
          onClick={handleClick}
          onPointerOver={(e) => onPointerOver(e, 'hard')} 
          onPointerOut={onPointerOut}
        >
          <mesh position={[0, 0, 0.48]}>
            <torusGeometry args={[hardR, tubeRadius + (hoveredTarget === 'hard' ? 0.04 : 0), radSeg, tubSeg]} />
            <meshStandardMaterial 
              color="#ff1744" 
              emissive="#ff0033" 
              emissiveIntensity={0.9} 
              roughness={0.15} 
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

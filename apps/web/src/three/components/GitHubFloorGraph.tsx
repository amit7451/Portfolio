'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Day {
  date: string;
  level: number;
  count: number;
}

interface Week {
  days: Day[];
}

const GITHUB_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

// Instant fallback data generator (26 weeks) to prevent loading delay or layout shifts
const generateFallbackWeeks = (): Week[] => {
  const weeks: Week[] = [];
  const today = new Date();
  for (let w = 25; w >= 0; w--) {
    const days: Day[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      // Realistic distribution of contributions
      const pseudoRandom = (w * 7 + d * 13) % 17;
      const level = pseudoRandom < 7 ? 0 : pseudoRandom < 11 ? 1 : pseudoRandom < 14 ? 2 : pseudoRandom < 16 ? 3 : 4;
      days.push({
        date: date.toISOString().split('T')[0],
        level,
        count: level * 2,
      });
    }
    weeks.push({ days });
  }
  return weeks;
};

const INITIAL_FALLBACK_WEEKS = generateFallbackWeeks();

export default function GitHubFloorGraph({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const [weeks, setWeeks] = useState<Week[]>(INITIAL_FALLBACK_WEEKS);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [totalYearContributions, setTotalYearContributions] = useState<number>(387);

  // Non-blocking deferred background fetch
  useEffect(() => {
    const fetchDeferred = () => {
      fetch('/api/github/contributions')
        .then((r) => r.json())
        .then((data) => {
          if (data.weeks && data.weeks.length > 0) {
            const last6Months = data.weeks.slice(-26);
            setWeeks(last6Months);
          }
          if (data.totalContributions) {
            setTotalYearContributions(data.totalContributions);
          }
        })
        .catch(() => {
          // Gracefully retain fallback data if offline or error
        });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(fetchDeferred, { timeout: 1500 });
      return () => (window as any).cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(fetchDeferred, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  const totalCubes = useMemo(() => {
    let count = 0;
    weeks.forEach((w) => {
      count += w.days.length;
    });
    return count;
  }, [weeks]);

  const cubeSize = 0.3;
  const gap = 0.08;

  // Flatten data for InstancedMesh
  const flattenData = useMemo(() => {
    const arr: { x: number; z: number; level: number; date: string }[] = [];
    weeks.forEach((week, wIdx) => {
      week.days.forEach((day, dIdx) => {
        arr.push({
          x: wIdx * (cubeSize + gap) - (weeks.length * (cubeSize + gap)) / 2,
          z: dIdx * (cubeSize + gap) - (7 * (cubeSize + gap)) / 2,
          level: day.level,
          date: day.date,
        });
      });
    });
    return arr;
  }, [weeks]);

  // Fast instanced matrix updates
  useEffect(() => {
    if (!meshRef.current || flattenData.length === 0) return;
    
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    flattenData.forEach((item, i) => {
      dummy.position.set(item.x, 0, item.z);
      dummy.scale.set(1, 1, 1);
      
      const yOffset = item.level * 0.1;
      dummy.position.y = yOffset / 2;
      dummy.scale.y = 1 + item.level;

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      color.set(GITHUB_COLORS[item.level] || GITHUB_COLORS[0]);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [flattenData]);

  const handleGithubClick = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    window.dispatchEvent(new CustomEvent('openGithubReadme'));
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      setHoveredIdx(e.instanceId);
    }
  };

  const handlePointerOut = () => {
    setHoveredIdx(null);
  };

  return (
    <group position={position} rotation={[0, 0, 0]}>
      
      {/* 3D GitHub Title & Total */}
      <group 
        position={[0, 2.2, -((7 * (cubeSize + gap)) / 2) - 1.0]} 
        rotation={[-Math.PI / 5, 0, 0]}
        onClick={handleGithubClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsGithubHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsGithubHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <Text
          position={[0, 0, 0]}
          fontSize={1.3}
          color={isGithubHovered ? "#9be9a8" : "#ffffff"}
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          GitHub
        </Text>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.42}
          color="#a0aab5"
          anchorX="center"
          anchorY="middle"
        >
          {`${totalYearContributions} Contributions (This Year)`}
        </Text>
        <Text
          position={[0, -1.15, 0]}
          fontSize={0.25}
          color="#a0aab5"
          anchorX="center"
          anchorY="middle"
        >
          (Click to view Profile README)
        </Text>
      </group>

      {/* Platform/Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[(weeks.length * (cubeSize + gap)) + 0.4, 0.1, (7 * (cubeSize + gap)) + 0.4]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, totalCubes]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
        <meshStandardMaterial />
      </instancedMesh>
      
      {/* Hover highlight label */}
      {hoveredIdx !== null && flattenData[hoveredIdx] && (
         <mesh position={[flattenData[hoveredIdx].x, (flattenData[hoveredIdx].level * 0.1)/2, flattenData[hoveredIdx].z]} scale={[1.1, 1 + flattenData[hoveredIdx].level + 0.1, 1.1]}>
            <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
            <meshBasicMaterial color="#ffffff" wireframe />
         </mesh>
      )}
    </group>
  );
}

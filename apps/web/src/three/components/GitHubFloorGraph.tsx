'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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

export default function GitHubFloorGraph({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isGithubHovered, setIsGithubHovered] = useState(false);

  const [totalYearContributions, setTotalYearContributions] = useState<number>(0);

  // Fetch data
  useEffect(() => {
    fetch('/api/github/contributions')
      .then((r) => r.json())
      .then((data) => {
        if (data.weeks) {
          // Calculate total year contributions before filtering
          // User requested "last 6 months" -> roughly 26 weeks
          const last6Months = data.weeks.slice(-26);
          setWeeks(last6Months);
        }
        if (data.totalContributions) {
          setTotalYearContributions(data.totalContributions);
        }
      })
      .catch(console.error);
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

  // Flatten the data for InstancedMesh
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

  // Update instance matrices
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

  if (weeks.length === 0) return null;

  return (
    <group position={position} rotation={[0, 0, 0]}>
      
      {/* 3D GitHub Title & Total - Premium Look */}
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
          {totalYearContributions > 0 ? `${totalYearContributions} Contributions (This Year)` : 'Contributions'}
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

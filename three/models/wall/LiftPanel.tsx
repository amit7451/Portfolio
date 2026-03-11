'use client';

import React, { useState, useMemo } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';


const FLOOR_NAMES = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT'];

function LiftButton({
  floorIndex,
  label,
  position,
  onClick,
}: {
  floorIndex: number;
  label: string;
  position: [number, number, number];
  onClick: () => void;
}) {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // When clicked, flash green
  const handleClick = (e: any) => {
    e.stopPropagation();
    setActive(true);
    onClick();
    // Turn off glow after a short delay to simulate "registered"
    setTimeout(() => setActive(false), 1000);
  };

  return (
    <group position={position} scale={hovered ? 1.1 : 1}>
      {/* Green Glow Strip (Backing) */}
      {(hovered || active) && (
        <mesh position={[0, 0, 0]}>
           <planeGeometry args={[1.05, 0.6]} />
          <meshBasicMaterial color="#00ff00" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Button Shape (Superellipse approximation via RoundedBox) */}
      <RoundedBox
        args={[0.9, 0.5, 0.04]} // Width, Height, Depth
        radius={0.05} // Corner radius
        smoothness={4}
        position={[0, 0, 0.02]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={active ? "#eeeeee" : "#d0d0d0"}
          metalness={0.5}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Label Text */}
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.20}
        color="#101010"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}


interface LiftPanelProps {
  currentFloorIndex: number; // 0, 1, 2, 3
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function LiftPanel({
  currentFloorIndex,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: LiftPanelProps) {
  // Filter out current floor to get 3 remote destinations
  const remoteFloors = useMemo(() => {
    const allFloors = [0, 1, 2, 3];
    return allFloors.filter((idx) => idx !== currentFloorIndex);
  }, [currentFloorIndex]);

  // Handler for navigation
  const handleFloorClick = (targetIndex: number) => {
    const event = new CustomEvent('navigationClicked', {
      detail: { targetPage: targetIndex },
    });
    window.dispatchEvent(event);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* ─── MAIN PANEL BODY (Silver) ─── */}
      <group position={[0, -0.6, 0]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 2.5, 0.1]} />
            <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.6}
            roughness={0.2}
            />
        </mesh>
        
        {/* ─── BUTTONS AREA ─── */}
        <group position={[0, 0.1, 0.06]}>
            {remoteFloors.map((floorIdx, i) => (
            <LiftButton
                key={floorIdx}
                floorIndex={floorIdx}
                label={FLOOR_NAMES[floorIdx]}
                position={[0, 0.7 - i * 0.7, 0]} 
                onClick={() => handleFloorClick(floorIdx)}
            />
            ))}
        </group>
      </group>

      {/* ─── DIGITAL DISPLAY TOP (Black Screen) ─── */}
      <group position={[0, 1.2, 0.02]}>
        {/* Screen Bezel/Background */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen content area */}
        <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.0, 0.6]} />
            <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Floor Indicator Text */}
        <Text
          position={[0, 0, 0.08]}
          fontSize={0.25}
          color="#ff0000"
          anchorX="center"
          anchorY="middle"
        >
          {FLOOR_NAMES[currentFloorIndex]}
        </Text>
      </group>
    </group>
  );
}

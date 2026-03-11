'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoundedBox, Text3D, Center, Outlines, useCursor } from '@react-three/drei';
import Desk from './Desk';
import Chair from './Chair';
import DeskLamp from './DeskLamp';
import { Character } from '../character';
import * as THREE from 'three';



interface DeskGroupProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * Sub-component for the interactive boxes on the stool
 */
function StoolBoxButton({
  pos,
  rot,
  color,
  text,
  textColor = 'white',
  link
}: {
  pos: [number, number, number];
  rot: [number, number, number];
  color: string;
  text: string;
  textColor?: string;
  link: string;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handleClick = useCallback(() => {
    if (link === 'download') {
      const downloadLink = document.createElement('a');
      downloadLink.href = '/3d/wall/images/Amit_Kumar_Resume.pdf';
      downloadLink.download = 'Amit_Kumar_Resume.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      window.open(link, '_blank');
    }
  }, [link]);

  return (
    <group
      position={pos}
      rotation={rot}
      scale={hovered ? 1.1 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <RoundedBox
        args={[0.92, 0.22, 0.52]}
        radius={0.06}
        smoothness={4}
        castShadow={false}
        receiveShadow={false}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.62}
          metalness={0.05}
        />
        {hovered && <Outlines color="#00ff00" thickness={5} transparent opacity={0.8} />}
      </RoundedBox>

      {/* Label on the front face (user side) */}
      <Center position={[0, 0, 0.261]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.08}
          height={0.01}
          curveSegments={12}
        >
          {text}
          <meshStandardMaterial
            color={textColor}
            roughness={0.1}
            metalness={0.5}
            emissive={textColor}
            emissiveIntensity={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
}

export default function DeskGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: DeskGroupProps) {

  const boxes = [
    {
      pos: [0.0, 0.16, 0.0] as [number, number, number],
      rot: [0, 0.32, 0] as [number, number, number],
      color: '#ffffff', // Bottom: White
      text: 'freelancer',
      textColor: '#000000',
      link: 'https://www.freelancer.in/u/amitk0461'
    },
    {
      pos: [0.06, 0.42, -0.02] as [number, number, number],
      rot: [0, -0.25, 0] as [number, number, number],
      color: '#0066cc', // 3rd: Blue
      text: 'linkedIn',
      textColor: '#ffffff',
      link: 'https://www.linkedin.com/in/amit-devspace/'
    },
    {
      pos: [-0.04, 0.68, 0.03] as [number, number, number],
      rot: [0, 0.18, 0] as [number, number, number],
      color: '#000000', // 2nd: Black
      text: 'github',
      textColor: '#ffffff',
      link: 'https://github.com/amit7451'
    },
    {
      pos: [0.03, 0.94, -0.02] as [number, number, number],
      rot: [0, -0.36, 0] as [number, number, number],
      color: '#7c3aed', // Top: Violet
      text: 'RESUME',
      textColor: '#ffffff',
      link: 'download'
    },
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Desk
        position={[0, 0, 0]}
        scale={[1.8, 1.8, 1.8]}
        color="#3a3028"
      />

      <Character
        position={[0, 1.0, -1.9]}
        rotation={[0, 0, 0]}
        scale={[1.4, 1.4, 1.4]}
      />

      <Chair
        position={[0, 0, -3.5]}
        rotation={[0, Math.PI + 0.175, 0]}
        scale={[1.7, 1.7, 1.7]}
        color="#1a1a1a"
      />

      <group position={[4.75, 0, 0.55]} scale={[1.42, 1.42, 1.42]}>
        <mesh position={[0, 0.9, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.58, 0.62, 0.12, 32]} />
          <meshStandardMaterial color="#6e4a2f" roughness={0.72} metalness={0.04} />
        </mesh>

        <mesh position={[0, 0.82, 0]} castShadow={false}>
          <cylinderGeometry args={[0.46, 0.5, 0.06, 28]} />
          <meshStandardMaterial color="#5a3b26" roughness={0.76} metalness={0.03} />
        </mesh>

        {[
          [0.3, 0.4, 0.3],
          [-0.3, 0.4, 0.3],
          [0.3, 0.4, -0.3],
          [-0.3, 0.4, -0.3],
        ].map((legPos, idx) => (
          <mesh key={`stool-leg-${idx}`} position={legPos as [number, number, number]} castShadow={false}>
            <cylinderGeometry args={[0.05, 0.06, 0.78, 18]} />
            <meshStandardMaterial color="#5a3b26" roughness={0.75} metalness={0.03} />
          </mesh>
        ))}

        <mesh position={[0, 0.1, 0]} castShadow={false}>
          <cylinderGeometry args={[0.34, 0.36, 0.05, 24]} />
          <meshStandardMaterial color="#4b301f" roughness={0.78} metalness={0.02} />
        </mesh>

        <group position={[0, 0.98, 0]}>
          {boxes.map((box, index) => (
            <StoolBoxButton
              key={`stool-box-${index}`}
              {...box}
            />
          ))}
        </group>
      </group>

      {/* Promotion Block on the opposite side */}
      <PromotionBlock position={[-5.5, 0.4, -0.5]} />

      {/*
        Desk lamp: placed on desk top surface.
        DeskGroup is at world Y=0.22. Desk scale=1.8, deskY=1.54 → surface at 1.54*1.8=2.77.
        Lamp position in DeskGroup local space: Y = 2.77.
        X = -1.4 (left side of desk), Z = -0.9 (back edge near wall).
      */}
      <DeskLamp position={[-1.4, 2.77, -0.9]} scale={0.9} />
    </group>
  );
}

/**
 * Sub-component for the Promotion Block
 */
function PromotionBlock({ position }: { position: [number, number, number] }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    router.push('/projects');
  };

  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      {/* Base Pedestal */}
      <mesh position={[0, -0.2, 0]} castShadow={false}>
        <boxGeometry args={[3, 0.4, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Main Backing Board */}
      <mesh position={[0, 1.0, -0.5]} rotation={[-0.1, 0, 0]} castShadow={false}>
        <boxGeometry args={[2.8, 1.6, 0.1]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.3} />
        {/* Neon Glow Outline */}
        <Outlines thickness={0.02} color="#00ffff" opacity={0.5} transparent />
      </mesh>

      {/* Title Text */}
      <Center position={[0, 1.3, -0.4]} rotation={[-0.1, 0, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.16}
          height={0.02}
          curveSegments={4}
        >
          Want to Create a Similar
          <meshStandardMaterial color="#ffffff" emissive="#bbbbbb" emissiveIntensity={0.2} />
        </Text3D>
      </Center>
      <Center position={[0, 1.0, -0.4]} rotation={[-0.1, 0, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.18}
          height={0.02}
          curveSegments={4}
        >
          Portfolio/Website?
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </Text3D>
      </Center>

      {/* Interactive Button */}
      <group position={[0, 0.4, 0.2]} rotation={[-0.1, 0, 0]}>
        <RoundedBox
          args={[1.6, 0.4, 0.1]}
          radius={0.05}
          smoothness={2}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          <meshStandardMaterial
            color="#00cc66"
            roughness={0.3}
            metalness={0.2}
            emissive="#00ff80"
            emissiveIntensity={hovered ? 0.9 : 0.2}
          />
          {/* Edge Glow on Hover */}
          <Outlines
            thickness={hovered ? 0.06 : 0}
            color="#00ff80"
            transparent
            opacity={hovered ? 1 : 0}
          />
        </RoundedBox>
        {/* Point light that glows around the button on hover */}
        {hovered && (
          <pointLight
            color="#00ff80"
            intensity={3}
            distance={1.6}
            decay={2}
            position={[0, 0, 0.3]}
          />
        )}
        <Center position={[0, 0, 0.06]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.14}
            height={0.01}
            curveSegments={2}
          >
            CLICK HERE
            <meshBasicMaterial color="#ffffff" />
          </Text3D>
        </Center>
      </group>
    </group>
  );
}

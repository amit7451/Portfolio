'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoundedBox, Text3D, Center, Outlines, useCursor } from '@react-three/drei';
import Desk from './Desk';
import Chair from './Chair';
import DeskLamp from './DeskLamp';
import * as THREE from 'three';
import { useResponsiveCanvas } from '../../../hooks/useResponsive';



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
  link,
  isMobile = false
}: {
  pos: [number, number, number];
  rot: [number, number, number];
  color: string;
  text: string;
  textColor?: string;
  link: string;
  isMobile?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { mapLinear } = useResponsiveCanvas();
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
        args={[mapLinear(1.2, 0.92), mapLinear(0.3, 0.22), mapLinear(0.7, 0.52)]}
        radius={0.06}
        smoothness={4}
        castShadow={false}
        receiveShadow={false}
      >
        <meshLambertMaterial
          color={color}
        />
        {hovered && <Outlines color="#00ff00" thickness={5} transparent opacity={0.8} />}
      </RoundedBox>

      {/* Label on the front face (user side) */}
      <Center position={[0, 0, mapLinear(0.35, 0.261)]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={mapLinear(0.12, 0.08)}
          height={0.01}
          curveSegments={12}
        >
          {text}
          <meshLambertMaterial
            color={textColor}
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
  const { mapLinear } = useResponsiveCanvas();

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

  const stoolPos = [mapLinear(2.0, 4.75), 0, mapLinear(1.5, 0.55)];
  const stoolScale = mapLinear(1.6, 1.42);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Desk
        position={[0, 0, 0]}
        scale={[1.8, 1.8, 1.8]}
        color="#3a3028"
      />

      <Chair
        position={[0, 0, -3.5]}
        rotation={[0, Math.PI + 0.175, 0]}
        scale={[1.7, 1.7, 1.7]}
        color="#1a1a1a"
      />

      <group position={stoolPos as [number, number, number]} scale={[stoolScale, stoolScale, stoolScale]}>
        <mesh position={[0, 0.9, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.58, 0.62, 0.12, 32]} />
          <meshLambertMaterial color="#6e4a2f" />
        </mesh>

        <mesh position={[0, 0.82, 0]} castShadow={false}>
          <cylinderGeometry args={[0.46, 0.5, 0.06, 28]} />
          <meshLambertMaterial color="#5a3b26" />
        </mesh>

        {[
          [0.3, 0.4, 0.3],
          [-0.3, 0.4, 0.3],
          [0.3, 0.4, -0.3],
          [-0.3, 0.4, -0.3],
        ].map((legPos, idx) => (
          <mesh key={`stool-leg-${idx}`} position={legPos as [number, number, number]} castShadow={false}>
            <cylinderGeometry args={[0.05, 0.06, 0.78, 18]} />
            <meshLambertMaterial color="#5a3b26" />
          </mesh>
        ))}

        <mesh position={[0, 0.1, 0]} castShadow={false}>
          <cylinderGeometry args={[0.34, 0.36, 0.05, 24]} />
          <meshLambertMaterial color="#4b301f" />
        </mesh>

        <group position={[0, 0.98, 0]}>
          {boxes.map((box, index) => {
            // Adjust box Y offset so the larger buttons don't clip each other on mobile
            const boxYOffset = mapLinear(index * 0.12, 0);
            const adjustedBox = { ...box, pos: [box.pos[0], box.pos[1] + boxYOffset, box.pos[2]] as [number, number, number] };
            
            return (
              <StoolBoxButton
                key={`stool-box-${index}`}
                {...adjustedBox}
              />
            );
          })}
        </group>
      </group>

      {/* Promotion Block removed per user request */}

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

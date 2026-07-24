'use client';

import { useState, useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useCursor, Text } from '@react-three/drei';
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
 * Interactive flat rectangular plate attached to the right wooden drawer of the desk
 * Smooth animated lerp on hover
 */
function DrawerPlateButton({
  pos,
  color,
  text,
  textColor = 'white',
  link,
}: {
  pos: [number, number, number];
  color: string;
  text: string;
  textColor?: string;
  link: string;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.045 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, Math.min(delta * 10, 0.2));
    groupRef.current.scale.setScalar(scaleRef.current);
  });

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
      ref={groupRef}
      position={pos}
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
      {/* Flat rectangular plate attached flush to the wooden drawer face */}
      <RoundedBox
        args={[0.84, 0.18, 0.02]}
        radius={0.03}
        smoothness={4}
        castShadow={false}
        receiveShadow={false}
      >
        <meshLambertMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.25 : 0.05}
        />
      </RoundedBox>

      {/* Bold Text with clean letter-spacing so letters NEVER touch or overlap */}
      <Text
        position={[0, 0, 0.015]}
        fontSize={0.070}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        fontWeight="bold"
      >
        {text}
      </Text>
    </group>
  );
}

/**
 * Interactive hinged white board for DoorDripp Pvt. Ltd. attached to front of desk
 * Smooth animated lerp on hover
 */
function CompanyBoardButton({
  pos = [-0.06, 1.30, 0.77] as [number, number, number],
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.038 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, Math.min(delta * 10, 0.2));
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  const handleClick = useCallback(() => {
    window.open('https://doordripp.com/', '_blank');
  }, []);

  return (
    <group
      ref={groupRef}
      position={pos}
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
      {/* Subtle black top hinge brackets attaching board to desk frame */}
      {[-0.62, 0.62].map((xHinge, i) => (
        <group key={`hinge-${i}`} position={[xHinge, 0.23, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.035, 0.05, 0.025]} />
            <meshLambertMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 10]} />
            <meshLambertMaterial color="#2a2a2a" />
          </mesh>
        </group>
      ))}

      {/* Main White Board Panel - Compacted height & width, top edge anchored to desk */}
      <RoundedBox
        args={[1.56, 0.48, 0.025]}
        radius={0.04}
        smoothness={4}
        castShadow={false}
        receiveShadow={false}
      >
        <meshLambertMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.12 : 0.02}
        />
      </RoundedBox>

      {/* Subtle border outline */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.54, 0.46]} />
        <meshBasicMaterial color="#f2f2f2" />
      </mesh>

      {/* Line 1: CTO & Software Development Engineer */}
      <Text
        position={[0, 0.09, 0.018]}
        fontSize={0.070}
        color="#222222"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
        fontWeight="bold"
      >
        CTO & Software Development Engineer
      </Text>

      {/* Line 2: DOORDRIPP PVT. LTD. */}
      <Text
        position={[0, -0.08, 0.018]}
        fontSize={0.085}
        color="#0a0a0a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.07}
        fontWeight="900"
      >
        DOORDRIPP PVT. LTD.
      </Text>
    </group>
  );
}

export default function DeskGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: DeskGroupProps) {
  const { mapLinear, isMobile } = useResponsiveCanvas();

  // 4 Link items attached to the front face of the right wooden drawer unit (ALL CAPS)
  const drawerPlates = [
    {
      pos: [1.27, 1.35, 0.77] as [number, number, number],
      color: '#7c3aed', // Violet
      text: 'RESUME',
      textColor: '#ffffff',
      link: 'download',
    },
    {
      pos: [1.27, 1.12, 0.77] as [number, number, number],
      color: '#1a1a1a', // Black
      text: 'GITHUB',
      textColor: '#ffffff',
      link: 'https://github.com/amit7451',
    },
    {
      pos: [1.27, 0.89, 0.77] as [number, number, number],
      color: '#0066cc', // Blue
      text: 'LINKEDIN',
      textColor: '#ffffff',
      link: 'https://www.linkedin.com/in/amit-devspace/',
    },
    {
      pos: [1.27, 0.66, 0.77] as [number, number, number],
      color: '#ffffff', // White
      text: 'FREELANCER',
      textColor: '#000000',
      link: 'https://www.freelancer.in/u/amitk0461',
    },
  ];

  const stoolPos = [mapLinear(2.0, 4.75), 0, mapLinear(0.8, 0.55)];
  const stoolScale = mapLinear(1.3, 1.42);
  const deskScale = mapLinear(1.25, 1.8);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Scaled desk group with 4 flat rectangular link plates mounted on the right wooden drawer */}
      <group scale={[deskScale, deskScale, deskScale]}>
        <Desk position={[0, 0, 0]} scale={[1, 1, 1]} color="#3a3028" />

        {/* 4 Flat rectangular link plates on the right wooden drawer cabinet */}
        {drawerPlates.map((plate, index) => (
          <DrawerPlateButton key={`drawer-plate-${index}`} {...plate} />
        ))}

        {/* DoorDripp Pvt. Ltd. Hinged White Board attached flush under desk top edge */}
        <CompanyBoardButton pos={[-0.06, 1.30, 0.77]} />
      </group>

      <Chair
        position={[0, 0, -3.5]}
        rotation={[0, Math.PI + 0.175, 0]}
        scale={[mapLinear(1.15, 1.7), mapLinear(1.15, 1.7), mapLinear(1.15, 1.7)]}
        color="#1a1a1a"
      />

      {/* ═══ Plain wooden stool — shown on desktop, hidden on mobile so it never gets cut off ═══ */}
      {!isMobile && (
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
        </group>
      )}

    </group>
  );
}

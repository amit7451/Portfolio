'use client';

import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useTexture, Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import WallText from '../wall/WallText';
import RisingLaserLines from '../wall/RisingLaserLines';

/**
 * ProjectsRoom — A floor module representing the "Projects" showcase.
 * Similar structure to the developer room but themed for project display.
 */

interface ProjectsRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function ProjectsRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: ProjectsRoomProps) {
  const groupRef = useRef<THREE.Group>(null);  
  // Load textures for walls and ceiling
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.jpg');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.jpg');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.jpg');
  
  // Configure wall texture with anisotropy to prevent flickering
  const wallTexture = useMemo(() => {
    const cloned = basePlasterTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(6, 3);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 16;
    cloned.needsUpdate = true;
    return cloned;
  }, [basePlasterTexture]);
  
  // Configure ceiling texture with anisotropy
  const ceilingTexture = useMemo(() => {
    const cloned = baseCeilingTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(5, 5.5);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 16;
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseCeilingTexture]);
  
  // Configure floor texture with anisotropy
  const floorTexture = useMemo(() => {
    const cloned = baseFloorTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(4, 11);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 16;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseFloorTexture]);
  // Room dimensions (matching building room depth)
  const roomW = 20;
  const roomH = 12;
  const roomD = 32;
  const backWallZ = -4; // Decorative back wall (content is visible from camera at Z=14)
  const floorY = 0; // relative floor
  const ceilY = roomH;

  const wallColor = '#e8e4e0';
  const accentColor = '#2a6496';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, roomH / 2, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial map={wallTexture} color="#e8e4e0" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Rising Laser Lines Effect */}
      <RisingLaserLines wallWidth={roomW} wallZ={backWallZ} />

      {/* ═══ LEFT SIDE WALL ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial
          map={wallTexture}
          color="#e8e4e0"
          roughness={0.9}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial
          map={wallTexture}
          color="#e8e4e0"
          roughness={0.9}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial map={floorTexture} color="#b8a88a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* ═══ CEILING ═══ */}
      <mesh position={[0, roomH - 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshBasicMaterial
          map={ceilingTexture}
          color="#f5f5f5"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ═══ "PROJECT ROOM" TITLE EMBEDDED IN WALL ═══ */}
      <WallText
        position={[0, roomH - 2, backWallZ + 0.1]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        color="#6b6560"
        text="PROJECTS ROOM"
        fontSize={0.9}
        depth={0.06}
        roughness={0.85}
        metalness={0.05}
      />

      {/* ═══ PROJECT DISPLAY BOARDS ═══ */}
      {/* Left Project Board */}
      <ProjectBoard
        position={[-6, roomH / 2 + 1.5, backWallZ + 0.1]}
        title="Rentra"
        titleBgColor="#e63946"
        titleTextColor="#ffffff"
        imagePath="/3d/ProjectRoom/images/Rentra.png"
      />

      {/* Center Project Board */}
      <ProjectBoard
        position={[0, roomH / 2 + 1.5, backWallZ + 0.1]}
        title="goCab"
        titleBgColor="#1e56a0"
        titleTextColor="#ffd60a"
        imagePath="/3d/ProjectRoom/images/goCab.png"
      />

      {/* Right Project Board */}
      <ProjectBoard
        position={[6, roomH / 2 + 1.5, backWallZ + 0.1]}
        title="pdfSuite"
        titleBgColor="#e63946"
        titleTextColor="#ffffff"
        imagePath="/3d/ProjectRoom/images/pdf_suite.png"
      />

      {/* ═══ PROJECT TABLES ═══ */}
      <ProjectTable position={[-5, 0, 4]} cardId={0} />
      <ProjectTable position={[0, 0, 4]} cardId={1} />
      <ProjectTable position={[5, 0, 4]} cardId={2} />

      {/* ═══ ACCENT LIGHTING ═══ */}
      <pointLight
        position={[0, roomH - 1, 0]}
        intensity={0.6}
        color="#ffffff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[-6, roomH - 1, 0]}
        intensity={0.3}
        color="#e0e8ff"
        distance={8}
        decay={2}
      />
      {/* Enhanced right side lighting */}
      <pointLight
        position={[6, roomH - 1, 0]}
        intensity={0.5}
        color="#e0e8ff"
        distance={8}
        decay={2}
      />
      <pointLight
        position={[8, roomH / 2, 4]}
        intensity={0.4}
        color="#ffffff"
        distance={8}
        decay={2}
      />
    </group>
  );
}

/* ─── Sub-components ─── */

function ProjectBoard({
  position,
  title,
  titleBgColor,
  titleTextColor,
  imagePath,
}: {
  position: [number, number, number];
  title: string;
  titleBgColor: string;
  titleTextColor: string;
  imagePath: string;
}) {
  const imageTexture = useTexture(imagePath);
  
  return (
    <group position={position}>
      {/* Board frame (thinner) */}
      <mesh castShadow>
        <boxGeometry args={[4, 3, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Board surface with image (larger to reduce border) */}
      <mesh position={[0, -0.15, 0.05]}>
        <planeGeometry args={[3.85, 2.45]} />
        <meshStandardMaterial
          map={imageTexture}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      {/* Title bar background */}
      <mesh position={[0, 1.35, 0.06]}>
        <planeGeometry args={[3.9, 0.6]} />
        <meshStandardMaterial
          color={titleBgColor}
          roughness={0.5}
          metalness={0.1}
          emissive={titleBgColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Project Title Text */}
      <Text
        position={[0, 1.35, 0.11]}
        fontSize={0.35}
        color={titleTextColor}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {title}
      </Text>
    </group>
  );
}

function ProjectTable({
  position,
  cardId,
}: {
  position: [number, number, number];
  cardId: number;
}) {
  const tableH = 1.8;
  const tableRadius = 2.2;
  const legRadius = 0.05;
  const legHeight = tableH;

  // 3 legs positioned in triangular formation
  const legPositions = useMemo(() => {
    const angleStep = (Math.PI * 2) / 3;
    const legDistance = tableRadius * 0.7;
    return Array.from({ length: 3 }, (_, i) => {
      const angle = i * angleStep;
      return [
        Math.cos(angle) * legDistance,
        legHeight / 2,
        Math.sin(angle) * legDistance,
      ] as [number, number, number];
    });
  }, [tableRadius, legHeight]);

  return (
    <group position={position}>
      {/* Rounded table top */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[tableRadius, tableRadius, 0.08, 32]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* 3 Legs in triangular formation */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[legRadius, legRadius * 0.8, legHeight, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}

      {/* Floating Card */}
      <FloatingCard tableHeight={tableH} tableRadius={tableRadius} cardId={cardId} />
    </group>
  );
}

function FloatingCard({
  tableHeight,
  tableRadius,
  cardId,
}: {
  tableHeight: number;
  tableRadius: number;
  cardId: number;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  
  const cardWidth = 2.2;
  const cardHeight = 3.5;
  const cardDepth = 0.2;
  const baseFloatHeight = tableHeight + 1.8;
  
  // Random seed for each card
  const seed = useMemo(() => cardId * 1.337, [cardId]);
  
  // Premium tilt settings
  const MAX_TILT = 0.2; // ~11.5 degrees - controlled and premium
  const SPRING_STIFFNESS = 0.18; // Medium stiffness
  const SPRING_DAMPING = 0.85; // High damping for smooth motion

  // Mouse move handler for premium 3D tilt
  const handlePointerMove = (event: any) => {
    if (!hovered || !cardRef.current) return;
    
    const rect = event.target.getBoundingClientRect?.();
    if (rect) {
      // Normalized cursor position (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update target rotation with controlled amplitude
      targetRotation.current.x = y * MAX_TILT;
      targetRotation.current.y = x * MAX_TILT;
      
      mousePos.current.x = x;
      mousePos.current.y = y;
    }
  };

  useFrame((state) => {
    if (cardRef.current) {
      const time = state.clock.getElapsedTime();
      const dt = state.clock.getDelta();
      
      // Subtle random floating animation with unique timing
      const floatOffset = Math.sin(time * 0.7 + seed) * 0.12 + Math.cos(time * 0.5 + seed * 0.5) * 0.08;
      const hoverLiftOffset = hovered ? 0.3 : 0; // Subtle lift
      cardRef.current.position.y = baseFloatHeight + floatOffset + hoverLiftOffset;
      
      // Premium scale with subtle growth (1.05 max)
      const targetScale = hovered ? 1.05 : 1;
      const currentScale = cardRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, SPRING_STIFFNESS);
      cardRef.current.scale.set(newScale, newScale, newScale);
      
      // Spring-based rotation with high damping
      if (hovered) {
        // Apply spring physics to rotation
        cardRef.current.rotation.x = THREE.MathUtils.lerp(
          cardRef.current.rotation.x,
          targetRotation.current.x,
          SPRING_STIFFNESS
        );
        cardRef.current.rotation.y = THREE.MathUtils.lerp(
          cardRef.current.rotation.y,
          targetRotation.current.y,
          SPRING_STIFFNESS
        );
        cardRef.current.rotation.z = THREE.MathUtils.lerp(
          cardRef.current.rotation.z,
          0,
          SPRING_STIFFNESS
        );
      } else {
        // Smooth reset on mouse leave - gentle idle rotation
        const idleRotation = Math.sin(time * 0.5 + seed) * 0.03; // Very subtle
        targetRotation.current.x = 0;
        targetRotation.current.y = idleRotation;
        targetRotation.current.z = 0;
        
        // Smooth damped return to neutral
        cardRef.current.rotation.x = THREE.MathUtils.lerp(
          cardRef.current.rotation.x,
          0,
          SPRING_DAMPING * 0.12
        );
        cardRef.current.rotation.y = THREE.MathUtils.lerp(
          cardRef.current.rotation.y,
          idleRotation,
          SPRING_DAMPING * 0.12
        );
        cardRef.current.rotation.z = THREE.MathUtils.lerp(
          cardRef.current.rotation.z,
          0,
          SPRING_DAMPING * 0.12
        );
      }
    }
  });

  return (
    <group ref={cardRef} position={[0, baseFloatHeight, 0]}>
      {/* Enhanced circular glow with soft shadow */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={hovered ? 1.8 : 0.8}
        color="#00d9ff"
        distance={tableRadius * 2}
        decay={2}
      />

      {/* Dark neon card body with gradient - rounded */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.15}
        smoothness={4}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerMove={handlePointerMove}
      >
        <meshStandardMaterial
          color={hovered ? "#0a0a0a" : "#050505"}
          roughness={0.3}
          metalness={0.8}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Neon cyan left edge - rounded */}
      <RoundedBox
        args={[0.05, cardHeight, cardDepth + 0.02]}
        radius={0.025}
        smoothness={4}
        position={[-cardWidth / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={hovered ? 2.5 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Neon cyan right edge - rounded */}
      <RoundedBox
        args={[0.05, cardHeight, cardDepth + 0.02]}
        radius={0.025}
        smoothness={4}
        position={[cardWidth / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={hovered ? 2.5 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Neon purple top edge - rounded */}
      <RoundedBox
        args={[cardWidth, 0.05, cardDepth + 0.02]}
        radius={0.025}
        smoothness={4}
        position={[0, cardHeight / 2, 0]}
      >
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={hovered ? 2.5 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Neon purple bottom edge - rounded */}
      <RoundedBox
        args={[cardWidth, 0.05, cardDepth + 0.02]}
        radius={0.025}
        smoothness={4}
        position={[0, -cardHeight / 2, 0]}
      >
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={hovered ? 2.5 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>
    </group>
  );
}

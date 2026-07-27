'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture, Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import WallText from '../models/wall/WallText';
import { useResponsiveCanvas } from '../../hooks/useResponsive';

/**
 * ProjectsRoom — A floor module representing the "Projects" showcase.
 * Features an infinite 3D circular swipe carousel for tables/cards and wall boards.
 */

interface ProjectsRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const PROJECTS_DATA = [
  {
    id: 0,
    slug: 'rentra',
    title: 'Rentra',
    subtitle: 'Flats & Hostels Near You',
    line1: 'Rentra',
    line2: 'Flats & Hostels',
    line3: 'Near You',
    techStack: ['Flutter', 'Firebase', 'Node.js', 'Maps APIs', 'OneSignal'],
    titleBgColor: '#e63946',
    titleTextColor: '#ffffff',
    imagePath: '/3d/ProjectRoom/images/Rentra.webp',
    github: 'https://github.com/amit7451/Rentra',
    playstore: 'https://play.google.com/store/apps/details?id=com.rentra.app.rentra',
    linkedin: 'https://linkedin.com/in/amit-devspace',
    popupEvent: 'open-rentra-popup',
  },
  {
    id: 1,
    slug: 'gocab',
    title: 'goCab',
    subtitle: 'Real-Time Cab Booking',
    line1: 'goCab',
    line2: 'Real-Time Cab',
    line3: 'Booking Web App',
    techStack: ['React', 'Node', 'Express', 'Maps APIs', 'WebSockets'],
    titleBgColor: '#1e56a0',
    titleTextColor: '#ffd60a',
    imagePath: '/3d/ProjectRoom/images/goCab.webp',
    github: 'https://github.com/amit7451/goCab',
    web: 'https://gocab-1-frontend.onrender.com',
    linkedin: 'https://linkedin.com/in/amit-devspace',
    popupEvent: 'open-gocab-popup',
  },
  {
    id: 2,
    slug: 'pdfsuite',
    title: 'PDF Suite',
    subtitle: 'Web-based PDF Platform',
    line1: 'PDF Suite',
    line2: 'Web-based PDF',
    line3: 'Processing Platform',
    techStack: ['FastAPI', 'pypdf', 'pdfplumber', 'Pillow', 'Docker'],
    titleBgColor: '#e63946',
    titleTextColor: '#ffffff',
    imagePath: '/3d/ProjectRoom/images/pdf_suite.webp',
    github: 'https://github.com/amit7451/PDF_Suite',
    web: 'https://github.com/amit7451/PDF_Suite',
    linkedin: 'https://linkedin.com/in/amit-devspace',
    popupEvent: 'open-pdfsuite-popup',
  },
];

export default function ProjectsRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: ProjectsRoomProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { mapLinear, shouldHideSideNav, isMobile } = useResponsiveCanvas();
  const isSmallScreen = shouldHideSideNav || isMobile;

  // Load textures for walls and ceiling
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.webp');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.webp');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.webp');

  const wallTexture = useMemo(() => {
    const cloned = basePlasterTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(6, 3);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [basePlasterTexture]);

  const ceilingTexture = useMemo(() => {
    const cloned = baseCeilingTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(5, 5.5);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseCeilingTexture]);

  const floorTexture = useMemo(() => {
    const cloned = baseFloorTexture.clone();
    cloned.wrapS = cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(4, 11);
    cloned.magFilter = THREE.LinearFilter;
    cloned.minFilter = THREE.LinearMipmapLinearFilter;
    cloned.anisotropy = 4;
    cloned.needsUpdate = true;
    return cloned;
  }, [baseFloorTexture]);

  const roomW = 20;
  const roomH = 12;
  const roomD = 32;
  const backWallZ = -4;

  // Carousel State & Controller
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const isInteracting = useRef<boolean>(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef<number | null>(null);

  // Auto-slide right every 6.0 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInteracting.current) {
        targetProgress.current += 1;
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const pauseAutoSlide = () => {
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 7500);
  };

  const handleNext = () => {
    pauseAutoSlide();
    targetProgress.current += 1;
  };

  const handleSelectProject = (index: number) => {
    // Ignore click navigation if user was performing a touch swipe gesture
    if (totalDragDistance.current > 10) return;

    pauseAutoSlide();
    const project = PROJECTS_DATA[index];
    const total = PROJECTS_DATA.length;
    const currentNorm = ((currentProgress.current % total) + total) % total;
    let diff = index - currentNorm;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (Math.abs(diff) < 0.35) {
      if (typeof window !== 'undefined' && project?.slug) {
        window.location.href = '/' + project.slug;
      }
    } else {
      targetProgress.current += diff;
    }
  };

  const totalDragDistance = useRef<number>(0);

  // Dedicated Native Touch Listener for Mobile Smartphones (Nothing Phone, iPhones, Android)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let startX = 0;
    let startY = 0;
    let startProgress = 0;
    let isTouchActive = false;
    let isHorizontalSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startProgress = targetProgress.current;
      isTouchActive = true;
      isHorizontalSwipe = false;
      totalDragDistance.current = 0;
      pauseAutoSlide();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchActive || e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Lock to horizontal swipe if movement is primarily horizontal
      if (!isHorizontalSwipe && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalSwipe = true;
      }

      if (isHorizontalSwipe) {
        if (e.cancelable) {
          e.preventDefault(); // Stop mobile browser from canceling touch gesture or scrolling page!
        }
        totalDragDistance.current = Math.abs(deltaX);
        const dragSensitivity = isSmallScreen ? 140 : 250;
        targetProgress.current = startProgress - deltaX / dragSensitivity;
      }
    };

    const handleTouchEnd = () => {
      if (!isTouchActive) return;
      isTouchActive = false;
      if (isHorizontalSwipe) {
        targetProgress.current = Math.round(targetProgress.current);
      }
      setTimeout(() => {
        totalDragDistance.current = 0;
      }, 120);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isSmallScreen]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* ═══ BACK WALL ═══ */}
      <mesh position={[0, roomH / 2, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshLambertMaterial map={wallTexture} color="#e8e4e0" />
      </mesh>

      {/* ═══ LEFT SIDE WALL ═══ */}
      <mesh position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color="#e8e4e0"
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ RIGHT SIDE WALL ═══ */}
      <mesh position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomD, roomH]} />
        <meshLambertMaterial
          map={wallTexture}
          color="#e8e4e0"
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* ═══ FLOOR ═══ */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshLambertMaterial map={floorTexture} color="#b8a88a" />
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

      {/* ═══ ADAPTIVE TITLE TEXT ("PROJECTS ROOM" -> "PROJECTS") ═══ */}
      <WallText
        key={isSmallScreen ? 'title-projects-only' : 'title-projects-room'}
        position={[0, isSmallScreen ? roomH - 1.5 : roomH - 1.5, backWallZ + 0.1]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        color="#6b6560"
        text={isSmallScreen ? "PROJECTS" : "PROJECTS ROOM"}
        fontSize={isSmallScreen ? 0.65 : mapLinear(0.6, 0.9)}
        depth={0.06}
      />

      {/* ═══ INFINITE 3D CIRCULAR CAROUSEL ═══ */}
      <CarouselContainer
        targetProgress={targetProgress}
        currentProgress={currentProgress}
        backWallZ={backWallZ}
        roomH={roomH}
        isSmallScreen={isSmallScreen}
        mapLinear={mapLinear}
        onSelectProject={handleSelectProject}
        pauseAutoSlide={pauseAutoSlide}
      />
    </group>
  );
}

/* ─── Carousel Manager Component ─── */

function CarouselContainer({
  targetProgress,
  currentProgress,
  backWallZ,
  roomH,
  isSmallScreen,
  mapLinear,
  onSelectProject,
  pauseAutoSlide,
}: {
  targetProgress: React.MutableRefObject<number>;
  currentProgress: React.MutableRefObject<number>;
  backWallZ: number;
  roomH: number;
  isSmallScreen: boolean;
  mapLinear: (m: number, d: number) => number;
  onSelectProject: (index: number) => void;
  pauseAutoSlide: () => void;
}) {
  const boardGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const boardFrameMatRefs = useRef<(THREE.MeshLambertMaterial | null)[]>([]);
  const titleBarMatRefs = useRef<(THREE.MeshLambertMaterial | null)[]>([]);

  const tableGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const tableTopMatRefs = useRef<(THREE.MeshLambertMaterial | null)[]>([]);

  const dotRingMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dotRingMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const dotCircleMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dotCircleMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame((_, delta) => {
    const step = THREE.MathUtils.lerp(currentProgress.current, targetProgress.current, Math.min(1, delta * 7));
    currentProgress.current = step;

    const totalItems = PROJECTS_DATA.length;
    const spacing = isSmallScreen ? mapLinear(2.9, 3.8) : mapLinear(4.0, 5.4);
    const normProgress = ((step % totalItems) + totalItems) % totalItems;

    PROJECTS_DATA.forEach((_, i) => {
      let offset = i - normProgress;
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;

      const absOffset = Math.abs(offset);
      const posX = offset * spacing;

      const boardY = roomH / 2 + 2.1;
      const boardZ = backWallZ + 0.1 - Math.pow(absOffset, 1.2) * 0.45;
      const boardScale = isSmallScreen
        ? Math.max(0.72, 1.1 - absOffset * 0.38)
        : Math.max(0.82, 1.25 - absOffset * 0.42);

      const tableZ = 3.6 - Math.pow(absOffset, 1.2) * 2.0;
      const tableScale = isSmallScreen
        ? Math.max(0.72, 1.05 - absOffset * 0.33)
        : Math.max(0.82, 1.2 - absOffset * 0.38);

      const isCenter = absOffset < 0.3;

      const boardGroup = boardGroupRefs.current[i];
      if (boardGroup) {
        boardGroup.position.set(posX, boardY, boardZ);
        boardGroup.scale.set(boardScale, boardScale, boardScale);
      }

      const boardFrameMat = boardFrameMatRefs.current[i];
      if (boardFrameMat) {
        boardFrameMat.color.set(isCenter ? "#3a3a3a" : "#222222");
      }

      const titleBarMat = titleBarMatRefs.current[i];
      if (titleBarMat) {
        titleBarMat.emissiveIntensity = isCenter ? 0.55 : 0.25;
      }

      const tableGroup = tableGroupRefs.current[i];
      if (tableGroup) {
        tableGroup.position.set(posX, 0, tableZ);
        tableGroup.scale.set(tableScale, tableScale, tableScale);
      }

      const tableTopMat = tableTopMatRefs.current[i];
      if (tableTopMat) {
        tableTopMat.color.set(isCenter ? "#6a5a4a" : "#4a3a2a");
      }

      // ─── Dot Indicators Update ───
      let dist = Math.abs(i - normProgress);
      if (dist > totalItems / 2) dist = totalItems - dist;

      const activeFactor = Math.max(0, 1 - dist * 1.5);
      const dotRadius = 0.035 + activeFactor * 0.025;
      const dotScale = dotRadius / 0.035;

      const ringMesh = dotRingMeshRefs.current[i];
      if (ringMesh) {
        ringMesh.visible = activeFactor > 0.1;
        ringMesh.scale.set(dotScale, dotScale, 1);
      }

      const ringMat = dotRingMatRefs.current[i];
      if (ringMat) {
        ringMat.opacity = activeFactor * 0.9;
      }

      const circleMesh = dotCircleMeshRefs.current[i];
      if (circleMesh) {
        circleMesh.scale.set(dotScale, dotScale, 1);
      }

      const circleMat = dotCircleMatRefs.current[i];
      if (circleMat) {
        circleMat.color.set(activeFactor > 0.4 ? "#00ffff" : "#ffffff");
        circleMat.opacity = activeFactor > 0.4 ? 1.0 : 0.55;
      }
    });
  });

  const totalItems = PROJECTS_DATA.length;
  const spacing = isSmallScreen ? mapLinear(2.9, 3.8) : mapLinear(4.0, 5.4);

  return (
    <>
      {PROJECTS_DATA.map((project, i) => {
        // Initial setup for first frame render before useFrame runs
        const normProgress = ((currentProgress.current % totalItems) + totalItems) % totalItems;
        let offset = i - normProgress;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        const absOffset = Math.abs(offset);
        const posX = offset * spacing;
        const boardY = roomH / 2 + 2.1;
        const boardZ = backWallZ + 0.1 - Math.pow(absOffset, 1.2) * 0.45;
        const boardScale = isSmallScreen
          ? Math.max(0.72, 1.1 - absOffset * 0.38)
          : Math.max(0.82, 1.25 - absOffset * 0.42);

        const tableZ = 3.6 - Math.pow(absOffset, 1.2) * 2.0;
        const tableScale = isSmallScreen
          ? Math.max(0.72, 1.05 - absOffset * 0.33)
          : Math.max(0.82, 1.2 - absOffset * 0.38);

        const isCenter = absOffset < 0.3;

        return (
          <group key={project.id}>
            {/* ═══ WALL IMAGE BOARD (Mounted high on back wall) ═══ */}
            <ProjectBoard
              boardGroupRef={(el) => { boardGroupRefs.current[i] = el; }}
              boardFrameMatRef={(el) => { boardFrameMatRefs.current[i] = el; }}
              titleBarMatRef={(el) => { titleBarMatRefs.current[i] = el; }}
              position={[posX, boardY, boardZ]}
              scale={[boardScale, boardScale, boardScale]}
              title={project.title}
              titleBgColor={project.titleBgColor}
              titleTextColor={project.titleTextColor}
              imagePath={project.imagePath}
              isCenter={isCenter}
              isSmallScreen={isSmallScreen}
              slug={project.slug}
              onClick={() => onSelectProject(i)}
            />

            {/* ═══ PROJECT TABLE & FLOATING CARD (Center table moved towards camera) ═══ */}
            <ProjectTable
              tableGroupRef={(el) => { tableGroupRefs.current[i] = el; }}
              tableTopMatRef={(el) => { tableTopMatRefs.current[i] = el; }}
              position={[posX, 0, tableZ]}
              scale={[tableScale, tableScale, tableScale]}
              project={project}
              projectIndex={i}
              currentProgress={currentProgress}
              totalItems={totalItems}
              isCenter={isCenter}
              isSmallScreen={isSmallScreen}
              onClick={() => onSelectProject(i)}
              pauseAutoSlide={pauseAutoSlide}
            />
          </group>
        );
      })}

      {/* ═══ ELEGANT MINIMAL 3D DOT INDICATOR (3 Small Subtle Dots) ═══ */}
      <group position={[0, 0.25, 4.3]}>
        {PROJECTS_DATA.map((proj, idx) => {
          const total = PROJECTS_DATA.length;
          const normProgress = ((currentProgress.current % total) + total) % total;
          let dist = Math.abs(idx - normProgress);
          if (dist > total / 2) dist = total - dist;

          const activeFactor = Math.max(0, 1 - dist * 1.5);
          const dotRadius = 0.035 + activeFactor * 0.025;
          const dotScale = dotRadius / 0.035;
          const dotX = (idx - 1) * 0.22;

          return (
            <group key={proj.id} position={[dotX, 0, 0]}>
              {/* Fine outer cyan ring for active dot */}
              <mesh
                ref={(el) => { dotRingMeshRefs.current[idx] = el; }}
                position={[0, 0, -0.005]}
                scale={[dotScale, dotScale, 1]}
                visible={activeFactor > 0.1}
              >
                <ringGeometry args={[0.035, 0.05, 32]} />
                <meshBasicMaterial
                  ref={(el) => { dotRingMatRefs.current[idx] = el; }}
                  color="#00ffff"
                  transparent
                  opacity={activeFactor * 0.9}
                />
              </mesh>

              {/* Small round circle dot */}
              <mesh
                ref={(el) => { dotCircleMeshRefs.current[idx] = el; }}
                scale={[dotScale, dotScale, 1]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(idx);
                }}
              >
                <circleGeometry args={[0.035, 32]} />
                <meshBasicMaterial
                  ref={(el) => { dotCircleMatRefs.current[idx] = el; }}
                  color={activeFactor > 0.4 ? "#00ffff" : "#ffffff"}
                  transparent
                  opacity={activeFactor > 0.4 ? 1.0 : 0.55}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}

/* ─── Sub-components ─── */

function ProjectBoard({
  boardGroupRef,
  boardFrameMatRef,
  titleBarMatRef,
  position,
  scale,
  title,
  titleBgColor,
  titleTextColor,
  imagePath,
  isCenter,
  isSmallScreen,
  slug,
  onClick,
}: {
  boardGroupRef?: (el: THREE.Group | null) => void;
  boardFrameMatRef?: (el: THREE.MeshLambertMaterial | null) => void;
  titleBarMatRef?: (el: THREE.MeshLambertMaterial | null) => void;
  position: [number, number, number];
  scale: [number, number, number];
  title: string;
  titleBgColor: string;
  titleTextColor: string;
  imagePath: string;
  isCenter: boolean;
  isSmallScreen: boolean;
  slug: string;
  onClick: () => void;
}) {
  const imageTexture = useTexture(imagePath);
  const boardW = 3.8;
  const boardH = 2.4;

  return (
    <group
      ref={boardGroupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (typeof window !== 'undefined' && slug) {
          window.location.href = '/' + slug;
        } else {
          onClick();
        }
      }}
    >
      {/* Board frame */}
      <mesh>
        <boxGeometry args={[boardW, boardH, 0.08]} />
        <meshLambertMaterial ref={boardFrameMatRef} color={isCenter ? "#3a3a3a" : "#222222"} />
      </mesh>

      {/* Board surface with image */}
      <mesh position={[0, -0.12, 0.05]}>
        <planeGeometry args={[boardW - 0.16, boardH - 0.52]} />
        <meshLambertMaterial map={imageTexture} />
      </mesh>

      {/* Title bar background */}
      <mesh position={[0, boardH / 2 - 0.26, 0.06]}>
        <planeGeometry args={[boardW - 0.1, 0.46]} />
        <meshLambertMaterial
          ref={titleBarMatRef}
          color={titleBgColor}
          emissive={titleBgColor}
          emissiveIntensity={isCenter ? 0.55 : 0.25}
        />
      </mesh>

      {/* Project Title Text */}
      <Text
        position={[0, boardH / 2 - 0.26, 0.11]}
        fontSize={0.29}
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
  tableGroupRef,
  tableTopMatRef,
  position,
  scale,
  project,
  projectIndex,
  currentProgress,
  totalItems,
  isCenter,
  isSmallScreen,
  onClick,
  pauseAutoSlide,
}: {
  tableGroupRef?: (el: THREE.Group | null) => void;
  tableTopMatRef?: (el: THREE.MeshLambertMaterial | null) => void;
  position: [number, number, number];
  scale: [number, number, number];
  project: typeof PROJECTS_DATA[0];
  projectIndex: number;
  currentProgress: React.MutableRefObject<number>;
  totalItems: number;
  isCenter: boolean;
  isSmallScreen: boolean;
  onClick: () => void;
  pauseAutoSlide: () => void;
}) {
  const tableH = 1.5;
  const tableRadius = isSmallScreen ? 2.05 : 2.35;
  const legRadius = 0.045;
  const legHeight = tableH;

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
    <group ref={tableGroupRef} position={position} scale={scale} onClick={onClick}>
      {/* Table top */}
      <mesh position={[0, tableH, 0]}>
        <cylinderGeometry args={[tableRadius, tableRadius, 0.08, 32]} />
        <meshLambertMaterial ref={tableTopMatRef} color={isCenter ? "#6a5a4a" : "#4a3a2a"} />
      </mesh>

      {/* 3 Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[legRadius, legRadius * 0.8, legHeight, 16]} />
          <meshLambertMaterial color="#2a2a2a" />
        </mesh>
      ))}

      {/* Floating Card */}
      <FloatingCard
        tableHeight={tableH}
        tableRadius={tableRadius}
        project={project}
        projectIndex={projectIndex}
        currentProgress={currentProgress}
        totalItems={totalItems}
        isCenter={isCenter}
        isSmallScreen={isSmallScreen}
        pauseAutoSlide={pauseAutoSlide}
      />
    </group>
  );
}

function FloatingCard({
  tableHeight,
  tableRadius,
  project,
  projectIndex,
  currentProgress,
  totalItems,
  isCenter,
  isSmallScreen,
  pauseAutoSlide,
}: {
  tableHeight: number;
  tableRadius: number;
  project: typeof PROJECTS_DATA[0];
  projectIndex: number;
  currentProgress: React.MutableRefObject<number>;
  totalItems: number;
  isCenter: boolean;
  isSmallScreen: boolean;
  pauseAutoSlide: () => void;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const cardBodyMatRef = useRef<THREE.MeshLambertMaterial>(null);
  const cyanEdge1MatRef = useRef<THREE.MeshLambertMaterial>(null);
  const cyanEdge2MatRef = useRef<THREE.MeshLambertMaterial>(null);
  const purpleEdge1MatRef = useRef<THREE.MeshLambertMaterial>(null);
  const purpleEdge2MatRef = useRef<THREE.MeshLambertMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState<number | null>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });

  const cardWidth = isSmallScreen ? 1.95 : 2.25;
  const cardHeight = isSmallScreen ? 2.85 : 3.25;
  const cardDepth = 0.18;
  // Lift float height to tableHeight + 1.7 so the bottom of the card hovers clearly above table top
  const baseFloatHeight = tableHeight + 1.7;

  const githubTexture = useTexture('/3d/ProjectRoom/images/github.webp');
  const playstoreTexture = useTexture('/3d/ProjectRoom/images/playstore.webp');
  const linkedinTexture = useTexture('/3d/ProjectRoom/images/linkedin.webp');
  const webTexture = useTexture('/3d/ProjectRoom/images/web.webp');

  const seed = useMemo(() => project.id * 1.337, [project.id]);

  const MAX_TILT = 0.18;
  const SPRING_STIFFNESS = 0.18;
  const SPRING_DAMPING = 0.85;

  const handlePointerMove = (event: any) => {
    if (!hovered || !cardRef.current) return;
    const rect = event.target.getBoundingClientRect?.();
    if (rect) {
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotation.current.x = y * MAX_TILT;
      targetRotation.current.y = x * MAX_TILT;
    }
  };

  useFrame((state) => {
    if (cardRef.current) {
      const time = state.clock.getElapsedTime();

      // Compute dynamic isCenter inside useFrame without triggering React state re-render
      const normProgress = ((currentProgress.current % totalItems) + totalItems) % totalItems;
      let offset = projectIndex - normProgress;
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;
      const dynamicIsCenter = Math.abs(offset) < 0.3;

      const floatOffset = Math.sin(time * 0.7 + seed) * 0.06 + Math.cos(time * 0.5 + seed * 0.5) * 0.04;
      const hoverLiftOffset = hovered ? 0.2 : 0;
      cardRef.current.position.y = baseFloatHeight + floatOffset + hoverLiftOffset;

      const targetScale = hovered ? 1.04 : 1;
      const currentScale = cardRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, SPRING_STIFFNESS);
      cardRef.current.scale.set(newScale, newScale, newScale);

      if (hovered) {
        cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, targetRotation.current.x, SPRING_STIFFNESS);
        cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetRotation.current.y, SPRING_STIFFNESS);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, 0, SPRING_STIFFNESS);
      } else {
        const idleRotation = Math.sin(time * 0.5 + seed) * 0.025;
        targetRotation.current.x = 0;
        targetRotation.current.y = idleRotation;
        targetRotation.current.z = 0;

        cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, 0, SPRING_DAMPING * 0.12);
        cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, idleRotation, SPRING_DAMPING * 0.12);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, 0, SPRING_DAMPING * 0.12);
      }

      // Imperative light & material updates
      if (lightRef.current) {
        lightRef.current.intensity = dynamicIsCenter ? (hovered ? 2.0 : 1.2) : 0.4;
      }
      if (cardBodyMatRef.current) {
        cardBodyMatRef.current.color.set(dynamicIsCenter ? (hovered ? "#0f0f18" : "#08080d") : "#040406");
      }
      const edgeEmissive = dynamicIsCenter ? (hovered ? 2.5 : 1.8) : 0.8;
      if (cyanEdge1MatRef.current) cyanEdge1MatRef.current.emissiveIntensity = edgeEmissive;
      if (cyanEdge2MatRef.current) cyanEdge2MatRef.current.emissiveIntensity = edgeEmissive;
      if (purpleEdge1MatRef.current) purpleEdge1MatRef.current.emissiveIntensity = edgeEmissive;
      if (purpleEdge2MatRef.current) purpleEdge2MatRef.current.emissiveIntensity = edgeEmissive;
    }
  });

  const titleFont = isSmallScreen ? 0.17 : 0.19;
  const lineFont = isSmallScreen ? 0.13 : 0.15;
  const techFont = isSmallScreen ? 0.10 : 0.11;
  const btnSize = isSmallScreen ? 0.31 : 0.35;
  const btnOffset = isSmallScreen ? 0.50 : 0.56;

  return (
    <group ref={cardRef} position={[0, baseFloatHeight, 0]}>
      {/* Light glow for center card */}
      <pointLight
        ref={lightRef}
        position={[0, -0.4, 0]}
        intensity={isCenter ? (hovered ? 2.0 : 1.2) : 0.4}
        color="#00d9ff"
        distance={tableRadius * 2.0}
        decay={2}
      />

      {/* Card body */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.14}
        smoothness={4}
        onPointerOver={() => {
          setHovered(true);
          pauseAutoSlide();
        }}
        onPointerOut={() => setHovered(false)}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          if (typeof window === 'undefined') return;
          e.stopPropagation();
          if (project.slug) {
            window.location.href = '/' + project.slug;
          }
        }}
      >
        <meshLambertMaterial
          ref={cardBodyMatRef}
          color={isCenter ? (hovered ? "#0f0f18" : "#08080d") : "#040406"}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Neon cyan left edge */}
      <RoundedBox args={[0.04, cardHeight, cardDepth + 0.02]} radius={0.02} smoothness={4} position={[-cardWidth / 2, 0, 0]}>
        <meshLambertMaterial ref={cyanEdge1MatRef} color="#00d9ff" emissive="#00d9ff" emissiveIntensity={isCenter ? (hovered ? 2.5 : 1.8) : 0.8} />
      </RoundedBox>

      {/* Neon cyan right edge */}
      <RoundedBox args={[0.04, cardHeight, cardDepth + 0.02]} radius={0.02} smoothness={4} position={[cardWidth / 2, 0, 0]}>
        <meshLambertMaterial ref={cyanEdge2MatRef} color="#00d9ff" emissive="#00d9ff" emissiveIntensity={isCenter ? (hovered ? 2.5 : 1.8) : 0.8} />
      </RoundedBox>

      {/* Neon purple top edge */}
      <RoundedBox args={[cardWidth, 0.04, cardDepth + 0.02]} radius={0.02} smoothness={4} position={[0, cardHeight / 2, 0]}>
        <meshLambertMaterial ref={purpleEdge1MatRef} color="#a855f7" emissive="#a855f7" emissiveIntensity={isCenter ? (hovered ? 2.5 : 1.8) : 0.8} />
      </RoundedBox>

      {/* Neon purple bottom edge */}
      <RoundedBox args={[cardWidth, 0.04, cardDepth + 0.02]} radius={0.02} smoothness={4} position={[0, -cardHeight / 2, 0]}>
        <meshLambertMaterial ref={purpleEdge2MatRef} color="#a855f7" emissive="#a855f7" emissiveIntensity={isCenter ? (hovered ? 2.5 : 1.8) : 0.8} />
      </RoundedBox>

      {/* Card Text Content */}
      <group position={[0, 0, cardDepth / 2 + 0.04]}>
        <Text position={[0, cardHeight / 2 - 0.38, 0]} fontSize={titleFont} color="#00ff00" anchorX="center" anchorY="middle" fontWeight="bold" maxWidth={cardWidth - 0.2}>
          {project.line1}
        </Text>

        <Text position={[0, cardHeight / 2 - 0.65, 0]} fontSize={lineFont} color="#00ff00" anchorX="center" anchorY="middle" fontWeight="bold" maxWidth={cardWidth - 0.2}>
          {project.line2}
        </Text>

        <Text position={[0, cardHeight / 2 - 0.88, 0]} fontSize={lineFont} color="#00ff00" anchorX="center" anchorY="middle" fontWeight="bold" maxWidth={cardWidth - 0.2}>
          {project.line3}
        </Text>

        <Text position={[0, cardHeight / 2 - 1.28, 0]} fontSize={techFont + 0.02} color="#00d9ff" anchorX="center" anchorY="middle" fontWeight="600">
          Tech Stack:
        </Text>

        <Text position={[0, cardHeight / 2 - 1.50, 0]} fontSize={techFont} color="#00d9ff" anchorX="center" anchorY="middle" maxWidth={cardWidth - 0.1} lineHeight={1.3}>
          {project.techStack.slice(0, 3).join(' • ')}
        </Text>

        <Text position={[0, cardHeight / 2 - 1.68, 0]} fontSize={techFont} color="#00d9ff" anchorX="center" anchorY="middle" maxWidth={cardWidth - 0.1} lineHeight={1.3}>
          {project.techStack.slice(3).join(' • ')}
        </Text>

        {/* Buttons */}
        <group position={[0, -cardHeight / 2 + 0.44, 0]}>
          {/* GitHub Button */}
          {project.github && (
            <group position={[-btnOffset, 0, 0]}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.github, '_blank');
                }}
                onPointerOver={() => setButtonHovered(0)}
                onPointerOut={() => setButtonHovered(null)}
              >
                <RoundedBox args={[btnSize, btnSize, 0.04]} radius={0.08} smoothness={4}>
                  <meshLambertMaterial
                    color="#24292e"
                    emissiveIntensity={buttonHovered === 0 ? 0.6 : 0.2}
                    emissive={buttonHovered === 0 ? "#00ff00" : "#000000"}
                  />
                </RoundedBox>
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[btnSize * 0.78, btnSize * 0.78]} />
                <meshBasicMaterial map={githubTexture} transparent side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            </group>
          )}

          {/* Main Action Button (PlayStore or Web) */}
          {(project.playstore || project.web) && (
            <group position={[0, 0, 0]}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.playstore || project.web, '_blank');
                }}
                onPointerOver={() => setButtonHovered(1)}
                onPointerOut={() => setButtonHovered(null)}
              >
                <RoundedBox args={[btnSize, btnSize, 0.04]} radius={0.08} smoothness={4}>
                  <meshLambertMaterial
                    color={project.playstore ? "#01875f" : "#0ea5e9"}
                    emissiveIntensity={buttonHovered === 1 ? 0.6 : 0.2}
                    emissive={buttonHovered === 1 ? "#00ff00" : "#000000"}
                  />
                </RoundedBox>
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[btnSize * 0.78, btnSize * 0.78]} />
                <meshBasicMaterial
                  map={project.playstore ? playstoreTexture : webTexture}
                  transparent
                  side={THREE.DoubleSide}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )}

          {/* LinkedIn Button */}
          {project.linkedin && (
            <group position={[btnOffset, 0, 0]}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.linkedin, '_blank');
                }}
                onPointerOver={() => setButtonHovered(2)}
                onPointerOut={() => setButtonHovered(null)}
              >
                <RoundedBox args={[btnSize, btnSize, 0.04]} radius={0.08} smoothness={4}>
                  <meshLambertMaterial
                    color="#0a66c2"
                    emissiveIntensity={buttonHovered === 2 ? 0.6 : 0.2}
                    emissive={buttonHovered === 2 ? "#0a66c2" : "#000000"}
                  />
                </RoundedBox>
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[btnSize * 0.78, btnSize * 0.78]} />
                <meshBasicMaterial map={linkedinTexture} transparent side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

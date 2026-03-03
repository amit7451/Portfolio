'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import WallBase from './WallBase';
import FloorBase from './FloorBase';
import SideWall from './SideWall';
import WallText from './WallText';
import Shelf from './Shelf';
import Frame from './Frame';
import StickyNote from './StickyNote';
import DigitalClock from './DigitalClock';
import PhotoFrame from './PhotoFrame';
import DeskCalendar from './DeskCalendar';
import Wardrobe from './Wardrobe';
import { TanjiroFigurine, ZenitsuFigurine, SpiderManFigurine, IronManFigurine, CaptainAmericaFigurine } from './ToyFigurines';

interface WallDecorGroupProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  visible?: boolean;
}

export default function WallDecorGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  visible = true,
}: WallDecorGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.jpg');
  
  // Clone and configure ceiling texture with anisotropy to prevent flickering
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

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Background Wall - main back wall - shifted up to align top with viewport top */}
      <WallBase
        position={[0, 3, -4]}
        width={20}
        height={12}
        color="#f5f2ed"
        roughness={0.92}
      />

      {/* Left Side Wall - creates room depth */}
      <SideWall
        position={[-10, 3, 6]}
        width={22}
        height={12}
        color="#ebe8e3"
        roughness={0.92}
        side="left"
        textureRepeatX={8}
        textureRepeatY={4}
      />

      {/* Right Side Wall - creates room depth */}
      <SideWall
        position={[10, 3, 6]}
        width={22}
        height={12}
        color="#ebe8e3"
        roughness={0.92}
        side="right"
        textureRepeatX={8}
        textureRepeatY={4}
      />
      
      {/* Wardrobe - Left Side Wall */}
      <Wardrobe
        position={[-9.65, -3, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        scale={[1, 1, 1]}
      />

      {/* Floor - wooden floor extending forward */}
      <FloorBase
        position={[0, -3, 6]}
        width={20}
        depth={22}
        color="#d4c4a8"
        textureRepeatX={4}
        textureRepeatY={11}
      />

      {/* Ceiling - textured ceiling matching floor size */}
      <mesh
        position={[0, 8.5, 6]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 22]} />
        <meshBasicMaterial
          map={ceilingTexture}
          color="#f5f5f5"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Title Text - painted on wall look */}
      <WallText
        position={[0, 7.5, -3.95]}
        text="FULL STACK DEVELOPER"
        fontSize={0.75}
        depth={0.02}
        color="#9a8b7a"
        roughness={1.0}
        metalness={0}
      />

      {/* Upper Shelf - shorter, centered */}
      <Shelf
        position={[0, 4.5, -3.3]}
        length={6}
        thickness={0.15}
        depth={0.7}
        showLightStrip={true}
        lightColor="#fff5e6"
        lightIntensity={0.5}
      />

      {/* Lower Shelf - full width */}
      <Shelf
        position={[0, 1.0, -3.3]}
        length={18}
        thickness={0.15}
        depth={0.7}
        showLightStrip={true}
        lightColor="#fff5e6"
        lightIntensity={0.4}
      />

      {/* Toy Figurines on Upper Shelf - left side (random spacing & sizes) */}
      <group position={[-2.8, 4.65, -3.0]} scale={[1.45, 1.45, 1.45]}>
        <TanjiroFigurine position={[0, 0, 0]} />
      </group>
      <group position={[-1.85, 4.65, -2.92]} scale={[1.3, 1.3, 1.3]}>
        <ZenitsuFigurine position={[0, 0, 0]} />
      </group>
      <group position={[-1.15, 4.65, -3.06]} scale={[1.55, 1.55, 1.55]}>
        <SpiderManFigurine position={[0, 0, 0]} />
      </group>
      <group position={[-0.25, 4.65, -2.88]} scale={[1.35, 1.35, 1.35]}>
        <IronManFigurine position={[0, 0, 0]} />
      </group>
      <group position={[0.45, 4.65, -3.0]} scale={[1.5, 1.5, 1.5]}>
        <CaptainAmericaFigurine position={[0, 0, 0]} />
      </group>

      {/* Digital Clock on Upper Shelf - right corner */}
      <DigitalClock
        position={[1.8, 4.9, -3.0]}
        scale={[0.6, 0.6, 0.6]}
      />

      {/* 4 Photo Frames - 2x2 pattern outside upper rack x-range */}
      {/* Left side - 2 frames stacked */}
      <PhotoFrame
        position={[-6.5, 5.5, -3.85]}
        imagePath="/3d/wall/images/c1.png"
        width={1.6}
        height={2.2}
        frameColor="#3d2817"
      />
      <PhotoFrame
        position={[-4.2, 3.8, -3.85]}
        imagePath="/3d/wall/images/r1.png"
        width={1.6}
        height={2.2}
        frameColor="#3d2817"
      />
      
      {/* Right side - 2 frames stacked */}
      <PhotoFrame
        position={[6.5, 5.5, -3.85]}
        imagePath="/3d/wall/images/c2.png"
        width={1.6}
        height={2.2}
        frameColor="#3d2817"
      />
      <PhotoFrame
        position={[4.2, 3.8, -3.85]}
        imagePath="/3d/wall/images/r2.png"
        width={1.6}
        height={2.2}
        frameColor="#3d2817"
      />

      {/* Sticky Notes Cluster - Between upper and lower shelves */}
      <StickyNote position={[-1.8, 3.4, -3.8]} color="#fff740" size={0.38} />
      <StickyNote position={[-1.2, 3.35, -3.78]} color="#fff740" size={0.36} />
      <StickyNote position={[-0.6, 3.5, -3.8]} color="#fff740" size={0.34} />
      <StickyNote position={[0, 3.3, -3.78]} color="#fff740" size={0.36} />
      <StickyNote position={[0.5, 3.45, -3.8]} color="#fff740" size={0.34} />
      <StickyNote position={[1.0, 3.35, -3.78]} color="#fff740" size={0.36} />

      {/* Second Row of Sticky Notes */}
      <StickyNote position={[-1.5, 2.85, -3.8]} color="#fff740" size={0.32} />
      <StickyNote position={[-0.9, 2.8, -3.78]} color="#fff740" size={0.34} />
      <StickyNote position={[-0.3, 2.95, -3.8]} color="#fff740" size={0.32} />
      <StickyNote position={[0.3, 2.75, -3.78]} color="#fff740" size={0.36} />
      <StickyNote position={[0.8, 2.9, -3.8]} color="#fff740" size={0.32} />

      {/* Third Row - More scattered */}
      <StickyNote position={[-1.2, 2.35, -3.8]} color="#fff740" size={0.30} />
      <StickyNote position={[-0.5, 2.4, -3.78]} color="#fff740" size={0.32} />
      <StickyNote position={[0.1, 2.3, -3.8]} color="#fff740" size={0.30} />
      <StickyNote position={[0.6, 2.45, -3.78]} color="#fff740" size={0.29} />

      {/* Printer with papers on lower shelf - left side */}
      <PrinterWithPaper position={[-7.5, 1.35, -3.2]} />

      {/* Binders/Folders on lower shelf - center left */}
      <BinderGroup position={[-4.5, 1.35, -3.25]} />

      {/* Old CRT Monitor on lower shelf - left of calendar */}
      <CRTMonitor position={[2.5, 1.35, -3.1]} />

      {/* Desk Calendar on lower shelf - right side */}
      <DeskCalendar position={[5.3, 1.65, -3.0]} scale={[1.2, 1.2, 1.2]} />

      {/* Randomly stacked books on lower shelf - far right */}
      <RandomBookStack position={[7.0, 1.35, -3.15]} />

      {/* Photography Umbrella/Light Stand (right side) */}
      <LightStand position={[7.5, -3, 1.5]} />
    </group>
  );
}

// Additional Decorative Components

function Printer({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main Body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Paper Tray */}
      <mesh position={[0, 0.25, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Control Panel */}
      <mesh position={[0.35, 0.2, 0.32]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Display */}
      <mesh position={[0.35, 0.22, 0.33]}>
        <planeGeometry args={[0.15, 0.04]} />
        <meshStandardMaterial color="#1a3a2a" emissive="#0a2015" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function PrinterWithPaper({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main Body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Paper Tray */}
      <mesh position={[0, 0.25, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Control Panel */}
      <mesh position={[0.35, 0.2, 0.32]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Display */}
      <mesh position={[0.35, 0.22, 0.33]}>
        <planeGeometry args={[0.15, 0.04]} />
        <meshStandardMaterial color="#1a3a2a" emissive="#0a2015" emissiveIntensity={0.3} />
      </mesh>
      {/* White paper stack on top */}
      <mesh position={[0, 0.35, 0.05]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} />
      </mesh>
      {/* Output paper tray with papers */}
      <mesh position={[0, 0.1, 0.45]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.02, 0.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0.12, 0.48]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.02, 0.28]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

function BookStack({ position = [0, 0, 0] as [number, number, number] }) {
  const bookColors = ['#8b4513', '#2f4f4f', '#4a4a8a', '#8b0000', '#006400'];

  return (
    <group position={position}>
      {bookColors.map((color, i) => (
        <mesh key={i} position={[0, i * 0.08, 0]} castShadow>
          <boxGeometry args={[0.6, 0.07, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

// Randomly stacked books with varied rotations and positions
function RandomBookStack({ position = [0, 0, 0] as [number, number, number] }) {
  const books = [
    { color: '#8b4513', width: 0.65, height: 0.09, depth: 0.45, xOffset: 0.05, zOffset: 0, rotation: 0.02 },
    { color: '#2f4f4f', width: 0.55, height: 0.08, depth: 0.4, xOffset: -0.08, zOffset: 0.03, rotation: -0.05 },
    { color: '#6b3a2e', width: 0.7, height: 0.1, depth: 0.42, xOffset: 0.03, zOffset: -0.02, rotation: 0.08 },
    { color: '#4a4a8a', width: 0.5, height: 0.07, depth: 0.38, xOffset: -0.05, zOffset: 0.05, rotation: -0.03 },
    { color: '#8b0000', width: 0.6, height: 0.085, depth: 0.4, xOffset: 0.1, zOffset: 0, rotation: 0.12 },
    { color: '#006400', width: 0.58, height: 0.075, depth: 0.36, xOffset: -0.03, zOffset: -0.04, rotation: -0.08 },
    { color: '#483d8b', width: 0.52, height: 0.08, depth: 0.35, xOffset: 0.07, zOffset: 0.02, rotation: 0.06 },
  ];

  let currentHeight = 0;

  return (
    <group position={position}>
      {books.map((book, i) => {
        const yPos = currentHeight + book.height / 2;
        currentHeight += book.height;
        return (
          <mesh 
            key={i} 
            position={[book.xOffset, yPos, book.zOffset]} 
            rotation={[0, book.rotation, 0]}
            castShadow
          >
            <boxGeometry args={[book.width, book.height, book.depth]} />
            <meshStandardMaterial color={book.color} roughness={0.7} metalness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

function BinderGroup({ position = [0, 0, 0] as [number, number, number] }) {
  const binderColors = ['#1e90ff', '#32cd32', '#ff6347', '#9370db', '#40e0d0', '#ffd700'];

  return (
    <group position={position}>
      {binderColors.map((color, i) => (
        <mesh key={i} position={[i * 0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.7, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function CableCoil({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Coiled cable simplified as torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.02, 8, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Inner coils */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0.3]} castShadow>
        <torusGeometry args={[0.1, 0.02, 8, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Cable ends */}
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.02, 0.08]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

function CRTMonitor({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Monitor body - boxy CRT shape */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.8, 1.5, 1.4]} />
        <meshStandardMaterial color="#c8c0b0" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Rear bulge (CRT tube) */}
      <mesh position={[0, 0.55, -0.55]} castShadow>
        <boxGeometry args={[1.5, 1.2, 0.5]} />
        <meshStandardMaterial color="#b8b0a0" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Screen bezel - dark frame */}
      <mesh position={[0, 0.6, 0.71]} castShadow>
        <boxGeometry args={[1.55, 1.25, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Screen - black with green glow */}
      <mesh position={[0, 0.6, 0.74]}>
        <planeGeometry args={[1.3, 1.0]} />
        <meshStandardMaterial
          color="#001a00"
          roughness={0.1}
          metalness={0.3}
          emissive="#001a00"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Green scanlines / code lines on screen */}
      {[
        { y: 0.85, w: 0.9 },
        { y: 0.78, w: 0.55 },
        { y: 0.71, w: 1.05 },
        { y: 0.64, w: 0.7 },
        { y: 0.57, w: 0.85 },
        { y: 0.50, w: 0.45 },
        { y: 0.43, w: 1.1 },
        { y: 0.36, w: 0.6 },
        { y: 0.29, w: 0.95 },
      ].map((line, i) => (
        <mesh key={i} position={[-0.55 + line.w / 2, line.y, 0.75]}>
          <planeGeometry args={[line.w, 0.035]} />
          <meshStandardMaterial
            color="#00ff41"
            emissive="#00ff41"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6 + Math.random() * 0.3}
          />
        </mesh>
      ))}

      {/* Blinking cursor */}
      <mesh position={[-0.45, 0.22, 0.75]}>
        <planeGeometry args={[0.06, 0.045]} />
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Monitor stand/base */}
      <mesh position={[0, -0.15, 0.1]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial color="#b8b0a0" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Stand foot */}
      <mesh position={[0, -0.22, 0.1]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.8]} />
        <meshStandardMaterial color="#a8a090" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Power button */}
      <mesh position={[0.6, 0.15, 0.72]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Power LED */}
      <mesh position={[0.6, 0.08, 0.72]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#00cc00"
          emissive="#00cc00"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Ventilation slots on side */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0.91, 0.35 + i * 0.12, 0]} castShadow>
          <boxGeometry args={[0.01, 0.04, 0.6]} />
          <meshStandardMaterial color="#555" roughness={0.7} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function LightStand({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.3, 0]}>
      {/* Stand Base — sits on the floor */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Stand Pole — rises from base */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Umbrella Frame — at top of pole */}
      <mesh position={[0, 5.3, 0]} rotation={[0.3, 0, 0]} castShadow>
        <coneGeometry args={[1.2, 0.8, 8, 1, true]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.8}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

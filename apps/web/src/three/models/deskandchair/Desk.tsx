'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface DeskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export default function Desk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#3a3028',
}: DeskProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Desk dimensions
  const topW = 3.6;  // width (X)
  const topD = 1.6;  // depth (Z)
  const topH = 0.08; // thickness
  const legH = 1.5;  // leg height
  const legW = 0.08;
  const legD = 0.08;
  const deskY = legH + topH / 2; // top surface Y

  const darkMetal = '#1a1a1a';
  const frameMetal = '#2a2a2a';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* ═══ DESKTOP SURFACE ═══ */}
      <mesh position={[0, deskY, 0]} castShadow receiveShadow>
        <boxGeometry args={[topW, topH, topD]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Subtle edge banding on front */}
      <mesh position={[0, deskY, topD / 2 + 0.005]} castShadow>
        <boxGeometry args={[topW, topH, 0.01]} />
        <meshLambertMaterial color="#4a4038" />
      </mesh>

      {/* ═══ METAL FRAME / LEGS ═══ */}
      {/* 4 legs at corners */}
      {[
        [-topW / 2 + 0.15, legH / 2, -topD / 2 + 0.12],
        [topW / 2 - 0.15, legH / 2, -topD / 2 + 0.12],
        [-topW / 2 + 0.15, legH / 2, topD / 2 - 0.12],
        [topW / 2 - 0.15, legH / 2, topD / 2 - 0.12],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[legW, legH, legD]} />
          <meshLambertMaterial color={darkMetal} />
        </mesh>
      ))}

      {/* Front cross-bar (under desktop, front) */}
      <mesh position={[0, legH - 0.1, topD / 2 - 0.12]} castShadow>
        <boxGeometry args={[topW - 0.3, 0.06, 0.06]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Back cross-bar */}
      <mesh position={[0, legH - 0.1, -topD / 2 + 0.12]} castShadow>
        <boxGeometry args={[topW - 0.3, 0.06, 0.06]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Left side bar */}
      <mesh position={[-topW / 2 + 0.15, legH - 0.1, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, topD - 0.24]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Right side bar */}
      <mesh position={[topW / 2 - 0.15, legH - 0.1, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, topD - 0.24]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* ═══ KEYBOARD TRAY (optional subtle pull-out) ═══ */}
      <mesh position={[0, deskY - 0.18, 0.15]} castShadow>
        <boxGeometry args={[1.8, 0.03, 0.8]} />
        <meshLambertMaterial color="#2e2822" />
      </mesh>

      {/* Tray rail left */}
      <mesh position={[-0.85, deskY - 0.1, 0.15]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.75]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Tray rail right */}
      <mesh position={[0.85, deskY - 0.1, 0.15]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.75]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* ═══ CABLE MANAGEMENT TRAY (under desk, back) ═══ */}
      <mesh position={[0, legH - 0.35, -topD / 2 + 0.25]} castShadow>
        <boxGeometry args={[2.0, 0.04, 0.3]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Side bracket left */}
      <mesh position={[-1.0, legH - 0.25, -topD / 2 + 0.25]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* Side bracket right */}
      <mesh position={[1.0, legH - 0.25, -topD / 2 + 0.25]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshLambertMaterial color={frameMetal} />
      </mesh>

      {/* ═══ STORAGE DRAWER UNIT (right ¼ of desk) ═══ */}
      {(() => {
        const drawerW = topW * 0.25;           // ¼ desk width
        const drawerH = legH * 0.65;           // ~65% leg height
        const drawerD = topD - 0.1;            // nearly full depth, slight inset
        const drawerX = topW / 2 - drawerW / 2 - 0.08; // flush with right edge, inset 0.08
        const drawerY = deskY - topH / 2 - drawerH / 2; // hangs from desk top
        return (
          <group>
            {/* Main drawer body */}
            <mesh position={[drawerX, drawerY, 0]} castShadow receiveShadow>
              <boxGeometry args={[drawerW, drawerH, drawerD]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Front face panel — slightly protruding for depth */}
            <mesh position={[drawerX, drawerY, drawerD / 2 + 0.008]} castShadow>
              <boxGeometry args={[drawerW + 0.02, drawerH + 0.02, 0.016]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Drawer handles removed to allow clean flush plate mounting */}
          </group>
        );
      })()}

      {/* ═══ FLAT MONITOR (left-front corner, angled toward chair) ═══ */}
      {(() => {
        const monW = 0.85;    // smaller screen width
        const monH = 0.55;    // smaller screen height
        const monThick = 0.03;
        const bezelW = 0.02;
        const monX = -topW / 2 + monW / 2 + 0.18; // near left edge
        const monBaseY = deskY + topH / 2;
        const monAngle = -0.6 + Math.PI; // Rotated 180 degrees to face character (screen faces -Z, back faces +Z)
        return (
          <group position={[monX, monBaseY, topD / 2 - 0.4]} rotation={[0, monAngle, 0]}>
            {/* Monitor stand base */}
            <mesh position={[0, 0.015, 0.08]} castShadow receiveShadow>
              <boxGeometry args={[0.22, 0.015, 0.16]} />
              <meshLambertMaterial color="#222222" />
            </mesh>
            {/* Monitor stand neck */}
            <mesh position={[0, 0.14, 0.05]} castShadow>
              <boxGeometry args={[0.04, 0.25, 0.04]} />
              <meshLambertMaterial color="#2a2a2a" />
            </mesh>
            {/* Screen frame (black bezel) */}
            <mesh position={[0, 0.28 + monH / 2, 0]} castShadow>
              <boxGeometry args={[monW + bezelW * 2, monH + bezelW * 2, monThick]} />
              <meshLambertMaterial color="#222222" />
            </mesh>
            
            {/* ═══ FRONT SCREEN (facing character) ═══ */}
            <mesh position={[0, 0.28 + monH / 2, monThick / 2 + 0.001]}>
              <planeGeometry args={[monW, monH]} />
              <meshLambertMaterial
                color="#0a0a12"
                emissive="#0a0f1a"
                emissiveIntensity={0.15}
              />
            </mesh>
            
            {/* ═══ BACK PANEL (visible to viewer) ═══ */}
            {/* Main back panel with lighter gray for visibility */}
            <mesh position={[0, 0.28 + monH / 2, -monThick / 2 - 0.005]} castShadow>
              <boxGeometry args={[monW + bezelW * 1.5, monH + bezelW * 1.5, 0.01]} />
              <meshLambertMaterial color="#505050" />
            </mesh>

            {/* Brand logo area - highly visible */}
            <mesh position={[0, 0.28 + monH - 0.06, -monThick / 2 - 0.01]}>
              <boxGeometry args={[0.2, 0.04, 0.004]} />
              <meshLambertMaterial color="#888888" />
            </mesh>

            {/* VESA mount plate - lighter for contrast */}
            <mesh position={[0, 0.28 + monH / 2, -monThick / 2 - 0.008]} castShadow>
              <boxGeometry args={[0.25, 0.25, 0.008]} />
              <meshLambertMaterial color="#606060" />
            </mesh>

            {/* VESA mount holes */}
            {[
              [-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08], [0.08, -0.08]
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.28 + monH / 2 + pos[1], -monThick / 2 - 0.012]} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.015, 12]} />
                <meshLambertMaterial color="#222222" />
              </mesh>
            ))}

            {/* Ventilation panel - right side */}
            <mesh position={[0.25, 0.28 + monH / 2, -monThick / 2 - 0.008]} castShadow>
              <boxGeometry args={[0.18, 0.3, 0.006]} />
              <meshLambertMaterial color="#444444" />
            </mesh>

            {/* Ventilation grilles - dark contrast */}
            {Array.from({ length: 12 }, (_, i) => (
              <mesh key={`vent-${i}`} position={[0.25, 0.28 + monH / 2 - 0.12 + i * 0.02, -monThick / 2 - 0.01]} castShadow>
                <boxGeometry args={[0.15, 0.004, 0.003]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
            ))}

            {/* I/O panel - lighter */}
            <mesh position={[-0.28, 0.28 + monH / 2 - 0.08, -monThick / 2 - 0.008]} castShadow>
              <boxGeometry args={[0.12, 0.16, 0.006]} />
              <meshLambertMaterial color="#444444" />
            </mesh>

            {/* Power LED - bright green glow */}
            <mesh position={[-0.32, 0.28 + monH / 2 - 0.15, -monThick / 2 - 0.01]}>
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshLambertMaterial 
                color="#00ff00" 
                emissive="#00ff00" 
                emissiveIntensity={2.0}
                toneMapped={false}
              />
            </mesh>

            {/* ═══ CABLES going from back of monitor down into desk ═══ */}
            <mesh position={[-0.1, 0.12, -monThick / 2 - 0.03]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
              <meshLambertMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.06, 0.12, -monThick / 2 - 0.05]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
              <meshLambertMaterial color="#222222" />
            </mesh>
            <mesh position={[0, -0.01, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
              <meshLambertMaterial color="#1a1a1a" />
            </mesh>
          </group>
        );
      })()}

      {/* ═══ KEYBOARD (nearer the chair side, aligned with monitor) ═══ */}
      {(() => {
        const kbW = 0.75;
        const kbD = 0.28;
        const kbH = 0.02;
        const kbX = -topW / 2 + 0.18 + 0.85 / 2; // aligned to monitor X center
        const kbY = deskY + topH / 2 + kbH / 2 + 0.005;
        const kbZ = -0.15; // pushed toward chair side (-Z)
        return (
          <group position={[kbX, kbY, kbZ]} rotation={[0, 0.15, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[kbW, kbH, kbD]} />
              <meshLambertMaterial color="#2a2a2a" />
            </mesh>
            <mesh position={[0, kbH / 2 + 0.001, -0.01]}>
              <boxGeometry args={[kbW - 0.06, 0.003, kbD - 0.04]} />
              <meshLambertMaterial color="#333333" />
            </mesh>
            {[-0.08, -0.02, 0.04, 0.08].map((zOff, i) => (
              <mesh key={`row-${i}`} position={[0, kbH / 2 + 0.003, zOff]}>
                <boxGeometry args={[kbW - 0.1, 0.002, 0.035]} />
                <meshLambertMaterial color="#3a3a3a" />
              </mesh>
            ))}
            <mesh position={[0, kbH / 2 + 0.004, 0.1]}>
              <boxGeometry args={[0.25, 0.003, 0.035]} />
              <meshLambertMaterial color="#3d3d3d" />
            </mesh>
          </group>
        );
      })()}

      {/* ═══ PAPER PILES (right side, bigger & messier) ═══ */}
      {(() => {
        const surfY = deskY + topH / 2;
        const baseX = topW / 2 - 0.55;
        const baseZ = 0.05;
        const papers = [
          { w: 0.55, d: 0.42, h: 0.035, x: 0, z: 0, rot: 0.08, color: '#f5f2ec' },
          { w: 0.52, d: 0.40, h: 0.03, x: -0.06, z: 0.04, rot: -0.15, color: '#ebe8e0' },
          { w: 0.50, d: 0.38, h: 0.025, x: 0.05, z: -0.03, rot: 0.22, color: '#f0ede6' },
          { w: 0.48, d: 0.36, h: 0.02, x: -0.04, z: 0.06, rot: -0.1, color: '#f8f5ef' },
          { w: 0.53, d: 0.35, h: 0.028, x: 0.08, z: -0.05, rot: 0.35, color: '#edeae3' },
          { w: 0.45, d: 0.34, h: 0.018, x: -0.07, z: 0.02, rot: -0.28, color: '#f3f0ea' },
        ];
        let stackY = 0;
        return (
          <group position={[baseX, surfY, baseZ]}>
            {papers.map((p, i) => {
              const y = stackY + p.h / 2;
              stackY += p.h;
              return (
                <mesh key={`paper-${i}`} position={[p.x, y, p.z]} rotation={[0, p.rot, 0]} castShadow receiveShadow>
                  <boxGeometry args={[p.w, p.h, p.d]} />
                  <meshLambertMaterial color={p.color} />
                </mesh>
              );
            })}
          </group>
        );
      })()}

      {/* ═══ COFFEE MUG (shifted left per user request) ═══ */}
      {(() => {
        const surfY = deskY + topH / 2;
        const mugX = -0.25;
        const mugZ = -topD / 2 + 0.2; // chair side edge
        const mugR = 0.065;
        const mugH = 0.17;
        return (
          <group position={[mugX, surfY, mugZ]}>
            {/* Mug body — simple cylinder */}
            <mesh position={[0, mugH / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[mugR, mugR, mugH, 20]} />
              <meshLambertMaterial color="#f0ece4" />
            </mesh>
            {/* Handle — half-torus on the side */}
            <mesh position={[mugR + 0.025, mugH * 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.035, 0.01, 8, 12, Math.PI]} />
              <meshLambertMaterial color="#f0ece4" />
            </mesh>
            {/* Coffee inside */}
            <mesh position={[0, mugH - 0.01, 0]}>
              <cylinderGeometry args={[mugR - 0.006, mugR - 0.006, 0.004, 16]} />
              <meshLambertMaterial color="#2a1a0a" />
            </mesh>
          </group>
        );
      })()}

      {/* ═══ WATER BOTTLE (viewer side edge, +Z) ═══ */}
      {(() => {
        const surfY = deskY + topH / 2;
        const btlX = 0.6;
        const btlZ = topD / 2 - 0.18; // near front/viewer edge
        const btlR = 0.055;
        const btlH = 0.42;
        return (
          <group position={[btlX, surfY, btlZ]}>
            <mesh position={[0, btlH / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[btlR, btlR * 1.05, btlH, 16]} />
              <meshLambertMaterial color="#c8e8f8" transparent opacity={0.75} />
            </mesh>
            <mesh position={[0, btlH + 0.02, 0]} castShadow>
              <cylinderGeometry args={[btlR * 0.6, btlR * 0.7, 0.06, 12]} />
              <meshLambertMaterial color="#555555" />
            </mesh>
            <mesh position={[0, btlH - 0.02, 0]} castShadow>
              <cylinderGeometry args={[btlR * 0.55, btlR, 0.06, 12]} />
              <meshLambertMaterial color="#c8e8f8" transparent opacity={0.75} />
            </mesh>
            <mesh position={[0, btlH * 0.35, 0]}>
              <cylinderGeometry args={[btlR - 0.008, btlR - 0.005, btlH * 0.6, 12]} />
              <meshLambertMaterial color="#a0d4f0" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })()}

      {/* ═══ EXECUTIVE OFFICER METALLIC NAMEPLATE (center front of desk) ═══ */}
      {(() => {
        const surfY = deskY + topH / 2;
        const plateX = -0.05;
        const plateZ = topD / 2 - 0.16;
        return (
          <group position={[plateX, surfY, plateZ]} rotation={[-0.22, 0, 0]}>
            {/* Metallic desk stand base (low bottom feet) */}
            <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.76, 0.03, 0.10]} />
              <meshStandardMaterial
                color="#8a9098"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Dark metal backing frame */}
            <mesh position={[0, 0.08, 0.008]} castShadow>
              <boxGeometry args={[0.74, 0.13, 0.012]} />
              <meshStandardMaterial
                color="#1a1c20"
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>

            {/* Brushed silver face plate */}
            <mesh position={[0, 0.08, 0.018]} castShadow>
              <boxGeometry args={[0.70, 0.11, 0.008]} />
              <meshStandardMaterial
                color="#e2e6eb"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>

            {/* Gold/Brass corner accent pins */}
            {[-0.31, 0.31].map((xPin, idx) => (
              <mesh key={`pin-${idx}`} position={[xPin, 0.10, 0.024]}>
                <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}

            {/* Text: "AMIT KUMAR" (Placed cleanly at Z=0.032 in front of all metal surfaces) */}
            <Text
              position={[0, 0.08, 0.032]}
              fontSize={0.070}
              color="#050505"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
              fontWeight="900"
            >
              AMIT KUMAR
            </Text>
          </group>
        );
      })()}

      {/* ═══ DESK TOYS (front edge, bigger, Batman & Iron Man themed) ═══ */}
      {(() => {
        const surfY = deskY + topH / 2;
        const frontZ = topD / 2 - 0.2;
        return (
          <group>
            {/* ── Batman Figure (left-front) ── */}
            <group position={[-0.55, surfY, frontZ]}>
              {/* Base */}
              <mesh position={[0, 0.01, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.08, 0.02, 12]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
              {/* Legs */}
              <mesh position={[-0.025, 0.07, 0]} castShadow>
                <boxGeometry args={[0.04, 0.1, 0.05]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
              <mesh position={[0.025, 0.07, 0]} castShadow>
                <boxGeometry args={[0.04, 0.1, 0.05]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
              {/* Torso */}
              <mesh position={[0, 0.17, 0]} castShadow>
                <boxGeometry args={[0.1, 0.12, 0.07]} />
                <meshLambertMaterial color="#1c1c1c" />
              </mesh>
              {/* Belt (yellow) */}
              <mesh position={[0, 0.12, 0.036]} castShadow>
                <boxGeometry args={[0.1, 0.018, 0.006]} />
                <meshLambertMaterial color="#f0c040" />
              </mesh>
              {/* Arms */}
              <mesh position={[-0.07, 0.17, 0]} castShadow>
                <boxGeometry args={[0.03, 0.1, 0.04]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
              <mesh position={[0.07, 0.17, 0]} castShadow>
                <boxGeometry args={[0.03, 0.1, 0.04]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
              {/* Head */}
              <mesh position={[0, 0.26, 0]} castShadow>
                <boxGeometry args={[0.065, 0.065, 0.06]} />
                <meshLambertMaterial color="#1a1a1a" />
              </mesh>
              {/* Bat-ears */}
              <mesh position={[-0.025, 0.305, 0]} castShadow>
                <boxGeometry args={[0.012, 0.03, 0.012]} />
                <meshLambertMaterial color="#0a0a0a" />
              </mesh>
              <mesh position={[0.025, 0.305, 0]} castShadow>
                <boxGeometry args={[0.012, 0.03, 0.012]} />
                <meshLambertMaterial color="#0a0a0a" />
              </mesh>
              {/* Eyes (white slits) */}
              <mesh position={[-0.015, 0.265, 0.031]}>
                <boxGeometry args={[0.018, 0.008, 0.002]} />
                <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[0.015, 0.265, 0.031]}>
                <boxGeometry args={[0.018, 0.008, 0.002]} />
                <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
              </mesh>
              {/* Cape (back) */}
              <mesh position={[0, 0.14, -0.045]} castShadow>
                <boxGeometry args={[0.1, 0.2, 0.015]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
            </group>

            {/* ── Iron Man Figure (right-front) ── */}
            <group position={[0.4, surfY, frontZ - 0.03]}>
              {/* Base */}
              <mesh position={[0, 0.01, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.08, 0.02, 12]} />
                <meshLambertMaterial color="#222222" />
              </mesh>
              {/* Legs */}
              <mesh position={[-0.025, 0.07, 0]} castShadow>
                <boxGeometry args={[0.04, 0.1, 0.05]} />
                <meshLambertMaterial color="#8b1a1a" />
              </mesh>
              <mesh position={[0.025, 0.07, 0]} castShadow>
                <boxGeometry args={[0.04, 0.1, 0.05]} />
                <meshLambertMaterial color="#8b1a1a" />
              </mesh>
              {/* Torso */}
              <mesh position={[0, 0.17, 0]} castShadow>
                <boxGeometry args={[0.1, 0.12, 0.07]} />
                <meshLambertMaterial color="#cc2222" />
              </mesh>
              {/* Arc reactor (chest glow) */}
              <mesh position={[0, 0.18, 0.036]}>
                <cylinderGeometry args={[0.015, 0.015, 0.005, 10]} />
                <meshLambertMaterial color="#80dfff" emissive="#40c0ff" emissiveIntensity={2} />
              </mesh>
              {/* Arms */}
              <mesh position={[-0.07, 0.17, 0]} castShadow>
                <boxGeometry args={[0.03, 0.1, 0.04]} />
                <meshLambertMaterial color="#cc2222" />
              </mesh>
              <mesh position={[0.07, 0.17, 0]} castShadow>
                <boxGeometry args={[0.03, 0.1, 0.04]} />
                <meshLambertMaterial color="#cc2222" />
              </mesh>
              {/* Gold shoulder accents */}
              <mesh position={[-0.065, 0.215, 0]} castShadow>
                <boxGeometry args={[0.035, 0.02, 0.045]} />
                <meshLambertMaterial color="#d4a017" />
              </mesh>
              <mesh position={[0.065, 0.215, 0]} castShadow>
                <boxGeometry args={[0.035, 0.02, 0.045]} />
                <meshLambertMaterial color="#d4a017" />
              </mesh>
              {/* Head / Helmet */}
              <mesh position={[0, 0.26, 0]} castShadow>
                <boxGeometry args={[0.065, 0.065, 0.06]} />
                <meshLambertMaterial color="#cc2222" />
              </mesh>
              {/* Face plate (gold) */}
              <mesh position={[0, 0.255, 0.031]}>
                <boxGeometry args={[0.045, 0.04, 0.004]} />
                <meshLambertMaterial color="#d4a017" />
              </mesh>
              {/* Eyes (glowing white) */}
              <mesh position={[-0.012, 0.26, 0.034]}>
                <boxGeometry args={[0.014, 0.006, 0.002]} />
                <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
              </mesh>
              <mesh position={[0.012, 0.26, 0.034]}>
                <boxGeometry args={[0.014, 0.006, 0.002]} />
                <meshLambertMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
              </mesh>
            </group>
          </group>
        );
      })()}
    </group>
  );
}

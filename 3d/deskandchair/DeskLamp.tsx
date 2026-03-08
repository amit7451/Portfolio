'use client';

import { useState } from 'react';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Standalone desk lamp.
 * The white cylindrical button on the base is the on/off switch.
 * Uses emissive-only glow — zero GPU cost, no pointLight.
 */
export default function DeskLamp({
    position = [0, 0, 0] as [number, number, number],
    scale = 1,
}: {
    position?: [number, number, number];
    scale?: number;
}) {
    const [on, setOn] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    useCursor(btnHovered);

    return (
        <group position={position} scale={[scale, scale, scale]}>

            {/* ── Base plate ── */}
            <mesh castShadow={false} receiveShadow={false} position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.11, 0.13, 0.03, 20]} />
                <meshStandardMaterial color="#1e1e1e" roughness={0.5} metalness={0.7} />
            </mesh>

            {/* ── ON/OFF Button (white cylinder on base) ── */}
            <mesh
                castShadow={false}
                position={[0.04, 0.045, 0.06]}
                onClick={(e) => {
                    e.stopPropagation();
                    setOn((prev) => !prev);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setBtnHovered(true);
                }}
                onPointerOut={() => setBtnHovered(false)}
            >
                <cylinderGeometry args={[0.022, 0.022, 0.018, 14]} />
                <meshStandardMaterial
                    color={btnHovered ? '#ffffff' : on ? '#cccccc' : '#aaaaaa'}
                    emissive={on ? '#ffffff' : btnHovered ? '#aaaaaa' : '#000000'}
                    emissiveIntensity={on ? 0.8 : btnHovered ? 0.4 : 0}
                    roughness={0.2}
                    metalness={0.1}
                />
            </mesh>

            {/* ── Pole ── */}
            <mesh castShadow={false} position={[0, 0.24, 0]}>
                <cylinderGeometry args={[0.013, 0.016, 0.44, 10]} />
                <meshStandardMaterial color="#2e2e2e" roughness={0.4} metalness={0.7} />
            </mesh>

            {/* ── Elbow joint ── */}
            <mesh castShadow={false} position={[0, 0.46, 0]}>
                <sphereGeometry args={[0.022, 10, 10]} />
                <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* ── Arm ── */}
            <mesh castShadow={false} position={[0.12, 0.5, 0]} rotation={[0, 0, -0.45]}>
                <cylinderGeometry args={[0.01, 0.01, 0.26, 8]} />
                <meshStandardMaterial color="#2e2e2e" roughness={0.4} metalness={0.7} />
            </mesh>

            {/* ── Shade (open cone — DoubleSide so interior is visible) ── */}
            <mesh
                castShadow={false}
                position={[0.22, 0.45, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                <coneGeometry args={[0.12, 0.18, 18, 1, true]} />
                <meshStandardMaterial
                    color={on ? '#ffe9a0' : '#4a4a4a'}
                    emissive={on ? '#ffc832' : '#000000'}
                    emissiveIntensity={on ? 1.4 : 0}
                    roughness={0.55}
                    metalness={0.25}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* ── Bulb (inside shade) — the glow source ── */}
            <mesh position={[0.19, 0.45, 0]}>
                <sphereGeometry args={[0.028, 10, 10]} />
                <meshStandardMaterial
                    color={on ? '#fffde8' : '#666666'}
                    emissive={on ? '#ffdd44' : '#000000'}
                    emissiveIntensity={on ? 4.0 : 0}
                    roughness={0.05}
                    metalness={0}
                    toneMapped={false}
                />
            </mesh>

        </group>
    );
}

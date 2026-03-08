'use client';

import { Html, Text, useTexture, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CSSProperties, ChangeEvent, FormEvent, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import RisingLaserLines from './RisingLaserLines';
import WallText from './WallText';

interface ContactsRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function ContactsRoom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: ContactsRoomProps) {
  const groupRef = useRef<THREE.Group>(null);
  const basePlasterTexture = useTexture('/3d/wall/textures/plaster.jpg');
  const baseCeilingTexture = useTexture('/3d/wall/textures/ceiling_interior.jpg');
  const baseFloorTexture = useTexture('/3d/wall/textures/floor.jpg');

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

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, roomH / 2, backWallZ]}>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial map={wallTexture} color="#e8e4e0" roughness={0.9} metalness={0.02} />
      </mesh>

      <RisingLaserLines wallWidth={roomW} wallZ={backWallZ} />

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

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial map={floorTexture} color="#b8a88a" roughness={0.8} metalness={0.05} />
      </mesh>

      <mesh position={[0, roomH - 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <meshBasicMaterial map={ceilingTexture} color="#f5f5f5" side={THREE.DoubleSide} />
      </mesh>

      <WallText
        position={[0, roomH - 1.5, backWallZ + 0.1]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        color="#6b6560"
        text="CONTACT ME"
        fontSize={0.9}
        depth={0.06}
        roughness={0.85}
        metalness={0.05}
      />

      {/* Embedded Touchscreen Monitor aligned to the ProjectsRoom architecture */}
      <ContactBoard position={[0, 4.0, backWallZ + 0.1]} />

      {/* Only using 2 lights for performance instead of 5 */}
      <pointLight position={[0, roomH - 1, 0]} intensity={0.6} color="#ffffff" distance={15} decay={2} castShadow={false} />
      <pointLight position={[0, 4.0, 4]} intensity={0.4} color="#e0e8ff" distance={10} decay={2} />
    </group>
  );
}

// Sub-component mirroring ProjectBoard from ProjectsRoom
function ContactBoard({ position }: { position: [number, number, number] }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Custom hook to safely grab the portal root DOM element after mount
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = document.getElementById('html-portal-root');
    if (node) setPortalNode(node);
  }, []);

  const scroll = useScroll();
  const [currentOffset, setCurrentOffset] = useState(0);

  useFrame(() => {
    if (scroll.offset !== currentOffset) {
      setCurrentOffset(scroll.offset);
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('submitting');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to send message right now.');
      }

      setSubmitState('success');
      setSubmitMessage('Message sent successfully. I will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send message right now.';
      setSubmitState('error');
      setSubmitMessage(message);
    }
  };

  return (
    <group position={position}>
      <mesh castShadow={false}>
        <boxGeometry args={[16, 8, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Board surface */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[15.5, 7.5]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.5}
          metalness={0.1}
          emissive="#000000"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Title bar (styled like ProjectBoard title bar) */}
      <mesh position={[0, 3.4, 0.06]}>
        <planeGeometry args={[14.5, 0.7]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.8}
          metalness={0}
          transparent
          opacity={0.05}
        />
      </mesh>

      <Text
        position={[0, 3.4, 0.07]}
        fontSize={0.35}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        fontWeight="bold"
        letterSpacing={0.1}
      >
        INITIATE CONTACT SEQUENCE
      </Text>

      {/* Embedded Touchscreen UI */}
      {portalNode && currentOffset > 0.88 && (
        <Html
          position={[0, -0.6, 0.1]} // Lowered slightly within the taller board
          transform
          center
          distanceFactor={5.0} // Ideal balance for the wide board
          zIndexRange={[100, 0]}
          portal={{ current: portalNode }} // Injecting into the safe 2D root outside the Canvas!
        >
          <div
            ref={overlayRef}
            style={{
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "auto",
              opacity: currentOffset > 0.94 ? 1 : Math.max(0, (currentOffset - 0.88) * 16), // Quick fade in
              transition: 'opacity 0.1s linear',
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                background: 'rgba(10, 10, 10, 0.9)', // Darker translucent background
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '24px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                color: '#ffffff',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  style={{ ...inputStyle, fontSize: '20px', padding: '16px 20px', borderRadius: '12px' }}
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address"
                  style={{ ...inputStyle, fontSize: '20px', padding: '16px 20px', borderRadius: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  style={{ ...inputStyle, fontSize: '20px', padding: '16px 20px', borderRadius: '12px' }}
                />
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  style={{
                    ...inputStyle,
                    fontSize: '20px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: formData.projectType === '' ? 'rgba(255, 255, 255, 0.5)' : '#ffffff'
                  }}
                >
                  <option value="" disabled style={{ background: '#0a0a0a' }}>Select Project Type</option>
                  <option value="web" style={{ background: '#0a0a0a' }}>Web Application</option>
                  <option value="mobile" style={{ background: '#0a0a0a' }}>Mobile App</option>
                  <option value="3d" style={{ background: '#0a0a0a' }}>3D/WebXR Experience</option>
                  <option value="ai" style={{ background: '#0a0a0a' }}>AI Integration</option>
                  <option value="other" style={{ background: '#0a0a0a' }}>Other</option>
                </select>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell me about your vision..."
                style={{ ...inputStyle, fontSize: '20px', padding: '16px 20px', borderRadius: '12px', minHeight: '120px', resize: 'none' }}
              />

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                style={{
                  border: '2px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '16px',
                  padding: '18px',
                  fontWeight: 800,
                  fontSize: '22px',
                  letterSpacing: '3px',
                  color: '#00ffff',
                  textTransform: 'uppercase',
                  background: 'rgba(0, 255, 255, 0.1)',
                  cursor: submitState === 'submitting' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
                  marginTop: '10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.2)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.2)';
                }}
              >
                {submitState === 'submitting' ? 'Sending...' : 'Transmit Message'}
              </button>

              {submitMessage ? (
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: submitState === 'error' ? '#ff4d4d' : '#00ffaa',
                    textAlign: 'center',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {submitMessage}
                </div>
              ) : null}
            </form>
          </div>
        </Html>
      )}
    </group>
  );
}

const inputStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  fontWeight: 500,
  outline: 'none',
  color: '#ffffff',
  background: 'rgba(255, 255, 255, 0.05)',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  width: '100%',
};

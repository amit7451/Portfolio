'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function Character({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: CharacterProps) {
  const group = useRef<THREE.Group>(null);
  const { scene: characterModel, animations } = useGLTF('/model/char_Typing.glb');
  const { mixer, actions } = useAnimations(animations, group);

  // Animation state for subtle breathing/typing motion
  const animationState = useRef({
    time: 0,
    breathingPhase: 0,
    typingPhase: 0,
  });

  useEffect(() => {
    // Start typing animation if available
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
        firstAction.setLoop(THREE.LoopRepeat, Infinity);
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!group.current) return;

    animationState.current.time += delta;
    
    // Subtle breathing motion (very gentle)
    animationState.current.breathingPhase += delta * 0.8; // Slow breathing
    const breathingOffset = Math.sin(animationState.current.breathingPhase) * 0.002; // 2mm movement
    
    // Subtle typing micro-movements
    animationState.current.typingPhase += delta * 2.5; // Faster for typing rhythm
    const typingOffset = Math.sin(animationState.current.typingPhase * 3) * 0.001; // 1mm movement
    
    // Apply subtle animations to the character
    group.current.position.y = position[1] + breathingOffset;
    group.current.rotation.z = rotation[2] + typingOffset;
  });

  // Character positioning calculations
  const chairSeatY = 1.05; // From Chair.tsx - seat surface height
  const chairScale = 1.7; // From DeskGroup.tsx - chair scaling factor
  const characterScale = 1.8; // Character scaling to properly fit chair
  const scaledSeatHeight = chairSeatY * chairScale; // Actual scaled seat height
  const deskTopY = 1.58 * 1.8; // Desk scaled by 1.8
  const keyboardY = deskTopY + 0.04; // Keyboard height above desk

  // Anatomical positioning adjustments  
  const hipAdjustment = 0.0; // Keep at passed position level to align with chair seat
  const finalY = hipAdjustment; // Since we're positioning relative to passed position

  // Posture rotations (in radians) for natural typing position
  const forwardLean = -0.087; // 5 degrees forward torso lean
  const monitorRotation = -0.175; // 10 degrees rotation toward monitor (left side of desk)
  const headTilt = -0.175; // 10 degrees head down toward screen
  const shoulderRelax = 0.052; // 3 degrees shoulder inward rotation

  return (
    <group 
      ref={group} 
      position={[
        position[0], 
        position[1] + finalY, 
        position[2] + 0.8 // Position forward on chair seat to reach desk
      ]} 
      rotation={[
        rotation[0] + forwardLean, // Apply forward lean
        rotation[1] + monitorRotation, // Rotate toward monitor (left side)
        rotation[2]
      ]} 
      scale={scale}
    >
      {/* Character model with proper anatomical adjustments */}
      <group name="character-posture">
        {/* Main character model */}
        <primitive 
          object={characterModel} 
          castShadow 
          receiveShadow
          scale={1.0}
          position={[0, 0, 0]}
        />
        
        {/* Posture adjustment groups for fine-tuning */}
        <group name="upper-body" position={[0, 1.2, 0]} rotation={[forwardLean * 0.5, 0, shoulderRelax]}>
          {/* Upper body with shoulder relaxation */}
        </group>
        
        <group name="head-position" position={[0, 1.65, 0.1]} rotation={[headTilt, 0, 0]}>
          {/* Head tilted toward screen */}
        </group>
        
        <group name="arms-keyboard" position={[0, 1.1, 0.35]}>
          {/* Arms positioned for keyboard reach */}
          <group name="left-arm" position={[-0.2, 0, 0]} rotation={[0, 0.2, 0]} />
          <group name="right-arm" position={[0.2, 0, 0]} rotation={[0, -0.2, 0]} />
        </group>
      </group>

      {/* Feet positioning for stable floor contact */}
      <group name="feet-positioning" position={[0, -1.0, 0.1]}>
        <group name="left-foot" position={[-0.15, 0, 0]} rotation={[0, 0.1, 0]} />
        <group name="right-foot" position={[0.15, 0, 0]} rotation={[0, -0.1, 0]} />
      </group>
    </group>
  );
}

// Preload the model
useGLTF.preload('/model/char_Typing.glb');
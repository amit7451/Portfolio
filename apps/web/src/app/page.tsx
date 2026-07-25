'use client';

import dynamic from 'next/dynamic';
import { GlobalOverlay } from '../components/Loader';

// Dynamic import to avoid SSR issues with Three.js
const BuildingScene = dynamic(() => import('../three/scenes/BuildingScene'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <GlobalOverlay />
      {/* Hero Section - Full viewport 3D scene with scroll-driven building */}
      <main
        id="main-hero"
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
        }}
      >
        {/* 3D Building Scene — scroll-driven camera animation */}
        <BuildingScene />
      </main>
    </>
  );
}

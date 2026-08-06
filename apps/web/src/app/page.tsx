'use client';

import dynamic from 'next/dynamic';
import { GlobalOverlay } from '../components/Loader';
// Dynamic imports for zero initial bundle overhead
const BuildingScene = dynamic(() => import('../three/scenes/BuildingScene'), {
  ssr: false,
  loading: () => null,
});

const CertificationModal = dynamic(() => import('../components/CertificationModal'), {
  ssr: false,
});

const GitHubReadmeModal = dynamic(() => import('../components/GitHubReadmeModal'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <GlobalOverlay />
      <CertificationModal />
      <GitHubReadmeModal />
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

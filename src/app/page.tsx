'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const WallScene = dynamic(() => import('../../3d/wall/WallScene'), {
  ssr: false,
  loading: () => (
    <div
      className="hero-loading"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid #333',
            borderTop: '3px solid #c9a227',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px',
          }}
        />
        <p style={{ 
          fontSize: '14px', 
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#888'
        }}>
          Loading Scene
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      {/* Hero Section - Full viewport 3D scene */}
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
        {/* 3D Wall Scene */}
        <WallScene enableOrbitControls={false} />
      </main>
    </>
  );
}

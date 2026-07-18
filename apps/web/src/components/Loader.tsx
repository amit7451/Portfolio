'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface LoaderCardProps {
  message: string;
  progress?: number;
}

interface LoaderProps {
  message?: string;
  progress?: number;
}

export function LoaderCard({ message, progress }: LoaderCardProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(8, 8, 8, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '3px solid #2d2d2d',
          borderTop: '3px solid #c9a227',
          borderRadius: '50%',
          animation: 'loader-spin 1s linear infinite',
          margin: '0 auto 14px',
        }}
      />
      <p
        style={{
          margin: '0 0 4px',
          fontSize: '12px',
          letterSpacing: '1.6px',
          textTransform: 'uppercase',
          color: '#c8c8c8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {message}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: '#8f8f8f',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {typeof progress === 'number' ? `${Math.round(progress)}%` : 'Please wait...'}
      </p>
      <div style={{ marginTop: '12px', width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: (typeof progress === 'number' ? progress : 0) + '%', 
            height: '100%', 
            background: '#c9a227', 
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '2px'
          }} 
        />
      </div>
      <style>{`
        @keyframes loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function Loader({
  message = 'Loading Scene',
  progress,
}: LoaderProps) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <LoaderCard message={message} progress={progress} />
    </div>
  );
}

// A global overlay that combines both Next.js mounting and R3F asset loading into one seamless screen
export function GlobalOverlay() {
  const { progress, active } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Smooth out the progress so it never jumps backwards
  useEffect(() => {
    setSmoothProgress((prev) => {
      if (progress > prev) return progress;
      return prev;
    });
  }, [progress]);

  // Handle fade out when loading is done
  useEffect(() => {
    if (!active && smoothProgress >= 100) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 500); // Wait for fade transition
      return () => clearTimeout(timeout);
    }
  }, [active, smoothProgress]);

  if (!visible) return null;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a', // Solid black/dark gray to hide everything underneath
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <LoaderCard message="Loading 3D Assets" progress={smoothProgress} />
    </div>
  );
}

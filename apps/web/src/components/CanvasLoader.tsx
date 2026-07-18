'use client';

import { Html, useProgress } from '@react-three/drei';
import { LoaderCard } from './Loader';
import { useEffect, useState } from 'react';

interface CanvasLoaderProps {
  message?: string;
}

export default function CanvasLoader({
  message = 'Loading 3D Assets',
}: CanvasLoaderProps) {
  const { progress } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Smooth out the progress so it never jumps backwards and feels buttery smooth
  useEffect(() => {
    setSmoothProgress((prev) => {
      // If the new progress is higher, jump to it but we can use CSS transition on the UI if we want.
      // But mostly, prevent it from going backwards which causes the "jitter"
      if (progress > prev) {
        return progress;
      }
      return prev;
    });
  }, [progress]);

  return (
    <Html
      as="div"
      center
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'rgba(10, 10, 10, 0.9)', // Darker background to hide pop-in
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      <LoaderCard message={message} progress={smoothProgress} />
    </Html>
  );
}

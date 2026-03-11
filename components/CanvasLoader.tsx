'use client';

import { Html, useProgress } from '@react-three/drei';
import { LoaderCard } from './Loader';

interface CanvasLoaderProps {
  message?: string;
}

export default function CanvasLoader({
  message = 'Loading 3D Assets',
}: CanvasLoaderProps) {
  const { progress } = useProgress();

  return (
    <Html
      fullscreen
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'rgba(10, 10, 10, 0.35)',
      }}
    >
      <LoaderCard message={message} progress={progress} />
    </Html>
  );
}

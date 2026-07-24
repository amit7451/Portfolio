import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

// For 3D Canvas components
export function useResponsiveCanvas() {
  const { viewport, size } = useThree();
  
  const isMobile = size.width < BREAKPOINTS.mobile;
  const isTablet = size.width >= BREAKPOINTS.mobile && size.width < BREAKPOINTS.tablet;
  const isDesktop = size.width >= BREAKPOINTS.tablet;
  
  // Calculate a responsive scale factor based on standard desktop width
  const scaleFactor = Math.min(1, size.width / 1200);

  // Smooth interpolation helper
  // Map screen width from mobile (375px) to desktop (1200px)
  const mapLinear = (mobileVal: number, desktopVal: number) => {
    return THREE.MathUtils.mapLinear(
      THREE.MathUtils.clamp(size.width, 375, 1200),
      375,
      1200,
      mobileVal,
      desktopVal
    );
  };

  const aspectRatio = size.width / size.height;
  const isPortrait = aspectRatio < 1.0;

  return {
    isMobile,
    isTablet,
    isDesktop,
    scaleFactor,
    mapLinear,
    viewport,
    size,
    aspectRatio,
    isPortrait,
  };
}

// For 2D React DOM components outside the Canvas
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.mobile;
  const isTablet = windowSize.width >= BREAKPOINTS.mobile && windowSize.width < BREAKPOINTS.tablet;
  const isDesktop = windowSize.width >= BREAKPOINTS.tablet;

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}

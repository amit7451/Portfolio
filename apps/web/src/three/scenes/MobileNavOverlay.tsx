'use client';

import React, { useState, useEffect } from 'react';

const FLOOR_NAMES = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT'];

export default function MobileNavOverlay() {
  const [currentFloor, setCurrentFloor] = useState(0);

  useEffect(() => {
    // Listen for scroll updates to update current floor indicator
    const handleScroll = (e: any) => {
      // It's tricky to get exact floor without useScroll, but we can try to hook into the same navigationClicked event
      // Or we just provide simple navigation links and let the user click them.
    };
    
    // In a real app we might sync this with ScrollControls, but for now we'll just have clickable buttons
    // Actually NavigationController dispatches navigationClicked with targetPage.
    const handleNav = (e: any) => {
      setCurrentFloor(e.detail.targetPage);
    };

    window.addEventListener('navigationClicked', handleNav);
    return () => window.removeEventListener('navigationClicked', handleNav);
  }, []);

  const handleFloorClick = (targetIndex: number) => {
    setCurrentFloor(targetIndex);
    const event = new CustomEvent('navigationClicked', {
      detail: { targetPage: targetIndex },
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        padding: '10px 16px',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      {FLOOR_NAMES.map((name, index) => (
        <button
          key={index}
          onClick={() => handleFloorClick(index)}
          style={{
            background: currentFloor === index ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
            border: currentFloor === index ? '1px solid rgba(0, 255, 255, 0.5)' : '1px solid transparent',
            color: currentFloor === index ? '#00ffff' : '#aaaaaa',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

const FLOORS = [
  { name: 'HOME', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'PROJECTS', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { name: 'ABOUT', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: 'CONTACT', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function MobileNavOverlay() {
  const [currentFloor, setCurrentFloor] = useState(0);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (typeof e.detail?.targetPage === 'number') {
        setCurrentFloor(e.detail.targetPage);
      }
    };

    const handleFloorChange = (e: any) => {
      if (typeof e.detail?.floorIndex === 'number') {
        setCurrentFloor(e.detail.floorIndex);
      }
    };

    window.addEventListener('navigationClicked', handleNav);
    window.addEventListener('floorChanged', handleFloorChange);

    return () => {
      window.removeEventListener('navigationClicked', handleNav);
      window.removeEventListener('floorChanged', handleFloorChange);
    };
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
      className="bottom-nav-overlay"
      style={{
        position: 'fixed',
        bottom: 'max(16px, calc(12px + env(safe-area-inset-bottom, 0px)))',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        background: 'rgba(15, 18, 28, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 240, 255, 0.15)',
        zIndex: 99999,
        pointerEvents: 'auto',
        maxWidth: '92vw',
      }}
    >
      {FLOORS.map((item, index) => {
        const isActive = currentFloor === index;
        return (
          <button
            key={item.name}
            onClick={() => handleFloorClick(index)}
            aria-label={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isActive
                ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 180, 255, 0.15))'
                : 'transparent',
              border: isActive
                ? '1px solid rgba(0, 240, 255, 0.6)'
                : '1px solid transparent',
              color: isActive ? '#00ffff' : '#b0b8c4',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? '0 0 12px rgba(0, 240, 255, 0.3)' : 'none',
              touchAction: 'manipulation',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

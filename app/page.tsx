'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';

// Dynamic import to avoid SSR issues with Three.js
const BuildingScene = dynamic(() => import('../three/scenes/BuildingScene'), {
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
  const [rentraOpen, setRentraOpen] = useState(false);
  const [rentraClosing, setRentraClosing] = useState(false);
  const [gocabOpen, setGocabOpen] = useState(false);
  const [gocabClosing, setGocabClosing] = useState(false);
  const [pdfSuiteOpen, setPdfSuiteOpen] = useState(false);
  const [pdfSuiteClosing, setPdfSuiteClosing] = useState(false);

  const openRentra = useCallback(() => {
    setRentraClosing(false);
    setRentraOpen(true);
  }, []);

  const closeRentra = useCallback(() => {
    if (rentraClosing) return;
    setRentraClosing(true);
    setTimeout(() => {
      setRentraOpen(false);
      setRentraClosing(false);
    }, 300);
  }, [rentraClosing]);

  const openGocab = useCallback(() => {
    setGocabClosing(false);
    setGocabOpen(true);
  }, []);

  const closeGocab = useCallback(() => {
    if (gocabClosing) return;
    setGocabClosing(true);
    setTimeout(() => {
      setGocabOpen(false);
      setGocabClosing(false);
    }, 300);
  }, [gocabClosing]);

  const openPdfSuite = useCallback(() => {
    setPdfSuiteClosing(false);
    setPdfSuiteOpen(true);
  }, []);

  const closePdfSuite = useCallback(() => {
    if (pdfSuiteClosing) return;
    setPdfSuiteClosing(true);
    setTimeout(() => {
      setPdfSuiteOpen(false);
      setPdfSuiteClosing(false);
    }, 300);
  }, [pdfSuiteClosing]);

  useEffect(() => {
    window.addEventListener('open-rentra-popup', openRentra as EventListener);
    window.addEventListener('open-gocab-popup', openGocab as EventListener);
    window.addEventListener('open-pdfsuite-popup', openPdfSuite as EventListener);
    return () => {
      window.removeEventListener('open-rentra-popup', openRentra as EventListener);
      window.removeEventListener('open-gocab-popup', openGocab as EventListener);
      window.removeEventListener('open-pdfsuite-popup', openPdfSuite as EventListener);
    };
  }, [openRentra, openGocab, openPdfSuite]);

  // Lock scroll while any overlay is open
  useEffect(() => {
    if (rentraOpen || gocabOpen || pdfSuiteOpen) {
      document.body.style.overflow = 'hidden';
      // Block wheel events from reaching ScrollControls
      const block = (e: WheelEvent) => e.stopImmediatePropagation();
      window.addEventListener('wheel', block, { capture: true });
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('wheel', block, { capture: true });
      };
    }
  }, [rentraOpen, gocabOpen, pdfSuiteOpen]);

  return (
    <>
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

      {/* Rentra project overlay — rendered outside the canvas to avoid R3F namespace errors */}
      {rentraOpen && <RentraOverlay onClose={closeRentra} isClosing={rentraClosing} />}
      {gocabOpen && <GocabOverlay onClose={closeGocab} isClosing={gocabClosing} />}
      {pdfSuiteOpen && <PdfSuiteOverlay onClose={closePdfSuite} isClosing={pdfSuiteClosing} />}
    </>
  );
}

function RentraOverlay({ onClose, isClosing }: { onClose: () => void; isClosing: boolean }) {
  const [btnHovered, setBtnHovered] = useState<number | null>(null);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: isClosing ? 'rentraBgOut 0.3s ease-in forwards' : 'rentraBgIn 0.3s ease-out forwards',
      }}
    >
      {/* Popup panel — stop propagation so outside-click still works */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '70vw',
          aspectRatio: '16/9',
          maxHeight: '70vh',
          backgroundColor: '#050505',
          border: '2px solid #00d9ff',
          borderRadius: '18px',
          padding: '36px 40px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 0 0 1px #00d9ff33, 0 0 60px rgba(0,217,255,0.35), inset 0 0 40px rgba(168,85,247,0.1)',
          overflow: 'hidden',
          animation: isClosing ? 'rentraOut 0.3s ease-in forwards' : 'rentraIn 0.32s ease-out forwards',
        }}
      >
        {/* Neon corner accents */}
        <div style={{ position:'absolute', top:0, left:0, width:60, height:3, background:'linear-gradient(90deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', top:0, left:0, width:3, height:60, background:'linear-gradient(180deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:60, height:3, background:'linear-gradient(270deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:3, height:60, background:'linear-gradient(0deg,#a855f7,transparent)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #00d9ff',
            background: 'transparent',
            color: '#00d9ff',
            fontSize: '20px',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00d9ff'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00d9ff'; }}
        >
          ×
        </button>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <h2 style={{
            margin: '0 0 18px 0',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(18px, 2.2vw, 30px)',
            textShadow: '0 0 12px rgba(0,255,0,0.55)',
            letterSpacing: '0.02em',
          }}>
            Rentra – Flats &amp; Hostels Near You
          </h2>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Designed and developed a cross-platform rental marketplace enabling broker-free property discovery, listing, and booking near workplaces and colleges.',
              'Implemented authentication, database synchronization, live location tracking, dynamic distance computation, in-app payments (order creation & signature verification), and push notifications.',
              'Tech Stack: Flutter (Dart), Firebase (Auth, Firestore), Node.js Cloud Functions, Google Maps APIs, OneSignal, Cloudinary.',
            ].map((text, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: '10px',
                color: '#00d9ff',
                fontFamily: 'monospace',
                fontSize: 'clamp(12px, 1.4vw, 16px)',
                lineHeight: 1.75,
                marginBottom: '12px',
              }}>
                <span style={{ color: '#a855f7', flexShrink: 0, marginTop: '2px' }}>•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Icon buttons row */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '18px', flexShrink: 0 }}>
          {[
            { href: 'https://github.com/amit7451/Rentra', src: '/3d/ProjectRoom/images/github.png', alt: 'GitHub', bg: '#24292e', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://play.google.com/store/apps/details?id=com.rentra.app.rentra', src: '/3d/ProjectRoom/images/playstore.png', alt: 'Play Store', bg: '#01875f', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://linkedin.com/in/amit-devspace', src: '/3d/ProjectRoom/images/linkedin.png', alt: 'LinkedIn', bg: '#0a66c2', glow: '0 0 20px rgba(10,102,194,0.7)' },
          ].map(({ href, src, alt, bg, glow }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 'clamp(52px,6vw,80px)',
                height: 'clamp(52px,6vw,80px)',
                borderRadius: '18px',
                backgroundColor: bg,
                border: '2px solid #00d9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: btnHovered === i ? glow : 'none',
                transform: btnHovered === i ? 'scale(1.08)' : 'scale(1)',
              }}
              onMouseEnter={() => setBtnHovered(i)}
              onMouseLeave={() => setBtnHovered(null)}
            >
              <img src={src} alt={alt} style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rentraBgIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes rentraBgOut { from { opacity:1 } to { opacity:0 } }
        @keyframes rentraIn  { from { opacity:0; transform:scale(0.94) translateY(24px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes rentraOut { from { opacity:1; transform:scale(1) translateY(0) } to { opacity:0; transform:scale(0.94) translateY(20px) } }
      `}</style>
    </div>
  );
}

function GocabOverlay({ onClose, isClosing }: { onClose: () => void; isClosing: boolean }) {
  const [btnHovered, setBtnHovered] = useState<number | null>(null);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: isClosing ? 'rentraBgOut 0.3s ease-in forwards' : 'rentraBgIn 0.3s ease-out forwards',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '70vw',
          aspectRatio: '16/9',
          maxHeight: '70vh',
          backgroundColor: '#050505',
          border: '2px solid #00d9ff',
          borderRadius: '18px',
          padding: '36px 40px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 0 0 1px #00d9ff33, 0 0 60px rgba(0,217,255,0.35), inset 0 0 40px rgba(168,85,247,0.1)',
          overflow: 'hidden',
          animation: isClosing ? 'rentraOut 0.3s ease-in forwards' : 'rentraIn 0.32s ease-out forwards',
        }}
      >
        <div style={{ position:'absolute', top:0, left:0, width:60, height:3, background:'linear-gradient(90deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', top:0, left:0, width:3, height:60, background:'linear-gradient(180deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:60, height:3, background:'linear-gradient(270deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:3, height:60, background:'linear-gradient(0deg,#a855f7,transparent)' }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #00d9ff',
            background: 'transparent',
            color: '#00d9ff',
            fontSize: '20px',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#00d9ff'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00d9ff'; }}
        >
          ×
        </button>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <h2 style={{
            margin: '0 0 18px 0',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(18px, 2.2vw, 30px)',
            textShadow: '0 0 12px rgba(0,255,0,0.55)',
            letterSpacing: '0.02em',
          }}>
            goCab – Real-Time Cab Booking Web Application
          </h2>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Developed a full-stack cab booking platform supporting real-time ride requests, driver-passenger matching, and complete trip lifecycle management.',
              'Implemented secure authentication, dynamic fare calculation, ride status synchronization, route optimization using Google Maps APIs.',
              'Tech Stack: React.js, Node.js, Express.js, Google Maps APIs, WebSockets; deployed on Render; integrated OneSignal and Cloudinary.',
            ].map((text, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: '10px',
                color: '#00d9ff',
                fontFamily: 'monospace',
                fontSize: 'clamp(12px, 1.4vw, 16px)',
                lineHeight: 1.75,
                marginBottom: '12px',
              }}>
                <span style={{ color: '#a855f7', flexShrink: 0, marginTop: '2px' }}>•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '18px', flexShrink: 0 }}>
          {[
            { href: 'https://github.com/amit7451/goCab', src: '/3d/ProjectRoom/images/github.png', alt: 'GitHub', bg: '#24292e', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://gocab-1-frontend.onrender.com', src: '/3d/ProjectRoom/images/web.png', alt: 'Web', bg: '#0ea5e9', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://linkedin.com/in/amit-devspace', src: '/3d/ProjectRoom/images/linkedin.png', alt: 'LinkedIn', bg: '#0a66c2', glow: '0 0 20px rgba(10,102,194,0.7)' },
          ].map(({ href, src, alt, bg, glow }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 'clamp(52px,6vw,80px)',
                height: 'clamp(52px,6vw,80px)',
                borderRadius: '18px',
                backgroundColor: bg,
                border: '2px solid #00d9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: btnHovered === i ? glow : 'none',
                transform: btnHovered === i ? 'scale(1.08)' : 'scale(1)',
              }}
              onMouseEnter={() => setBtnHovered(i)}
              onMouseLeave={() => setBtnHovered(null)}
            >
              <img src={src} alt={alt} style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PdfSuiteOverlay({ onClose, isClosing }: { onClose: () => void; isClosing: boolean }) {
  const [btnHovered, setBtnHovered] = useState<number | null>(null);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: isClosing ? 'rentraBgOut 0.3s ease-in forwards' : 'rentraBgIn 0.3s ease-out forwards',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '70vw',
          aspectRatio: '16/9',
          maxHeight: '70vh',
          backgroundColor: '#050505',
          border: '2px solid #00d9ff',
          borderRadius: '18px',
          padding: '36px 40px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 0 0 1px #00d9ff33, 0 0 60px rgba(0,217,255,0.35), inset 0 0 40px rgba(168,85,247,0.1)',
          overflow: 'hidden',
          animation: isClosing ? 'rentraOut 0.3s ease-in forwards' : 'rentraIn 0.32s ease-out forwards',
        }}
      >
        <div style={{ position:'absolute', top:0, left:0, width:60, height:3, background:'linear-gradient(90deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', top:0, left:0, width:3, height:60, background:'linear-gradient(180deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:60, height:3, background:'linear-gradient(270deg,#a855f7,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:3, height:60, background:'linear-gradient(0deg,#a855f7,transparent)' }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #00d9ff',
            background: 'transparent',
            color: '#00d9ff',
            fontSize: '20px',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#00d9ff'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00d9ff'; }}
        >
          ×
        </button>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <h2 style={{
            margin: '0 0 18px 0',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(18px, 2.2vw, 30px)',
            textShadow: '0 0 12px rgba(0,255,0,0.55)',
            letterSpacing: '0.02em',
          }}>
            PDF Suite – Web-based PDF Processing Platform
          </h2>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Designed and developed a full-featured web application for performing common PDF operations such as merging, splitting, compressing, converting, rotating, extracting text, and applying password protection through a clean browser-based interface.',
              'Implemented modular API endpoints and service layers to handle PDF manipulation, image conversion, text extraction, and file processing with efficient temporary storage and validation pipelines.',
              'Integrated support for image-to-PDF and PDF-to-image conversion, Word document generation from extracted text, and configurable compression levels to optimize file size and performance.',
              'Tech Stack: FastAPI (Python), pypdf, pdfplumber, pdf2image, Pillow, python-docx, ReportLab, Docker, HTML/CSS/JS.',
            ].map((text, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: '10px',
                color: '#00d9ff',
                fontFamily: 'monospace',
                fontSize: 'clamp(12px, 1.4vw, 16px)',
                lineHeight: 1.75,
                marginBottom: '12px',
              }}>
                <span style={{ color: '#a855f7', flexShrink: 0, marginTop: '2px' }}>•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '18px', flexShrink: 0 }}>
          {[
            { href: 'https://github.com/amit7451/PDF_Suite', src: '/3d/ProjectRoom/images/github.png', alt: 'GitHub', bg: '#24292e', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://github.com/amit7451/PDF_Suite', src: '/3d/ProjectRoom/images/web.png', alt: 'Web', bg: '#0ea5e9', glow: '0 0 20px rgba(0,255,0,0.55)' },
            { href: 'https://linkedin.com/in/amit-devspace', src: '/3d/ProjectRoom/images/linkedin.png', alt: 'LinkedIn', bg: '#0a66c2', glow: '0 0 20px rgba(10,102,194,0.7)' },
          ].map(({ href, src, alt, bg, glow }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 'clamp(52px,6vw,80px)',
                height: 'clamp(52px,6vw,80px)',
                borderRadius: '18px',
                backgroundColor: bg,
                border: '2px solid #00d9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: btnHovered === i ? glow : 'none',
                transform: btnHovered === i ? 'scale(1.08)' : 'scale(1)',
              }}
              onMouseEnter={() => setBtnHovered(i)}
              onMouseLeave={() => setBtnHovered(null)}
            >
              <img src={src} alt={alt} style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

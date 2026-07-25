'use client';

import React from 'react';
import Link from 'next/link';

export default function GocabPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        html, body {
          position: static !important;
          overflow: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100vh !important;
          background: #050510 !important;
        }
        ::-webkit-scrollbar {
          display: block !important;
          width: 8px;
          background: #050510;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 4px;
        }
      `}} />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#050510',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(30, 86, 160, 0.2), transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(255, 214, 10, 0.12), transparent 45%)
        `,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#ffffff',
        padding: '2rem 1rem 4rem 1rem',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* Back button */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00d9ff',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.6rem 1.4rem',
              borderRadius: '30px',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              background: 'rgba(0, 217, 255, 0.05)',
              transition: 'all 0.2s ease',
              marginBottom: '2rem',
            }}
          >
            ← Return to 3D Portfolio
          </Link>

          {/* Header Banner */}
          <div style={{
            background: 'rgba(20, 25, 40, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(30, 86, 160, 0.4)',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(30, 86, 160, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1e56a0, #ffd60a)',
            }} />

            {/* Title & Tagline */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(30, 86, 160, 0.3)',
                color: '#ffd60a',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}>
                Web Application
              </span>
              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: 0,
                background: 'linear-gradient(135deg, #ffffff 30%, #ffd60a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                goCab — Real-Time Cab Booking Web Application
              </h1>
              <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: '#a0aab5',
                marginTop: '0.8rem',
                maxWidth: '750px',
                lineHeight: 1.5,
              }}>
                Full-stack cab booking platform supporting real-time ride requests, driver-passenger matching, fare calculations, and trip lifecycle management.
              </p>
            </div>

            {/* Project Banner Image */}
            <div style={{
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              marginBottom: '2.5rem',
            }}>
              <img
                src="/3d/ProjectRoom/images/goCab.webp"
                alt="goCab Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '520px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Action Buttons Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}>
              <a
                href="https://gocab-1-frontend.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '14px',
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                <img src="/3d/ProjectRoom/images/web.webp" alt="Web App" style={{ width: '22px', height: '22px' }} />
                Open Live Web App
              </a>

              <a
                href="https://github.com/amit7451/goCab"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '14px',
                  backgroundColor: '#24292e',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s',
                }}
              >
                <img src="/3d/ProjectRoom/images/github.webp" alt="GitHub" style={{ width: '22px', height: '22px' }} />
                GitHub Repository
              </a>

              <a
                href="https://linkedin.com/in/amit-devspace"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '14px',
                  backgroundColor: '#0a66c2',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(10, 102, 194, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                <img src="/3d/ProjectRoom/images/linkedin.webp" alt="LinkedIn" style={{ width: '22px', height: '22px' }} />
                LinkedIn Profile
              </a>
            </div>

            {/* Overview & Key Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem',
            }}>
              <div style={{
                background: 'rgba(10, 15, 25, 0.6)',
                borderRadius: '16px',
                padding: '1.8rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <h3 style={{ color: '#00d9ff', fontSize: '1.3rem', marginTop: 0, marginBottom: '1rem' }}>
                  💡 Project Overview
                </h3>
                <p style={{ color: '#b0b8c0', lineHeight: 1.7, margin: 0, fontSize: '1rem' }}>
                  Developed a full-stack cab booking platform supporting real-time ride requests, driver-passenger matching, fare estimations, and complete trip lifecycle management using WebSockets and Google Maps APIs.
                </p>
              </div>

              <div style={{
                background: 'rgba(10, 15, 25, 0.6)',
                borderRadius: '16px',
                padding: '1.8rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <h3 style={{ color: '#ffd60a', fontSize: '1.3rem', marginTop: 0, marginBottom: '1rem' }}>
                  ⚙️ Key Features
                </h3>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#b0b8c0', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  <li>Real-time driver-passenger location synchronization</li>
                  <li>Dynamic fare calculations based on route distance</li>
                  <li>Google Maps Directions & Places API integration</li>
                  <li>WebSockets push messaging for instant ride matching</li>
                </ul>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#a855f7', fontSize: '1.3rem', marginBottom: '1rem' }}>
                🛠️ Technologies Used
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['React.js', 'Node.js', 'Express.js', 'WebSockets', 'Google Maps APIs', 'Render Cloud', 'OneSignal', 'Cloudinary'].map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(14, 165, 233, 0.15)',
                      border: '1px solid rgba(14, 165, 233, 0.4)',
                      color: '#7dd3fc',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

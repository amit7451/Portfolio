'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

type Product = {
    id: string;
    title: string;
    priceUSD: number;
    priceINR: number;
    features: string[];
};

const products: Product[] = [
    {
        id: 'github',
        title: 'Github Repo',
        priceUSD: 10,
        priceINR: 900,
        features: ['Instant Access to Source Code', 'Detailed Documentation', 'Pre-configured Setup', 'Community Support'],
    },
    {
        id: 'react2d',
        title: 'React 2D Portfolio',
        priceUSD: 60,
        priceINR: 5000,
        features: ['Modern Responsive Design', 'Dark/Light Theme', 'Custom domain setup', 'Seamless Animations'],
    },
    {
        id: '3dportfolio',
        title: '3D Portfolio',
        priceUSD: 100,
        priceINR: 8000,
        features: ['Interactive 3D Environments', 'React Three Fiber & Drei', 'Performance Optimized', 'Scroll-driven Navigation'],
    },
    {
        id: 'fullcustom',
        title: 'Full Custom Portfolio',
        priceUSD: 120,
        priceINR: 10000,
        features: ['Bespoke 3D Assets', 'Advanced Shaders & Materials', 'Backend Integration', 'Priority Lifetime Support'],
    },
];

export default function ProductsPage() {
    const router = useRouter();

    const handleBuyNow = () => {
        // Navigate to the new contacts page
        router.push('/contact');
    };

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
                * {
                    scrollbar-width: auto !important;
                }
            `}} />
            <div style={{
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: '#050510',
                backgroundImage: `
                    radial-gradient(circle at 15% 50%, rgba(0, 80, 255, 0.15), transparent 40%),
                    radial-gradient(circle at 85% 30%, rgba(0, 200, 255, 0.1), transparent 40%)
                `,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#ffffff'
            }}>
                <Head>
                    <title>Portfolio Packages & Pricing</title>
                </Head>

                <div style={{
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 2rem'
                }}>

                    <div style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #00ffff, #0088ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px'
                        }}>
                            Choose Your Package
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '600px', margin: '0 auto' }}>
                            Select the perfect architecture for your next big impression. Elevate your personal brand with absolute precision.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        width: '100%',
                        maxWidth: '1200px',
                        zIndex: 10
                    }}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={handleBuyNow}
                                style={{
                                    background: 'rgba(20, 25, 40, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(0, 150, 255, 0.2)',
                                    borderRadius: '24px',
                                    padding: '2.5rem 2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 150, 255, 0.3)';
                                    e.currentTarget.style.border = '1px solid rgba(0, 255, 255, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
                                    e.currentTarget.style.border = '1px solid rgba(0, 150, 255, 0.2)';
                                }}
                            >
                                {/* Top accent line */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #00ffff, #0088ff)'
                                }} />

                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                                    {product.title}
                                </h2>

                                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00ffff' }}>${product.priceUSD}</span>
                                    <span style={{ fontSize: '1rem', color: '#808a95', fontWeight: 500 }}>(INR {product.priceINR})</span>
                                </div>

                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '0 0 2rem 0',
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} style={{
                                            color: '#b0b8c0',
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuyNow();
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#00cc66',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                        boxShadow: '0 4px 15px rgba(0, 204, 102, 0.4)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#00ff80';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 204, 102, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#00cc66';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 204, 102, 0.4)';
                                    }}
                                >
                                    BUY NOW
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Back button */}
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            marginTop: '4rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            padding: '0.8rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        ← Return to Terminal
                    </button>
                </div>
            </div>
        </>
    );
}

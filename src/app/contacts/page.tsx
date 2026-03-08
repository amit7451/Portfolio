'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function ContactsPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
    });
    const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitState('submitting');
        setSubmitMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.error || 'Unable to send message right now.');
            }

            setSubmitState('success');
            setSubmitMessage('Message sent successfully. I will get back to you soon.');
            setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to send message right now.';
            setSubmitState('error');
            setSubmitMessage(message);
        }
    };

    const inputStyle: React.CSSProperties = {
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '18px',
        fontWeight: 500,
        outline: 'none',
        color: '#ffffff',
        background: 'rgba(255, 255, 255, 0.05)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        width: '100%',
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
                    <title>Initiate Contact Sequence</title>
                </Head>

                <div style={{
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 2rem'
                }}>

                    <div style={{ textAlign: 'center', marginBottom: '2rem', zIndex: 10 }}>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #00ffff, #0088ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px'
                        }}>
                            INITIATE CONTACT SEQUENCE
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '600px', margin: '0 auto' }}>
                            Send me a transmission and let's craft your next robust digital application.
                        </p>
                    </div>

                    <div style={{
                        width: '100%',
                        maxWidth: '800px',
                        zIndex: 10
                    }}>
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                width: '100%',
                                background: 'rgba(10, 10, 10, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(0, 255, 255, 0.3)',
                                borderRadius: '24px',
                                padding: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Your Name"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.8)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Email Address"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.8)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.8)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                                />
                                <select
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        ...inputStyle,
                                        cursor: 'pointer',
                                        color: formData.projectType === '' ? 'rgba(255, 255, 255, 0.5)' : '#ffffff'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.8)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                                >
                                    <option value="" disabled style={{ background: '#0a0a0a' }}>Select Project Type</option>
                                    <option value="web" style={{ background: '#0a0a0a' }}>Web Application</option>
                                    <option value="mobile" style={{ background: '#0a0a0a' }}>Mobile App</option>
                                    <option value="3d" style={{ background: '#0a0a0a' }}>3D/WebXR Experience</option>
                                    <option value="ai" style={{ background: '#0a0a0a' }}>AI Integration</option>
                                    <option value="other" style={{ background: '#0a0a0a' }}>Other</option>
                                </select>
                            </div>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                placeholder="Tell me about your vision..."
                                style={{ ...inputStyle, minHeight: '160px', resize: 'vertical' }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.8)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                            />

                            <button
                                type="submit"
                                disabled={submitState === 'submitting'}
                                style={{
                                    border: '2px solid rgba(0, 255, 255, 0.5)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    fontWeight: 800,
                                    fontSize: '22px',
                                    letterSpacing: '3px',
                                    color: '#00ffff',
                                    textTransform: 'uppercase',
                                    background: 'rgba(0, 255, 255, 0.1)',
                                    cursor: submitState === 'submitting' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
                                    marginTop: '10px',
                                }}
                                onMouseEnter={(e) => {
                                    if (submitState !== 'submitting') {
                                        e.currentTarget.style.background = 'rgba(0, 255, 255, 0.2)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.2)';
                                }}
                            >
                                {submitState === 'submitting' ? 'Sending...' : 'Transmit Message'}
                            </button>

                            {submitMessage ? (
                                <div
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        color: submitState === 'error' ? '#ff4d4d' : '#00ffaa',
                                        textAlign: 'center',
                                        marginTop: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    {submitMessage}
                                </div>
                            ) : null}
                        </form>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        style={{
                            marginTop: '3rem',
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
                        ← Return to Products
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        style={{
                            marginTop: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#a0aab5',
                            padding: '0.5rem',
                            fontSize: '0.9rem',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </>
    );
}

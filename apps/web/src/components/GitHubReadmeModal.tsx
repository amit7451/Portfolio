'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GitHubReadmeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      if (!markdown) {
        setLoading(true);
        fetch('/api/github/readme')
          .then((res) => res.json())
          .then((data) => {
            if (data.markdown) {
              setMarkdown(data.markdown);
            } else {
              setMarkdown('Failed to load README.md');
            }
          })
          .catch(() => {
            setMarkdown('Failed to load README.md');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('openGithubReadme', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('openGithubReadme', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        opacity: 1,
        transition: 'opacity 0.2s ease',
        overflowY: 'auto',
        padding: '5vh 20px',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          background: 'rgba(20, 22, 28, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '40px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
            Loading README...
          </div>
        ) : (
          <div
            className="github-readme"
            style={{
              lineHeight: 1.6,
              fontSize: '16px',
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .github-readme h1 { font-size: 2em; border-bottom: 1px solid #333; padding-bottom: 0.3em; margin-top: 1em; margin-bottom: 16px; }
          .github-readme h2 { font-size: 1.5em; border-bottom: 1px solid #333; padding-bottom: 0.3em; margin-top: 1em; margin-bottom: 16px; }
          .github-readme h3 { font-size: 1.25em; margin-top: 1em; margin-bottom: 16px; }
          .github-readme img { max-width: 100%; border-radius: 6px; }
          .github-readme a { color: #58a6ff; text-decoration: none; }
          .github-readme a:hover { text-decoration: underline; }
          .github-readme p { margin-bottom: 16px; }
          .github-readme ul, .github-readme ol { padding-left: 2em; margin-bottom: 16px; }
          .github-readme pre { background: #161b22; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; }
          .github-readme code { font-family: ui-monospace, SFMono-Regular, monospace; background: rgba(255,255,255,0.1); padding: 0.2em 0.4em; border-radius: 3px; font-size: 85%; }
          .github-readme pre code { background: transparent; padding: 0; font-size: 100%; }
          .github-readme blockquote { border-left: 4px solid #3b434b; color: #8b949e; padding: 0 1em; margin: 0 0 16px 0; }
          .github-readme table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
          .github-readme table th, .github-readme table td { border: 1px solid #3b434b; padding: 6px 13px; }
          .github-readme table tr:nth-child(2n) { background-color: #161b22; }
        `}} />
      </div>
    </div>
  );
}

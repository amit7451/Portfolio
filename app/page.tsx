'use client';

// This file re-exports from src/app/page.tsx
// The root /app directory coexists due to OneDrive restoring it
// We simply re-export the same page to avoid 404
export { default } from '../src/app/page';

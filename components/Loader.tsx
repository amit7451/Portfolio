'use client';

interface LoaderCardProps {
  message: string;
  progress?: number;
}

interface LoaderProps {
  message?: string;
  progress?: number;
}

export function LoaderCard({ message, progress }: LoaderCardProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(8, 8, 8, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '3px solid #2d2d2d',
          borderTop: '3px solid #c9a227',
          borderRadius: '50%',
          animation: 'loader-spin 1s linear infinite',
          margin: '0 auto 14px',
        }}
      />
      <p
        style={{
          margin: '0 0 4px',
          fontSize: '12px',
          letterSpacing: '1.6px',
          textTransform: 'uppercase',
          color: '#c8c8c8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {message}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: '#8f8f8f',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {typeof progress === 'number' ? `${Math.round(progress)}%` : 'Please wait...'}
      </p>
      <style>{`
        @keyframes loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function Loader({
  message = 'Loading Scene',
  progress,
}: LoaderProps) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <LoaderCard message={message} progress={progress} />
    </div>
  );
}

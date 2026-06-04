import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found | Expert\'s MarketPulse',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '120px', textAlign: 'center', maxWidth: '600px' }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
        The market page you're looking for doesn't exist or has been moved. Head back to the homepage for the latest stock market insights.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: 'var(--primary)',
          color: '#fff',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'none',
          transition: 'background 0.2s ease',
        }}
      >
        ← Back to MarketPulse
      </Link>
    </div>
  );
}

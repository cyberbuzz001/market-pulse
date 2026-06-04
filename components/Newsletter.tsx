'use client';

export default function Newsletter() {
  return (
    <div className="glass" style={{
      maxWidth: '800px',
      margin: '60px auto 0',
      padding: '40px',
      textAlign: 'center',
      borderRadius: '24px',
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
      border: '1px solid rgba(59, 130, 246, 0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#f8fafc' }}>
        Never Miss a Market Move
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '1.1rem' }}>
        Get the latest NSE/BSE updates, IPO analysis, and company insights delivered straight to your inbox daily.
      </p>
      
      <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <input 
          type="email" 
          placeholder="Enter your email address" 
          required
          style={{
            flexGrow: 1,
            padding: '16px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.2)',
            color: '#fff',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button type="submit" style={{
          padding: '16px 32px',
          borderRadius: '50px',
          border: 'none',
          background: 'linear-gradient(to right, #3b82f6, #10b981)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          Subscribe
        </button>
      </form>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '16px' }}>
        Join 50,000+ smart investors. One email per day, before 8 AM IST.
      </p>
      <div style={{ marginTop: '24px' }}>
        <a href="https://t.me/expertsmarketpulse" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: '#0088cc',
          color: '#fff',
          borderRadius: '24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          textDecoration: 'none'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Join our Telegram Channel
        </a>
      </div>
    </div>
  );
}

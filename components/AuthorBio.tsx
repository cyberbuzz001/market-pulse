import Image from 'next/image';
import Link from 'next/link';

export default function AuthorBio() {
  return (
    <div className="glass" style={{ 
      marginTop: '60px', 
      padding: '32px', 
      display: 'flex', 
      gap: '24px', 
      alignItems: 'flex-start',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    }}>
      <Image 
        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80" 
        alt="AI Market Analyst - Expert's MarketPulse" 
        width={80}
        height={80}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
      />
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--foreground)' }}>AI Market Analyst</h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Expert's MarketPulse Research Desk</p>
        <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Expert's MarketPulse's proprietary AI Analyst synthesizes data from NSE/BSE filings, SEBI circulars, and macroeconomic reports to generate real-time, unbiased, and data-driven insights into the Indian stock market.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>About Our Methodology →</Link>
          <Link href="/disclaimer" style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'none' }}>Read Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}

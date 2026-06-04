export const metadata = {
  title: 'Newsletter Archive | Expert\'s MarketPulse',
  description: 'Read past editions of our daily market intelligence newsletter.',
};

export default function EmailArchive() {
  const archives = [
    { date: 'Jun 03, 2026', title: 'Markets Snap Winning Streak, IT Stocks Face Profit-Booking', readTime: '3 min read' },
    { date: 'Jun 02, 2026', title: 'Sensex Rallies 380 Points, Value Buying in Midcaps', readTime: '4 min read' },
    { date: 'Jun 01, 2026', title: 'June Market Outlook: RBI Policy & Monsoon Progress', readTime: '5 min read' },
    { date: 'May 31, 2026', title: 'Weekly Wrap: Nifty Consolidates, FII Outflows Continue', readTime: '4 min read' },
  ];

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Newsletter Archive</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Read through past editions of our exclusive 8 AM daily market digest.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {archives.map((issue, idx) => (
          <a key={idx} href="#" className="glass" style={{ 
            display: 'block', 
            padding: '24px', 
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'transform 0.2s, background 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{issue.date}</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{issue.readTime}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#3b82f6' }}>{issue.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}

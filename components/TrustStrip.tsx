export default function TrustStrip() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      margin: '0 auto 60px',
      maxWidth: '900px'
    }}>
      <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--foreground)' }}>50K+</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscribers</p>
      </div>
      <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--foreground)' }}>Daily</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Articles</p>
      </div>
      <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--foreground)' }}>500+</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Companies Tracked</p>
      </div>
      <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--foreground)' }}>Free</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Always</p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface Alert {
  date: string;
  authority: 'SEBI' | 'RBI' | 'NSE' | 'BSE';
  title: string;
  impact: 'High' | 'Medium' | 'Low';
}

export default function AlertsInteractive() {
  const alerts: Alert[] = [
    { date: 'Jun 03, 2026', authority: 'SEBI', title: 'New T+0 Settlement Framework Guidelines', impact: 'High' },
    { date: 'Jun 01, 2026', authority: 'RBI', title: 'Monetary Policy Committee (MPC) Meeting Schedule', impact: 'High' },
    { date: 'May 28, 2026', authority: 'NSE', title: 'Revision in Market Lot of Derivative Contracts', impact: 'Medium' },
    { date: 'May 25, 2026', authority: 'BSE', title: 'Listing of New SME Segment Securities', impact: 'Low' },
    { date: 'May 22, 2026', authority: 'SEBI', title: 'Advisory on Mutual Fund Direct Plan Disclosures', impact: 'Medium' },
    { date: 'May 18, 2026', authority: 'RBI', title: 'External Commercial Borrowings (ECB) Framework Update', impact: 'Low' },
  ];

  const [authorityFilter, setAuthorityFilter] = useState<string>('All');
  const [impactFilter, setImpactFilter] = useState<string>('All');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesAuthority = authorityFilter === 'All' || alert.authority === authorityFilter;
    const matchesImpact = impactFilter === 'All' || alert.impact === impactFilter;
    return matchesAuthority && matchesImpact;
  });

  const authorities = ['All', 'SEBI', 'RBI', 'NSE', 'BSE'];
  const impacts = ['All', 'High', 'Medium', 'Low'];

  const getAuthorityStyles = (auth: string) => {
    switch (auth) {
      case 'SEBI':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: 'var(--primary)' };
      case 'RBI':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--accent)' };
      default:
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' };
    }
  };

  return (
    <div>
      {/* Filters Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {/* Authority Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, width: '80px' }}>Authority:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {authorities.map((auth) => (
              <button
                key={auth}
                onClick={() => setAuthorityFilter(auth)}
                style={{
                  background: authorityFilter === auth ? 'var(--primary)' : 'var(--secondary)',
                  color: authorityFilter === auth ? '#fff' : 'var(--text-normal)',
                  border: '1px solid var(--glass-border)',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {auth}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, width: '80px' }}>Impact:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {impacts.map((imp) => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                style={{
                  background: impactFilter === imp ? 'var(--primary)' : 'var(--secondary)',
                  color: impactFilter === imp ? '#fff' : 'var(--text-normal)',
                  border: '1px solid var(--glass-border)',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredAlerts.length === 0 ? (
        <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No regulatory alerts match the selected filters.
        </div>
      ) : (
        <div className="grid">
          {filteredAlerts.map((alert, idx) => {
            const authStyles = getAuthorityStyles(alert.authority);
            return (
              <div key={idx} className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                    <span style={{ 
                      background: authStyles.bg, 
                      color: authStyles.text,
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      {alert.authority}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{alert.date}</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)', lineHeight: 1.4 }}>
                    {alert.title}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Market Impact:</span>
                  <span style={{ 
                    color: alert.impact === 'High' ? '#ef4444' : alert.impact === 'Medium' ? '#f59e0b' : 'var(--accent)',
                    fontWeight: 700 
                  }}>
                    {alert.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

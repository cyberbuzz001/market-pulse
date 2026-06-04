'use client';

import { useState } from 'react';

interface EarningsRow {
  company: string;
  date: string;
  estEPS: string;
  prevEPS: string;
  status: string;
}

export default function EarningsInteractive() {
  const earnings: EarningsRow[] = [
    { company: 'TCS', date: 'Jul 12, 2026', estEPS: '₹34.50', prevEPS: '₹32.10', status: 'Upcoming' },
    { company: 'HDFC Bank', date: 'Jul 15, 2026', estEPS: '₹22.80', prevEPS: '₹21.10', status: 'Upcoming' },
    { company: 'Infosys', date: 'Jul 18, 2026', estEPS: '₹18.40', prevEPS: '₹17.90', status: 'Upcoming' },
    { company: 'Reliance Industries', date: 'Jul 21, 2026', estEPS: '₹30.20', prevEPS: '₹28.50', status: 'Upcoming' },
    { company: 'ICICI Bank', date: 'Jul 23, 2026', estEPS: '₹16.50', prevEPS: '₹15.40', status: 'Upcoming' },
    { company: 'Tata Motors', date: 'Jul 25, 2026', estEPS: '₹12.80', prevEPS: '₹11.90', status: 'Upcoming' },
    { company: 'ITC', date: 'Jul 28, 2026', estEPS: '₹6.20', prevEPS: '₹5.80', status: 'Upcoming' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredEarnings = earnings.filter((row) =>
    row.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Filter */}
      <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Filter by company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            outline: 'none',
            fontSize: '0.9rem',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
        />
      </div>

      {/* Table */}
      <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary)' }}>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Company</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Result Date</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Estimated EPS</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Previous Q EPS</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEarnings.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No upcoming results found.
                </td>
              </tr>
            ) : (
              filteredEarnings.map((row, idx) => (
                <tr 
                  key={idx} 
                  style={{ 
                    borderBottom: '1px solid var(--glass-border)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--foreground)' }}>{row.company}</td>
                  <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>{row.date}</td>
                  <td style={{ padding: '18px 24px', color: 'var(--primary)', fontWeight: 700 }}>{row.estEPS}</td>
                  <td style={{ padding: '18px 24px', color: 'var(--text-muted)' }}>{row.prevEPS}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      background: 'rgba(245, 158, 11, 0.15)', 
                      color: '#f59e0b',
                      fontWeight: 700
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

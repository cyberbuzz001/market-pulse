'use client';

import { useState } from 'react';

interface Fund {
  name: string;
  category: 'Small Cap' | 'Mid Cap' | 'Flexi Cap' | 'Index';
  nav: number;
  r1y: number;
  r3y: number;
  r5y: number;
}

export default function MutualFundsInteractive() {
  const funds: Fund[] = [
    { name: 'Quant Small Cap Fund', category: 'Small Cap', nav: 245.50, r1y: 54.2, r3y: 42.1, r5y: 35.8 },
    { name: 'Nippon India Small Cap', category: 'Small Cap', nav: 175.20, r1y: 48.5, r3y: 38.2, r5y: 31.4 },
    { name: 'Parag Parikh Flexi Cap', category: 'Flexi Cap', nav: 75.40, r1y: 32.1, r3y: 22.5, r5y: 20.1 },
    { name: 'HDFC Mid-Cap Opportunities', category: 'Mid Cap', nav: 140.10, r1y: 41.2, r3y: 28.4, r5y: 24.2 },
    { name: 'SBI Nifty 50 Index Fund', category: 'Index', nav: 210.80, r1y: 22.5, r3y: 16.8, r5y: 14.5 },
    { name: 'Mirae Asset Large Cap Fund', category: 'Index', nav: 98.60, r1y: 19.4, r3y: 15.2, r5y: 13.8 },
    { name: 'Motilal Oswal Midcap Fund', category: 'Mid Cap', nav: 82.30, r1y: 46.1, r3y: 34.5, r5y: 28.9 },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'r1y' | 'r3y' | 'r5y' | 'nav'>('r1y');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'r1y' | 'r3y' | 'r5y' | 'nav') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredFunds = activeCategory === 'All'
    ? funds
    : funds.filter((f) => f.category === activeCategory);

  const sortedFunds = [...filteredFunds].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const categories = ['All', 'Small Cap', 'Mid Cap', 'Flexi Cap', 'Index'];

  return (
    <div>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'var(--primary)' : 'var(--secondary)',
              color: activeCategory === cat ? '#fff' : 'var(--text-normal)',
              border: '1px solid var(--glass-border)',
              padding: '10px 20px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== cat) e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat) e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Funds Table */}
      <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary)' }}>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Fund Name</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Category</th>
              
              <th 
                onClick={() => handleSort('nav')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                NAV {sortBy === 'nav' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>

              <th 
                onClick={() => handleSort('r1y')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                1Y Return {sortBy === 'r1y' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>

              <th 
                onClick={() => handleSort('r3y')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                3Y Return {sortBy === 'r3y' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>

              <th 
                onClick={() => handleSort('r5y')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                5Y Return {sortBy === 'r5y' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFunds.map((fund, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--foreground)' }}>{fund.name}</td>
                <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>{fund.category}</td>
                <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>₹{fund.nav.toFixed(2)}</td>
                <td style={{ padding: '18px 24px', color: 'var(--accent)', fontWeight: 700 }}>{fund.r1y}%</td>
                <td style={{ padding: '18px 24px', color: 'var(--accent)', fontWeight: 600 }}>{fund.r3y}%</td>
                <td style={{ padding: '18px 24px', color: 'var(--accent)', fontWeight: 600 }}>{fund.r5y}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

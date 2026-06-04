'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Sector {
  name: string;
  change: number;
  value: string;
  stocks: { symbol: string; name: string; price: string; change: string; isUp: boolean }[];
}

export default function MarketHeatmap() {
  const sectors: Sector[] = [
    {
      name: 'NIFTY BANK',
      change: 1.45,
      value: '51,200.40',
      stocks: [
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: '₹1,650.00', change: '+1.5%', isUp: true },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: '₹1,120.40', change: '+1.34%', isUp: true }
      ]
    },
    {
      name: 'NIFTY IT',
      change: -0.62,
      value: '38,450.15',
      stocks: [
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹4,105.10', change: '+2.8%', isUp: true },
        { symbol: 'INFY', name: 'Infosys Ltd.', price: '₹1,480.90', change: '+1.2%', isUp: true }
      ]
    },
    {
      name: 'NIFTY AUTO',
      change: 2.10,
      value: '22,870.90',
      stocks: [
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: '₹985.40', change: '-0.5%', isUp: false }
      ]
    },
    {
      name: 'NIFTY FMCG',
      change: -1.25,
      value: '54,120.30',
      stocks: [
        { symbol: 'ITC', name: 'ITC Ltd.', price: '₹425.60', change: '-1.8%', isUp: false }
      ]
    },
    {
      name: 'NIFTY ENERGY',
      change: 0.85,
      value: '34,910.40',
      stocks: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,985.40', change: '+3.2%', isUp: true }
      ]
    },
    {
      name: 'NIFTY PHARMA',
      change: 0.40,
      value: '19,250.70',
      stocks: [
        { symbol: 'SUNPHARMA', name: 'Sun Pharma (Mock)', price: '₹1,540.20', change: '+0.8%', isUp: true }
      ]
    }
  ];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const activeSector = selectedIdx !== null ? sectors[selectedIdx] : null;

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: 'var(--foreground)' }}>
        Sectoral Performance Heatmap
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Select a sector block to inspect constituent stocks and market weight details.
      </p>

      {/* Grid of Heat Blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {sectors.map((sector, idx) => {
          const isUp = sector.change >= 0;
          const bgIntensity = isUp 
            ? `rgba(16, 185, 129, ${Math.min(0.08 + Math.abs(sector.change) * 0.1, 0.45)})`
            : `rgba(239, 68, 68, ${Math.min(0.08 + Math.abs(sector.change) * 0.1, 0.45)})`;
          const textGlow = isUp ? 'var(--accent)' : '#ef4444';
          const borderGlow = selectedIdx === idx 
            ? (isUp ? '1px solid var(--accent)' : '1px solid #ef4444')
            : '1px solid var(--glass-border)';

          return (
            <div
              key={idx}
              onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
              style={{
                background: bgIntensity,
                border: borderGlow,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: selectedIdx === idx ? `0 0 15px ${bgIntensity}` : 'none'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                {sector.name}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '4px' }}>
                {sector.value}
              </div>
              <div style={{ color: textGlow, fontWeight: 800, fontSize: '0.9rem' }}>
                {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{sector.change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Details Constituency */}
      {activeSector && (
        <div style={{ 
          padding: '20px', 
          background: 'var(--secondary)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '12px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Top Constituents for {activeSector.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Select stock to Screener</span>
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {activeSector.stocks.map((stock) => (
              <Link 
                key={stock.symbol}
                href={`/search?q=${stock.symbol}`}
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--foreground)' }}>{stock.symbol}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{stock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>{stock.price}</div>
                  <div style={{ color: stock.isUp ? 'var(--accent)' : '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
                    {stock.change}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

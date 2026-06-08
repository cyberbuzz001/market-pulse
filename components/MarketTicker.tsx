'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MarketTicker() {
  const [liveData, setLiveData] = useState<Record<string, any>>({});
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Fetch live quotes immediately and poll every 10 seconds
    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        if (json.success && json.data) {
          setLiveData(json.data);
          setIsLive(true);
        }
      } catch (err) {
        console.error('Failed to fetch live quotes for ticker:', err);
      }
    };

    fetchLiveQuotes();
    const liveInterval = setInterval(fetchLiveQuotes, 10000);

    return () => {
      clearInterval(liveInterval);
    };
  }, []);

  // Fallback data if API is slow or fails
  const fallbackItems = [
    { name: 'RELIANCE', value: '2985.40', change: 92.30, percent: '3.20', isUp: true, q: 'RELIANCE' },
    { name: 'TCS', value: '4105.10', change: 112.50, percent: '2.80', isUp: true, q: 'TCS' },
    { name: 'HDFCBANK', value: '1650.00', change: 24.50, percent: '1.50', isUp: true, q: 'HDFCBANK' },
    { name: 'INFY', value: '1480.90', change: 17.55, percent: '1.20', isUp: true, q: 'INFY' },
    { name: 'ITC', value: '425.60', change: -7.80, percent: '-1.80', isUp: false, q: 'ITC' },
  ];

  const hasLiveData = Object.keys(liveData).length > 0;
  
  const tickerItems = hasLiveData 
    ? Object.values(liveData).map(item => ({
        name: item.symbol,
        value: item.price.toFixed(2),
        change: item.change,
        percent: item.percent.toFixed(2),
        isUp: item.isUp,
        q: item.symbol
      }))
    : fallbackItems;

  return (
    <div style={{
      background: 'var(--background)',
      borderBottom: '1px solid var(--glass-border)',
      color: 'var(--text-normal)',
      fontSize: '0.85rem',
      padding: '8px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100%',
      position: 'relative',
      zIndex: 200,
      transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
      display: 'flex',
      alignItems: 'center'
    }}>
      <span style={{
        background: 'var(--secondary)',
        borderRight: '1px solid var(--glass-border)',
        padding: '0 12px',
        fontSize: '0.75rem',
        fontWeight: 800,
        color: isLive ? 'var(--accent)' : 'var(--text-muted)',
        zIndex: 210,
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '12px',
        gap: '6px'
      }}>
        {isLive && (
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)',
            animation: 'pulse 2s infinite'
          }}></span>
        )}
        {isLive ? 'LIVE' : 'DELAYED'}
      </span>
      <div style={{
        display: 'flex',
        animation: 'ticker 30s linear infinite',
        gap: '40px',
        width: 'max-content'
      }}>
        {/* Render twice for infinite loop scroll */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <Link
            key={idx}
            href={`/search?q=${item.q}`}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              color: 'inherit',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; }}
          >
            <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{item.name}</span>
            <span>{item.value}</span>
            <span style={{ color: item.isUp ? 'var(--accent)' : '#ef4444', fontWeight: 600 }}>
              {item.isUp ? '▲' : '▼'} {Math.abs(parseFloat(item.percent))}%
            </span>
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

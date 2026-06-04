'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MarketTicker() {
  const [liveData, setLiveData] = useState<Record<string, any>>({});
  const [nifty, setNifty] = useState({ value: 23500.50, change: 125.30, percent: 0.54 });
  const [sensex, setSensex] = useState({ value: 77200.15, change: 450.80, percent: 0.59 });

  useEffect(() => {
    // Fetch live quotes immediately and poll every 10 seconds
    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        if (json.success && json.data) {
          setLiveData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch live quotes for ticker:', err);
      }
    };

    fetchLiveQuotes();
    const liveInterval = setInterval(fetchLiveQuotes, 10000);

    // Keep simulated indexes moving for visual effect
    const simInterval = setInterval(() => {
      setNifty(prev => ({
        ...prev,
        value: prev.value + (Math.random() * 10 - 5),
      }));
      setSensex(prev => ({
        ...prev,
        value: prev.value + (Math.random() * 30 - 15),
      }));
    }, 5000);

    return () => {
      clearInterval(liveInterval);
      clearInterval(simInterval);
    };
  }, []);

  const getTickerData = (symbol: string, defaultVal: string, defaultChange: number, defaultPercent: string) => {
    const live = liveData[symbol];
    if (live) {
      return {
        value: live.price.toFixed(2),
        change: live.change,
        percent: live.percent.toFixed(2),
        isUp: live.isUp
      };
    }
    return {
      value: defaultVal,
      change: defaultChange,
      percent: defaultPercent,
      isUp: defaultChange >= 0
    };
  };

  const rel = getTickerData('RELIANCE', '2985.40', 92.30, '3.20');
  const tcs = getTickerData('TCS', '4105.10', 112.50, '2.80');
  const hdfc = getTickerData('HDFCBANK', '1650.00', 24.50, '1.50');
  const infy = getTickerData('INFY', '1480.90', 17.55, '1.20');
  const itc = getTickerData('ITC', '425.60', -7.80, '1.80');

  const tickerItems = [
    { name: 'NIFTY 50', value: nifty.value.toFixed(2), change: nifty.change, percent: nifty.percent.toFixed(2), isUp: nifty.change >= 0, q: 'NIFTY' },
    { name: 'BSE SENSEX', value: sensex.value.toFixed(2), change: sensex.change, percent: sensex.percent.toFixed(2), isUp: sensex.change >= 0, q: 'SENSEX' },
    { name: 'BANK NIFTY', value: '51200.40', change: 210.50, percent: '0.41', isUp: true, q: 'BANKNIFTY' },
    { name: 'RELIANCE', value: rel.value, change: rel.change, percent: rel.percent, isUp: rel.isUp, q: 'RELIANCE' },
    { name: 'TCS', value: tcs.value, change: tcs.change, percent: tcs.percent, isUp: tcs.isUp, q: 'TCS' },
    { name: 'HDFCBANK', value: hdfc.value, change: hdfc.change, percent: hdfc.percent, isUp: hdfc.isUp, q: 'HDFCBANK' },
    { name: 'INFY', value: infy.value, change: infy.change, percent: infy.percent, isUp: infy.isUp, q: 'INFY' },
    { name: 'ITC', value: itc.value, change: itc.change, percent: itc.percent, isUp: itc.isUp, q: 'ITC' },
  ];

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
        color: 'var(--text-muted)',
        zIndex: 210,
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '12px'
      }}>
        SIMULATED
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
              {item.isUp ? '▲' : '▼'} {item.percent}%
            </span>
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

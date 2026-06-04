'use client';

import { useState, useEffect } from 'react';
import StockChart from './StockChart';
import BrokerOrderTicket from './BrokerOrderTicket';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
  isUp: boolean;
  mcap: string;
  pe: string;
  high52: string;
  low52: string;
  volume: string;
  yield: string;
  sector: string;
}

interface StockDetailsCardProps {
  stock: StockData;
}

export default function StockDetailsCard({ stock }: StockDetailsCardProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showOrderTicket, setShowOrderTicket] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_tracker');
    if (saved) {
      const list = JSON.parse(saved) as string[];
      setIsInWatchlist(list.includes(stock.symbol));
    }
  }, [stock.symbol]);

  const toggleWatchlist = () => {
    const saved = localStorage.getItem('portfolio_tracker');
    let list: string[] = saved ? JSON.parse(saved) : [];
    
    if (isInWatchlist) {
      list = list.filter((s) => s !== stock.symbol);
      setIsInWatchlist(false);
    } else {
      if (list.length >= 5) {
        alert('Watchlist is full! Remove a stock from the Portfolio Tracker first.');
        return;
      }
      list.push(stock.symbol);
      setIsInWatchlist(true);
    }
    localStorage.setItem('portfolio_tracker', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="glass" style={{ padding: '32px', marginBottom: '40px', background: 'rgba(30, 41, 59, 0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', background: 'var(--secondary)', color: 'var(--text-normal)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
            {stock.sector}
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', marginBottom: '4px', color: 'var(--foreground)' }}>
            {stock.name} <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>({stock.symbol})</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', marginRight: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--foreground)' }}>
              ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ color: stock.isUp ? 'var(--accent)' : '#ef4444', fontWeight: 700, fontSize: '1rem' }}>
              {stock.isUp ? '▲' : '▼'} {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percent.toFixed(2)}%)
            </div>
          </div>

          <button
            onClick={() => setShowOrderTicket(!showOrderTicket)}
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ⚡ Trade Now
          </button>

          <button
            onClick={toggleWatchlist}
            style={{
              background: isInWatchlist ? 'transparent' : 'var(--secondary)',
              color: isInWatchlist ? 'var(--primary)' : 'var(--text-normal)',
              border: '1px solid var(--glass-border)',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            {isInWatchlist ? '✓ Watching' : '+ Watchlist'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
        {/* Chart Column */}
        <div style={{ minWidth: '0' }}>
          <StockChart symbol={stock.symbol} color={stock.isUp ? 'var(--accent)' : '#ef4444'} />
        </div>

        {/* Stats Column */}
        <div className="glass" style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--foreground)', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Key Statistics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Market Cap', value: stock.mcap },
              { label: 'P/E Ratio', value: stock.pe },
              { label: '52-Week High', value: stock.high52, color: 'var(--accent)' },
              { label: '52-Week Low', value: stock.low52, color: '#ef4444' },
              { label: 'Volume (Avg)', value: stock.volume },
              { label: 'Dividend Yield', value: stock.yield }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                <span style={{ fontWeight: 600, color: stat.color || 'var(--foreground)' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-down Order Ticket Sheet */}
      {showOrderTicket && (
        <BrokerOrderTicket
          symbol={stock.symbol}
          price={stock.price}
          onClose={() => setShowOrderTicket(false)}
        />
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';

export default function PortfolioTracker() {
  const [stocks, setStocks] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [liveData, setLiveData] = useState<Record<string, any>>({});

  // Mock price generator for demo
  const getMockData = (symbol: string) => {
    // If we have live quote data, use it!
    if (liveData[symbol]) {
      const live = liveData[symbol];
      return {
        price: live.price,
        isUp: live.isUp,
        bigMove: Math.abs(live.percent) > 3 ? `${live.isUp ? '+' : ''}${live.percent.toFixed(2)}%` : null
      };
    }
    const hash = symbol.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const price = Math.abs(hash % 5000) + 100;
    const isUp = price % 2 === 0;
    // Simulate a "big move" for certain hash patterns
    const bigMove = (hash % 10) > 7 ? (isUp ? '+5.2%' : '-4.8%') : null;
    return { price, isUp, bigMove };
  };

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_tracker');
    if (saved) {
      setStocks(JSON.parse(saved));
    }

    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        if (json.success && json.data) {
          setLiveData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch live quotes for portfolio tracker:', err);
      }
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const addStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input && stocks.length < 5 && !stocks.includes(input.toUpperCase())) {
      const newStocks = [...stocks, input.toUpperCase()];
      setStocks(newStocks);
      localStorage.setItem('portfolio_tracker', JSON.stringify(newStocks));
      setInput('');
    }
  };

  const removeStock = (symbol: string) => {
    const newStocks = stocks.filter(s => s !== symbol);
    setStocks(newStocks);
    localStorage.setItem('portfolio_tracker', JSON.stringify(newStocks));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      width: isOpen ? '300px' : 'auto',
      transition: 'width 0.3s'
    }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #10b981)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
          📊 Portfolio Tracker
        </button>
      ) : (
        <div className="glass" style={{ padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', background: 'rgba(15, 23, 42, 0.95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Your Watchlist</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            {stocks.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Add up to 5 stocks to track.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stocks.map(stock => {
                  const { price, isUp, bigMove } = getMockData(stock);
                  return (
                    <li key={stock} style={{ display: 'flex', flexDirection: 'column', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{stock}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: isUp ? '#10b981' : '#ef4444', fontWeight: 600 }}>₹{price.toFixed(2)}</span>
                          <button onClick={() => removeStock(stock)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>×</button>
                        </div>
                      </div>
                      {bigMove && (
                        <div style={{ marginTop: '6px', fontSize: '0.8rem', color: isUp ? '#10b981' : '#ef4444', background: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                          ⚠️ Big Move Alert: {bigMove} today
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {stocks.length < 5 && (
            <form onSubmit={addStock} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: RELIANCE" 
                maxLength={10}
                style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Add</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

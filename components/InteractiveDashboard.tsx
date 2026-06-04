'use client';

import { useState, useEffect } from 'react';
import StockDetailsCard, { StockData } from './StockDetailsCard';

const stockDatabase: Record<string, StockData> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2985.40,
    change: 92.30,
    percent: 3.20,
    isUp: true,
    mcap: '₹20.20 Lakh Cr',
    pe: '28.4',
    high52: '₹3,024.90',
    low52: '₹2,220.30',
    volume: '5.8M',
    yield: '0.35%',
    sector: 'Conglomerate / Energy'
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    price: 4105.10,
    change: 112.50,
    percent: 2.80,
    isUp: true,
    mcap: '₹14.85 Lakh Cr',
    pe: '31.2',
    high52: '₹4,250.00',
    low52: '₹3,070.00',
    volume: '2.1M',
    yield: '1.20%',
    sector: 'Information Technology'
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1650.00,
    change: 24.50,
    percent: 1.50,
    isUp: true,
    mcap: '₹12.56 Lakh Cr',
    pe: '19.8',
    high52: '₹1,750.00',
    low52: '₹1,360.00',
    volume: '15.4M',
    yield: '1.15%',
    sector: 'Banking & Finance'
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1480.90,
    change: 17.55,
    percent: 1.20,
    isUp: true,
    mcap: '₹6.15 Lakh Cr',
    pe: '24.6',
    high52: '₹1,620.00',
    low52: '₹1,240.00',
    volume: '4.8M',
    yield: '2.40%',
    sector: 'Information Technology'
  },
  ITC: {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    price: 425.60,
    change: -7.80,
    percent: -1.80,
    isUp: false,
    mcap: '₹5.30 Lakh Cr',
    pe: '25.3',
    high52: '₹499.70',
    low52: '₹399.30',
    volume: '8.9M',
    yield: '3.75%',
    sector: 'FMCG / Conglomerate'
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1120.40,
    change: 14.80,
    percent: 1.34,
    isUp: true,
    mcap: '₹7.85 Lakh Cr',
    pe: '18.2',
    high52: '₹1,180.00',
    low52: '₹910.00',
    volume: '7.2M',
    yield: '0.89%',
    sector: 'Banking & Finance'
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    price: 985.40,
    change: -4.95,
    percent: -0.50,
    isUp: false,
    mcap: '₹3.27 Lakh Cr',
    pe: '16.4',
    high52: '₹1,065.00',
    low52: '₹540.00',
    volume: '6.4M',
    yield: '0.61%',
    sector: 'Automotive / EV'
  }
};

export default function InteractiveDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<Record<string, any>>({});

  // Poll live quotes
  useEffect(() => {
    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        if (json.success && json.data) {
          setLiveData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch live quotes for dashboard:', err);
      }
    };
    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Merge static DB with live dynamic data
  const getMergedStock = (symbol: string): StockData => {
    const base = stockDatabase[symbol];
    const live = liveData[symbol];
    if (base && live) {
      return {
        ...base,
        price: live.price,
        change: live.change,
        percent: live.percent,
        isUp: live.isUp
      };
    }
    return base;
  };

  const getLtpAndChange = (symbol: string, defaultLtp: string, defaultChange: string) => {
    const live = liveData[symbol];
    if (live) {
      return {
        ltp: live.price.toFixed(2),
        change: `${live.change >= 0 ? '+' : ''}${live.percent.toFixed(2)}%`
      };
    }
    return { ltp: defaultLtp, change: defaultChange };
  };

  const relData = getLtpAndChange('RELIANCE', '2985.40', '+3.2%');
  const tcsData = getLtpAndChange('TCS', '4105.10', '+2.8%');
  const hdfcData = getLtpAndChange('HDFCBANK', '1650.00', '+1.5%');
  const infyData = getLtpAndChange('INFY', '1480.90', '+1.2%');
  const itcData = getLtpAndChange('ITC', '425.60', '-1.8%');
  const tataData = getLtpAndChange('TATAMOTORS', '985.40', '-0.5%');

  const gainers = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', ltp: relData.ltp, change: relData.change },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', ltp: tcsData.ltp, change: tcsData.change },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', ltp: hdfcData.ltp, change: hdfcData.change },
    { symbol: 'INFY', name: 'Infosys Ltd.', ltp: infyData.ltp, change: infyData.change },
  ];

  const losers = [
    { symbol: 'ITC', name: 'ITC Ltd.', ltp: itcData.ltp, change: itcData.change },
    { symbol: 'WIPRO', name: 'Wipro Ltd. (Mock)', ltp: '450.20', change: '-1.2%' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India (Mock)', ltp: '12400.00', change: '-0.9%' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', ltp: tataData.ltp, change: tataData.change },
  ];

  const foActivity = [
    { instrument: 'NIFTY 23500 CE', volume: '2.5M', oi: '1.2M', trend: 'Long Buildup' },
    { instrument: 'BANKNIFTY 51000 PE', volume: '1.8M', oi: '0.9M', trend: 'Short Covering' },
    { instrument: 'RELIANCE 3000 CE', volume: '500K', oi: '250K', trend: 'Long Buildup' },
  ];

  const handleStockClick = (symbol: string) => {
    if (stockDatabase[symbol]) {
      setSelectedSymbol(symbol);
    } else {
      window.location.href = `/search?q=${symbol}`;
    }
  };

  const activeStock = selectedSymbol ? getMergedStock(selectedSymbol) : null;

  return (
    <div style={{ position: 'relative', minHeight: '60vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Gainers */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: 'var(--accent)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            Top Gainers (Nifty 50)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {gainers.map((stock, i) => (
              <li
                key={i}
                onClick={() => handleStockClick(stock.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="dashboard-row"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{stock.symbol}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{stock.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--foreground)' }}>₹{stock.ltp}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>{stock.change}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Losers */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: '#ef4444', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            Top Losers (Nifty 50)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {losers.map((stock, i) => (
              <li
                key={i}
                onClick={() => handleStockClick(stock.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{stock.symbol}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{stock.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--foreground)' }}>₹{stock.ltp}</span>
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>{stock.change}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* F&O Activity */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            F&O Highlights
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ paddingBottom: '16px', paddingLeft: '12px' }}>Instrument</th>
                  <th style={{ paddingBottom: '16px' }}>Volume</th>
                  <th style={{ paddingBottom: '16px' }}>Open Interest (OI)</th>
                  <th style={{ paddingBottom: '16px', paddingRight: '12px' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {foActivity.map((fo, i) => {
                  const underlying = fo.instrument.split(' ')[0];
                  return (
                    <tr
                      key={i}
                      onClick={() => handleStockClick(underlying)}
                      style={{
                        borderBottom: '1px solid var(--glass-border)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--foreground)' }}>{fo.instrument}</td>
                      <td style={{ padding: '16px 0', color: 'var(--text-normal)' }}>{fo.volume}</td>
                      <td style={{ padding: '16px 0', color: 'var(--text-normal)' }}>{fo.oi}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ 
                          background: fo.trend.includes('Long') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                          color: fo.trend.includes('Long') ? 'var(--accent)' : '#f59e0b',
                          padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700
                        }}>
                          {fo.trend}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Side Drawer Modal Overlay */}
      {activeStock && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: 5000,
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease'
        }}>
          {/* Backdrop Closer click target */}
          <div style={{ flexGrow: 1 }} onClick={() => setSelectedSymbol(null)} />

          {/* Drawer content box */}
          <div style={{
            width: '80%',
            maxWidth: '900px',
            height: '100%',
            background: 'var(--background)',
            borderLeft: '1px solid var(--glass-border)',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            padding: '40px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)' }}>Stock Overview</span>
              <button
                onClick={() => setSelectedSymbol(null)}
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--foreground)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.color = 'var(--foreground)'; }}
              >
                Close Drawer ✕
              </button>
            </div>

            <div style={{ flexGrow: 1 }}>
              <StockDetailsCard stock={activeStock} />
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

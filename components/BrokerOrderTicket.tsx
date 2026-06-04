'use client';

import { useState, useEffect } from 'react';

interface BrokerOrderTicketProps {
  symbol: string;
  price: number;
  onClose: () => void;
}

interface Portfolio {
  cash: number;
  holdings: Record<string, { quantity: number; avgPrice: number }>;
}

export default function BrokerOrderTicket({ symbol, price, onClose }: BrokerOrderTicketProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({ cash: 1000000, holdings: {} });
  const [qty, setQty] = useState<number>(10);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedBroker, setSelectedBroker] = useState<'Zerodha' | 'Groww' | 'AngelOne'>('Zerodha');
  const [tradeSuccess, setTradeSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('paper_portfolio');
    if (saved) {
      setPortfolio(JSON.parse(saved));
    } else {
      const initial = { cash: 1000000, holdings: {} };
      setPortfolio(initial);
      localStorage.setItem('paper_portfolio', JSON.stringify(initial));
    }
  }, []);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;

    const totalCost = price * qty;
    const currentHolding = portfolio.holdings[symbol] ? portfolio.holdings[symbol].quantity : 0;
    const currentAvg = portfolio.holdings[symbol] ? portfolio.holdings[symbol].avgPrice : 0;

    let nextCash = portfolio.cash;
    let nextHoldings = { ...portfolio.holdings };

    if (orderType === 'BUY') {
      if (portfolio.cash < totalCost) {
        alert('Insufficient cash balance to execute this simulated trade.');
        return;
      }
      nextCash -= totalCost;
      const nextQty = currentHolding + qty;
      const nextAvg = (currentHolding * currentAvg + totalCost) / nextQty;
      nextHoldings[symbol] = { quantity: nextQty, avgPrice: parseFloat(nextAvg.toFixed(2)) };
    } else {
      if (currentHolding < qty) {
        alert('Insufficient stock quantity in holdings to execute this simulated sell.');
        return;
      }
      nextCash += totalCost;
      const nextQty = currentHolding - qty;
      if (nextQty === 0) {
        delete nextHoldings[symbol];
      } else {
        nextHoldings[symbol] = { quantity: nextQty, avgPrice: currentAvg };
      }
    }

    const nextPortfolio = { cash: nextCash, holdings: nextHoldings };
    setPortfolio(nextPortfolio);
    localStorage.setItem('paper_portfolio', JSON.stringify(nextPortfolio));

    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      onClose();
    }, 1500);
  };

  const currentShares = portfolio.holdings[symbol] ? portfolio.holdings[symbol].quantity : 0;

  return (
    <div style={{
      background: 'var(--secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '20px',
      animation: 'slideUp 0.2s ease-out'
    }}>
      {tradeSuccess ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '8px' }}>✓</div>
          <h4 style={{ fontSize: '1.2rem', color: 'var(--foreground)', marginBottom: '4px' }}>Order Executed!</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Simulated {orderType} order for {qty} shares of {symbol} successful.</p>
        </div>
      ) : (
        <form onSubmit={handleOrder}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--foreground)' }}>Place Order (Paper Trading)</span>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1rem' }}>✕ Cancel</button>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #f59e0b',
            color: '#f59e0b',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ⚠️ VIRTUAL SIMULATION ONLY (No Real Capital Involved)
          </div>

          {/* Buy/Sell Toggles */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['BUY', 'SELL'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  background: orderType === t ? (t === 'BUY' ? 'var(--accent)' : '#ef4444') : 'rgba(0,0,0,0.2)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Broker Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>CHOOSE BROKER INTEGRATION</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Zerodha', 'Groww', 'AngelOne'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBroker(b)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: selectedBroker === b ? '1.5px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: selectedBroker === b ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: selectedBroker === b ? 'var(--primary)' : 'var(--text-normal)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Price */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>QUANTITY</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(0,0,0,0.2)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>LIMIT PRICE</label>
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', borderRadius: '6px', fontWeight: 700 }}>
                ₹{price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Paper Info */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-normal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Available Cash Balance:</span>
              <span style={{ fontWeight: 700 }}>₹{portfolio.cash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Current Holdings ({symbol}):</span>
              <span style={{ fontWeight: 700 }}>{currentShares} shares</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '6px', marginTop: '6px', fontSize: '0.85rem' }}>
              <span>Est. Order Value:</span>
              <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>₹{(price * qty).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Execute Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#fff',
              background: orderType === 'BUY' ? 'var(--accent)' : '#ef4444',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            Confirm Simulated {orderType} Order via {selectedBroker}
          </button>
        </form>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

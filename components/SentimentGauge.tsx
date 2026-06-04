'use client';

import { useEffect, useState } from 'react';

export default function SentimentGauge() {
  const [value, setValue] = useState(62.5); // Default: 62.5 (Greed)
  const [animatedVal, setAnimatedVal] = useState(0);

  useEffect(() => {
    // Animate needle on load
    const timer = setTimeout(() => {
      setAnimatedVal(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Convert score (0 - 100) to radians for needle angle (range: -180 deg to 0 deg)
  const angleDeg = -180 + (animatedVal / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Needle endpoint coordinates (origin: 100, 100, radius: 70)
  const needleX = 100 + 70 * Math.cos(angleRad);
  const needleY = 100 + 70 * Math.sin(angleRad);

  const getLabel = (val: number) => {
    if (val < 25) return { text: 'Extreme Fear 😨', color: '#ef4444' };
    if (val < 45) return { text: 'Fear 📉', color: '#f59e0b' };
    if (val < 55) return { text: 'Neutral ⚖️', color: 'var(--text-normal)' };
    if (val < 75) return { text: 'Greed 📈', color: 'var(--accent)' };
    return { text: 'Extreme Greed 🚀', color: '#10b981' };
  };

  const sentiment = getLabel(animatedVal);

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '280px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px', width: '100%', textAlign: 'left' }}>
        Market Sentiment
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', width: '100%', textAlign: 'left' }}>
        Fear & Greed Index calculated from index advances/declines and option chain open interest ratios.
      </p>

      <div style={{ position: 'relative', width: '200px', height: '110px' }}>
        <svg width="200" height="110" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Outer arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Value colored arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            style={{ opacity: 0.95 }}
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="10" fill="var(--foreground)" />

          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={needleX}
            y2={needleY}
            stroke="var(--foreground)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: sentiment.color }}>
          {animatedVal.toFixed(1)}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '2px' }}>
          {sentiment.text}
        </div>
      </div>
    </div>
  );
}

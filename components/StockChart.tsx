'use client';

import { useState, useRef, useEffect } from 'react';

interface ChartPoint {
  label: string;
  price: number;
}

interface StockChartProps {
  symbol: string;
  color?: string;
  onHoverPoint?: (point: ChartPoint | null) => void;
}

// Deterministic seedable random number generator to create mock stocks charts
function getMockChartData(symbol: string, timeframe: string): ChartPoint[] {
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  let pointsCount = 10;
  let startPrice = 100 + (hash % 4000);
  let drift = 0.02; // general growth trend
  
  if (timeframe === '1D') {
    pointsCount = 12;
    drift = -0.002; // intraday flat or down slightly
  } else if (timeframe === '1W') {
    pointsCount = 7;
    drift = 0.01;
  } else if (timeframe === '1M') {
    pointsCount = 15;
    drift = 0.03;
  } else if (timeframe === '1Y') {
    pointsCount = 24;
    drift = 0.25; // solid annual return
  }

  const data: ChartPoint[] = [];
  let currentPrice = startPrice;

  // Simple pseudo-random walk
  for (let i = 0; i < pointsCount; i++) {
    const factor = Math.sin(hash + i * 1.5) * 0.03; // wave variations
    const noise = Math.cos(hash * i + 3) * 0.01;
    const progress = i / (pointsCount - 1);
    
    currentPrice = currentPrice * (1 + drift / pointsCount + factor + noise);
    
    // Label generation
    let label = '';
    if (timeframe === '1D') {
      const hour = 9 + Math.floor(progress * 6);
      const min = Math.floor(progress * 60) % 60;
      label = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    } else if (timeframe === '1W') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      label = days[i % 7];
    } else if (timeframe === '1M') {
      label = `Day ${i + 1}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      label = months[i % 12] + (i >= 12 ? ' (H2)' : ' (H1)');
    }

    data.push({ label, price: parseFloat(currentPrice.toFixed(2)) });
  }

  return data;
}

export default function StockChart({ symbol, color = '#3b82f6', onHoverPoint }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const data = getMockChartData(symbol, timeframe);

  const prices = data.map((p) => p.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  const priceRange = maxPrice - minPrice || 1;

  // SVG parameters
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Generate SVG coordinates
  const getCoordinates = () => {
    return data.map((point, index) => {
      const x = paddingX + (index / (data.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
      return { x, y, label: point.label, price: point.price };
    });
  };

  const coords = getCoordinates();

  // Create SVG path string
  const getPathD = () => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, coord, idx) => {
      if (idx === 0) return `M ${coord.x} ${coord.y}`;
      // Smooth curve calculation
      const prev = coords[idx - 1];
      const cpX1 = prev.x + (coord.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (2 * (coord.x - prev.x)) / 3;
      const cpY2 = coord.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coord.x} ${coord.y}`;
    }, '');
  };

  // Create area path string for glowing fill
  const getAreaD = () => {
    const linePath = getPathD();
    if (!linePath) return '';
    return `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Find closest coordinate
    const distances = coords.map((c) => Math.abs(c.x - (mouseX * (width / rect.width))));
    const minDistance = Math.min(...distances);
    const closestIdx = distances.indexOf(minDistance);

    if (closestIdx !== -1) {
      setHoverIndex(closestIdx);
      setHoverPos({
        x: coords[closestIdx].x,
        y: coords[closestIdx].y,
      });
      if (onHoverPoint) {
        onHoverPoint(data[closestIdx]);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoverPos(null);
    if (onHoverPoint) {
      onHoverPoint(null);
    }
  };

  return (
    <div style={{ minHeight: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TREND HISTORY</span>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--secondary)', padding: '4px', borderRadius: '8px' }}>
          {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                background: timeframe === t ? 'var(--primary)' : 'transparent',
                color: timeframe === t ? '#fff' : 'var(--text-normal)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label={`Interactive pricing trend chart for ${symbol} displaying historical stock price ranges.`}
        >
          <desc>Interactive line chart displaying price variations for the symbol {symbol} across selected intervals.</desc>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--glass-border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={width - paddingX} y2={paddingY + chartHeight / 2} stroke="var(--glass-border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--glass-border)" />

          {/* Glowing Area Fill */}
          <path d={getAreaD()} fill={`url(#gradient-${symbol})`} />

          {/* Trend Line */}
          <path d={getPathD()} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Active Tracker Guide Line */}
          {hoverPos && (
            <line
              x1={hoverPos.x}
              y1={paddingY}
              x2={hoverPos.x}
              y2={height - paddingY}
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Data Points */}
          {coords.map((coord, idx) => (
            <circle
              key={idx}
              cx={coord.x}
              cy={coord.y}
              r={hoverIndex === idx ? 6 : 2}
              fill={hoverIndex === idx ? color : 'var(--background)'}
              stroke={color}
              strokeWidth="2"
              style={{ transition: 'r 0.1s' }}
            />
          ))}

          {/* Labels */}
          {coords.map((coord, idx) => {
            // Only draw a few x-labels to avoid clutter
            const stride = Math.ceil(coords.length / 5);
            if (idx % stride !== 0 && idx !== coords.length - 1) return null;
            return (
              <text
                key={idx}
                x={coord.x}
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-dim)"
              >
                {coord.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && hoverPos && (
          <div style={{
            position: 'absolute',
            top: `${(hoverPos.y / height) * 100 - 18}%`,
            left: `${(hoverPos.x / width) * 100}%`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--secondary)',
            border: '1px solid var(--glass-border)',
            padding: '6px 12px',
            borderRadius: '6px',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
            whiteSpace: 'nowrap',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{data[hoverIndex].label}</div>
            <div style={{ fontWeight: 700, color: 'var(--foreground)' }}>₹{data[hoverIndex].price.toLocaleString('en-IN')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

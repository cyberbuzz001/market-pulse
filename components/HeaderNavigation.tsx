'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function HeaderNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Market News', href: '/category/nse-bse-news' },
    { label: 'Company Insights', href: '/category/indian-company-insights' },
    { label: 'IPO Tracker', href: '/ipos' },
    { label: 'Mutual Funds', href: '/category/mutual-funds' },
    { label: 'Screener', href: '/search' }
  ];

  return (
    <header className="header glass container" style={{ marginTop: '0', borderRadius: '0 0 16px 16px', padding: '16px 24px', position: 'relative' }}>
      <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <a href="/" className="logo" style={{ flexShrink: 0 }}>Expert's MarketPulse</a>

        {/* Desktop Links - Hidden on Mobile via CSS in media queries */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search, Theme, & Hamburger Wrapper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          {/* Search Form */}
          <form action="/search" method="GET" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              name="q" 
              placeholder="Search..." 
              style={{
                padding: '8px 12px 8px 32px',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                outline: 'none',
                fontSize: '0.85rem',
                width: '140px',
                transition: 'width 0.3s, background-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.width = '180px'; }}
              onBlur={(e) => { e.currentTarget.style.width = '140px'; }}
            />
            <svg style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </form>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Hamburger Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hamburger-btn"
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              cursor: 'pointer',
              display: 'none',
              padding: '6px'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Slide Down Mobile Navigation Panel */}
      {isOpen && (
        <nav 
          className="mobile-nav" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid var(--glass-border)',
            animation: 'slideDownNav 0.2s ease-out forwards'
          }}
        >
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="nav-link" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px 4px', borderBottom: '1px solid rgba(255,255,255,0.02)', fontWeight: 600 }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Media Queries Styling block */}
      <style>{`
        @keyframes slideDownNav {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

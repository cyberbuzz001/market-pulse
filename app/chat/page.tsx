'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simple custom component to render markdown-like responses cleanly
function FormattedContent({ text }: { text: string }) {
  const lines = text.split('\n');
  let inList = false;
  const listItems: string[] = [];
  const renderedElements: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-normal)' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
          ))}
        </ul>
      );
      listItems.length = 0;
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      listItems.push(trimmed.substring(2));
    } else {
      if (inList) {
        flushList(idx);
      }

      if (trimmed.startsWith('### ')) {
        renderedElements.push(
          <h4 key={idx} style={{ fontSize: '1.15rem', color: 'var(--primary)', marginTop: '20px', marginBottom: '8px' }}>
            {trimmed.substring(4)}
          </h4>
        );
      } else if (trimmed.startsWith('## ')) {
        renderedElements.push(
          <h3 key={idx} style={{ fontSize: '1.35rem', color: 'var(--primary)', marginTop: '24px', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
            {trimmed.substring(3)}
          </h3>
        );
      } else if (trimmed.startsWith('# ')) {
        renderedElements.push(
          <h2 key={idx} style={{ fontSize: '1.6rem', color: 'var(--primary)', marginTop: '28px', marginBottom: '16px' }}>
            {trimmed.substring(2)}
          </h2>
        );
      } else if (trimmed) {
        // Simple bold replacements (**text**)
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        const inlineElements = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: 'var(--foreground)' }}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        renderedElements.push(
          <p key={idx} style={{ marginBottom: '14px', color: 'var(--text-normal)', lineHeight: '1.6' }}>
            {inlineElements}
          </p>
        );
      }
    }
  });

  if (inList) {
    flushList(lines.length);
  }

  return <div>{renderedElements}</div>;
}

export default function ChatTerminal() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'System initialized. Welcome to the MarketPulse intelligence terminal. Mentions of NSE tickers (e.g. RELIANCE, TCS, HDFCBANK, INFY, ITC, ICICIBANK, TATAMOTORS) will trigger real-time quote lookups from Angel One SmartAPI automatically.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Analyze RELIANCE',
    'TCS Support & Resistance',
    'Compare INFY vs TCS',
    'FMCG outlook & ITC levels',
    'Market summary today'
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to generate response.'}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection timed out. Please check your API credentials.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '85vh', paddingBottom: '60px' }}>
      <div className="ambient-glow"></div>
      
      <div className="container" style={{ maxWidth: '900px', paddingTop: '40px' }}>
        {/* Terminal Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: 'var(--foreground)' }}>
              AI Advisor <span style={{ color: 'var(--primary)' }}>Terminal</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gemini-powered financial insights backed by live Angel One data feeds.</p>
          </div>
          <Link href="/dashboard" className="btn-premium" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Chat Terminal Box */}
        <div className="glass" style={{
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '600px',
          overflow: 'hidden',
          background: 'rgba(6, 9, 14, 0.6)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Top Panel Banner */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Connection Status: STABLE
            </span>
          </div>

          {/* Message Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(0, 240, 255, 0.2)' : 'var(--glass-border)'}`,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '16px 20px',
                  color: 'var(--foreground)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: msg.role === 'user' ? 'var(--primary)' : 'var(--accent)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px'
                  }}>
                    {msg.role === 'user' ? 'Client' : 'MarketPulse Analyst'}
                  </div>
                  {msg.role === 'assistant' ? (
                    <FormattedContent text={msg.content} />
                  ) : (
                    <p style={{ color: 'var(--foreground)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'bouncePulse 1.2s infinite' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Querying Angel One feeds & analyzing portfolio...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Quick Suggestions */}
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-normal)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-normal)'; }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Inputs */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '12px',
              background: 'rgba(255,255,255,0.01)'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about RELIANCE, TCS, market trends..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-premium"
              style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', opacity: (isLoading || !input.trim()) ? 0.6 : 1 }}
            >
              Send ⚡
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes bouncePulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

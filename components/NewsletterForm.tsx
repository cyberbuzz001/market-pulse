'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [contact, setContact] = useState('');
  const [type, setType] = useState<'email' | 'whatsapp'>('email');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, type })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('Successfully subscribed to alerts!');
        setContact('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%' }}>
      <h3 style={{ color: 'var(--foreground)', marginBottom: '16px', fontSize: '1.25rem' }}>Subscribe to Live Alerts</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Get breaking market news and AI insights delivered straight to your inbox or WhatsApp.
      </p>

      {status === 'success' ? (
        <div style={{ color: 'var(--accent)', fontWeight: 600, padding: '16px', background: 'rgba(0,230,118,0.1)', borderRadius: '8px', textAlign: 'center' }}>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--secondary)', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setType('email')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: type === 'email' ? 'var(--primary)' : 'transparent',
                color: type === 'email' ? '#000' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setType('whatsapp')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: type === 'whatsapp' ? '#25D366' : 'transparent',
                color: type === 'whatsapp' ? '#000' : 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              WhatsApp
            </button>
          </div>

          <input
            type={type === 'email' ? 'email' : 'tel'}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={type === 'email' ? 'Enter your email address' : 'Enter WhatsApp number'}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
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
            disabled={status === 'loading'}
            className="btn-premium"
            style={{ width: '100%', padding: '12px', textAlign: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>

          {status === 'error' && (
            <div style={{ color: 'var(--negative)', fontSize: '0.85rem', textAlign: 'center', marginTop: '8px' }}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

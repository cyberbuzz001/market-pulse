'use client';

import { useState } from 'react';

export default function WhatsAppSubscription() {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['NSE/BSE News']);
  const [tier, setTier] = useState<'free' | 'premium'>('free');
  const [loading, setLoading] = useState(false);

  const topics = ['NSE/BSE News', 'Indian IPOs', 'Mutual Funds', 'Company Insights'];

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, topics: selectedTopics, tier }),
      });
      if (response.ok) {
        setStep(2);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection failed. Please check if your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '16px', background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.2)', marginBottom: '40px' }}>
      {step === 1 ? (
        <form onSubmit={handleSubscribe}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.75rem' }}>💬</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
              Get Instant WhatsApp Alerts
            </h3>
          </div>
          <p style={{ color: 'var(--text-normal)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Subscribe to receive morning index opening trends, regulatory alarms, and breaking stock alerts directly in your WhatsApp inbox at 8:45 AM IST daily.
          </p>

          {/* Tier Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 700 }}>
              CHOOSE SUBSCRIPTION TIER
            </label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div 
                onClick={() => setTier('free')}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: tier === 'free' ? '2px solid #25D366' : '1px solid var(--glass-border)',
                  background: tier === 'free' ? 'rgba(37, 211, 102, 0.05)' : 'var(--secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>Free Briefing</span>
                  <span style={{ fontSize: '0.8rem', color: '#25D366', fontWeight: 800 }}>FREE</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily morning updates containing Nifty trends and general corporate news.</p>
              </div>

              <div 
                onClick={() => setTier('premium')}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: tier === 'premium' ? '2px solid #25D366' : '1px solid var(--glass-border)',
                  background: tier === 'premium' ? 'rgba(37, 211, 102, 0.05)' : 'var(--secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tier === 'premium' ? '0 4px 15px rgba(37, 211, 102, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--foreground)' }}>Premium Group</span>
                  <span style={{ fontSize: '0.8rem', color: '#25D366', fontWeight: 800 }}>₹99 / Mo</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time WhatsApp group access for pre-market scans and instant regulatory updates.</p>
              </div>
            </div>
          </div>

          {/* Topics choice */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
              SELECT TOPICS OF INTEREST
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {topics.map((t) => {
                const isActive = selectedTopics.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTopic(t)}
                    style={{
                      background: isActive ? '#25D366' : 'var(--secondary)',
                      color: isActive ? '#fff' : 'var(--text-normal)',
                      border: '1px solid var(--glass-border)',
                      padding: '8px 16px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone field */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>+91</span>
              <input
                type="tel"
                required
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 54px',
                  borderRadius: '24px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#25D366',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '24px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.95rem',
                minWidth: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
              }}
            >
              {loading ? (
                <div style={{ width: '18px', height: '18px', border: '2.5px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                tier === 'free' ? 'Subscribe Now' : 'Pay ₹99 & Join'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0', animation: 'scaleUp 0.3s ease-out' }}>
          <div style={{ fontSize: '3rem', color: '#25D366', marginBottom: '12px' }}>✓</div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>
            {tier === 'free' ? 'Subscription Confirmed!' : 'Payment & Join Confirmed!'}
          </h4>
          <p style={{ color: 'var(--text-normal)', fontSize: '0.95rem', margin: 0 }}>
            {tier === 'free' 
              ? `You will receive daily morning briefing alerts on +91 ${phone} starting tomorrow.`
              : `Welcome to the Premium WhatsApp group! We have added +91 ${phone} and sent your receipt.`
            }
          </p>
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

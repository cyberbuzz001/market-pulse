'use client';

import { useState, useEffect } from 'react';

interface NotificationAlert {
  title: string;
  body: string;
  type: 'alert' | 'success' | 'info';
}

export default function PushNotifications() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeAlert, setActiveAlert] = useState<NotificationAlert | null>(null);

  const mockAlerts: NotificationAlert[] = [
    { title: '⚠️ RELIANCE Big Move', body: 'Reliance Industries surges +3.2% to ₹2,985.40, leading Nifty indices to new highs.', type: 'alert' },
    { title: '🔔 Swiggy IPO update', body: 'Swiggy Limited mainboard IPO opening dates announced. Current GMP stands at ₹120.', type: 'info' },
    { title: '💰 T+0 Settlement', body: 'SEBI rolls out real-time T+0 settlement guidelines for top 25 liquid NSE stocks.', type: 'success' },
    { title: '📈 Market Breakout', body: 'NIFTY 50 breaches crucial resistance at 23,600 with strong volume support.', type: 'success' }
  ];

  useEffect(() => {
    // Check if permission prompt was already dismissed
    const status = localStorage.getItem('push_notifications_status');
    if (!status) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Prompt appears after 5s
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const status = localStorage.getItem('push_notifications_status');
    if (status === 'allowed') {
      // Setup periodic simulated notifications
      const interval = setInterval(() => {
        const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
        setActiveAlert(randomAlert);

        // Auto dismiss alert after 5s
        setTimeout(() => {
          setActiveAlert(null);
        }, 6000);
      }, 30000); // Fires every 30 seconds

      return () => clearInterval(interval);
    }
  }, [showPrompt]);

  const handleAllow = () => {
    localStorage.setItem('push_notifications_status', 'allowed');
    setShowPrompt(false);
    
    // Fire initial success welcome notification
    setTimeout(() => {
      setActiveAlert({
        title: '🔔 Alerts Activated',
        body: 'You will receive real-time Indian stock market breaking news updates here.',
        type: 'success'
      });
      setTimeout(() => setActiveAlert(null), 5000);
    }, 1000);
  };

  const handleDismiss = () => {
    localStorage.setItem('push_notifications_status', 'dismissed');
    setShowPrompt(false);
  };

  return (
    <>
      {/* Top Banner Permission Prompt */}
      {showPrompt && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '480px',
          background: 'var(--secondary)',
          border: '1.5px solid var(--primary)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          animation: 'slideDownPrompt 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ minWidth: '0' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '4px' }}>
              Enable Market Alerts?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Get instant notifications of big market breakouts and SEBI alerts.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleAllow}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              Allow
            </button>
            <button
              onClick={handleDismiss}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--glass-border)',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Floating Corner Notification Toast */}
      {activeAlert && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 9999,
          width: '320px',
          background: 'var(--secondary)',
          borderLeft: `5px solid ${activeAlert.type === 'alert' ? '#ef4444' : activeAlert.type === 'success' ? 'var(--accent)' : 'var(--primary)'}`,
          borderTop: '1px solid var(--glass-border)',
          borderRight: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'pointer'
        }}
        onClick={() => setActiveAlert(null)}
        >
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)' }}>
            {activeAlert.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-normal)', lineHeight: 1.4 }}>
            {activeAlert.body}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDownPrompt {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

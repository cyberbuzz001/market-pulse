import { sql } from '@vercel/postgres';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for the admin page

export default async function AdminSubscribersPage() {
  let subscribers = [];
  let error = null;

  try {
    const data = await sql`SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 500`;
    subscribers = data.rows;
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--foreground)' }}>Subscribers Dashboard</h1>
        <Link href="/" className="btn-premium">Back to Site</Link>
      </div>

      <div className="glass" style={{ padding: '32px' }}>
        {error ? (
          <div style={{ color: 'var(--negative)' }}>
            Error fetching subscribers: {error}. Have you run the `/api/setup-db` route?
          </div>
        ) : subscribers.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No subscribers found.</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px 8px', color: 'var(--primary)' }}>ID</th>
                <th style={{ padding: '16px 8px', color: 'var(--primary)' }}>Contact</th>
                <th style={{ padding: '16px 8px', color: 'var(--primary)' }}>Type</th>
                <th style={{ padding: '16px 8px', color: 'var(--primary)' }}>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: any) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{sub.id}</td>
                  <td style={{ padding: '16px 8px', fontWeight: 600 }}>{sub.contact}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      background: sub.type === 'whatsapp' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(0, 240, 255, 0.1)',
                      color: sub.type === 'whatsapp' ? '#25D366' : 'var(--primary)'
                    }}>
                      {sub.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(sub.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

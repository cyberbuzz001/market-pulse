import IpoInteractive from '../../components/IpoInteractive';

export const metadata = {
  title: 'IPO Calendar | Expert\'s MarketPulse',
  description: 'Track open, upcoming, and closed IPOs in the Indian stock market.',
};

export default function IpoCalendar() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>IPO Calendar</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Track the latest mainboard IPOs, their grey market premiums (GMP), and subscription status. Click headers to sort.</p>

      <IpoInteractive />
    </div>
  );
}

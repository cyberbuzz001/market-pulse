import EarningsInteractive from '../../components/EarningsInteractive';

export const metadata = {
  title: 'Earnings Calendar | Expert\'s MarketPulse',
  description: 'Upcoming quarterly results and earnings estimates for Indian companies.',
};

export default function EarningsCalendar() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>Earnings Calendar</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Track Q1 FY27 quarterly results schedules and EPS estimates.</p>

      <EarningsInteractive />
    </div>
  );
}

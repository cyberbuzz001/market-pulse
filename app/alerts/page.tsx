import AlertsInteractive from '../../components/AlertsInteractive';

export const metadata = {
  title: 'Regulatory Alerts | Expert\'s MarketPulse',
  description: 'Latest SEBI circulars, RBI policy dates, and exchange notices.',
};

export default function RegulatoryAlerts() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>Regulatory Alerts</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Stay compliant and informed with the latest updates from SEBI, RBI, NSE, and BSE.</p>

      <AlertsInteractive />
    </div>
  );
}

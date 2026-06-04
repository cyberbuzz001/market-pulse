import MutualFundsInteractive from '../../components/MutualFundsInteractive';

export const metadata = {
  title: 'Mutual Fund Explorer | Expert\'s MarketPulse',
  description: 'Explore top performing mutual funds in India across various categories.',
};

export default function MutualFundsExplorer() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>Mutual Fund Explorer</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Compare NAVs and historical returns across top-performing Equity Mutual Funds. Click column headers to sort by return rates.</p>

      <MutualFundsInteractive />
    </div>
  );
}

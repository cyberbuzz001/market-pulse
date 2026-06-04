import InteractiveDashboard from '../../components/InteractiveDashboard';
import MarketHeatmap from '../../components/MarketHeatmap';
import SentimentGauge from '../../components/SentimentGauge';

export const metadata = {
  title: 'Market Dashboard | Expert\'s MarketPulse',
  description: 'Live indices, top gainers/losers, and F&O activity at a glance.',
};

export default function Dashboard() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>Market Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Your one-glance view of Dalal Street\'s pulse. Click on any stock or heatmap sector to view historical trends and key statistics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <MarketHeatmap />
        </div>
        <div>
          <SentimentGauge />
        </div>
      </div>

      <InteractiveDashboard />
    </div>
  );
}

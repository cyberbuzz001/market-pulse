export const metadata = {
  title: 'About Us | Expert\'s MarketPulse',
  description: 'Learn about Expert\'s MarketPulse, India\'s premier automated stock market intelligence portal delivering NSE/BSE updates and company analysis.',
};

export default function About() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>About Expert's MarketPulse</h1>
        <div className="prose">
          <p>
            Welcome to <strong>Expert's MarketPulse</strong>, India's premier destination for real-time stock market insights, deep-dive company analysis, and comprehensive coverage of the NSE and BSE.
          </p>
          <p>
            Our mission is to empower retail investors, financial professionals, and market enthusiasts with highly accurate, data-driven, and unbiased news. In a market flooded with noise, we provide clarity.
          </p>
          <p>
            As a technology-driven publication, we leverage advanced market data algorithms alongside expert editorial review to distill complex corporate earnings, IPO filings, and regulatory updates into readable and actionable analyses.
          </p>
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>What We Cover</h2>
          <ul>
            <li><strong>NSE & BSE Updates:</strong> Daily market movements, index tracking, and broad market sentiments.</li>
            <li><strong>Company Insights:</strong> In-depth fundamental analysis and strategic shifts of Indian conglomerates.</li>
            <li><strong>Indian IPOs:</strong> Comprehensive coverage of upcoming primary market listings.</li>
            <li><strong>Mutual Funds:</strong> Guidance on passive and active investing strategies.</li>
            <li><strong>Global Economy:</strong> How international macroeconomic factors impact Dalal Street.</li>
          </ul>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>YMYL Compliance & Editorial Integrity</h2>
          <p>
            We strictly adhere to the highest standards of financial journalism. We do not offer personal advisory services or recommend individual trades. 
          </p>
          
          <div style={{ marginTop: '24px', padding: '20px', borderLeft: '4px solid var(--primary)', background: 'var(--secondary)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--foreground)' }}>SEBI Regulatory Disclaimer</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Expert's MarketPulse is an independent financial education portal. We are NOT a SEBI-registered investment advisor. Under no circumstances does any information posted on this site represent a recommendation to buy or sell securities. Investments in the securities market are subject to market risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

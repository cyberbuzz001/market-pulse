export const metadata = {
  title: 'Disclaimer & Terms of Use | Expert\'s MarketPulse',
  description: 'Comprehensive disclaimer covering investment risks, AI-generated content disclosure, and terms of use for Expert\'s MarketPulse.',
};

export default function Disclaimer() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Disclaimer &amp; Terms of Use</h1>
        <div className="prose">
          <p>Effective Date: June 3, 2026</p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Investment Risk Disclaimer</h2>
          <div style={{ padding: '20px', borderLeft: '4px solid #ef4444', background: 'var(--secondary)', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>WARNING: Investment in the securities market are subject to market risks. Read all related documents carefully before investing.</p>
            <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Past performance is not indicative of future results. The value of investments and the income derived from them can go down as well as up. You may not get back the amount you originally invested. Changes in exchange rates may also cause the value of investments to fluctuate. There is no guarantee that any forecasts or projections will be realised.
            </p>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Trading in equities, derivatives, futures, options, mutual funds, and other financial instruments involves substantial risk of loss and is not suitable for every investor. The high degree of leverage associated with futures and options can work against you as well as for you. Before deciding to invest, you should carefully consider your investment objectives, level of experience, and risk appetite. You should be aware of all the risks associated with trading and seek advice from an independent certified financial advisor if you have any doubts.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>AI-Generated Content Disclosure</h2>
          <div style={{ padding: '20px', borderLeft: '4px solid #f59e0b', background: 'var(--secondary)', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>IMPORTANT: The content on Expert&apos;s MarketPulse is generated using artificial intelligence and automated systems.</p>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            All articles, analyses, market summaries, and reports published on this website are produced by automated AI-driven systems. While we strive for accuracy and timeliness, AI-generated content may contain errors, omissions, outdated information, or inaccuracies. The AI models used may not capture all market nuances, breaking developments, or regulatory changes in real-time.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            No human editorial review is performed on every piece of content before publication. Readers should independently verify all information before making any financial decisions. Expert&apos;s MarketPulse, its operators, and its technology providers shall not be held liable for any inaccuracies or losses resulting from reliance on AI-generated content.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>No Investment Advisory</h2>
          <div style={{ padding: '20px', borderLeft: '4px solid #3b82f6', background: 'var(--secondary)', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>Expert&apos;s MarketPulse is NOT registered with SEBI as a Research Analyst or Investment Advisor.</p>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            The information and content provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the website&apos;s content as such. Expert&apos;s MarketPulse does not recommend that any financial instrument should be bought, sold, or held by you. Nothing on this website should be construed as an offer, recommendation, or solicitation to buy or sell any security or financial product.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            We do not provide personalised recommendations. Any reference to specific securities, asset classes, or financial markets is purely for educational and informational purposes. Registration granted by SEBI, membership of BASL, and certification from NISM in no way guarantee performance of any intermediary or provide any assurance of returns to investors.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Limitation of Liability</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Under no circumstances shall Expert&apos;s MarketPulse, its founders, employees, technology providers, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this website, its content, or any linked third-party websites. This includes, but is not limited to, any losses, damages, or claims arising from trading or investment decisions made based on the content of this website.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Third-Party Links</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            This website may contain links to external websites. Expert&apos;s MarketPulse does not endorse and is not responsible for the content, accuracy, or practices of third-party websites. Accessing third-party sites is at your own risk.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Changes to This Disclaimer</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Expert&apos;s MarketPulse reserves the right to modify this disclaimer at any time without prior notice. By continuing to access or use our website after any revisions become effective, you agree to be bound by the updated terms.
          </p>

          <div style={{ marginTop: '40px', padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              By using Expert&apos;s MarketPulse, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer and our Terms of Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

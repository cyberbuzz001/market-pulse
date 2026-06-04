export const metadata = {
  title: 'Privacy Policy & Disclaimers | Expert\'s MarketPulse',
  description: 'Privacy Policy, cookies, Google AdSense disclosures, and regulatory SEBI disclaimers for Expert\'s MarketPulse.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Privacy Policy & Disclaimers</h1>
        <div className="prose">
          <p>Effective Date: June 3, 2026</p>
          <p>
            At <strong>Expert's MarketPulse</strong>, a property of <strong>SHREESVARN FINNOVOTION PRIVATE LIMITED</strong>, the privacy of our visitors is of extreme importance to us. This document details the types of personal information collected, processed, and our compliance with financial publication rules in India.
          </p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Google AdSense & DoubleClick Cookies</h2>
          <ul>
            <li>Google, as a third-party vendor, uses cookies to serve targeted advertisements on Expert's MarketPulse based on your browsing history.</li>
            <li>Users can manage cookie settings or opt-out of personalized advertising by visiting the Google Ad Settings page.</li>
            <li>We utilize standard analytical scripts that track impressions and anonymous page views to improve page load metrics and reader engagement.</li>
          </ul>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Log Files</h2>
          <p>
            Expert's MarketPulse (operated by SHREESVARN FINNOVOTION PRIVATE LIMITED) uses standard web server log files (IP addresses, browser type, ISP, time stamps, referring URLs) purely to analyze site performance, detect security anomalies, and ensure our automated site features load smoothly.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>SEBI Regulatory Disclaimer & Risk Warning</h2>
          <div style={{ padding: '20px', borderLeft: '4px solid #ef4444', background: 'var(--secondary)', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>WARNING: Investment in the securities market are subject to market risks. Read all related documents carefully before investing.</p>
            <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '0.95rem' }}>
              Expert's MarketPulse is an automated financial reporting and simulation portal operated by SHREESVARN FINNOVOTION PRIVATE LIMITED. We are NOT registered with the Securities and Exchange Board of India (SEBI) as a research analyst or investment advisor. The information provided here is for educational, analytical, and informational purposes only. It should not be construed as investment, trading, or financial advice.
            </p>
          </div>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Consent</h2>
          <p>
            By continuing to browse our website, you hereby consent to our Privacy Policy, Cookie terms, and acknowledge our regulatory disclaimers.
          </p>
        </div>
      </div>
    </div>
  );
}

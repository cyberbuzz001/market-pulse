export const metadata = {
  title: 'Contact Us | Expert\'s MarketPulse',
  description: 'Get in touch with the Expert\'s MarketPulse team for editorial feedback, press inquiries, and business partnerships.',
};

export default function ContactUs() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Contact Us</h1>
        <div className="prose">
          <p>
            Have a question, feedback, or a news tip? We'd love to hear from you. At Expert's MarketPulse, we are dedicated to providing the most accurate and up-to-date Indian stock market news. Your feedback helps us improve our coverage.
          </p>
          
          <div style={{ marginTop: '32px', background: 'var(--secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--foreground)' }}>Contact Information</h3>
            <p style={{ margin: '8px 0' }}><strong>Email Support:</strong> support@expertsmarketpulse.in</p>
            <p style={{ margin: '8px 0' }}><strong>Editorial Desk:</strong> editor@expertsmarketpulse.in</p>
            <p style={{ margin: '8px 0' }}><strong>Office Hours:</strong> Monday – Friday: 9:00 AM to 6:00 PM IST</p>
            <p style={{ margin: '8px 0' }}><strong>Address:</strong> Dalal Street, Fort, Mumbai, Maharashtra 400001, India</p>
          </div>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.5rem' }}>Advertising & Partnerships</h2>
          <p>
            For marketing, advertising integrations, or programmatic ad unit setups, please contact our monetization desk at <strong>ads@expertsmarketpulse.in</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

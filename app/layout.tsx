import './globals.css';
import { Inter } from 'next/font/google';
import MarketTicker from '../components/MarketTicker';
import PortfolioTracker from '../components/PortfolioTracker';
import HeaderNavigation from '../components/HeaderNavigation';
import PushNotifications from '../components/PushNotifications';
import NewsletterForm from '../components/NewsletterForm';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Expert\'s MarketPulse - Premium Stock Market Insights',
  description: 'Daily automated stock market news, company insights, crypto updates, and more.',
  alternates: {
    canonical: 'https://expertsmarketpulse.in',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: "Expert's MarketPulse",
            url: 'https://expertsmarketpulse.in',
            description: 'India\'s premier automated stock market intelligence portal',
            sameAs: [],
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: "Expert's MarketPulse",
            url: 'https://expertsmarketpulse.in',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://expertsmarketpulse.in/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }) }}
        />
        <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
          <MarketTicker />
          <HeaderNavigation />
        </div>
        
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <footer className="footer container">
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: 'var(--foreground)', marginBottom: '16px' }}>Legal & Utility</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link></li>
                <li><Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</Link></li>
                <li><Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link href="/disclaimer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Disclaimer</Link></li>
                <li style={{ marginTop: '12px' }}><Link href="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Market Dashboard</Link></li>
                <li><Link href="/ipos" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>IPO Calendar</Link></li>
                <li><Link href="/mutual-funds-explorer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Mutual Funds Explorer</Link></li>
                <li><Link href="/earnings" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Earnings Calendar</Link></li>
                <li><Link href="/alerts" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Regulatory Alerts</Link></li>
                <li><Link href="/archive" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Email Archive</Link></li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <NewsletterForm />
            </div>
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} Expert&apos;s MarketPulse. Fully Automated Stock Market Blog.</p>
          <div style={{ marginTop: '24px', padding: '16px 20px', borderTop: '1px solid var(--glass-border)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'left', lineHeight: '1.4' }}>
            <strong>SEBI Disclaimer:</strong> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of intermediary or provide any assurance of returns to investors. The content is for educational and simulation purposes only and does not constitute financial or investment advice.
          </div>
        </footer>
        <PortfolioTracker />
        <PushNotifications />
      </body>
    </html>
  );
}

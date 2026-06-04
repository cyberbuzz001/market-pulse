import { getSortedPostsData } from '../../lib/posts';
import Link from 'next/link';
import StockDetailsCard, { StockData } from '../../components/StockDetailsCard';

const stockDatabase: Record<string, StockData> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2985.40,
    change: 92.30,
    percent: 3.20,
    isUp: true,
    mcap: '₹20.20 Lakh Cr',
    pe: '28.4',
    high52: '₹3,024.90',
    low52: '₹2,220.30',
    volume: '5.8M',
    yield: '0.35%',
    sector: 'Conglomerate / Energy'
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    price: 4105.10,
    change: 112.50,
    percent: 2.80,
    isUp: true,
    mcap: '₹14.85 Lakh Cr',
    pe: '31.2',
    high52: '₹4,250.00',
    low52: '₹3,070.00',
    volume: '2.1M',
    yield: '1.20%',
    sector: 'Information Technology'
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1650.00,
    change: 24.50,
    percent: 1.50,
    isUp: true,
    mcap: '₹12.56 Lakh Cr',
    pe: '19.8',
    high52: '₹1,750.00',
    low52: '₹1,360.00',
    volume: '15.4M',
    yield: '1.15%',
    sector: 'Banking & Finance'
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1480.90,
    change: 17.55,
    percent: 1.20,
    isUp: true,
    mcap: '₹6.15 Lakh Cr',
    pe: '24.6',
    high52: '₹1,620.00',
    low52: '₹1,240.00',
    volume: '4.8M',
    yield: '2.40%',
    sector: 'Information Technology'
  },
  ITC: {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    price: 425.60,
    change: -7.80,
    percent: -1.80,
    isUp: false,
    mcap: '₹5.30 Lakh Cr',
    pe: '25.3',
    high52: '₹499.70',
    low52: '₹399.30',
    volume: '8.9M',
    yield: '3.75%',
    sector: 'FMCG / Conglomerate'
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1120.40,
    change: 14.80,
    percent: 1.34,
    isUp: true,
    mcap: '₹7.85 Lakh Cr',
    pe: '18.2',
    high52: '₹1,180.00',
    low52: '₹910.00',
    volume: '7.2M',
    yield: '0.89%',
    sector: 'Banking & Finance'
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    price: 985.40,
    change: -4.95,
    percent: -0.50,
    isUp: false,
    mcap: '₹3.27 Lakh Cr',
    pe: '16.4',
    high52: '₹1,065.00',
    low52: '₹540.00',
    volume: '6.4M',
    yield: '0.61%',
    sector: 'Automotive / EV'
  }
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  return {
    title: query ? `Search: "${query}" | Expert's MarketPulse` : 'Stock Screener | Expert\'s MarketPulse',
    description: `Search for stock quotes, IPO calendars, mutual funds, or articles on Dalal Street.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const allPostsData = getSortedPostsData();

  // Find exact or partial stock matches
  let matchedStock: StockData | null = null;
  if (query) {
    const uppercaseQuery = query.toUpperCase();
    if (stockDatabase[uppercaseQuery]) {
      matchedStock = { ...stockDatabase[uppercaseQuery] };
    } else {
      const found = Object.values(stockDatabase).find(
        (stock) =>
          stock.symbol.toLowerCase() === query.toLowerCase() ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      if (found) {
        matchedStock = { ...found };
      }
    }
  }

  // Fetch live market data for matched stock if found
  if (matchedStock) {
    try {
      const { getLiveStockQuotes } = await import('../../lib/angelone');
      const TOKEN_MAPPING: Record<string, string> = {
        RELIANCE: '2885',
        TCS: '11536',
        HDFCBANK: '1333',
        INFY: '1594',
        ITC: '1660',
        ICICIBANK: '10893',
        TATAMOTORS: '3456'
      };
      const token = TOKEN_MAPPING[matchedStock.symbol];
      if (token) {
        const quotes = await getLiveStockQuotes([token]);
        if (quotes && quotes[0]) {
          const quote = quotes[0];
          const ltp = parseFloat(quote.ltp);
          const close = parseFloat(quote.close);
          const change = ltp - close;
          const percent = close !== 0 ? (change / close) * 100 : 0;
          
          matchedStock.price = ltp;
          matchedStock.change = change;
          matchedStock.percent = percent;
          matchedStock.isUp = change >= 0;
        }
      }
    } catch (err) {
      console.error('Failed to load live stock quotes for search page:', err);
    }
  }

  // Filter blog posts by query
  const searchResults = query
    ? allPostsData.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase()) ||
          (matchedStock && post.title.toLowerCase().includes(matchedStock.symbol.toLowerCase()))
      )
    : [];

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      {query ? (
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--foreground)' }}>
          Search results for "{query}"
        </h1>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', color: 'var(--foreground)' }}>
            Indian Stock Screener & Search
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
            Look up stock charts, IPO details, mutual funds, or read verified daily financial market updates.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <form action="/search" method="GET" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                name="q"
                placeholder="Search stocks (e.g. RELIANCE, TCS), news, or IPOs..."
                style={{
                  width: '100%',
                  padding: '16px 24px 16px 48px',
                  borderRadius: '30px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--secondary)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}
              />
              <svg style={{ position: 'absolute', left: '18px', color: 'var(--text-muted)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </form>
            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-dim)', alignSelf: 'center', fontSize: '0.85rem' }}>Trending searches:</span>
              {['RELIANCE', 'TCS', 'HDFCBANK', 'Swiggy IPO', 'Mutual Funds'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${term}`}
                  style={{
                    background: 'var(--secondary)',
                    border: '1px solid var(--glass-border)',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    color: 'var(--text-normal)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Render stock card if match is found */}
      {matchedStock && (
        <div style={{ marginTop: '20px' }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FinancialProduct',
                'name': matchedStock.name,
                'tickerSymbol': matchedStock.symbol,
                'offers': {
                  '@type': 'Offer',
                  'price': matchedStock.price,
                  'priceCurrency': 'INR'
                }
              })
            }}
          />
          <StockDetailsCard stock={matchedStock} />
        </div>
      )}

      {/* Render articles search results */}
      {query && (
        <div style={{ marginTop: matchedStock ? '60px' : '20px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            Related Market Coverage
          </h2>
          {searchResults.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No articles match your query.</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>We post hourly market analyses. New articles matching this topic will be generated by our automated engine shortly.</p>
            </div>
          ) : (
            <div className="grid">
              {searchResults.map(({ slug, title, date, category, excerpt, coverImage }) => (
                <Link href={`/blog/${slug}`} key={slug} className="card glass">
                  <div className="card-img-wrapper">
                    <img src={coverImage} alt={title} className="card-img" />
                  </div>
                  <div className="card-category">{category}</div>
                  <h2 className="card-title">{title}</h2>
                  <p className="card-excerpt">{excerpt}</p>
                  <div className="card-footer">
                    <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { getSortedPostsData } from '../../../lib/posts';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${categoryName} | Expert's MarketPulse`,
    description: `Read the latest news and insights about ${categoryName}.`,
  };
}

// A simple mock widget component that changes based on category
function CategoryWidget({ categorySlug }: { categorySlug: string }) {
  if (categorySlug === 'indian-ipos') {
    return (
      <div className="glass" style={{ padding: '24px', marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>Upcoming IPO Calendar</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1' }}>
          <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Swiggy Ltd.</span> <span style={{ color: '#10b981' }}>Opening Soon</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Hyundai India</span> <span style={{ color: '#10b981' }}>DRHP Filed</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bajaj Housing Finance</span> <span style={{ color: '#f59e0b' }}>Expected Q3</span></li>
        </ul>
      </div>
    );
  }
  if (categorySlug === 'mutual-funds') {
    return (
      <div className="glass" style={{ padding: '24px', marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>Top Funds by Category (1Y Return)</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1' }}>
          <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Small Cap Index</span> <span style={{ color: '#10b981' }}>+45.2%</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Mid Cap Actives</span> <span style={{ color: '#10b981' }}>+38.5%</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Flexi Cap</span> <span style={{ color: '#10b981' }}>+24.1%</span></li>
        </ul>
      </div>
    );
  }
  // Default generic widget
  return (
    <div className="glass" style={{ padding: '24px', marginBottom: '40px', background: 'rgba(59, 130, 246, 0.1)' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>Market Sentiment: BULLISH</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>FIIs are net buyers. Volatility index (VIX) remains stable below 15.</p>
    </div>
  );
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const allPostsData = getSortedPostsData();
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const categoryPosts = allPostsData.filter(post => 
    post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categorySlug
  );

  const featuredPost = categoryPosts.length > 0 ? categoryPosts[0] : null;
  const otherPosts = categoryPosts.length > 1 ? categoryPosts.slice(1) : [];

  return (
    <div>
      <section className="hero container" style={{ paddingBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>{categoryName}</h1>
        <p>Latest insights and news from the {categoryName} sector.</p>
      </section>

      <section className="container">
        {categoryPosts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>No posts available in this category yet. Check back soon!</p>
        ) : (
          <div className="category-layout" style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '80px' }}>
            
            {/* Main Content Column */}
            <div style={{ flex: '1 1 600px', minWidth: 0 }}>
              {/* Featured Post (Latest) */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="card glass" style={{ marginBottom: '32px' }}>
                  <div className="card-img-wrapper" style={{ height: '350px' }}>
                    <img src={featuredPost.coverImage} alt={featuredPost.title} className="card-img" />
                  </div>
                  <div className="card-category" style={{ fontSize: '0.85rem' }}>{featuredPost.category}</div>
                  <h2 className="card-title" style={{ fontSize: '2rem' }}>{featuredPost.title}</h2>
                  <p className="card-excerpt" style={{ fontSize: '1.1rem' }}>{featuredPost.excerpt}</p>
                </Link>
              )}

              {/* Grid of older posts */}
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {otherPosts.map(({ slug, title, date, category, excerpt, coverImage }) => (
                  <Link href={`/blog/${slug}`} key={slug} className="card glass">
                    <div className="card-img-wrapper" style={{ height: '160px' }}>
                      <img src={coverImage} alt={title} className="card-img" />
                    </div>
                    <h2 className="card-title" style={{ fontSize: '1.25rem' }}>{title}</h2>
                    <div className="card-footer" style={{ marginTop: 'auto' }}>
                      <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Column */}
            <aside style={{ flex: '0 0 300px', width: '100%' }}>
              <CategoryWidget categorySlug={categorySlug} />
              
              <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>Trending Today</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#cbd5e1' }}>Reliance jumps 3% on AI expansion news</a></li>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#cbd5e1' }}>HDFC Bank hits 52-week high</a></li>
                  <li><a href="#" style={{ color: '#cbd5e1' }}>RBI leaves repo rate unchanged at 6.5%</a></li>
                </ul>
              </div>
            </aside>
            
          </div>
        )}
      </section>
    </div>
  );
}

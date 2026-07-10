import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export const revalidate = 3600; // revalidate every hour if not pushed by webhook

export default function Home() {
  const allPostsData = getSortedPostsData();
  const featuredPost = allPostsData[0];
  const gridPosts = allPostsData.slice(1);

  return (
    <div>
      {/* Ambient Animated Glow */}
      <div className="ambient-glow"></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        
        {/* Hero Section */}
        <section style={{ padding: '100px 0 60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', letterSpacing: '-1px', marginBottom: '16px', color: 'var(--foreground)', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
            Expert's <span style={{ color: 'var(--primary)', textShadow: '0 0 30px var(--primary-glow)' }}>MarketPulse</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 30px' }}>
            The next-generation terminal for automated, AI-driven stock market intelligence and global economic analysis.
          </p>
          <Link href="/dashboard" className="btn-premium">
            Launch Terminal
          </Link>
        </section>

        {/* Featured Spotlight */}
        {featuredPost && (
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--negative)', boxShadow: '0 0 10px var(--negative)' }}></span>
              LIVE BULLETIN
            </h2>
            <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '400px' }}>
                <div style={{ flex: 1, background: `url("${featuredPost.coverImage}") center/cover no-repeat`, minHeight: '300px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--secondary), transparent)' }}></div>
                </div>
                <div style={{ padding: '40px', position: 'relative', zIndex: 2, marginTop: '-100px' }}>
                  <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--primary)', color: '#000', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', borderRadius: '4px', marginBottom: '16px', letterSpacing: '1px' }}>
                    {featuredPost.category}
                  </span>
                  <h3 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--foreground)', lineHeight: 1.2 }}>{featuredPost.title}</h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', maxWidth: '800px' }}>{featuredPost.excerpt}</p>
                  <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{featuredPost.date}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Market Intel Grid */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-muted)' }}>Market Intelligence Feed</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {gridPosts.map(({ slug, date, title, excerpt, category, coverImage }) => (
              <Link href={`/blog/${slug}`} key={slug} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: `url("${coverImage}") center/cover no-repeat`, borderBottom: '1px solid var(--glass-border)' }}></div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</span>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{date}</small>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--foreground)', lineHeight: 1.4 }}>{title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>{excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

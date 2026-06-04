import Link from 'next/link';
import { getSortedPostsData, PostData } from '../lib/posts';

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
}

export default function RelatedPosts({ currentSlug, currentCategory }: RelatedPostsProps) {
  const allPosts = getSortedPostsData();
  
  // Get posts from same category first, then fill with recent posts
  const sameCategoryPosts = allPosts.filter(
    (post) => post.category === currentCategory && post.slug !== currentSlug
  );
  const otherPosts = allPosts.filter(
    (post) => post.category !== currentCategory && post.slug !== currentSlug
  );
  
  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 3);
  
  if (relatedPosts.length === 0) return null;

  return (
    <div style={{ maxWidth: '750px', margin: '60px auto 0' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)' }}>Related Articles</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="glass"
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--primary)' }}>
                {post.category}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '4px 0 6px', color: 'var(--foreground)', lineHeight: 1.3 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

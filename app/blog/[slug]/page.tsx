import { getPostData, getSortedPostsData } from '../../../lib/posts';
import AuthorBio from '../../../components/AuthorBio';
import RelatedPosts from '../../../components/RelatedPosts';
import { Metadata } from 'next';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);
  const canonicalUrl = `https://expertsmarketpulse.in/blog/${postData.slug}`;
  return {
    title: `${postData.title} | Expert's MarketPulse`,
    description: postData.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      type: 'article',
      publishedTime: postData.date,
      url: canonicalUrl,
      images: [{ url: postData.coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt,
      images: [postData.coverImage],
    }
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);
  
  // Calculate reading time (roughly 200 words per minute)
  const wordCount = postData.contentHtml ? postData.contentHtml.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const jsonLdNews = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: postData.title,
    image: [postData.coverImage],
    datePublished: new Date(postData.date).toISOString(),
    dateModified: new Date(postData.date).toISOString(),
    author: [{
      '@type': 'Person',
      name: 'AI Market Analyst',
      url: 'https://expertsmarketpulse.in/about'
    }]
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://expertsmarketpulse.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://expertsmarketpulse.in/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: postData.title,
        item: `https://expertsmarketpulse.in/blog/${postData.slug}`
      }
    ]
  };

  const shareUrl = `https://expertsmarketpulse.in/blog/${postData.slug}`;
  const shareText = encodeURIComponent(`${postData.title} - Read more at Expert's MarketPulse: ${shareUrl}`);

  return (
    <article className="container" style={{ paddingBottom: '80px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNews) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <header className="article-header">
        <div className="article-category">{postData.category}</div>
        <h1 className="article-title">{postData.title}</h1>
        <div className="article-meta">
          <span>Last updated: {new Date(postData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at 08:00 AM IST</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </header>

      <Image src={postData.coverImage} alt={postData.title} className="article-hero-img" width={1000} height={500} priority style={{ width: '100%', height: 'auto', maxWidth: '1000px', objectFit: 'cover', borderRadius: '16px', margin: '0 auto 60px', display: 'block' }} />

      <div style={{ maxWidth: '750px', margin: '0 auto 32px' }}>
        <a 
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#25D366',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '24px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Share on WhatsApp
        </a>
      </div>

      <div className="prose">
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderLeft: '4px solid #3b82f6',
          padding: '24px',
          borderRadius: '0 12px 12px 0',
          marginBottom: '40px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--foreground)', fontSize: '1.25rem' }}>Quick Summary</h3>
          <p style={{ margin: 0, color: 'var(--text-normal)' }}>{postData.excerpt}</p>
        </div>
      </div>

      <div className="prose glass" style={{ padding: '40px' }} dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />
      
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <AuthorBio />
      </div>

      <RelatedPosts currentSlug={postData.slug} currentCategory={postData.category} />
    </article>
  );
}

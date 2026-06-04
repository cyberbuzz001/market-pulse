import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Image from 'next/image';
import Newsletter from '../components/Newsletter';
import TrustStrip from '../components/TrustStrip';
import WhatsAppSubscription from '../components/WhatsAppSubscription';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div>
      <section className="hero container">
        <h1>Expert's MarketPulse</h1>
        <p>Premium, automated daily insights on stock market trends, company insights, crypto, and the global economy.</p>
      </section>

      <section className="container">
        <TrustStrip />
      </section>

      <section className="container">
        <div className="grid">
          {allPostsData.map(({ slug, title, date, category, excerpt, coverImage }) => (
            <Link href={`/blog/${slug}`} key={slug} className="card glass">
              <div className="card-img-wrapper">
                <Image src={coverImage} alt={title} className="card-img" width={400} height={200} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      </section>

      <section className="container" style={{ paddingBottom: '32px' }}>
        <WhatsAppSubscription />
      </section>

      <section className="container" style={{ paddingBottom: '80px' }}>
        <Newsletter />
      </section>
    </div>
  );
}

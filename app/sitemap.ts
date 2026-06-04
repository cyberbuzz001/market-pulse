import { MetadataRoute } from 'next';
import { getSortedPostsData } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://expertsmarketpulse.in';
  
  // Get all blog posts
  const posts = getSortedPostsData();
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Define static routes
  const routes = ['', '/about', '/contact', '/privacy', '/disclaimer'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.5,
  }));

  // Define category routes based on our layout
  const categories = ['nse-bse-news', 'indian-company-insights', 'indian-ipos', 'mutual-funds', 'global-economy'].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...categories, ...postUrls];
}

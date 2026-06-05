import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLiveStockQuotes } from '@/lib/angelone';

async function handleAutoPost(req: Request) {
  try {
    // Basic security check: support both GEMINI_API_KEY (manual) and CRON_SECRET (vercel cron)
    const authHeader = req.headers.get('authorization');
    const validTokens = [
      `Bearer ${process.env.GEMINI_API_KEY}`,
      `Bearer ${process.env.CRON_SECRET}`
    ];
    
    if (!validTokens.includes(authHeader || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    // 1. Fetch live market data
    let marketDataContext = "Unable to fetch live market data at this moment.";
    try {
      // Common NSE tokens for major stocks/indices (e.g., SBI, Reliance, HDFC, TCS)
      // Since specific index tokens vary, we use a few major large-cap tokens to seed the AI with real numbers.
      const tokens = ['3045', '2885', '1333', '11536']; 
      const liveData = await getLiveStockQuotes(tokens);
      if (liveData) {
        marketDataContext = "Live Stock Quotes Context:\\n" + JSON.stringify(liveData, null, 2);
      }
    } catch (e) {
      console.warn("Could not fetch Angel One data:", e);
    }

    // 2. Ask Gemini to write an article
    const dateStr = new Date().toISOString().split('T')[0];
    const prompt = `Write a professional financial blog post for an Indian audience about today's stock market performance.
    
Use the following live market data to make the article accurate and specific:
${marketDataContext}

Format the response EXACTLY as a markdown file with frontmatter. 
Make sure the content is analytical and sounds like a professional financial portal.

Format:
---
title: "Catchy Headline Here"
date: "${dateStr}"
category: "nse-bse-news"
coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
excerpt: "A brief 2 sentence summary of the article."
---
[Body of the article in Markdown format here]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    let markdownContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!markdownContent) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    // Clean up markdown block quotes if Gemini added them
    markdownContent = markdownContent.replace(/^```markdown/g, '').replace(/```$/g, '').trim();

    // Extract title for slug
    const titleMatch = markdownContent.match(/title:\s*"([^"]+)"/);
    if (!titleMatch) {
      return NextResponse.json({ error: 'Failed to parse title' }, { status: 500 });
    }
    
    const slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const filename = `${slug}.md`;
    
    // Save to GitHub
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (GITHUB_TOKEN) {
      const contentEncoded = Buffer.from(markdownContent, 'utf8').toString('base64');
      const ghResponse = await fetch(`https://api.github.com/repos/cyberbuzz001/market-pulse/contents/content/posts/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Auto-post: ${titleMatch[1]}`,
          content: contentEncoded,
        })
      });
      
      if (!ghResponse.ok) {
        const ghError = await ghResponse.text();
        console.error('GitHub push failed:', ghError);
        // Fallback to fs if github fails but we're local
        const postsDirectory = path.join(process.cwd(), 'content/posts');
        fs.writeFileSync(path.join(postsDirectory, filename), markdownContent, 'utf8');
      }
    } else {
      // Save to local fs as fallback
      const postsDirectory = path.join(process.cwd(), 'content/posts');
      fs.writeFileSync(path.join(postsDirectory, filename), markdownContent, 'utf8');
    }

    return NextResponse.json({ success: true, message: 'Article generated and saved', slug });
  } catch (error: any) {
    console.error('Auto-post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handleAutoPost(req);
}

export async function GET(req: Request) {
  return handleAutoPost(req);
}

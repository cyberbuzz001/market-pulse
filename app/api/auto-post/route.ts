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

    const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
    const CF_API_TOKEN = process.env.CF_API_TOKEN;
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return NextResponse.json({ error: 'Cloudflare API credentials missing' }, { status: 500 });
    }

    // 1. Fetch live market data (Angel One Fallback)
    let marketDataContext = "Unable to fetch live Angel One market data at this moment. Rely entirely on Google Search.";
    try {
      const tokens = ['3045', '2885', '1333', '11536']; 
      const liveData = await getLiveStockQuotes(tokens);
      if (liveData) {
        marketDataContext = "Live Stock Quotes Context:\\n" + JSON.stringify(liveData, null, 2);
      }
    } catch (e) {
      console.warn("Could not fetch Angel One data:", e);
    }

    // Determine time of day for context
    const hour = new Date().getHours();
    let edition = "Market Update";
    if (hour >= 2 && hour < 6) edition = "Morning Setup & Pre-Market Cues";
    else if (hour >= 6 && hour < 11) edition = "Midday Market Action";
    else if (hour >= 11 && hour < 15) edition = "Closing Bell Analysis";
    else if (hour >= 15 && hour < 19) edition = "Evening Global Cues";
    else edition = "Nightcap & Asian Markets";

    const dateStr = new Date().toISOString().split('T')[0];

    // 2. Generate Image using Cloudflare AI
    let coverImageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80";
    let imageBase64 = null;
    let imageFilename = null;

    try {
      const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
      const CF_API_TOKEN = process.env.CF_API_TOKEN;

      if (CF_ACCOUNT_ID && CF_API_TOKEN) {
        const cfResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            prompt: `A highly professional, photorealistic, cinematic image representing the Indian stock market, Dalal street, finance, ${edition}. Dark mode aesthetic with glowing green and red ticker elements, incredibly detailed, 8k resolution, corporate style.`
          })
        });

        if (cfResponse.ok) {
          const buffer = await cfResponse.arrayBuffer();
          imageBase64 = Buffer.from(buffer).toString('base64');
          imageFilename = `post-img-${Date.now()}.png`;
          coverImageUrl = `/images/${imageFilename}`;
          console.log("Successfully generated AI image via Cloudflare.");
        } else {
          console.warn("Cloudflare AI generation failed:", await cfResponse.text());
        }
      } else {
        console.warn("Cloudflare API credentials missing. Falling back to default image.");
      }
    } catch (imgErr) {
      console.warn("Error calling Cloudflare API:", imgErr);
    }

    // 3. Ask Cloudflare AI to write an article
    const prompt = `You are an elite, highly experienced financial journalist writing for "Expert's MarketPulse", a premium Indian stock market portal.
    
Write a highly professional, in-depth financial article for the ${edition}.

Use the following Angel One live data if available:
${marketDataContext}

CRITICAL WRITING GUIDELINES:
- Write like a human Wall Street/Dalal Street analyst. 
- DO NOT use AI jargon like "In conclusion", "It is important to note", "Delve into", "Navigating the landscape", or "A testament to".
- Use strong, declarative sentences. Be authoritative and analytical.
- Break down complex news into readable paragraphs and bullet points.

Format the response EXACTLY as a markdown file with frontmatter.

Format:
---
title: "A Catchy, Professional Headline Here"
date: "${dateStr}"
category: "Market News"
coverImage: "${coverImageUrl}"
excerpt: "A punchy, one-sentence summary of the main market driver."
---
[Body of the article in pristine Markdown format here]`;

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    let markdownContent = data.result?.response;

    if (!markdownContent) {
      console.error("Cloudflare AI text generation failed:", JSON.stringify(data));
      return NextResponse.json({ error: 'Failed to generate text content', details: data }, { status: 500 });
    }

    markdownContent = markdownContent.replace(/^```markdown/g, '').replace(/```$/g, '').trim();

    const titleMatch = markdownContent.match(/title:\s*"([^"]+)"/);
    if (!titleMatch) {
      return NextResponse.json({ error: 'Failed to parse title' }, { status: 500 });
    }
    
    const slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const filename = `${slug}.md`;
    
    // 4. Save to GitHub (Image first, then Markdown)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (GITHUB_TOKEN) {
      // Upload Image if generated
      if (imageBase64 && imageFilename) {
        await fetch(`https://api.github.com/repos/cyberbuzz001/market-pulse/contents/public/images/${imageFilename}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Auto-post image: ${imageFilename}`,
            content: imageBase64,
          })
        });
      }

      // Upload Markdown
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
        console.error('GitHub push failed:', await ghResponse.text());
        fs.writeFileSync(path.join(process.cwd(), 'content/posts', filename), markdownContent, 'utf8');
      }
    } else {
      // Local fallback
      fs.writeFileSync(path.join(process.cwd(), 'content/posts', filename), markdownContent, 'utf8');
      if (imageBase64 && imageFilename) {
        const publicDir = path.join(process.cwd(), 'public/images');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(path.join(publicDir, imageFilename), Buffer.from(imageBase64, 'base64'));
      }
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

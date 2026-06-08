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

    // 1. Fetch live market data (Angel One) — expanded token list for richer articles
    let marketDataContext = "No live market data available at this moment. Write a comprehensive article based on recent Indian stock market trends, global macro-economic developments, and upcoming catalysts. Do NOT mention that data is unavailable.";
    try {
      // Expanded: RELIANCE, TCS, HDFCBANK, INFY, ITC, ICICIBANK, TATAMOTORS
      const tokens = ['2885', '11536', '1333', '1594', '1660', '10893', '3456']; 
      const liveData = await getLiveStockQuotes(tokens);
      // Check if liveData exists and is not an empty array/object
      if (liveData && (Array.isArray(liveData) ? liveData.length > 0 : Object.keys(liveData).length > 0)) {
        marketDataContext = "LIVE STOCK DATA (use these exact numbers in your article):\n" + JSON.stringify(liveData, null, 2);
      }
    } catch (e) {
      console.warn("Could not fetch Angel One data:", e);
    }

    // Determine time of day and category for context
    const hour = new Date().getUTCHours(); // Vercel runs in UTC
    const istHour = (hour + 5) % 24; // Approximate IST offset
    let edition = "Market Update";
    let category = "Market News";
    if (istHour >= 7 && istHour < 10) { edition = "Morning Setup & Pre-Market Cues"; category = "Pre-Market Brief"; }
    else if (istHour >= 10 && istHour < 14) { edition = "Midday Market Action"; category = "Market News"; }
    else if (istHour >= 14 && istHour < 16) { edition = "Closing Bell Analysis"; category = "Technical Analysis"; }
    else if (istHour >= 16 && istHour < 21) { edition = "Evening Global Cues"; category = "Global Markets"; }
    else { edition = "Market Wrap & Overnight Cues"; category = "Market News"; }

    const dateStr = new Date().toISOString().split('T')[0];

    // 2. Generate article using Cloudflare AI — upgraded to 70B model
    const prompt = `You are an elite financial journalist writing for "Expert's MarketPulse", India's premier stock market intelligence portal. Today is ${dateStr}.

Write a highly professional, in-depth article for the "${edition}" edition.

${marketDataContext}

MANDATORY ARTICLE STRUCTURE (you MUST follow this exactly):

---
title: "A Catchy, Specific Headline About Today's Market"
date: "${dateStr}"
category: "${category}"
coverImage: "[COVER_IMAGE_URL]"
excerpt: "One punchy sentence summarizing the key market driver today."
---

## Market Overview
(2-3 paragraphs setting the scene — what happened today, key index movements, market mood)

## Top Market Movers
(Discuss the biggest gainers and losers using the live data above. Use exact prices and percentage changes. Format as bullet points.)

## Sectoral Spotlight
(Which sectors outperformed/underperformed? Banking, IT, Pharma, Auto, Metal — pick 2-3 that matter today.)

## Technical Levels to Watch
(Key support and resistance for Nifty 50 and Bank Nifty. Mention any chart patterns.)

## What Should Investors Do?
(Actionable strategy — be specific. SIP continuation, sector rotation ideas, stocks to watch.)

CRITICAL WRITING RULES:
- Write MINIMUM 600 words. Do NOT truncate or cut the article short.
- Use the EXACT stock prices from the live data provided above. Do NOT make up numbers.
- Write like a Dalal Street veteran. Be authoritative, not generic.
- NO AI jargon: avoid "In conclusion", "It is important to note", "Delve into", "Navigating the landscape".
- Use Indian market context: NSE, BSE, Nifty, Sensex, SEBI, FII/DII flows.
- Include specific company names and ticker symbols.
- End with a forward-looking statement about tomorrow's session.`;

    const cfTextResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
      })
    });

    const textData = await cfTextResponse.json();
    let markdownContent = textData.result?.response;

    if (!markdownContent) {
      console.error("Cloudflare AI text generation failed:", JSON.stringify(textData));
      return NextResponse.json({ error: 'Failed to generate text content', details: textData }, { status: 500 });
    }

    // Clean up markdown fencing that the AI sometimes wraps
    markdownContent = markdownContent
      .replace(/^```(?:markdown|md)?\s*/gi, '')
      .replace(/```\s*$/g, '')
      .trim();

    // Make the title parsing robust (allow unquoted titles)
    const titleMatch = markdownContent.match(/title:\s*"?([^"\n]+)"?/);
    if (!titleMatch) {
      console.error("Failed to parse title from content:", markdownContent.substring(0, 500));
      return NextResponse.json({ error: 'Failed to parse title', content: markdownContent.substring(0, 500) }, { status: 500 });
    }
    
    const slug = titleMatch[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const filename = `${slug}.md`;

    // 3. Duplicate post prevention — check if slug already exists on GitHub
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (GITHUB_TOKEN) {
      const existingCheck = await fetch(
        `https://api.github.com/repos/cyberbuzz001/market-pulse/contents/content/posts/${filename}`,
        { headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` } }
      );
      if (existingCheck.ok) {
        console.log(`Post already exists: ${filename}, skipping duplicate.`);
        return NextResponse.json({ success: true, message: 'Post already exists, skipped duplicate', slug }, { status: 200 });
      }
    }

    // 4. Generate Image using Cloudflare AI
    let coverImageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80";
    let imageBase64 = null;
    let imageFilename = null;

    try {
      if (CF_ACCOUNT_ID && CF_API_TOKEN) {
        const cfResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            prompt: `A highly professional, photorealistic, cinematic image representing the stock market news headline: "${titleMatch[1]}". ${edition}. Dark mode aesthetic with glowing green and red ticker elements, incredibly detailed, 8k resolution, corporate style.`
          })
        });

        if (cfResponse.ok) {
          const data = await cfResponse.json();
          if (data.result && data.result.image) {
            imageBase64 = data.result.image;
            imageFilename = `post-img-${Date.now()}.png`;
            coverImageUrl = `/images/${imageFilename}`;
            console.log("Successfully generated AI image via Cloudflare.");
          } else {
            console.warn("Cloudflare AI image generation succeeded but no image was returned.");
          }
        } else {
          console.warn("Cloudflare AI generation failed:", await cfResponse.text());
        }
      }
    } catch (imgErr) {
      console.warn("Error calling Cloudflare API for image:", imgErr);
    }

    // Replace whatever is in coverImage: "..." with the actual coverImageUrl using regex
    markdownContent = markdownContent.replace(/^coverImage:\s*.*$/m, `coverImage: "${coverImageUrl}"`);

    // 5. Save to GitHub (Image first, then Markdown)
    if (GITHUB_TOKEN) {
      // Upload Image if generated
      if (imageBase64 && imageFilename) {
        const imgResponse = await fetch(`https://api.github.com/repos/cyberbuzz001/market-pulse/contents/public/images/${imageFilename}`, {
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
        if (!imgResponse.ok) {
          console.warn('GitHub image upload failed:', await imgResponse.text());
        }
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
        const errorText = await ghResponse.text();
        console.error('GitHub push failed:', errorText);
        // Local fallback
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

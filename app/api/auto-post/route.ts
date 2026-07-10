import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLiveStockQuotes } from '@/lib/angelone';

function extractInitialTitleAndSlug(content: string) {
  const cleaned = content
    .replace(/^```(?:markdown|md)?\s*/gi, '')
    .replace(/```\s*$/g, '')
    .trim();

  const titleMatch = cleaned.match(/title:\s*"?([^"\n]+)"?/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '') : 'Market Update';
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return { title, slug };
}

function cleanAndNormalizePost(
  rawContent: string,
  dateStr: string,
  category: string,
  coverImageUrl: string
) {
  const content = rawContent
    .replace(/^```(?:markdown|md)?\s*/gi, '')
    .replace(/```\s*$/g, '')
    .trim();

  const lines = content.split(/\r?\n/);
  let inFrontmatter = false;
  let frontmatterDone = false;
  let frontmatterLines: string[] = [];
  let bodyLines: string[] = [];
  let lineIndex = 0;

  if (lines[0]?.trim() === '---') {
    inFrontmatter = true;
    lineIndex = 1;
  }

  for (; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (inFrontmatter && !frontmatterDone) {
      if (line.trim() === '---') {
        // Proper closing delimiter
        inFrontmatter = false;
        frontmatterDone = true;
        continue;
      }
      if (line.trim().startsWith('#')) {
        // AI omitted closing ---, markdown heading signals end of frontmatter
        inFrontmatter = false;
        frontmatterDone = true;
        bodyLines.push(line);
        continue;
      }
      if (line.trim() === '' && frontmatterLines.length > 0) {
        // Blank line after some frontmatter fields — likely missing closing ---
        // Peek ahead: if next non-blank line starts with ##, treat blank as separator
        const nextNonBlank = lines.slice(lineIndex + 1).find(l => l.trim() !== '');
        if (nextNonBlank && nextNonBlank.trim().startsWith('#')) {
          inFrontmatter = false;
          frontmatterDone = true;
          continue;
        }
      }
      frontmatterLines.push(line);
    } else {
      bodyLines.push(line);
    }
  }


  const fmData: Record<string, string> = {};
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      fmData[key] = value;
    }
  }

  let title = fmData.title || '';
  if (!title) {
    const titleMatch = content.match(/title:\s*"?([^"\n]+)"?/i);
    title = titleMatch ? titleMatch[1].trim() : 'Market Update';
  }
  
  const cleanTitle = title.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');
  const slug = cleanTitle.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const date = fmData.date || dateStr;
  const cat = fmData.category || category;
  
  let excerpt = fmData.excerpt || '';
  if (!excerpt) {
    const excerptMatch = content.match(/excerpt:\s*"?([^"\n]+)"?/i);
    excerpt = excerptMatch ? excerptMatch[1].trim() : 'Latest updates from Indian stock markets.';
  }
  const cleanExcerpt = excerpt.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');

  const normalizedFrontmatter = [
    '---',
    `title: ${JSON.stringify(cleanTitle)}`,
    `date: "${date}"`,
    `category: "${cat}"`,
    `coverImage: "${coverImageUrl}"`,
    `excerpt: ${JSON.stringify(cleanExcerpt)}`,
    '---'
  ].join('\n');

  const cleanBody = bodyLines.join('\n').trim();
  const normalizedContent = `${normalizedFrontmatter}\n\n${cleanBody}`;

  return { filename: `${slug}.md`, slug, normalizedContent, title: cleanTitle, excerpt: cleanExcerpt };
}

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

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini text generation failed:", errText);
      return NextResponse.json({ error: 'Failed to generate text content' }, { status: 500 });
    }

    const textData = await geminiResponse.json();
    let markdownContent = textData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!markdownContent) {
      console.error("Gemini empty response:", JSON.stringify(textData));
      return NextResponse.json({ error: 'Empty response generated by AI model' }, { status: 500 });
    }

    // Robust parsing for initial title and slug
    const { title, slug } = extractInitialTitleAndSlug(markdownContent);
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

    // 4. Generate image using Cloudflare Workers AI flux-1-schnell
    const imagePrompt = `A cinematic, 8k resolution, highly detailed image representing "${title}" in the context of ${category}. Professional financial atmosphere, dramatic lighting.`;
    let imageBuffer: Buffer | null = null;
    let coverImageUrl = '';
    const localImageFilename = `post-img-${Date.now()}.png`;

    try {
      const cfImageResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      if (!cfImageResponse.ok) {
        console.error("Cloudflare image generation failed:", await cfImageResponse.text());
      } else {
        const jsonResponse = await cfImageResponse.json();
        const base64Image = jsonResponse.result?.image;
        if (base64Image) {
          imageBuffer = Buffer.from(base64Image, 'base64');
          coverImageUrl = `/images/${localImageFilename}`;
          console.log(`Generated AI image successfully: ${localImageFilename}`);
        } else {
          console.error("No image data in Cloudflare response.");
        }
      }
    } catch (e) {
      console.error("Error generating image:", e);
    }

    // Fallback to a default if generation fails
    if (!coverImageUrl) {
        coverImageUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80';
    }

    // Clean, normalize and rebuild the post markdown with correct frontmatter
    const normalizedResult = cleanAndNormalizePost(markdownContent, dateStr, category, coverImageUrl);
    const finalFilename = normalizedResult.filename;
    const finalSlug = normalizedResult.slug;
    const finalContent = normalizedResult.normalizedContent;
    const finalTitle = normalizedResult.title;
    const finalExcerpt = normalizedResult.excerpt;

    // 5. Save to GitHub (Markdown + Image)
    let saveLocally = !GITHUB_TOKEN;
    if (GITHUB_TOKEN) {
      try {
        // Upload Image if generated
        if (imageBuffer) {
          const imageEncoded = imageBuffer.toString('base64');
          const ghImageResponse = await fetch(`https://api.github.com/repos/cyberbuzz001/market-pulse/contents/public/images/${localImageFilename}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Auto-post image: ${localImageFilename}`,
              content: imageEncoded,
            })
          });
          if (!ghImageResponse.ok) {
            console.error('GitHub image push failed:', await ghImageResponse.text());
          }
        }

        // Upload Markdown
        const contentEncoded = Buffer.from(finalContent, 'utf8').toString('base64');
        const ghResponse = await fetch(`https://api.github.com/repos/cyberbuzz001/market-pulse/contents/content/posts/${finalFilename}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Auto-post: ${finalTitle}`,
            content: contentEncoded,
          })
        });

        if (!ghResponse.ok) {
          const errorText = await ghResponse.text();
          console.error('GitHub push failed:', errorText);
          saveLocally = true;
        } else {
          // Force Vercel to rebuild and deploy the site with the new post
          try {
            await fetch('https://api.vercel.com/v1/integrations/deploy/prj_W3X2JfIYDvZOe5SNZPl0gPJslZv9/s99V4MznHB', { method: 'POST' });
            console.log('Successfully triggered Vercel deploy hook.');
          } catch (deployErr) {
            console.error('Error triggering deploy hook:', deployErr);
          }
        }
      } catch (ghErr) {
        console.error('GitHub integration error:', ghErr);
        saveLocally = true;
      }
    }

    if (saveLocally) {
      // Local fallback
      fs.writeFileSync(path.join(process.cwd(), 'content/posts', finalFilename), finalContent, 'utf8');
      if (imageBuffer) {
        fs.writeFileSync(path.join(process.cwd(), 'public/images', localImageFilename), imageBuffer);
      }
    }

    // 6. Automated Telegram Broadcasting (Optional)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const postUrl = `https://blog.shreesvarn.in/blog/${finalSlug}`;
        const messageText = `📊 *${finalTitle}*\n\n_${finalExcerpt}_\n\n🔗 [Read full article](${postUrl})`;
        
        let telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        let bodyData: any = {
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown',
          disable_web_page_preview: false
        };

        // If coverImageUrl is an absolute URL, send it as a photo
        if (coverImageUrl && coverImageUrl.startsWith('http')) {
          telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
          bodyData = {
            chat_id: TELEGRAM_CHAT_ID,
            photo: coverImageUrl,
            caption: messageText,
            parse_mode: 'Markdown'
          };
        }

        const tgRes = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });
        
        if (tgRes.ok) {
          console.log('Successfully broadcasted post to Telegram!');
        } else {
          console.warn('Telegram broadcast failed:', await tgRes.text());
        }
      } catch (tgErr) {
        console.error('Error broadcasting to Telegram:', tgErr);
      }
    }

    // 7. Automated Email Subscribers Notification (Optional Vercel Postgres query)
    try {
      const { sql: dbSql } = require('@vercel/postgres');
      const subscribers = await dbSql`
        SELECT contact FROM subscribers WHERE type = 'email'
      `;
      if (subscribers && subscribers.rows && subscribers.rows.length > 0) {
        const emailList = subscribers.rows.map((r: any) => r.contact);
        console.log(`[AUTOMATION] Notifying ${emailList.length} email subscribers:`, emailList);
      }
    } catch (dbErr) {
      console.warn('Could not query subscribers for email notification:', dbErr);
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

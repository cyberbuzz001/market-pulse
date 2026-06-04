import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Basic security check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.GEMINI_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    // 1. Ask Gemini to write an article
    const prompt = `Write a professional financial blog post for an Indian audience about the latest stock market trends (NSE/BSE).
    
Format the response EXACTLY as a markdown file with frontmatter. 
Make sure the content is analytical and sounds like a professional financial portal.

Format:
---
title: "Catchy Headline Here"
date: "2026-06-04"
category: "nse-bse-news"
coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
excerpt: "A brief 2 sentence summary of the article."
---
[Body of the article in Markdown format here]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
    
    // Save to content/posts/
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const filePath = path.join(postsDirectory, filename);
    
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Article generated and saved', slug });
  } catch (error: any) {
    console.error('Auto-post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

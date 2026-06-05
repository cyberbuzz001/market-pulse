# Expert's MarketPulse

Expert's MarketPulse is a **Fully Autonomous, AI-Driven Financial Intelligence Portal**. 
It continuously scrapes the internet for financial news, integrates live stock market quotes via Angel One's SmartAPI, writes professional algorithmic journalism using Google's Gemini Flash model, generates high-end cinematic cover images using Cloudflare's AI, and pushes itself to production 5 times a day.

## Architecture & Automation

### 1. The Autonomous Engine (`app/api/auto-post/route.ts`)
The entire blog writes itself. 
- **Vercel Cron** wakes up the API route at 8 AM, 12 PM, 4:30 PM, 9 PM, and 1 AM (IST).
- The route fetches live stock market quotes (Nifty, Sensex, Reliance, etc.) from **Angel One**.
- It asks **Gemini (Google Search Grounded)** to crawl the web for the latest global and domestic financial news based on the time of day.
- It calls **Cloudflare Workers AI (`flux-1-schnell`)** to generate a cinematic, 8k resolution stock market image.
- It packages the image and the AI-written markdown article and commits them directly to **GitHub**.
- **Vercel** automatically detects the new commit and statically builds the new site.

### 2. High-Tech Glassmorphic UI
The frontend is built with Next.js App Router and a custom pure-CSS aesthetic.
- Deep dark navy backgrounds with Neon Cyan (`#00f0ff`) and Neon Emerald (`#00e676`) accents.
- 3D physical hover effects, dynamic blurred glassmorphism, and ambient glowing meshes.
- Typography powered by Google's `Inter` and `Space Grotesk`.

### 3. Core Features
- **Market Dashboard**: Heatmaps and live index tracking.
- **Stock Screener**: An interactive search page displaying PE ratios, market caps, and live quotes.
- **Push Notifications & Subscribe**: Integrated UI to collect user emails and WhatsApp numbers.
- **SEO Optimized**: Fully automated XML Sitemap (`/sitemap.xml`) and RSS 2.0 Feed (`/feed.xml`) generation on every build.

## Deployment Setup

To host this repository, you must set the following **Environment Variables** in Vercel:

| Variable | Description |
| -------- | ----------- |
| `GEMINI_API_KEY` | Your Google AI Studio API key (Pay-as-you-go tier required for Search Grounding). |
| `GITHUB_TOKEN` | GitHub Personal Access Token (classic) with `repo` scope to push markdown files. |
| `CRON_SECRET` | A secure string matched in the Vercel cron configuration to prevent unauthorized API execution. |
| `CF_ACCOUNT_ID` | Cloudflare Account ID for Image generation. |
| `CF_API_TOKEN` | Cloudflare Workers AI Token. |

## Legal Compliance
The platform includes built-in `/disclaimer`, `/privacy`, and a hardcoded SEBI disclaimer in the footer to clarify that the AI-generated news is for educational and simulation purposes only.

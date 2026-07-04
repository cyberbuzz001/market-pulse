import crypto from 'crypto';

// Base32 Decoder for TOTP secret key
function base32Decode(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = base32.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = alphabet.indexOf(cleaned[i]);
    if (idx === -1) {
      throw new Error('Invalid base32 character: ' + cleaned[i]);
    }
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// Generate Time-based One Time Password (TOTP)
export function generateTOTP(secret: string): string {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const time = Math.floor(epoch / 30);

  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(time / 0x100000000), 0);
  timeBuffer.writeUInt32BE(time % 0x100000000, 4);

  const hmac = crypto.createHmac('sha1', key).update(timeBuffer).digest();

  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

let cachedSession: { jwtToken: string; feedToken: string; apiKey: string; expiry: number } | null = null;

// Authenticate session on Angel One SmartAPI
export async function getAngelOneSession() {
  const clientCode = process.env.ANGEL_ONE_CLIENT_CODE;
  const password = process.env.ANGEL_ONE_PASSWORD;
  const totpSecret = process.env.ANGEL_ONE_TOTP_SECRET;
  const apiKey = process.env.ANGEL_ONE_API_KEY;

  if (!clientCode || !password || !totpSecret || !apiKey) {
    throw new Error('Missing Angel One credentials in environment variables');
  }

  // Use cached session if valid (Angel One tokens usually last for the day, but we'll cache for 55 mins)
  if (cachedSession && Date.now() < cachedSession.expiry) {
    return cachedSession;
  }

  const totp = generateTOTP(totpSecret);

  const response = await fetch('https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientIP': '122.181.101.159',
      'X-MACAddress': '00:00:00:00:00:00',
      'X-PrivateKey': apiKey
    },
    body: JSON.stringify({
      clientcode: clientCode,
      password: password,
      totp: totp
    })
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error('Angel One authentication failed: ' + JSON.stringify(data));
  }

  cachedSession = {
    jwtToken: data.data.jwtToken,
    feedToken: data.data.feedToken,
    apiKey,
    expiry: Date.now() + 55 * 60 * 1000 // 55 minutes
  };

  return cachedSession;
}

// Map of NSE tokens to Yahoo Finance tickers
const TOKEN_TO_YAHOO: Record<string, { tradingSymbol: string, yahooSymbol: string }> = {
  '2885': { tradingSymbol: 'RELIANCE-EQ', yahooSymbol: 'RELIANCE.NS' },
  '11536': { tradingSymbol: 'TCS-EQ', yahooSymbol: 'TCS.NS' },
  '1333': { tradingSymbol: 'HDFCBANK-EQ', yahooSymbol: 'HDFCBANK.NS' },
  '1594': { tradingSymbol: 'INFY-EQ', yahooSymbol: 'INFY.NS' },
  '1660': { tradingSymbol: 'ITC-EQ', yahooSymbol: 'ITC.NS' },
  '10893': { tradingSymbol: 'ICICIBANK-EQ', yahooSymbol: 'ICICIBANK.NS' },
  '3456': { tradingSymbol: 'TATAMOTORS-EQ', yahooSymbol: 'TATAMOTORS.NS' }
};

// Robust fallback fetch using Yahoo Finance API (no keys, no whitelisting required)
async function fetchYahooQuotes(tokens: string[]) {
  console.log('[MarketData] Falling back to Yahoo Finance for tokens:', tokens);
  try {
    const promises = tokens.map(async (token) => {
      const mapping = TOKEN_TO_YAHOO[token];
      if (!mapping) return null;

      try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${mapping.yahooSymbol}?interval=1d&range=1d`);
        if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (!meta) throw new Error('Yahoo invalid response meta');

        const ltp = meta.regularMarketPrice;
        const close = meta.chartPreviousClose || ltp;
        const netChange = ltp - close;
        const percentChange = close !== 0 ? (netChange / close) * 100 : 0;

        return {
          exchange: 'NSE',
          tradingSymbol: mapping.tradingSymbol,
          symbolToken: token,
          ltp: ltp,
          open: close,
          high: ltp,
          low: ltp,
          close: close,
          netChange: netChange,
          percentChange: percentChange,
          volume: meta.regularMarketVolume || 0,
          depth: { buy: [], sell: [] }
        };
      } catch (err) {
        console.warn(`[MarketData] Yahoo fetch failed for ${mapping.yahooSymbol}:`, err);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((r) => r !== null);
  } catch (err) {
    console.error('[MarketData] Yahoo fallback failed completely:', err);
    return null;
  }
}

// Query live stock details from Angel One SmartAPI using NSE tokens
export async function getLiveStockQuotes(tokens: string[]) {
  try {
    const session = await getAngelOneSession();
    
    const response = await fetch('https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`,
        'X-PrivateKey': session.apiKey,
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientIP': '122.181.101.159',
        'X-MACAddress': '00:00:00:00:00:00'
      },
      body: JSON.stringify({
        mode: 'FULL',
        exchangeTokens: {
          'NSE': tokens
        }
      })
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error('Failed to fetch stock quotes: ' + JSON.stringify(data));
    }

    return data.data.fetched;
  } catch (error: any) {
    console.warn('Angel One API failed, switching to Yahoo Finance fallback:', error?.message || error);
    return fetchYahooQuotes(tokens);
  }
}


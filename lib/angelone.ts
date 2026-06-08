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
  } catch (error) {
    console.error('Error fetching live quotes:', error);
    return null;
  }
}

import { NextResponse } from 'next/server';
import { getLiveStockQuotes } from '../../../lib/angelone';

// Map of symbols to NSE tokens from Angel One SmartAPI
const TOKEN_MAPPING: Record<string, string> = {
  RELIANCE: '2885',
  TCS: '11536',
  HDFCBANK: '1333',
  INFY: '1594',
  ITC: '1660',
  ICICIBANK: '10893',
  TATAMOTORS: '3456'
};

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 10_000; // 10 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    
    // Only use cache if no specific symbols are requested (default fetch all)
    if (!symbolsParam && cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cache.data, cached: true });
    }

    
    let symbolsToFetch = Object.keys(TOKEN_MAPPING);
    if (symbolsParam) {
      symbolsToFetch = symbolsParam
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => TOKEN_MAPPING[s]);
    }

    if (symbolsToFetch.length === 0) {
      return NextResponse.json({ error: 'No valid symbols requested' }, { status: 400 });
    }

    const tokens = symbolsToFetch.map(s => TOKEN_MAPPING[s]);
    const quotes = await getLiveStockQuotes(tokens);

    if (!quotes || !Array.isArray(quotes)) {
      return NextResponse.json({ error: 'Failed to fetch live quotes from Angel One API' }, { status: 502 });
    }

    // Map fetched quotes back to a symbol-keyed object
    const result: Record<string, any> = {};
    
    // Find symbol name for each token in quotes
    quotes.forEach((quote: any) => {
      const token = quote.token;
      const symbol = Object.keys(TOKEN_MAPPING).find(key => TOKEN_MAPPING[key] === token);
      if (symbol) {
        const ltp = parseFloat(quote.ltp);
        const close = parseFloat(quote.close);
        const change = ltp - close;
        const percent = close !== 0 ? (change / close) * 100 : 0;
        
        result[symbol] = {
          symbol,
          price: ltp,
          change,
          percent,
          isUp: change >= 0,
          volume: quote.volume || '0',
          high: quote.high || '0',
          low: quote.low || '0',
        };
      }
    });

    if (!symbolsParam) {
      cache = { data: result, timestamp: Date.now() };
    }

    return NextResponse.json({ success: true, data: result, cached: false });
  } catch (error: any) {
    console.error('Error in market-data API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

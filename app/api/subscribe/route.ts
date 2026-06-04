import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'content/subscribers.json');

// Ensure database directory and file exist
function initializeDb() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2), 'utf8');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, topics, tier } = body;

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    initializeDb();

    // Read current subscribers
    const fileData = fs.readFileSync(dbPath, 'utf8');
    const subscribers = JSON.parse(fileData);

    // Check if already subscribed
    const existingIdx = subscribers.findIndex((s: any) => s.phone === phone);
    const newSubscriber = {
      phone,
      topics,
      tier: tier || 'free',
      subscribedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      subscribers[existingIdx] = newSubscriber;
    } else {
      subscribers.push(newSubscriber);
    }

    // Save to database
    fs.writeFileSync(dbPath, JSON.stringify(subscribers, null, 2), 'utf8');

    // =========================================================================
    // PRODUCTION INTEGRATION BOILERPLATE (e.g. using Twilio API)
    // =========================================================================
    // Uncomment and configure these variables when deploying to production:
    //
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    //
    // await client.messages.create({
    //   from: 'whatsapp:+14155238886', // Twilio WhatsApp Sandbox Number
    //   body: `Welcome to Expert's MarketPulse! You have subscribed to receive daily morning alerts for: ${topics.join(', ')}.`,
    //   to: `whatsapp:+91${phone}`
    // });
    // =========================================================================

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

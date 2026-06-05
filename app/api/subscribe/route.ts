import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contact, type } = await request.json();

    if (!contact || !type) {
      return NextResponse.json({ error: 'Contact and type are required' }, { status: 400 });
    }

    // Insert into DB
    await sql`
      INSERT INTO subscribers (contact, type)
      VALUES (${contact}, ${type})
    `;

    return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Subscription error:', error);
    // Handle unique constraint or other db errors
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

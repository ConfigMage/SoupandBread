import { NextResponse } from 'next/server';
import { setDestroyed } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await setDestroyed();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error destroying mission:', error);
    return NextResponse.json(
      { error: 'Failed to destroy mission' },
      { status: 500 }
    );
  }
}

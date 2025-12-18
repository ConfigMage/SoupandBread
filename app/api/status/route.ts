import { NextResponse } from 'next/server';
import { getStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}

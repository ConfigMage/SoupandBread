import { NextResponse } from 'next/server';
import { resetMission } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await resetMission();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting mission:', error);
    return NextResponse.json(
      { error: 'Failed to reset mission' },
      { status: 500 }
    );
  }
}

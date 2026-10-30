import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/supabase';

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

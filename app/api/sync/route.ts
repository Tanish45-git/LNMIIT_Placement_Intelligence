import { NextResponse } from 'next/server';
import { triggerSync, getAuditLogs } from '@/lib/supabase';

export async function GET() {
  try {
    const logs = await getAuditLogs();
    const lastSync = logs.find((l) => l.eventType === 'AUTO_SYNC_CHECK' || l.eventType === 'AUTO_SYNC_UPDATED');

    return NextResponse.json({
      success: true,
      lastSyncTime: lastSync?.timestamp || new Date().toISOString(),
      lastStatus: lastSync?.status || 'NO_CHANGE',
      totalLogs: logs.length,
      recentLogs: logs.slice(0, 10)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Optional bearer secret check for cron jobs
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow local/admin requests if no secret set
    }

    const result = await triggerSync();

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

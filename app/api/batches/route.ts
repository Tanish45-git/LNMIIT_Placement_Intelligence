import { NextResponse } from 'next/server';
import { getBatches, getStatistics } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId') || undefined;

    const batches = await getBatches();
    const statistics = await getStatistics(batchId);

    return NextResponse.json({
      success: true,
      batches,
      statistics,
      totalCount: batches.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

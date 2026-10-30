import { NextResponse } from 'next/server';
import { getBatches, getStatistics, addBatch } from '@/lib/supabase';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { batch, statistics } = body;

    if (!batch || !statistics) {
      return NextResponse.json(
        { success: false, error: 'batch and statistics payload required' },
        { status: 400 }
      );
    }

    await addBatch(batch, statistics);

    return NextResponse.json({
      success: true,
      message: `Batch ${batch.batchName} created successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

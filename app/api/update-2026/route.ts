import { NextResponse } from 'next/server';
import { getStatistics, getBatches } from '@/lib/supabase';
import { INITIAL_STATISTICS, INITIAL_UPDATE_LOGS } from '@/lib/data/lnmiitPlacementData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { additionalPlaced = 1, additionalOffers = 1, newHighestLPA, companyName } = body;

    const stat2026 = INITIAL_STATISTICS.find((s) => s.graduationYear === 2026);
    if (!stat2026) {
      return NextResponse.json({ success: false, error: '2026 batch statistics not found' }, { status: 404 });
    }

    // Increment placed and offers
    stat2026.studentsPlaced += Number(additionalPlaced);
    stat2026.totalJobOffers += Number(additionalOffers);
    stat2026.placementPercentage = Number(
      ((stat2026.studentsPlaced / stat2026.registeredStudents) * 100).toFixed(2)
    );

    if (newHighestLPA && Number(newHighestLPA) > stat2026.highestPackageLPA) {
      stat2026.highestPackageLPA = Number(newHighestLPA);
    }

    stat2026.reportingDate = new Date().toISOString().slice(0, 10);
    stat2026.lastCheckedDate = new Date().toISOString().slice(0, 10);

    // Record audit log entry
    const log = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'AUTO_SYNC_UPDATED' as const,
      status: 'SUCCESS' as const,
      sourceUrl: 'https://placements.lnmiit.ac.in/statistics',
      message: `Updated Class of 2026 (Y22) Ongoing Drive: +${additionalPlaced} placed, +${additionalOffers} offers${companyName ? ` (${companyName})` : ''}. Current placed: ${stat2026.studentsPlaced}/${stat2026.registeredStudents} (${stat2026.placementPercentage}%).`,
      details: {
        batch: 'Y22 (2026)',
        studentsPlaced: stat2026.studentsPlaced,
        totalJobOffers: stat2026.totalJobOffers,
        companyName
      }
    };
    INITIAL_UPDATE_LOGS.unshift(log);

    return NextResponse.json({
      success: true,
      message: 'Class of 2026 placement figures successfully updated!',
      updatedStat: stat2026,
      log
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

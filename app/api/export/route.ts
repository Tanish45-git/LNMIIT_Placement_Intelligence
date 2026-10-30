import { NextResponse } from 'next/server';
import { getStatistics, getBatches } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const batches = await getBatches();
    const stats = await getStatistics();

    if (format === 'json') {
      return NextResponse.json({ batches, stats });
    }

    // Generate CSV
    const headers = [
      'Graduation Year',
      'Batch Name',
      'Total Batch Strength',
      'Registered Students',
      'Students Placed',
      'Placement Percentage (%)',
      'Highest Package (LPA)',
      'Average Package (LPA)',
      'Median Package (LPA)',
      'Total Job Offers',
      'Recruiting Companies',
      'Reporting Date',
      'Verification Status',
      'Source Type',
      'Source URL'
    ];

    const rows = stats.map((s) => {
      const batch = batches.find((b) => b.id === s.batchId);
      return [
        s.graduationYear,
        `"${batch?.batchName || s.batchId}"`,
        s.totalBatchStrength,
        s.registeredStudents,
        s.studentsPlaced,
        s.placementPercentage,
        s.highestPackageLPA,
        s.averagePackageLPA,
        s.medianPackageLPA,
        s.totalJobOffers,
        s.recruitingCompaniesCount,
        s.reportingDate,
        `"${s.verificationStatus}"`,
        `"${s.sourceType}"`,
        `"${s.sourceUrl}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="LNMIIT_Placement_Records_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getCompanies, getCompanyRecruitment } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const tier = searchParams.get('tier') || '';
    const industry = searchParams.get('industry') || '';

    let companies = await getCompanies();
    const recruitment = await getCompanyRecruitment();

    if (search) {
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.industry.toLowerCase().includes(search) ||
          (c.description && c.description.toLowerCase().includes(search))
      );
    }

    if (tier) {
      companies = companies.filter((c) => c.tier === tier);
    }

    if (industry) {
      companies = companies.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      count: companies.length,
      companies,
      recruitment
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

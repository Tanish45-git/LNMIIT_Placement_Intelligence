import { describe, it, expect } from 'vitest';
import {
  INITIAL_BATCHES,
  INITIAL_STATISTICS,
  INITIAL_BRANCH_STATISTICS,
  INITIAL_COMPANIES,
  INITIAL_RECRUITMENT_RECORDS,
  INITIAL_INTERNSHIP_STATISTICS
} from '../lib/data/lnmiitPlacementData';

describe('LNMIIT Placement Intelligence — Comprehensive Dataset Audits (2007–2026)', () => {
  it('covers all graduating batches from 2007 up to the live 2026 ongoing cycle', () => {
    expect(INITIAL_BATCHES.length).toBeGreaterThanOrEqual(20);

    const years = INITIAL_BATCHES.map((b) => b.graduationYear).sort((a, b) => a - b);
    expect(years[0]).toBe(2007); // First graduating batch Y03
    expect(years[years.length - 1]).toBe(2026); // Live ongoing batch Y22

    const batch2026 = INITIAL_BATCHES.find((b) => b.graduationYear === 2026);
    expect(batch2026).toBeDefined();
    expect(batch2026?.status).toBe('ongoing');
    expect(batch2026?.isCurrent).toBe(true);
  });

  it('verifies mathematical invariants for every single graduating batch including 2026', () => {
    INITIAL_STATISTICS.forEach((stat) => {
      // 1. Placed <= Registered
      expect(stat.studentsPlaced).toBeLessThanOrEqual(stat.registeredStudents);

      // 2. Registered <= Strength
      expect(stat.registeredStudents).toBeLessThanOrEqual(stat.totalBatchStrength);

      // 3. Offers >= Placed
      expect(stat.totalJobOffers).toBeGreaterThanOrEqual(stat.studentsPlaced);

      // 4. Percentage is between 0 and 100
      expect(stat.placementPercentage).toBeGreaterThanOrEqual(0);
      expect(stat.placementPercentage).toBeLessThanOrEqual(100);

      // 5. Highest package >= Average package
      expect(stat.highestPackageLPA).toBeGreaterThanOrEqual(stat.averagePackageLPA);

      // 6. Verification status is a valid tier
      expect(['Officially Verified', 'Secondary Source', 'Awaiting Verification']).toContain(
        stat.verificationStatus
      );

      // 7. Sourced with valid URL
      expect(stat.sourceUrl).toContain('lnmiit.ac.in');
    });
  });

  it('verifies 2026 ongoing statistics and branch distribution', () => {
    const stat2026 = INITIAL_STATISTICS.find((s) => s.graduationYear === 2026);
    expect(stat2026).toBeDefined();
    expect(stat2026?.studentsPlaced).toBeGreaterThan(0);
    expect(stat2026?.totalJobOffers).toBeGreaterThanOrEqual(stat2026?.studentsPlaced || 0);

    const branch2026 = INITIAL_BRANCH_STATISTICS.filter((b) => b.graduationYear === 2026);
    expect(branch2026.length).toBeGreaterThanOrEqual(4);
  });

  it('verifies company recruitment and tier categorization', () => {
    expect(INITIAL_COMPANIES.length).toBeGreaterThanOrEqual(20);

    const companyIds = new Set(INITIAL_COMPANIES.map((c) => c.id));
    INITIAL_RECRUITMENT_RECORDS.forEach((rec) => {
      expect(companyIds.has(rec.companyId)).toBe(true);
      expect(rec.jobRoles.length).toBeGreaterThan(0);
    });
  });

  it('verifies internship metrics and PPO rates', () => {
    INITIAL_INTERNSHIP_STATISTICS.forEach((i) => {
      expect(i.totalInternshipOffers).toBeGreaterThan(0);
      expect(i.highestStipendMonthly).toBeGreaterThanOrEqual(i.averageStipendMonthly);
      expect(i.ppoConversionRate).toBeLessThanOrEqual(100);
      expect(i.topInternshipCompanies.length).toBeGreaterThan(0);
    });
  });
});

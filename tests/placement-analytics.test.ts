import { describe, it, expect } from 'vitest';
import {
  INITIAL_BATCHES,
  INITIAL_STATISTICS,
  INITIAL_BRANCH_STATISTICS,
  INITIAL_COMPANIES,
  INITIAL_RECRUITMENT_RECORDS,
  INITIAL_INTERNSHIP_STATISTICS
} from '../lib/data/lnmiitPlacementData';

describe('LNMIIT Placement Intelligence — Comprehensive Dataset Audits (2007–2025)', () => {
  it('covers all graduating batches since LNMIIT was started (2007 to 2025)', () => {
    expect(INITIAL_BATCHES.length).toBeGreaterThanOrEqual(19);

    const years = INITIAL_BATCHES.map((b) => b.graduationYear).sort((a, b) => a - b);
    expect(years[0]).toBe(2007); // First graduating batch Y03
    expect(years[years.length - 1]).toBe(2025); // Current batch Y21
  });

  it('verifies mathematical invariants for every single graduating batch', () => {
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

  it('verifies branch analytics integrity for engineering departments', () => {
    const branchCodes = new Set(INITIAL_BRANCH_STATISTICS.map((b) => b.branchCode));
    expect(branchCodes.has('CSE')).toBe(true);
    expect(branchCodes.has('CCE')).toBe(true);
    expect(branchCodes.has('ECE')).toBe(true);
    expect(branchCodes.has('MME')).toBe(true);

    INITIAL_BRANCH_STATISTICS.forEach((b) => {
      expect(b.studentsPlaced).toBeLessThanOrEqual(b.registeredStudents);
      expect(b.highestPackageLPA).toBeGreaterThanOrEqual(b.averagePackageLPA);
      expect(b.topRecruiters.length).toBeGreaterThan(0);
    });
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

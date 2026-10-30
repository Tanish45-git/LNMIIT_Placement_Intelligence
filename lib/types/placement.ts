export type VerificationStatus = 'Officially Verified' | 'Secondary Source' | 'Awaiting Verification';

export type SourceType = 'Official Website' | 'Annual Report PDF' | 'T&P Brochure' | 'NIRF Report';

export type BranchCode = 'CSE' | 'CCE' | 'ECE' | 'MME' | 'M&C';

export interface PlacementSource {
  id: string;
  title: string;
  sourceUrl: string;
  sourceType: SourceType;
  batchYear: number;
  publishedDate: string;
  lastCheckedDate: string;
  contentHash: string;
  verificationStatus: VerificationStatus;
  methodologyNotes: string;
}

export interface PlacementBatch {
  id: string; // e.g. "y20"
  batchName: string; // "Class of 2024 (Y20)"
  graduationYear: number; // 2024
  admissionYear: number; // 2020
  isCurrent: boolean;
  status: 'completed' | 'ongoing' | 'archived';
  notes?: string;
}

export interface SalaryBracketDistribution {
  bracket0To5LPA: number;
  bracket5To10LPA: number;
  bracket10To15LPA: number;
  bracket15To20LPA: number;
  bracket20To30LPA: number;
  bracket30PlusLPA: number;
}

export interface PlacementStatistics {
  id: string;
  batchId: string;
  graduationYear: number;
  totalBatchStrength: number;
  registeredStudents: number;
  studentsPlaced: number;
  placementPercentage: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  totalJobOffers: number;
  recruitingCompaniesCount: number;
  salaryDistribution?: SalaryBracketDistribution;
  reportingDate: string;
  lastCheckedDate: string;
  sourceUrl: string;
  sourceType: SourceType;
  verificationStatus: VerificationStatus;
  methodologyNotes: string;
  isDisputed?: boolean;
}

export interface BranchStatistics {
  id: string;
  batchId: string;
  graduationYear: number;
  branchCode: BranchCode;
  branchName: string;
  totalStudents: number;
  registeredStudents: number;
  studentsPlaced: number;
  placementPercentage: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  totalOffers: number;
  topRecruiters: string[];
  verificationStatus: VerificationStatus;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  tier: 'Tier 1 (30+ LPA)' | 'Tier 2 (15-30 LPA)' | 'Tier 3 (8-15 LPA)' | 'Tier 4 (<8 LPA)';
  website?: string;
  logoUrl?: string;
  headquarters?: string;
  description?: string;
}

export interface CompanyRecruitmentRecord {
  id: string;
  companyId: string;
  companyName: string;
  industry: string;
  tier: string;
  batchId: string;
  graduationYear: number;
  jobRoles: string[];
  eligibleBranches: BranchCode[];
  packageLPA?: number;
  stipendMonthly?: number;
  hiresCount?: number;
  internshipOffered: boolean;
  fullTimeOffered: boolean;
  ppoConverted?: number;
  verificationStatus: VerificationStatus;
  sourceUrl: string;
}

export interface InternshipStatistics {
  id: string;
  batchId: string;
  graduationYear: number;
  totalInternshipOffers: number;
  highestStipendMonthly: number; // in INR
  averageStipendMonthly: number;
  medianStipendMonthly: number;
  totalPPOConversions: number;
  ppoConversionRate: number; // %
  topInternshipCompanies: string[];
  reportingDate: string;
  verificationStatus: VerificationStatus;
  methodologyNotes: string;
}

export interface DataUpdateLog {
  id: string;
  timestamp: string;
  eventType: 'AUTO_SYNC_CHECK' | 'AUTO_SYNC_UPDATED' | 'PDF_EXTRACTED' | 'ADMIN_EDIT' | 'DISCREPANCY_FLAGGED' | 'ADMIN_APPROVE';
  status: 'SUCCESS' | 'PENDING_REVIEW' | 'ERROR' | 'NO_CHANGE';
  sourceUrl: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'auditor';
}

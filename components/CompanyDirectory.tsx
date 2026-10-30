'use strict';
'use client';

import React, { useState, useMemo } from 'react';
import { Company, CompanyRecruitmentRecord, BranchCode } from '@/lib/types/placement';
import {
  Search,
  Building2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface CompanyDirectoryProps {
  companies: Company[];
  recruitmentRecords: CompanyRecruitmentRecord[];
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  recruitmentRecords
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [offerTypeFilter, setOfferTypeFilter] = useState<'all' | 'fulltime' | 'internship'>('all');

  const tiers = [
    'all',
    'Tier 1 (30+ LPA)',
    'Tier 2 (15-30 LPA)',
    'Tier 3 (8-15 LPA)',
    'Tier 4 (<8 LPA)'
  ];

  // Combined company details with their latest recruitment records
  const enrichedCompanies = useMemo(() => {
    return companies.map((c) => {
      const records = recruitmentRecords.filter((r) => r.companyId === c.id);
      const latestRecord = records.sort((a, b) => b.graduationYear - a.graduationYear)[0];
      return {
        ...c,
        latestRecord,
        totalHires: records.reduce((acc, curr) => acc + (curr.hiresCount || 0), 0),
        yearsActive: Array.from(new Set(records.map((r) => r.graduationYear)))
      };
    });
  }, [companies, recruitmentRecords]);

  // Filtering
  const filteredCompanies = useMemo(() => {
    return enrichedCompanies.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.latestRecord?.jobRoles.some((role) =>
          role.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchTier = selectedTier === 'all' || c.tier === selectedTier;

      const matchBranch =
        selectedBranch === 'all' ||
        (c.latestRecord && c.latestRecord.eligibleBranches.includes(selectedBranch as BranchCode));

      const matchOfferType =
        offerTypeFilter === 'all' ||
        (offerTypeFilter === 'fulltime' && c.latestRecord?.fullTimeOffered) ||
        (offerTypeFilter === 'internship' && c.latestRecord?.internshipOffered);

      return matchSearch && matchTier && matchBranch && matchOfferType;
    });
  }, [enrichedCompanies, searchTerm, selectedTier, selectedBranch, offerTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Header and Filter Toolbar */}
      <div className="stat-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recruiting Organizations Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified corporate recruiters at LNMIIT across software, semiconductors, finance, and core technology sectors.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCompanies.length}</span> of {companies.length} companies
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, roles, industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Tier Selector */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All Compensation Tiers</option>
              <option value="Tier 1 (30+ LPA)">Tier 1 (30+ LPA)</option>
              <option value="Tier 2 (15-30 LPA)">Tier 2 (15-30 LPA)</option>
              <option value="Tier 3 (8-15 LPA)">Tier 3 (8-15 LPA)</option>
              <option value="Tier 4 (<8 LPA)">Tier 4 (&lt;8 LPA)</option>
            </select>
          </div>

          {/* Branch Eligibility Selector */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All Eligible Branches</option>
              <option value="CSE">CSE (Computer Science)</option>
              <option value="CCE">CCE (Communication &amp; Comp)</option>
              <option value="ECE">ECE (Electronics &amp; Comm)</option>
              <option value="MME">MME (Mechanical-Mechatronics)</option>
            </select>
          </div>

          {/* Offer Type Filter */}
          <div>
            <select
              value={offerTypeFilter}
              onChange={(e) => setOfferTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All Offer Types</option>
              <option value="fulltime">Full-Time (FTE) Roles</option>
              <option value="internship">Internships &amp; PPO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => {
          const rec = company.latestRecord;
          return (
            <div
              key={company.id}
              className="stat-card p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-600 transition-all"
            >
              <div>
                {/* Header: Company Name & Tier Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{company.name}</span>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-orange-500 transition-colors"
                          title="Visit corporate careers site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {company.industry}
                    </p>
                  </div>

                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                      company.tier.includes('Tier 1')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : company.tier.includes('Tier 2')
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                        : company.tier.includes('Tier 3')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {company.tier.split(' ')[0]} {company.tier.split(' ')[1]}
                  </span>
                </div>

                {/* Company Description */}
                {company.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2">
                    {company.description}
                  </p>
                )}

                {/* Recruitment Highlights */}
                {rec && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    {/* Compensation & Stipend */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Offered CTC:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {rec.packageLPA ? `₹${rec.packageLPA.toFixed(2)} LPA` : 'Undisclosed'}
                      </span>
                    </div>

                    {rec.stipendMonthly && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Monthly Stipend:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{rec.stipendMonthly.toLocaleString()}/mo
                        </span>
                      </div>
                    )}

                    {/* Roles Offered */}
                    {rec.jobRoles.length > 0 && (
                      <div className="text-xs pt-1">
                        <span className="text-slate-500 dark:text-slate-400 block mb-1">
                          Key Roles:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rec.jobRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Eligible Branches */}
                    {rec.eligibleBranches.length > 0 && (
                      <div className="text-xs pt-1">
                        <span className="text-slate-500 dark:text-slate-400 block mb-1">
                          Eligible Branches:
                        </span>
                        <div className="flex gap-1">
                          {rec.eligibleBranches.map((br) => (
                            <span
                              key={br}
                              className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 font-bold text-[10px]"
                            >
                              {br}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Verification Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{rec ? `Recruited in ${rec.graduationYear}` : 'Historical Recruiter'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

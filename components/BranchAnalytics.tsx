'use strict';
'use client';

import React, { useState } from 'react';
import { BranchStatistics, BranchCode } from '@/lib/types/placement';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Cpu,
  Radio,
  Microchip,
  Wrench,
  Calculator,
  CheckCircle2,
  Building,
  TrendingUp,
  Percent,
  Users
} from 'lucide-react';

interface BranchAnalyticsProps {
  branchStats: BranchStatistics[];
  isDark: boolean;
}

export const BranchAnalytics: React.FC<BranchAnalyticsProps> = ({ branchStats, isDark }) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchCode>('CSE');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const branchesConfig: { code: BranchCode; name: string; icon: any }[] = [
    { code: 'CSE', name: 'Computer Science & Engineering', icon: Cpu },
    { code: 'CCE', name: 'Communication & Computer Engg.', icon: Radio },
    { code: 'ECE', name: 'Electronics & Communication Engg.', icon: Microchip },
    { code: 'MME', name: 'Mechanical-Mechatronics Engg.', icon: Wrench },
    { code: 'M&C', name: 'Mathematics & Computing', icon: Calculator }
  ];

  // Filter for currently selected year and branch
  const activeBranchData = branchStats.find(
    (b) => b.branchCode === selectedBranch && b.graduationYear === selectedYear
  );

  // All branches data for selected year for comparative chart
  const currentYearBranches = branchStats.filter((b) => b.graduationYear === selectedYear);

  const chartData = currentYearBranches.map((b) => ({
    branch: b.branchCode,
    average: b.averagePackageLPA,
    highest: b.highestPackageLPA,
    percentage: b.placementPercentage,
    placed: b.studentsPlaced
  }));

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Header & Department Filters */}
      <div className="stat-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Departmental & Branch-Wise Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative placement rates, CTC benchmarks, and primary recruiters across engineering departments.
            </p>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Batch Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500"
            >
              <option value={2024}>Class of 2024</option>
              <option value={2023}>Class of 2023</option>
              <option value={2022}>Class of 2022</option>
            </select>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {branchesConfig.map((b) => {
            const Icon = b.icon;
            const isSelected = selectedBranch === b.code;
            return (
              <button
                key={b.code}
                onClick={() => setSelectedBranch(b.code)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-orange-600 dark:text-white border-slate-900 dark:border-orange-600 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{b.code}</span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-400 dark:text-white' : 'text-slate-400'}`} />
                </div>
                <div className="text-[11px] truncate opacity-85 mt-1">{b.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Branch Drill-down KPI Cards */}
      {activeBranchData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
                <span>Branch Highest CTC</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                ₹{activeBranchData.highestPackageLPA.toFixed(2)} LPA
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{activeBranchData.branchName}</div>
            </div>

            <div className="stat-card p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
                <span>Branch Average CTC</span>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                ₹{activeBranchData.averagePackageLPA.toFixed(2)} LPA
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Mean package for placed students</div>
            </div>

            <div className="stat-card p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
                <span>Placement %</span>
                <Percent className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {activeBranchData.placementPercentage.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {activeBranchData.studentsPlaced} placed of {activeBranchData.registeredStudents} registered
              </div>
            </div>

            <div className="stat-card p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
                <span>Total Offers</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {activeBranchData.totalOffers}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Strength: {activeBranchData.totalStudents} total enrolled
              </div>
            </div>
          </div>

          {/* Top Recruiters for Branch */}
          <div className="stat-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" />
              <span>Primary Recruiting Organizations for {activeBranchData.branchCode} ({selectedYear})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeBranchData.topRecruiters.map((company, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="stat-card p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">
            Detailed department statistics for {selectedBranch} ({selectedYear}) are either archived or not treated as zero per verification policy.
          </p>
        </div>
      )}

      {/* Cross-Branch Comparative Visualizer */}
      <div className="stat-card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Branch Comparison: Average Package & Placement Rate ({selectedYear})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Direct cross-departmental comparison of academic programs.
        </p>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="branch" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#111726' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="average" name="Average CTC (LPA)" fill="#ea580c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highest" name="Highest CTC (LPA)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

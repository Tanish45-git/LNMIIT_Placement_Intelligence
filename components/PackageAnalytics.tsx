'use strict';
'use client';

import React, { useState } from 'react';
import { PlacementStatistics } from '@/lib/types/placement';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { Award, TrendingUp, BarChart2, ShieldAlert, AlertCircle, Info } from 'lucide-react';

interface PackageAnalyticsProps {
  statistics: PlacementStatistics[];
  isDark: boolean;
}

export const PackageAnalytics: React.FC<PackageAnalyticsProps> = ({ statistics, isDark }) => {
  // Only select statistics that actually have verified salary distribution data
  const statsWithDistribution = statistics.filter((s) => Boolean(s.salaryDistribution));
  const [selectedBatchYear, setSelectedBatchYear] = useState<number>(2024);

  const activeStat =
    statsWithDistribution.find((s) => s.graduationYear === selectedBatchYear) ||
    statsWithDistribution[0];

  const distribution = activeStat?.salaryDistribution;

  const bracketData = distribution
    ? [
        { bracket: '0–5 LPA', offers: distribution.bracket0To5LPA, fill: '#94a3b8' },
        { bracket: '5–10 LPA', offers: distribution.bracket5To10LPA, fill: '#3b82f6' },
        { bracket: '10–15 LPA', offers: distribution.bracket10To15LPA, fill: '#6366f1' },
        { bracket: '15–20 LPA', offers: distribution.bracket15To20LPA, fill: '#8b5cf6' },
        { bracket: '20–30 LPA', offers: distribution.bracket20To30LPA, fill: '#ea580c' },
        { bracket: '30+ LPA', offers: distribution.bracket30PlusLPA, fill: '#f59e0b' }
      ]
    : [];

  const totalDistributedOffers = bracketData.reduce((acc, curr) => acc + curr.offers, 0);

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Header and Batch Switcher */}
      <div className="stat-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Package &amp; Salary Distribution Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact offer breakdown across verified compensation brackets. Only displayed when underlying institutional data is documented.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Graduating Batch:
            </span>
            <select
              value={selectedBatchYear}
              onChange={(e) => setSelectedBatchYear(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {statsWithDistribution.map((s) => (
                <option key={s.id} value={s.graduationYear}>
                  Class of {s.graduationYear} (Audited)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Package Benchmark Summary Cards */}
      {activeStat && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Highest Package</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              ₹{activeStat.highestPackageLPA.toFixed(2)} LPA
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Maximum verified offer for {activeStat.graduationYear}
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Average Package</span>
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-orange-600 dark:text-orange-400">
              ₹{activeStat.averagePackageLPA.toFixed(2)} LPA
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Institute arithmetic mean across offers
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Median Package</span>
              <BarChart2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              ₹{activeStat.medianPackageLPA.toFixed(2)} LPA
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              50th percentile (central tendency)
            </div>
          </div>
        </div>
      )}

      {/* Salary Distribution Bar Histogram */}
      <div className="stat-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Offer Count by Salary Bracket ({selectedBatchYear})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total mapped offers in brackets: {totalDistributedOffers}
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            Officially Verified
          </span>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bracketData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="bracket" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#111726' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`${val} Offers`, 'Offer Volume']}
              />
              <Bar dataKey="offers" name="Offers Count" radius={[6, 6, 0, 0]}>
                {bracketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistical Guardrail Note */}
        <div className="mt-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Zero Synthetic Data Invariant:
            </span>{' '}
            Per project specifications, salary distributions are never estimated or synthesized from average and highest figures alone. If distribution data is missing for any past year, it is omitted rather than falsified.
          </div>
        </div>
      </div>
    </div>
  );
};

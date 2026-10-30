'use strict';
'use client';

import React, { useState } from 'react';
import { InternshipStatistics } from '@/lib/types/placement';
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent,
  Building,
  AlertTriangle,
  Info
} from 'lucide-react';
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

interface InternshipAnalyticsProps {
  internshipStats: InternshipStatistics[];
  isDark: boolean;
}

export const InternshipAnalytics: React.FC<InternshipAnalyticsProps> = ({
  internshipStats,
  isDark
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const activeStat =
    internshipStats.find((s) => s.graduationYear === selectedYear) || internshipStats[0];

  const chartData = internshipStats.map((s) => ({
    year: s.graduationYear.toString(),
    offers: s.totalInternshipOffers,
    ppo: s.totalPPOConversions,
    conversionRate: s.ppoConversionRate,
    avgStipend: s.averageStipendMonthly / 1000 // In thousands
  }));

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Header and Batch Switcher */}
      <div className="stat-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Internship &amp; PPO (Pre-Placement Offer) Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Summer and semester internships, monthly stipend benchmarks, and conversion rates to full-time roles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Graduating Batch:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {internshipStats.map((s) => (
                <option key={s.id} value={s.graduationYear}>
                  Class of {s.graduationYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {activeStat && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Internship Offers</span>
              <Briefcase className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeStat.totalInternshipOffers}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Summer &amp; semester industry internships
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Highest Monthly Stipend</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{(activeStat.highestStipendMonthly / 1000).toFixed(0)}k/mo
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Offered by top product &amp; fintech firms
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>Average Monthly Stipend</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              ₹{(activeStat.averageStipendMonthly / 1000).toFixed(1)}k/mo
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Median: ₹{(activeStat.medianStipendMonthly / 1000).toFixed(0)}k/mo
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>PPO Conversion Rate</span>
              <Percent className="w-4 h-4 text-violet-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-violet-600 dark:text-violet-400">
              {activeStat.ppoConversionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {activeStat.totalPPOConversions} converted to full-time FTE
            </div>
          </div>
        </div>
      )}

      {/* Top Internship Hiring Companies */}
      {activeStat && (
        <div className="stat-card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-orange-500" />
            <span>Top Internship Recruiting Partners ({selectedYear})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeStat.topInternshipCompanies.map((c, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Historical Internship & PPO Conversion Trends */}
      <div className="stat-card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Historical Internship Offers &amp; PPO Conversions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Tracking conversion performance across academic cycles.
        </p>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#111726' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar
                dataKey="offers"
                name="Total Internship Offers"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ppo"
                name="PPO Conversions to Full-Time"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Methodology Differentiation Notice */}
      <div className="stat-card p-5 border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Data Integrity Rule: Strict Distinction from Full-Time Offers
            </h4>
            <p>
              To eliminate any ambiguity or double-counting, internship stipends and offers are calculated independently from final CTC and placed headcounts. When an intern is extended a Pre-Placement Offer (PPO) and accepts, the role is accounted in the graduating batch’s full-time placement statistics only upon official verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

'use strict';
'use client';

import React, { useState } from 'react';
import { PlacementStatistics } from '@/lib/types/placement';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, LineChart as LineIcon, CheckSquare, Square, Info } from 'lucide-react';

interface PlacementTrendsProps {
  statistics: PlacementStatistics[];
  isDark: boolean;
}

export const PlacementTrends: React.FC<PlacementTrendsProps> = ({ statistics, isDark }) => {
  const [activeMetric, setActiveMetric] = useState<'compensation' | 'percentage' | 'volume'>('compensation');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Sort ascending by year for time-series charts
  const sortedStats = [...statistics].sort((a, b) => a.graduationYear - b.graduationYear);
  const allYears = sortedStats.map((s) => s.graduationYear);

  // Multi-year selector state
  const [selectedYears, setSelectedYears] = useState<number[]>(allYears);

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 2) {
        setSelectedYears(selectedYears.filter((y) => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year].sort((a, b) => a - b));
    }
  };

  const selectAllYears = () => setSelectedYears(allYears);

  // Filtered chart dataset
  const chartData = sortedStats
    .filter((s) => selectedYears.includes(s.graduationYear))
    .map((s) => ({
      year: s.graduationYear.toString(),
      highest: s.highestPackageLPA,
      average: s.averagePackageLPA,
      median: s.medianPackageLPA,
      percentage: s.placementPercentage,
      placed: s.studentsPlaced,
      registered: s.registeredStudents,
      offers: s.totalJobOffers,
      strength: s.totalBatchStrength,
      companies: s.recruitingCompaniesCount
    }));

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="stat-card p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Historical Placement Trends</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({selectedYears.length} years selected)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare compensation trajectory, offer volumes, and institute placement ratios.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Buttons */}
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveMetric('compensation')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeMetric === 'compensation'
                  ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Compensation (CTC)
            </button>
            <button
              onClick={() => setActiveMetric('percentage')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeMetric === 'percentage'
                  ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Placement %
            </button>
            <button
              onClick={() => setActiveMetric('volume')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeMetric === 'volume'
                  ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Offers vs Placed
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Line Chart"
              aria-label="Line Chart"
            >
              <LineIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Bar Chart"
              aria-label="Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Year Selection Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
          Graduating Batches:
        </span>
        {allYears.map((year) => {
          const isSelected = selectedYears.includes(year);
          return (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white border-slate-900 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSelected ? <CheckSquare className="w-3 h-3 text-orange-400" /> : <Square className="w-3 h-3" />}
              <span>{year}</span>
            </button>
          );
        })}
        {selectedYears.length < allYears.length && (
          <button
            onClick={selectAllYears}
            className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium ml-2"
          >
            Select All
          </button>
        )}
      </div>

      {/* Interactive Chart Canvas */}
      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'compensation' ? (
            chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111726' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)} LPA`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="highest"
                  name="Highest CTC (LPA)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="Average CTC (LPA)"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="median"
                  name="Median CTC (LPA)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111726' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)} LPA`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="highest" name="Highest CTC" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average" name="Average CTC" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="median" name="Median CTC" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )
          ) : activeMetric === 'percentage' ? (
            chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  domain={[50, 100]}
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111726' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(2)}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Placement Percentage (%)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111726' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(2)}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="percentage" name="Placement %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            )
          ) : (
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
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="placed" name="Students Placed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offers" name="Total Job Offers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="companies" name="Recruiting Companies" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
        <Info className="w-4 h-4 text-orange-500 shrink-0" />
        <span>
          Note: Placement percentages reflect placed students divided by registered students. Never treating missing or provisional metrics as zero.
        </span>
      </div>
    </div>
  );
};

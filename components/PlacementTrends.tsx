'use strict';
'use client';

import React, { useState } from 'react';
import { PlacementBatch, PlacementStatistics } from '@/lib/types/placement';
import {
  ResponsiveContainer,
  LineChart,
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  BarChart3,
  LineChart as LineIcon,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PlacementTrendsProps {
  statistics: PlacementStatistics[];
  batches: PlacementBatch[];
  isDark: boolean;
}

interface YearBandCursorProps {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  points?: Array<{ x?: number }>;
  dataCount: number;
  fill: string;
  fillOpacity: number;
}

const YearBandCursor: React.FC<YearBandCursorProps> = ({
  left = 0,
  top = 0,
  width = 0,
  height = 0,
  points,
  dataCount,
  fill,
  fillOpacity
}) => {
  const center = points?.[0]?.x;
  if (center === undefined || !width || !height) return null;

  const bandWidth = width / dataCount;
  const bandX = Math.max(left, Math.min(center - bandWidth / 2, left + width - bandWidth));

  return (
    <rect
      className="recharts-tooltip-cursor"
      x={bandX}
      y={top}
      width={bandWidth}
      height={height}
      fill={fill}
      fillOpacity={fillOpacity}
      pointerEvents="none"
    />
  );
};

export const PlacementTrends: React.FC<PlacementTrendsProps> = ({ statistics, batches, isDark }) => {
  const [activeMetric, setActiveMetric] = useState<'compensation' | 'percentage' | 'volume'>('compensation');
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [showAllYears, setShowAllYears] = useState(false);

  // Sort ascending by year for time-series charts
  const sortedStats = [...statistics].sort((a, b) => a.graduationYear - b.graduationYear);
  const allYears = sortedStats.map((s) => s.graduationYear);
  const inProgressYears = new Set(
    batches.filter((batch) => batch.status === 'ongoing').map((batch) => batch.graduationYear)
  );
  const completedYears = allYears.filter((year) => !inProgressYears.has(year));
  const visibleYears = showAllYears ? allYears : completedYears.slice(-6);

  const [selectedYears, setSelectedYears] = useState<number[]>(() => completedYears.slice(-6));

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
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
    <div className="stat-card space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Historical Placement Trends</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare package, placement-rate, and offer trends across graduating batches.
          </p>
          {inProgressYears.size > 0 && (
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Ongoing batches are excluded by default; select one to view provisional figures.
            </p>
          )}
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Buttons */}
          <div className="inline-flex max-w-full flex-wrap rounded-lg bg-slate-100 p-1 text-[10px] font-medium dark:bg-slate-800 sm:text-xs">
            <button
              onClick={() => setActiveMetric('compensation')}
              className={`rounded-md px-2 py-1.5 transition-all sm:px-3 ${
                activeMetric === 'compensation'
                  ? 'bg-white dark:bg-blue-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Compensation (CTC)
            </button>
            <button
              onClick={() => setActiveMetric('percentage')}
              className={`rounded-md px-2 py-1.5 transition-all sm:px-3 ${
                activeMetric === 'percentage'
                  ? 'bg-white dark:bg-blue-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Placement %
            </button>
            <button
              onClick={() => setActiveMetric('volume')}
              className={`rounded-md px-2 py-1.5 transition-all sm:px-3 ${
                activeMetric === 'volume'
                  ? 'bg-white dark:bg-blue-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Offers vs Placed
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium dark:bg-slate-800">
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

      {/* Recent batch selector; older batches remain available on demand. */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="mr-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {showAllYears ? 'Graduating batches:' : 'Recent batches:'}
        </span>
        {visibleYears.map((year) => {
          const isSelected = selectedYears.includes(year);
          return (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white border-slate-900 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSelected ? <CheckSquare className="w-3 h-3 text-blue-300" /> : <Square className="w-3 h-3" />}
              <span>{year}</span>
            </button>
          );
        })}
        {selectedYears.length < allYears.length && (
          <button
            onClick={selectAllYears}
            className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-medium ml-2"
          >
            Select all
          </button>
        )}
        {allYears.length > 6 && (
          <button
            onClick={() => setShowAllYears((visible) => !visible)}
            aria-expanded={showAllYears}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {showAllYears ? 'Fewer years' : 'More years'}
            {showAllYears ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Interactive Chart Canvas */}
      <div className="h-[300px] w-full pt-1 sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'compensation' ? (
            chartType === 'line' ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  yAxisId={0}
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <YAxis
                  yAxisId={1}
                  orientation="right"
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                  width={48}
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
                <Legend
                  align="center"
                  verticalAlign="top"
                  height={32}
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="highest"
                  name="Highest package"
                  yAxisId={1}
                  stroke="#0d47a1"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={{ r: 4, fill: '#0d47a1', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="Average CTC (LPA)"
                  yAxisId={0}
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1976d2', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="median"
                  name="Median package"
                  yAxisId={0}
                  stroke="#64a5e8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#64a5e8', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            ) : (
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis
                  yAxisId={0}
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <YAxis
                  yAxisId={1}
                  orientation="right"
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                  width={48}
                />
                <defs>
                  <linearGradient id="averagePackageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3979dc" />
                    <stop offset="100%" stopColor="#0d47a1" />
                  </linearGradient>
                  <linearGradient id="medianPackageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a5ceff" />
                    <stop offset="100%" stopColor="#64a5e8" />
                  </linearGradient>
                  <linearGradient id="highestPackageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9aafb8" />
                    <stop offset="100%" stopColor="#607d8b" />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={
                    <YearBandCursor
                      dataCount={chartData.length}
                      fill={isDark ? '#64748b' : '#94a3b8'}
                      fillOpacity={isDark ? 0.42 : 0.35}
                    />
                  }
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="min-w-48 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
                        <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                        <div className="space-y-2">
                          {payload.map((item) => (
                            <div key={item.dataKey} className="flex items-center justify-between gap-4 text-xs">
                              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name}
                              </span>
                              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                                ₹{Number(item.value).toFixed(2)} LPA
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  align="center"
                  verticalAlign="top"
                  height={32}
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar
                  dataKey="average"
                  name="Average package"
                  fill="url(#averagePackageGradient)"
                  yAxisId={0}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                />
                <Bar
                  dataKey="median"
                  name="Median package"
                  fill="url(#medianPackageGradient)"
                  yAxisId={0}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                />
                <Bar
                  dataKey="highest"
                  name="Highest package"
                  yAxisId={1}
                  fill="url(#highestPackageGradient)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                />
              </ComposedChart>
            )
          ) : activeMetric === 'percentage' ? (
            chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                cursor={{ fill: isDark ? '#64748b' : '#d1d5db', fillOpacity: 0.72 }}
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
    </div>
  );
};

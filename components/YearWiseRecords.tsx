'use strict';
'use client';

import React, { useState, useMemo } from 'react';
import { PlacementBatch, PlacementStatistics } from '@/lib/types/placement';
import {
  Search,
  ArrowUpDown,
  Download,
  GitCompare,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

interface YearWiseRecordsProps {
  batches: PlacementBatch[];
  statistics: PlacementStatistics[];
}

type SortField =
  | 'graduationYear'
  | 'totalBatchStrength'
  | 'registeredStudents'
  | 'studentsPlaced'
  | 'placementPercentage'
  | 'highestPackageLPA'
  | 'averagePackageLPA'
  | 'medianPackageLPA'
  | 'totalJobOffers'
  | 'recruitingCompaniesCount';

export const YearWiseRecords: React.FC<YearWiseRecordsProps> = ({ batches, statistics }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('graduationYear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(['y20', 'y19']);
  const [showComparison, setShowComparison] = useState(false);

  // Combine batch and stat
  const combinedRecords = useMemo(() => {
    return statistics.map((stat) => {
      const batch = batches.find((b) => b.id === stat.batchId);
      return {
        ...stat,
        batchName: batch?.batchName || `Batch ${stat.graduationYear}`,
        batchStatus: batch?.status || 'completed'
      };
    });
  }, [batches, statistics]);

  // Filtering
  const filteredRecords = useMemo(() => {
    return combinedRecords.filter((r) => {
      const matchSearch =
        r.graduationYear.toString().includes(searchTerm) ||
        r.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.verificationStatus.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [combinedRecords, searchTerm]);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectBatch = (batchId: string) => {
    if (selectedBatchIds.includes(batchId)) {
      setSelectedBatchIds(selectedBatchIds.filter((id) => id !== batchId));
    } else {
      if (selectedBatchIds.length < 4) {
        setSelectedBatchIds([...selectedBatchIds, batchId]);
      }
    }
  };

  // Batches currently selected for comparison
  const comparedStats = statistics.filter((s) => selectedBatchIds.includes(s.batchId));

  const handleExportCSV = () => {
    window.open('/api/export?format=csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header and Toolbar */}
      <div className="stat-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Historical Placement Database
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive institutional placement archives from 2018 to present. Audited against official convocation reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Compare Trigger */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                showComparison
                  ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Batches ({selectedBatchIds.length})</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by year, batch, verification status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Batch Comparison Panel (When Active) */}
      {showComparison && (
        <div className="stat-card p-6 border-orange-200 dark:border-orange-900/40 bg-orange-50/20 dark:bg-orange-950/10">
          <div className="flex items-center justify-between pb-4 border-b border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Batch Comparison Matrix
              </h3>
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 pr-4 font-semibold text-slate-500 dark:text-slate-400">Metric</th>
                  {comparedStats.map((cs) => {
                    const b = batches.find((item) => item.id === cs.batchId);
                    return (
                      <th key={cs.id} className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        {b?.batchName}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Placement %</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {cs.placementPercentage.toFixed(2)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Highest Package</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      ₹{cs.highestPackageLPA.toFixed(2)} LPA
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Average Package</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 font-semibold text-orange-600 dark:text-orange-400">
                      ₹{cs.averagePackageLPA.toFixed(2)} LPA
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Median Package</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                      ₹{cs.medianPackageLPA.toFixed(2)} LPA
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Registered / Placed</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {cs.studentsPlaced} / {cs.registeredStudents}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Total Job Offers</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {cs.totalJobOffers}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 font-medium">Recruiting Companies</td>
                  {comparedStats.map((cs) => (
                    <td key={cs.id} className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {cs.recruitingCompaniesCount}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Sortable & Searchable Table */}
      <div className="stat-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="py-3 px-3 w-8">
                  <span className="sr-only">Compare</span>
                </th>
                <th
                  onClick={() => handleSort('graduationYear')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Batch / Year</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalBatchStrength')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Strength
                </th>
                <th
                  onClick={() => handleSort('registeredStudents')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Registered
                </th>
                <th
                  onClick={() => handleSort('studentsPlaced')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Placed
                </th>
                <th
                  onClick={() => handleSort('placementPercentage')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Placement %
                </th>
                <th
                  onClick={() => handleSort('highestPackageLPA')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Highest
                </th>
                <th
                  onClick={() => handleSort('averagePackageLPA')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Average
                </th>
                <th
                  onClick={() => handleSort('medianPackageLPA')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Median
                </th>
                <th
                  onClick={() => handleSort('totalJobOffers')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Offers
                </th>
                <th
                  onClick={() => handleSort('recruitingCompaniesCount')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  Recruiters
                </th>
                <th className="py-3 px-3 text-center font-semibold">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sortedRecords.map((record) => {
                const isSelected = selectedBatchIds.includes(record.batchId);
                return (
                  <tr
                    key={record.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-orange-50/30 dark:bg-orange-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectBatch(record.batchId)}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        title="Select for comparison"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {record.batchName}
                      </div>
                      <div className="text-[11px] text-slate-400">Class of {record.graduationYear}</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-medium">
                      {record.totalBatchStrength}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-medium">
                      {record.registeredStudents}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 dark:text-white font-bold">
                      {record.studentsPlaced}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {record.placementPercentage.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                      ₹{record.highestPackageLPA.toFixed(2)} L
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-orange-600 dark:text-orange-400">
                      ₹{record.averagePackageLPA.toFixed(2)} L
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                      ₹{record.medianPackageLPA.toFixed(2)} L
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 font-medium">
                      {record.totalJobOffers}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 font-medium">
                      {record.recruitingCompaniesCount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          record.verificationStatus === 'Officially Verified'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                        }`}
                      >
                        {record.verificationStatus === 'Officially Verified' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{record.verificationStatus.replace('Officially ', '')}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

'use strict';
'use client';

import React from 'react';
import { PlacementSource, PlacementStatistics, PlacementBatch } from '@/lib/types/placement';
import {
  Download,
  Printer,
  FileText,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Hash,
  Database
} from 'lucide-react';

interface ReportsDownloadsProps {
  sources: PlacementSource[];
  statistics: PlacementStatistics[];
  batches: PlacementBatch[];
}

export const ReportsDownloads: React.FC<ReportsDownloadsProps> = ({
  sources,
  statistics,
  batches
}) => {
  const handleDownloadCSV = () => {
    window.open('/api/export?format=csv', '_blank');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="stat-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reports, Official Sources &amp; Data Exports
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Export verified placement archives in open formats or inspect official institutional primary documents.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full CSV Archive</span>
            </button>

            <button
              onClick={handlePrintSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Executive Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Primary Sources Repository */}
      <div className="stat-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Verified Primary Document Registry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct URLs, publication timestamps, and SHA-256 validation hashes for institutional audit.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Audited Records</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sources.map((src) => (
            <div key={src.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {src.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {src.sourceType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {src.methodologyNotes}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Published: {src.publishedDate}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Hash className="w-3 h-3" /> Hash: {src.contentHash}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Open Document</span>
                  <ExternalLink className="w-3 h-3 text-orange-500" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Executive Snapshot Section */}
      <div className="stat-card p-6 bg-slate-50/50 dark:bg-slate-900/30">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Historical Benchmark Overview (19 Consecutive Graduating Batches: 2007–2025)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          High-level institutional milestone summary for academic and accreditation audits.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-2 pr-3">Graduation Year</th>
                <th className="py-2 px-3">Batch</th>
                <th className="py-2 px-3 text-right">Strength</th>
                <th className="py-2 px-3 text-right">Placed</th>
                <th className="py-2 px-3 text-right">Placement %</th>
                <th className="py-2 px-3 text-right">Average CTC</th>
                <th className="py-2 px-3 text-right">Highest CTC</th>
                <th className="py-2 pl-3 text-right">Total Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {statistics.slice(0, 10).map((s) => {
                const b = batches.find((item) => item.id === s.batchId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 pr-3 font-bold text-slate-900 dark:text-white">{s.graduationYear}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{b?.batchName}</td>
                    <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">{s.totalBatchStrength}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-900 dark:text-white">{s.studentsPlaced}</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{s.placementPercentage.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right font-semibold text-orange-600 dark:text-orange-400">₹{s.averagePackageLPA.toFixed(2)} L</td>
                    <td className="py-2 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">₹{s.highestPackageLPA.toFixed(2)} L</td>
                    <td className="py-2 pl-3 text-right font-medium text-slate-700 dark:text-slate-300">{s.totalJobOffers}</td>
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

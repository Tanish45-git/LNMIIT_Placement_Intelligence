'use strict';
'use client';

import React from 'react';
import { PlacementBatch, PlacementStatistics } from '@/lib/types/placement';
import { Calendar, ChevronDown, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  batches: PlacementBatch[];
  selectedBatch: PlacementBatch;
  onSelectBatch: (batch: PlacementBatch) => void;
  currentStat?: PlacementStatistics;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  batches,
  selectedBatch,
  onSelectBatch,
  currentStat
}) => {
  return (
    <section className="pt-8 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Title & Subtitle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                LNMIIT Jaipur Placement Intelligence Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Understanding Placements at LNMIIT
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              A comprehensive historical and real-time view of placement outcomes, verified recruiter records, branch benchmarks, and verified compensation analytics.
            </p>
          </div>

          {/* Batch Selector & Reporting Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative">
              <label htmlFor="batch-select" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Selected Graduating Batch
              </label>
              <div className="relative inline-block w-64">
                <select
                  id="batch-select"
                  value={selectedBatch.id}
                  onChange={(e) => {
                    const found = batches.find((b) => b.id === e.target.value);
                    if (found) onSelectBatch(found);
                  }}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm rounded-lg px-3.5 py-2.5 pr-8 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} {b.isCurrent ? '• Ongoing' : '• Audited'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 dark:text-slate-400 pt-5">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Verification Status Pill */}
            {currentStat && (
              <div className="pt-5 flex flex-col justify-end">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border ${
                    currentStat.verificationStatus === 'Officially Verified'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  {currentStat.verificationStatus === 'Officially Verified' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>{currentStat.verificationStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Batch Context Callout */}
        {selectedBatch.notes && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Methodology Note:</span>
              <span>{selectedBatch.notes}</span>
            </div>
            {currentStat && (
              <a
                href={currentStat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                <span>Source: {currentStat.sourceType}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

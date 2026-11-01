'use client';

import React from 'react';
import { PlacementBatch, PlacementStatistics } from '@/lib/types/placement';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Radio,
  ShieldCheck
} from 'lucide-react';

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
  const isCurrent = selectedBatch.isCurrent;
  const isVerified = currentStat?.verificationStatus === 'Officially Verified';

  return (
    <section className="py-5 sm:py-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span>The LNM Institute of Information Technology</span>
            <span aria-hidden="true">·</span>
            <span>Jaipur</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Placement overview
          </h1>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label htmlFor="batch-select" className="sr-only">
            Graduating batch
          </label>
          <div className="relative min-w-[190px] flex-1 sm:flex-none">
            <select
              id="batch-select"
              value={selectedBatch.id}
              onChange={(event) => {
                const batch = batches.find((item) => item.id === event.target.value);
                if (batch) onSelectBatch(batch);
              }}
              className="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:text-sm"
            >
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batchName}
                  {batch.isCurrent ? ' · Current cycle' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {currentStat && (
            <span
              className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-[10px] font-semibold sm:text-xs ${
                isVerified
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {isCurrent ? (
                <Radio className="h-3.5 w-3.5" />
              ) : isVerified ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock3 className="h-3.5 w-3.5" />
              )}
              {isCurrent ? 'Live cycle' : currentStat.verificationStatus}
            </span>
          )}

          {currentStat && (
            currentStat.sourceType === 'Secondary Tracker' ? (
              <span
                title={`${currentStat.sourceType}${selectedBatch.notes ? ` — ${selectedBatch.notes}` : ''}`}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                Secondary source
              </span>
            ) : (
              <a
                href={currentStat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`${currentStat.sourceType}${selectedBatch.notes ? ` — ${selectedBatch.notes}` : ''}`}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
              >
                Source
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )
          )}

        </div>
      </div>
    </section>
  );
};

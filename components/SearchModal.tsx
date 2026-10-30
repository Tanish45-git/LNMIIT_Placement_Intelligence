'use strict';
'use client';

import React, { useState, useMemo } from 'react';
import { Company, PlacementBatch, PlacementStatistics } from '@/lib/types/placement';
import { Search, X, Building2, Calendar, TrendingUp, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  batches: PlacementBatch[];
  statistics: PlacementStatistics[];
  onSelectBatch: (batch: PlacementBatch) => void;
  onNavigateTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  companies,
  batches,
  statistics,
  onSelectBatch,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!query.trim()) return [];
    return companies
      .filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.industry.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [companies, query]);

  const filteredBatches = useMemo(() => {
    if (!query.trim()) return [];
    return batches
      .filter(
        (b) =>
          b.batchName.toLowerCase().includes(query.toLowerCase()) ||
          b.graduationYear.toString().includes(query)
      )
      .slice(0, 5);
  }, [batches, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search LNMIIT companies, batch years (e.g. 2024, 2020), roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-3 max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Type to search recruiters (e.g. Amazon, Media.net), graduating batches (2007–2025), or branch analytics.
            </div>
          ) : (
            <>
              {filteredCompanies.length > 0 && (
                <div className="py-2 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-slate-400 px-2">
                    Recruiting Organizations
                  </span>
                  {filteredCompanies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigateTab('companies');
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.industry}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {c.tier}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredBatches.length > 0 && (
                <div className="py-2 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-slate-400 px-2">
                    Graduating Batches
                  </span>
                  {filteredBatches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBatch(b);
                        onNavigateTab('overview');
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{b.batchName}</div>
                          <div className="text-[11px] text-slate-500">Graduation Year {b.graduationYear}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {filteredCompanies.length === 0 && filteredBatches.length === 0 && (
                <div className="p-4 text-center text-slate-400">
                  No direct matches found for &quot;{query}&quot;. Try searching for &quot;2024&quot;, &quot;Microsoft&quot;, or &quot;Amazon&quot;.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

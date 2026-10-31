'use client';

import React, { useState, useEffect } from 'react';
import {
  PlacementBatch,
  PlacementStatistics,
  BranchStatistics,
  Company,
  CompanyRecruitmentRecord,
  InternshipStatistics,
  PlacementSource
} from '@/lib/types/placement';
import {
  getBatches,
  getStatistics,
  getBranchStatistics,
  getCompanies,
  getCompanyRecruitment,
  getInternshipStatistics,
  getSources
} from '@/lib/supabase';

import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { KPICards } from '@/components/KPICards';
import { PlacementTrends } from '@/components/PlacementTrends';
import { YearWiseRecords } from '@/components/YearWiseRecords';
import { BranchAnalytics } from '@/components/BranchAnalytics';
import { CompanyDirectory } from '@/components/CompanyDirectory';
import { PackageAnalytics } from '@/components/PackageAnalytics';
import { InternshipAnalytics } from '@/components/InternshipAnalytics';
import { ReportsDownloads } from '@/components/ReportsDownloads';
import { AboutDataSection } from '@/components/AboutDataModal';
import { SearchModal } from '@/components/SearchModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Data states
  const [batches, setBatches] = useState<PlacementBatch[]>([]);
  const [statistics, setStatistics] = useState<PlacementStatistics[]>([]);
  const [branchStats, setBranchStats] = useState<BranchStatistics[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruitment, setRecruitment] = useState<CompanyRecruitmentRecord[]>([]);
  const [internships, setInternships] = useState<InternshipStatistics[]>([]);
  const [sources, setSources] = useState<PlacementSource[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<PlacementBatch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load placement data
  const loadData = async () => {
    try {
      const [b, s, br, c, r, i, src] = await Promise.all([
        getBatches(),
        getStatistics(),
        getBranchStatistics(),
        getCompanies(),
        getCompanyRecruitment(),
        getInternshipStatistics(),
        getSources()
      ]);

      setBatches(b);
      setStatistics(s);
      setBranchStats(br);
      setCompanies(c);
      setRecruitment(r);
      setInternships(i);
      setSources(src);

      // Default to Class of 2026 (Live Ongoing Drive)
      if (!selectedBatch && b.length > 0) {
        const defaultBatch = b.find((item) => item.graduationYear === 2026) || b[0];
        setSelectedBatch(defaultBatch);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync theme with html root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  if (isLoading || !selectedBatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            Loading LNMIIT Placement Intelligence...
          </p>
        </div>
      </div>
    );
  }

  // Find stats for current selected batch and previous year for YoY delta
  const currentStat = statistics.find((s) => s.batchId === selectedBatch.id);
  const previousStat = statistics.find(
    (s) => s.graduationYear === selectedBatch.graduationYear - 1
  );
  const comparablePreviousStat = selectedBatch.status === 'completed' ? previousStat : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Institutional Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        {activeTab === 'overview' && (
          <div className="pt-6">
            <HeroSection
              batches={batches}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              currentStat={currentStat}
            />
          </div>
        )}

        {/* Tab-driven Content Switcher */}
        <div className={`${activeTab === 'overview' ? 'mt-7' : 'mt-6'} space-y-8`}>
          {activeTab === 'overview' && (
            <>
              {/* Primary KPI Cards */}
              {currentStat && (
                <KPICards currentStat={currentStat} previousStat={comparablePreviousStat} />
              )}

              {/* Multi-Year Interactive Trends */}
              <PlacementTrends statistics={statistics} batches={batches} isDark={isDark} />
            </>
          )}

          {activeTab === 'years' && (
            <YearWiseRecords batches={batches} statistics={statistics} />
          )}

          {activeTab === 'branches' && (
            <BranchAnalytics branchStats={branchStats} isDark={isDark} />
          )}

          {activeTab === 'companies' && (
            <CompanyDirectory companies={companies} recruitmentRecords={recruitment} />
          )}

          {activeTab === 'packages' && (
            <PackageAnalytics statistics={statistics} isDark={isDark} />
          )}

          {activeTab === 'internships' && (
            <InternshipAnalytics internshipStats={internships} isDark={isDark} />
          )}

          {activeTab === 'reports' && (
            <ReportsDownloads sources={sources} statistics={statistics} batches={batches} />
          )}

          {activeTab === 'about' && <AboutDataSection />}
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b101d] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              LNMIIT Placement Intelligence Portal
            </span>
            <span>• Independent Audited Placement Analytics</span>
          </div>
          <a
            href="https://placements.lnmiit.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors"
          >
            Official T&amp;P Portal
          </a>
        </div>
      </footer>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        companies={companies}
        batches={batches}
        statistics={statistics}
        onSelectBatch={setSelectedBatch}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}

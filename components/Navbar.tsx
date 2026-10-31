'use strict';
'use client';

import React from 'react';
import {
  Moon,
  Sun,
  Search
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenSearch
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'years', label: 'Year-wise Records' },
    { id: 'branches', label: 'Branch Analytics' },
    { id: 'companies', label: 'Companies' },
    { id: 'packages', label: 'Package Analytics' },
    { id: 'internships', label: 'Internships & PPO' },
    { id: 'reports', label: 'Reports' },
    { id: 'about', label: 'About Data' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-900 dark:bg-blue-700 text-white shadow-sm">
              <span className="font-extrabold text-sm tracking-tighter">LN</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap font-bold text-slate-900 dark:text-white text-[15px] tracking-tight">
                  <span className="sm:hidden">LNMIIT Portal</span>
                  <span className="hidden sm:inline">LNMIIT Placement Intelligence</span>
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
                  Placement portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                The LNM Institute of Information Technology, Jaipur
              </p>
            </div>
          </div>

          {/* Action Utilities */}
          <div className="flex items-center gap-2">
            {/* Quick Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
              title="Search companies, years, branches (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search portal...</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Main navigation" className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white dark:bg-blue-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

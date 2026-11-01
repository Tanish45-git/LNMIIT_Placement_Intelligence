'use strict';
'use client';

import React from 'react';
import { PlacementStatistics } from '@/lib/types/placement';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Building2,
  Percent,
  ExternalLink
} from 'lucide-react';

interface KPICardsProps {
  currentStat: PlacementStatistics;
  previousStat?: PlacementStatistics;
}

export const KPICards: React.FC<KPICardsProps> = ({ currentStat, previousStat }) => {
  const cards = [
    {
      id: 'highest-package',
      title: 'Highest Package',
      value: `₹${currentStat.highestPackageLPA.toFixed(2)} LPA`,
      prevValue: previousStat ? `₹${previousStat.highestPackageLPA.toFixed(2)} LPA` : undefined,
      delta: previousStat
        ? currentStat.highestPackageLPA - previousStat.highestPackageLPA
        : undefined,
      deltaUnit: ' LPA',
      isPositiveGood: true,
      icon: Award,
      accent: 'text-amber-500',
      description: 'Maximum verified domestic/global CTC'
    },
    {
      id: 'average-package',
      title: 'Average Package',
      value: `₹${currentStat.averagePackageLPA.toFixed(2)} LPA`,
      prevValue: previousStat ? `₹${previousStat.averagePackageLPA.toFixed(2)} LPA` : undefined,
      delta: previousStat
        ? currentStat.averagePackageLPA - previousStat.averagePackageLPA
        : undefined,
      deltaUnit: ' LPA',
      isPositiveGood: true,
      icon: TrendingUp,
      accent: 'text-blue-700 dark:text-blue-300',
      description: 'Mean CTC across all placed offers'
    },
    {
      id: 'median-package',
      title: 'Median Package',
      value: `₹${currentStat.medianPackageLPA.toFixed(2)} LPA`,
      prevValue: previousStat ? `₹${previousStat.medianPackageLPA.toFixed(2)} LPA` : undefined,
      delta: previousStat
        ? currentStat.medianPackageLPA - previousStat.medianPackageLPA
        : undefined,
      deltaUnit: ' LPA',
      isPositiveGood: true,
      icon: TrendingUp,
      accent: 'text-blue-500',
      description: '50th percentile CTC (less skewed by outliers)'
    },
    {
      id: 'placement-percentage',
      title: 'Placement Percentage',
      value: `${currentStat.placementPercentage.toFixed(2)}%`,
      prevValue: previousStat ? `${previousStat.placementPercentage.toFixed(2)}%` : undefined,
      delta: previousStat
        ? currentStat.placementPercentage - previousStat.placementPercentage
        : undefined,
      deltaUnit: ' pp',
      isPositiveGood: true,
      icon: Percent,
      accent: 'text-emerald-500',
      description: `${currentStat.studentsPlaced} placed of ${currentStat.registeredStudents} registered`
    },
    {
      id: 'students-placed',
      title: 'Total Students Placed',
      value: currentStat.studentsPlaced.toLocaleString(),
      prevValue: previousStat ? previousStat.studentsPlaced.toLocaleString() : undefined,
      delta: previousStat ? currentStat.studentsPlaced - previousStat.studentsPlaced : undefined,
      deltaUnit: '',
      isPositiveGood: true,
      icon: Users,
      accent: 'text-indigo-500',
      description: `Out of ${currentStat.totalBatchStrength} total graduating strength`
    },
    {
      id: 'total-job-offers',
      title: 'Total Job Offers',
      value: currentStat.totalJobOffers.toLocaleString(),
      prevValue: previousStat ? previousStat.totalJobOffers.toLocaleString() : undefined,
      delta: previousStat ? currentStat.totalJobOffers - previousStat.totalJobOffers : undefined,
      deltaUnit: '',
      isPositiveGood: true,
      icon: Briefcase,
      accent: 'text-violet-500',
      description: 'Includes multiple tier selections & conversions'
    },
    {
      id: 'recruiting-companies',
      title: 'Recruiting Companies',
      value: currentStat.recruitingCompaniesCount.toLocaleString(),
      prevValue: previousStat ? previousStat.recruitingCompaniesCount.toLocaleString() : undefined,
      delta: previousStat
        ? currentStat.recruitingCompaniesCount - previousStat.recruitingCompaniesCount
        : undefined,
      deltaUnit: '',
      isPositiveGood: true,
      icon: Building2,
      accent: 'text-teal-500',
      description: 'Participating on-campus & verified recruiters'
    }
  ];

  return (
    <div className="space-y-3">
      {previousStat && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Change compared with Class of {previousStat.graduationYear}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 max-[360px]:grid-cols-1 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="stat-card flex min-w-0 flex-col justify-between overflow-hidden p-3 group sm:p-5"
          >
            <div>
              {/* Header: Title and Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 ${card.accent}`}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:mt-3 sm:gap-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                  {card.value}
                </h3>
                {card.delta !== undefined && (
                  <span
                    className={`rounded px-1 py-0.5 text-[10px] font-semibold sm:px-1.5 sm:text-xs ${
                      card.delta >= 0
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}
                  >
                    {card.delta >= 0 ? '+' : ''}
                    {typeof card.delta === 'number' && card.delta % 1 !== 0
                      ? card.delta.toFixed(2)
                      : card.delta}
                    {card.deltaUnit}
                  </span>
                )}
              </div>

              {/* Micro description */}
              <p className="mt-1 text-[10px] font-medium leading-4 text-slate-500 dark:text-slate-400 sm:text-xs sm:leading-normal">
                {card.description}
              </p>
            </div>

            {currentStat.sourceType !== 'Secondary Tracker' && (
              <div className="mt-3 flex items-center justify-between gap-1 border-t border-slate-100 pt-2 text-[9px] text-slate-400 dark:border-slate-800/60 dark:text-slate-500 sm:mt-4 sm:pt-3 sm:text-[11px]">
                <div className="flex items-center gap-1.5 truncate max-w-[170px]" title={currentStat.sourceType}>
                  <a
                    href={currentStat.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <span className="truncate">{currentStat.sourceType}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

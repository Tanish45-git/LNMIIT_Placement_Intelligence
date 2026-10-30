'use strict';
'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Scale,
  Users,
  Briefcase,
  Award
} from 'lucide-react';

export const AboutDataSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="stat-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Data Governance &amp; Verification Methodology
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent reporting standards, definition of statistical metrics, and source verification tiers.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status Classifications */}
      <div className="stat-card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>The Three Verification Tiers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Officially Verified */}
          <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Officially Verified</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Statistics directly sourced and cross-referenced from statutory LNMIIT Annual Reports, Convocation Audit Booklets, or signed T&amp;P releases.
            </p>
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold pt-1">
              Confidence: 100% (Audited)
            </div>
          </div>

          {/* Secondary Source */}
          <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Secondary Source</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Data obtained from NIRF engineering filings, press releases, or recruiter announcements awaiting final convocation publication.
            </p>
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold pt-1">
              Confidence: Provisional
            </div>
          </div>

          {/* Awaiting Verification */}
          <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Awaiting Verification</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ongoing recruitment drives (such as the Class of 2025) where offers are in-progress and final consolidation has not yet occurred.
            </p>
            <div className="text-[11px] text-blue-800 dark:text-blue-300 font-semibold pt-1">
              Confidence: Rolling Updates
            </div>
          </div>
        </div>
      </div>

      {/* Critical Methodology Distinctions */}
      <div className="stat-card p-6 space-y-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Mathematical Definitions &amp; Methodology Guardrails
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              <Users className="w-4 h-4 text-orange-500" />
              <span>Placed Students vs. Total Job Offers</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Placed Students</strong> represents unique individual students who secured at least one employment offer. <strong>Total Job Offers</strong> accounts for all multiple job offers received by students across various company tiers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Registered Students vs. Total Batch Strength</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Total Batch Strength</strong> is the total enrolled cohort in the graduating year. <strong>Registered Students</strong> denotes students participating in campus placement; students pursuing Higher Studies, Entrepreneurship, or Civil Services opt out of registration.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Internship Offers vs. Full-Time Roles</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Summer stipends (e.g. ₹1.25L/month) are recorded exclusively under internship analytics and never converted into annual LPA equivalents to artificially inflate starting packages.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              <Award className="w-4 h-4 text-violet-500" />
              <span>On-Campus vs. Off-Campus Verification</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Off-campus and international offers (such as 63.27 LPA or Google offers) are only included when formally certified by the LNMIIT Training &amp; Placement Cell with verified offer letter submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

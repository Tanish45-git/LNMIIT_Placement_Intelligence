'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import livePlacementData from '@/lib/data/live_placements.json';

interface LivePlacementRecord {
  _id: string;
  companyName: string;
  role: string;
  type: string;
  ctc: number | null;
  cgpa: number | string | null;
  studentsPlaced: number;
  status: string;
  eligibleBranches: string[];
}

const records = livePlacementData.data as LivePlacementRecord[];

const formatPackage = (value: number | null) =>
  value === null
    ? 'Not disclosed'
    : `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value)} LPA`;

export const LiveDriveTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('all');
  const [status, setStatus] = useState('all');

  const branches = useMemo(
    () => [...new Set(records.flatMap((record) => record.eligibleBranches))].sort(),
    []
  );
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter((record) => {
        const matchesSearch =
          !query ||
          record.companyName.toLowerCase().includes(query) ||
          record.role.toLowerCase().includes(query) ||
          record.type.toLowerCase().includes(query);
        const matchesBranch = branch === 'all' || record.eligibleBranches.includes(branch);
        const matchesStatus = status === 'all' || record.status.toLowerCase() === status.toLowerCase();
        return matchesSearch && matchesBranch && matchesStatus;
      })
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [branch, search, status]);

  const completedCount = records.filter((record) => record.status === 'Completed').length;
  const pendingCount = records.filter((record) => record.status === 'Pending').length;

  return (
    <section className="stat-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              Current placement drive
            </h2>
            <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              {records.length} opportunities
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
            Recruiter requirements and selection progress from the current drive.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {completedCount} completed
          </span>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            {pendingCount} pending
          </span>
        </div>
      </div>

      <div className="grid gap-2 border-b border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-[minmax(220px,1fr)_180px_180px] sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search opportunities</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company or role..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
        <label>
          <span className="sr-only">Filter by eligible branch</span>
          <select
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="all">All branches</option>
            {branches.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by opportunity status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="all">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
            <tr>
              <th className="w-12 px-4 py-3 text-right font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Branches</th>
              <th className="px-4 py-3 font-semibold">Type / role</th>
              <th className="px-4 py-3 font-semibold">Min. CGPA</th>
              <th className="px-4 py-3 font-semibold">CTC</th>
              <th className="px-4 py-3 text-center font-semibold">Placed</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRecords.map((record, index) => {
              const isCompleted = record.status.toLowerCase() === 'completed';
              return (
                <tr
                  key={record._id}
                  className="transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{record.companyName}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex max-w-48 flex-wrap gap-1">
                      {record.eligibleBranches.map((item) => (
                        <span
                          key={item}
                          className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{record.type}</span>
                    <p className="mt-0.5 max-w-48 truncate text-[10px] text-slate-500 dark:text-slate-400" title={record.role}>
                      {record.role}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-300">
                    {record.cgpa === null
                      ? '—'
                      : typeof record.cgpa === 'number'
                        ? record.cgpa.toFixed(1)
                        : record.cgpa}
                  </td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {formatPackage(record.ctc)}
                  </td>
                  <td className="px-4 py-3.5 text-center font-medium tabular-nums text-slate-700 dark:text-slate-200">
                    {record.studentsPlaced}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {record.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  No opportunities match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-5">
        CGPA cutoffs are copied from a{' '}
        <a
          href="https://placementupdated.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
        >
          prior-drive reference
        </a>{' '}
        and may be outdated. Confirm current eligibility with the recruiter. A dash means the value was not disclosed.
      </p>
    </section>
  );
};

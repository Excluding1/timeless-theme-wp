import React from 'react';
import { cn } from '../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-slate-200 rounded", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <Skeleton className="h-9 w-72" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4"><Skeleton className="h-3 w-20" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-slate-100">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="p-4"><Skeleton className="h-4 w-24" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}

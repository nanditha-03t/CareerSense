import React from 'react';
import { Link } from 'react-router-dom';

export default function StatCard({
  title,
  value,
  supportingText,
  icon: Icon,
  className = '',
  to,
}) {
  const content = (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors ${
        to ? 'hover:shadow-2xs cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs sm:text-sm font-medium text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {supportingText}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}

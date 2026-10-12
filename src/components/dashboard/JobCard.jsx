import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export default function JobCard({
  title,
  company,
  match,
  skills = [],
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between gap-3">
      {/* Top: Title, Company & Match Percentage */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company}</span>
          </div>
        </div>

        {/* Match Percentage Badge */}
        {typeof match === 'number' ? (
          <div className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{match}% Match</span>
          </div>
        ) : (
          <div className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
            <span>Add Skills</span>
          </div>
        )}
      </div>

      {/* Middle: Required Skills Tags */}
      <div>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Required Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: Action */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">On-Campus Drive</span>
        <Link to="/jobs">
          <Button variant="secondary" size="sm">
            View Job
          </Button>
        </Link>
      </div>
    </div>
  );
}

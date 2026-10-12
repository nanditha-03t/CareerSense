import React from 'react';
import Badge from '../ui/Badge';
import { ChevronRight } from 'lucide-react';

export default function SkillGapItem({
  skill,
  priority = 'Medium Priority',
  category,
  onAction,
}) {
  const getBadgeVariant = (pri) => {
    const lower = pri.toLowerCase();
    if (lower.includes('high')) return 'high';
    if (lower.includes('medium')) return 'medium';
    if (lower.includes('low')) return 'low';
    return 'default';
  };

  return (
    <div
      onClick={onAction}
      className={`flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3 ${
        onAction ? 'cursor-pointer hover:border-blue-200' : ''
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 truncate">
            {skill}
          </span>
          {category && (
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              • {category}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Recommended target for upcoming on-campus drives
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={getBadgeVariant(priority)}>
          {priority}
        </Badge>
        {onAction && (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </div>
    </div>
  );
}

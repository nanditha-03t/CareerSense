import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

export default function ProfileCompletion({
  completionPercentage = 0,
  missingFields = [],
}) {
  const isComplete = completionPercentage >= 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Info & Progress Bar */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
            <UserCheck className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                {isComplete ? 'Profile Completed' : 'Profile Completion Status'}
              </h3>
              <span className="text-sm font-bold text-blue-600 lg:hidden">
                {completionPercentage}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isComplete
                ? 'Your student profile is complete and fully synchronized for campus placement drives.'
                : 'Complete your profile to unlock personalized job matches, accurate CGPA eligibility, and placement insights.'}
            </p>

            <div className="mt-3 flex items-center gap-3 max-w-md">
              <div className="flex-1">
                <ProgressBar
                  value={completionPercentage}
                  size="md"
                  barClassName={isComplete ? 'bg-emerald-600' : 'bg-blue-600'}
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden lg:inline shrink-0">
                {completionPercentage}%
              </span>
            </div>

            {/* Missing fields breakdown chips */}
            {!isComplete && Array.isArray(missingFields) && missingFields.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">Missing:</span>
                {missingFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium"
                  >
                    + {field}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="shrink-0 pt-1 lg:pt-0">
          <Link to="/profile" className="block sm:inline-block">
            <Button
              variant={isComplete ? 'secondary' : 'primary'}
              size="md"
              fullWidth
              className="sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isComplete ? 'View Profile' : 'Complete Profile'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

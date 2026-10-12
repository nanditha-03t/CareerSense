import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  UserCheck,
  Briefcase,
  GitCompare,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

const ACTIONS = [
  {
    label: 'Add Skill',
    desc: 'Update your tech stack',
    path: '/skills',
    icon: Wrench,
    accent: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    label: 'Update Profile',
    desc: 'Keep academics current',
    path: '/profile',
    icon: UserCheck,
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    label: 'Explore Jobs',
    desc: 'Browse campus drives',
    path: '/jobs',
    icon: Briefcase,
    accent: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    label: 'Check Skill Gap',
    desc: 'Target missing skills',
    path: '/skill-gap',
    icon: GitCompare,
    accent: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    label: 'Track Application',
    desc: 'View drive statuses',
    path: '/applications',
    icon: FileCheck2,
    accent: 'text-slate-700 bg-slate-100 border-slate-200',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
          Quick Actions
        </h3>
        <span className="text-xs text-slate-400 hidden sm:inline">• Jump directly to key placement tasks</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="group p-3 rounded-lg border border-slate-100 hover:border-slate-300 bg-slate-50/60 hover:bg-white hover:shadow-2xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md border shrink-0 ${action.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {action.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

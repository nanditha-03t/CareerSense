import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Brand({ showTagline = false, size = 'default', className = '' }) {
  const isLarge = size === 'large';
  
  return (
    <Link to="/login" className={`inline-flex items-center gap-2.5 text-slate-900 group ${className}`}>
      <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold shadow-sm ${
        isLarge ? 'w-10 h-10' : 'w-8 h-8'
      }`}>
        <GraduationCap className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 ${
            isLarge ? 'text-2xl' : 'text-xl'
          }`}>
            CareerSense
          </span>
          <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Campus
          </span>
        </div>
        {showTagline && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Campus Placement &amp; Skill Gap Platform
          </p>
        )}
      </div>
    </Link>
  );
}

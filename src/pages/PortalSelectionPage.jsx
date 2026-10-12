import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import Brand from '../components/ui/Brand';
import Card from '../components/ui/Card';
import { isAuthenticated, isAdmin } from '../utils/auth';

/**
 * Portal Selection Landing Page (/login)
 * Allows students and institutional administrators to select their dedicated authentication portal.
 */
export default function PortalSelectionPage() {
  const navigate = useNavigate();

  // If already authenticated, redirect immediately to the appropriate role dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 hidden sm:inline">New student?</span>
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Register Student Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <span>Campus Placement & Skill Gap Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome to CareerSense
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Please choose your account portal to sign in to your placement intelligence workspace.
            </p>
          </div>

          {/* Two Distinct Portal Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: STUDENT PORTAL */}
            <div className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Student Portal</h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                      B.Tech
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Access your personalized placement dashboard, test skill gap readiness, explore verified campus drives, and manage your placement profile.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Deterministic Skill Gap Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Campus Recruitment Drives & Preparation Roadmaps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Private Resume Management & Placement Tracker</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <Link
                  to="/student/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  <span>Student Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center mt-3">
                  <Link
                    to="/signup"
                    className="text-xs text-slate-500 hover:text-blue-600 hover:underline"
                  >
                    Don't have an account? Create Student Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 2: ADMIN & TPO PORTAL */}
            <div className="bg-white border-2 border-slate-200 hover:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Admin / TPO Portal</h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                      Placement Cell
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Institutional portal for Training & Placement Officers and faculty administrators to manage drives, review students, and update application milestones.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Live MongoDB Analytics & Placement Statistics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Manage Verified Drives & External Vacancies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Official Application Status & Milestone Authorization</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <Link
                  to="/admin/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  <span>Administrator Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center mt-3">
                  <span className="text-xs text-slate-400">
                    Restricted to authorized placement cell staff
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <p>
          CareerSense – Campus Placement & Skill Gap Analysis Platform • MLR Institute of Technology
        </p>
      </footer>
    </div>
  );
}

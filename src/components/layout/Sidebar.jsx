import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wrench,
  Briefcase,
  GitCompare,
  FileCheck2,
  BookOpenCheck,
  FolderGit2,
  Award,
  Settings,
  LogOut,
  X,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { logoutUser, isAdmin } from '../../utils/auth';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'My Skills', path: '/skills', icon: Wrench },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Skill Gap', path: '/skill-gap', icon: GitCompare },
  { name: 'Applications', path: '/applications', icon: FileCheck2 },
  { name: 'Preparation', path: '/preparation', icon: BookOpenCheck },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Certifications', path: '/certifications', icon: Award },
  { name: 'Admin / TPO', path: '/admin', icon: ShieldCheck, badge: 'Staff', adminOnly: true },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between bg-white select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                CareerSense
              </span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider -mt-1">
                Campus Placement
              </span>
            </div>
          </div>
          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_LINKS.filter((item) => !item.adminOnly || isAdmin()).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-3 border-t border-slate-200 space-y-1">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
            location.pathname === '/settings'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings
            className={`w-4 h-4 shrink-0 ${
              location.pathname === '/settings' ? 'text-blue-600' : 'text-slate-400'
            }`}
          />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-slate-200 bg-white min-h-screen">
        <div className="sticky top-0 h-screen">
          {navContent}
        </div>
      </aside>

      {/* Mobile / Tablet slide-out drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-lg z-50 flex flex-col">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

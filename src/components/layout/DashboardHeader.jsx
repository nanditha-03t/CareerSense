import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { getCurrentUser, logoutUser, isAdmin } from '../../utils/auth';

export default function DashboardHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentUser = getCurrentUser();
  const rawName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.email?.split('@')[0] ||
    'Student';
  const displayName = rawName.split(' ')[0];
  const initial = (displayName || 'S').charAt(0).toUpperCase();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block truncate mt-0.5">
              Campus placement preparation and skill readiness companion.
            </p>
          </div>
        </div>

        {/* Right: Admin Portal link (if admin), Notification, Profile chip with dropdown, Visible Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {isAdmin() && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin / TPO Portal</span>
            </Link>
          )}

          {/* Notification Icon */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Notifications"
            title="Campus placement updates"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* User Profile Pill / Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center shrink-0">
                {initial}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-800 hidden md:inline">
                {displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-sm py-1.5 z-40 text-xs sm:text-sm">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">
                      {currentUser?.name || currentUser?.fullName || 'Student'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || ''}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings</span>
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-blue-700 hover:bg-blue-50 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Admin / TPO Portal</span>
                    </Link>
                  )}
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Dedicated Header Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Mobile-only subtitle */}
      <div className="px-4 pb-2.5 sm:hidden border-t border-slate-100 pt-2 bg-slate-50/60">
        <p className="text-xs text-slate-500">
          Track your placement preparation and see where you can improve.
        </p>
      </div>
    </header>
  );
}

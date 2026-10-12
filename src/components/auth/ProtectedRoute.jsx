import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';

/**
 * ProtectedRoute Component
 * Guards student routes.
 * 1. Redirects unauthenticated users to /student/login.
 * 2. Redirects administrator accounts to /admin.
 * Preserves intended location in navigation state for seamless return after login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  const user = getCurrentUser();
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

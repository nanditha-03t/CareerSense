import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifyServerSession } from '../../utils/auth';
import { Loader2 } from 'lucide-react';

/**
 * AdminRoute Component
 * Guards administrative routes with both local token checks AND server-side role verification.
 * Students attempting to access /admin by URL manipulation are redirected to /dashboard.
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      if (!isAuthenticated()) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }

      try {
        // Query server directly to verify JWT and MongoDB role
        const user = await verifyServerSession();
        if (isMounted) {
          if (user && user.role === 'admin') {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
          setIsVerifying(false);
        }
      } catch {
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    // Non-admin student accounts attempting to access /admin are redirected to Student Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

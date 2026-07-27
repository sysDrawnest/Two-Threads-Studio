import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireAuth: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative w-10 h-10 mb-3">
          <div className="absolute inset-0 rounded-full border border-outline-variant/30" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-primary animate-spin" />
        </div>
        <p className="font-serif text-xs tracking-widest text-on-surface-variant uppercase animate-pulse">
          Verifying Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and store the original path they wanted to visit
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

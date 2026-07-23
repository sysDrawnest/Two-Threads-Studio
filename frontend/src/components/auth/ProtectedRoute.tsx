import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

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

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/auth/access-denied" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

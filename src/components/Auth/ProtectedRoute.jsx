import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-amoled-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-amoled-text mb-4">Access Denied</h2>
        <p className="text-amoled-muted mb-6">
          You need {requiredRole} access to view this page.
        </p>
        {requiredRole === 'pro' && (
          <Link to="/upgrade" className="btn-primary">
            Upgrade to Pro
          </Link>
        )}
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
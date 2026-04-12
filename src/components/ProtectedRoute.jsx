import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { ShieldAlert, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ paddingTop: '12rem', textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin text-red" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <ShieldAlert size={64} className="text-red" style={{ marginBottom: '1rem' }} />
        <h2>Access Denied</h2>
        <p className="text-muted">You don't have the required permissions to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

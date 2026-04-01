import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * A component to wrap protected routes.
 * Redirects unauthenticated users to the /account login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

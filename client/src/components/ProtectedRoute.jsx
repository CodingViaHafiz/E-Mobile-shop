import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { COLORS } from '../constants/designTokens';
import { getRoleHomePath } from '../utils/authRedirects';

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
            style={{
              borderColor: COLORS.primary.main,
              borderTopColor: "transparent",
            }}
          ></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHomePath(user)} replace />;
  }

  return children;
};

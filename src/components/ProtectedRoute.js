import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // This import should now work
import { CircularProgress, Box } from '@mui/material';

export const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // Save the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    }
  }, [authState.isAuthenticated, location]);

  if (authState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if token exists
  if (!authState.token) {
    console.error("User authenticated but token is missing");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
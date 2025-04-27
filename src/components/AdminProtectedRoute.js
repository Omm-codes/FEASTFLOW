import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

export const AdminProtectedRoute = ({ children }) => {
  const { authState, isAdmin } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      // Check admin credentials from various sources
      const adminToken = localStorage.getItem('adminToken');
      const isAdminFlag = localStorage.getItem('isAdmin') === 'true';
      const hasAdminRole = authState.user?.role === 'admin';
      
      // If user has admin access via any method
      if (adminToken || isAdminFlag || hasAdminRole) {
        console.log('User has admin credentials, allowing access');
        setIsAuthorized(true);
      } else {
        console.log('User lacks admin credentials, redirecting to admin login');
        setIsAuthorized(false);
      }
      
      setIsChecking(false);
    };
    
    if (!authState.loading) {
      checkAdminStatus();
    }
  }, [authState.loading, authState.user]);

  if (authState.loading || isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
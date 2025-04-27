import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the return path from location state, query params, or session storage
  const returnTo = 
    location.state?.returnTo || 
    new URLSearchParams(location.search).get('returnTo') || 
    sessionStorage.getItem('redirectAfterLogin') || 
    '/';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (authState.isAuthenticated) {
      // Clear any stored redirect paths
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(returnTo);
    }
    
    // Display auth errors from context if any
    if (authState.error) {
      setError(authState.error);
    }
  }, [authState.isAuthenticated, authState.error, navigate, returnTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Basic validation
      if (!email.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      
      if (!password) {
        setError('Password is required');
        setLoading(false);
        return;
      }
      
      console.log('Attempting login with email:', email);
      const success = await login({ email, password });
      
      if (success) {
        console.log('Login successful, redirecting to:', returnTo);
        
        // Clear the stored redirect path
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Navigate to the return path
        navigate(returnTo);
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login - Feast Flow">
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            p: 2,
            width: '100%',
          }}
        >
          <CardContent>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{
                fontWeight: 600,
                color: '#023047',
                mb: 1,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Welcome Back
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
              Login to FeastFlow
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}

            {location.state?.message && (
              <Alert
                severity="info"
                sx={{ mb: 2 }}
              >
                {location.state.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#ffb703',
                  color: '#000',
                  fontWeight: 600,
                  borderRadius: '30px',
                  '&:hover': {
                    backgroundColor: '#ffaa00',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                Don't have an account?{' '}
                <Box
                  component="span"
                  sx={{ color: '#219ebc', cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default Login;

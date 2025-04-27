import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Layout from '../../components/Layout/Layout';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Fix the infinite redirect loop by adding proper checks
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if admin token exists
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminToken) {
          // Verify the token is valid by making a test request
          const response = await fetch('http://localhost:5001/api/admin/orders', {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });
          
          if (response.ok) {
            // Token is valid, navigate to dashboard
            navigate('/admin/dashboard');
            return;
          } else {
            // Token is invalid, clear it
            console.log('Admin token invalid, clearing...');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('isAdmin');
          }
        }
        
        setCheckingAuth(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setCheckingAuth(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Check if the user is an admin
      if (data.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.name || 'Admin User');
        localStorage.setItem('adminEmail', data.email);
        navigate('/admin/dashboard');
      } else {
        setError('You are not authorized as an admin');
      }
    } catch (error) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 2,
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#023047', mr: 1 }} />
              <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: '#023047', fontFamily: "'Poppins', sans-serif" }}>
                Admin Login
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Enter your credentials to access the admin dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#023047',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#023047',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#023047',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#023047',
                  },
                }}
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
                  borderRadius: '20px',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#ffaa00',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}

export default AdminLogin;
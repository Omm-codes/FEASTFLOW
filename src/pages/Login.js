import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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
              <Typography
                color="error"
                align="center"
                sx={{ mb: 2, fontWeight: 500 }}
              >
                {error}
              </Typography>
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
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                Sign In
              </Button>

              {/* Optional: Add Signup link */}
              <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                Don’t have an account?{' '}
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

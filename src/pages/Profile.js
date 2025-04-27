import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const auth = useAuth();
  // For debugging
  useEffect(() => {
    console.log("Auth context:", auth);
    console.log("User data:", auth.user || auth.authState?.user);
  }, [auth]);
  
  // Try accessing user data from authState if direct access doesn't work
  const user = auth.user || auth.authState?.user;

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          {user ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="h6">{user.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="h6">{user.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="h6">{user.role}</Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1">
              No profile information available. Please log in again.
              <pre>Debug: {JSON.stringify(auth, null, 2)}</pre>
            </Typography>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;
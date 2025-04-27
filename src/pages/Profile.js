import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { 
  Container, Paper, Typography, Box, Grid, Avatar, 
  Button, styled, useTheme, IconButton
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `3px solid #fff`,
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const InfoCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f8f9fa',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  marginBottom: theme.spacing(2),
}));

const Profile = () => {
  const theme = useTheme();
  const { authState, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(null);
  
  // For debugging
  useEffect(() => {
    console.log("Auth context:", authState);
    console.log("User data:", authState?.user);
    
    // Load saved avatar from localStorage if it exists
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, [authState]);
  
  // Try accessing user data from authState
  const user = authState?.user;
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarDataUrl = e.target.result;
        setAvatar(avatarDataUrl);
        localStorage.setItem('userAvatar', avatarDataUrl);
        
        // Update the user object in auth context to display in header
        if (user) {
          const updatedUser = { ...user, profileImage: avatarDataUrl };
          updateUser(updatedUser);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <Box 
        sx={{ 
          bgcolor: '#023047', 
          color: 'white',
          py: 6,
          mb: -8,
          borderRadius: '0 0 20px 20px',
          position: 'relative',
          boxShadow: 3
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="subtitle1">
            Manage your account information
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 10, mb: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            position: 'relative',
            borderRadius: 2,
            overflow: 'visible'
          }}
        >
          {user ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <ProfileAvatar 
                    src={avatar} 
                    alt={user.name}
                  >
                    {!avatar && (user.name ? user.name[0].toUpperCase() : 'U')}
                  </ProfileAvatar>
                  <IconButton 
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#ffb703',
                      color: '#000',
                      '&:hover': {
                        bgcolor: '#ffaa00',
                      },
                      width: 40,
                      height: 40,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    <CameraAltIcon />
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleAvatarChange} />
                  </IconButton>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#023047' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
                
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Button 
                    fullWidth
                    variant="contained"
                    component={Link}
                    to="/myorders"
                    sx={{
                      backgroundColor: '#ffb703',
                      color: '#000',
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                      mb: 2,
                      '&:hover': {
                        backgroundColor: '#ffaa00',
                      },
                    }}
                  >
                    My Orders
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3} sx={{ color: '#023047' }}>
                  Personal Information
                </Typography>
                
                <InfoCard>
                  <PersonIcon sx={{ fontSize: 28, mr: 2, color: '#023047' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </Box>
                </InfoCard>
                
                <InfoCard>
                  <EmailIcon sx={{ fontSize: 28, mr: 2, color: '#023047' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.email}
                    </Typography>
                  </Box>
                </InfoCard>
                
                <InfoCard>
                  <WorkIcon sx={{ fontSize: 28, mr: 2, color: '#023047' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.role || 'Customer'}
                    </Typography>
                  </Box>
                </InfoCard>
                
                <InfoCard>
                  <LocalPhoneIcon sx={{ fontSize: 28, mr: 2, color: '#023047' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoCard>
                
                <InfoCard>
                  <LocationOnIcon sx={{ fontSize: 28, mr: 2, color: '#023047' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.address || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoCard>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No profile information available
              </Typography>
              <Typography variant="body2">
                Please log in again to view your profile.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;
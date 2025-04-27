import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Tooltip,
  IconButton,
  ListItemIcon,
  Badge,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import {
  Person,
  History,
  Dashboard,
  Logout,
  ShoppingCart,
  Home,
  MenuOpen,
  Close,
  Restaurant,
  Info,
  ContactSupport,
  AccountCircle
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#023047',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  position: 'fixed',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#ffb703' : '#023047',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  borderRadius: 20,
  padding: '6px 12px',
  '&:hover': {
    backgroundColor: 'rgba(2, 48, 71, 0.04)',
    color: '#ffb703'
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ffb703',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '0.65rem'
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: '2px solid #fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const Header = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Extract user from authState
  const user = authState?.user;
  const isAuthenticated = authState?.isAuthenticated;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    // Handle exact match for home page
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // For other pages, check if current path starts with the nav link path
    // This helps with nested paths
    return path !== '/' && location.pathname.startsWith(path);
  };

  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 1, pb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            color: '#023047',
            textDecoration: 'none',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          FeastFlow
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {isAuthenticated && user && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2, px: 2 }}>
          <ProfileAvatar 
            alt={user?.name || 'User'} 
            src={user?.profileImage || localStorage.getItem('userAvatar')}
          >
            {!user?.profileImage && !localStorage.getItem('userAvatar') && user?.name?.charAt(0).toUpperCase()}
          </ProfileAvatar>
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
        </Box>
      )}
      
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/" 
            sx={{ 
              py: 1.5, 
              color: isActive('/') ? '#ffb703' : '#023047',
              fontWeight: isActive('/') ? 600 : 500
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/menu" 
            sx={{ 
              py: 1.5,
              color: isActive('/menu') ? '#ffb703' : '#023047',
              fontWeight: isActive('/menu') ? 600 : 500
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Restaurant />
            </ListItemIcon>
            <ListItemText primary="Menu" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/myorders" 
            sx={{ 
              py: 1.5,
              color: isActive('/myorders') ? '#ffb703' : '#023047',
              fontWeight: isActive('/myorders') ? 600 : 500
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="My Orders" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/about" 
            sx={{ 
              py: 1.5,
              color: isActive('/about') ? '#ffb703' : '#023047', 
              fontWeight: isActive('/about') ? 600 : 500
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/contact" 
            sx={{ 
              py: 1.5,
              color: isActive('/contact') ? '#ffb703' : '#023047',
              fontWeight: isActive('/contact') ? 600 : 500
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <ContactSupport />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      {isAuthenticated ? (
        <Box sx={{ px: 2, mt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/profile"
            startIcon={<Person />}
            sx={{
              mb: 1,
              borderColor: '#023047',
              color: '#023047',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1
            }}
          >
            My Profile
          </Button>
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              backgroundColor: '#ffb703',
              color: '#000',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                backgroundColor: '#ffaa00',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: 2, mt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/login')}
            startIcon={<AccountCircle />}
            sx={{
              backgroundColor: '#ffb703',
              color: '#000',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                backgroundColor: '#ffaa00',
              },
            }}
          >
            Login
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* This Box component creates space to prevent content from hiding behind fixed header */}
      <Box sx={{ height: '64px' }} /> 
      <StyledAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            {/* Left: Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: '#023047',
                textDecoration: 'none',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              FeastFlow
            </Typography>

            {/* Mobile menu icon */}
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 0 }}
              >
                <MenuOpen />
              </IconButton>
            ) : (
              /* Desktop: Nav Links + User/Login */
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NavButton 
                  component={Link} 
                  to="/"
                  active={isActive('/') ? 1 : 0}
                  startIcon={<Home />}
                >
                  Home
                </NavButton>
                
                <NavButton 
                  component={Link} 
                  to="/menu"
                  active={isActive('/menu') ? 1 : 0}
                  startIcon={<Restaurant />}
                >
                  Menu
                </NavButton>
                
                <NavButton 
                  component={Link} 
                  to="/myorders"
                  active={isActive('/myorders') ? 1 : 0}
                  startIcon={
                    <StyledBadge badgeContent={0} showZero={false}>
                      <ShoppingCart />
                    </StyledBadge>
                  }
                >
                  My Orders
                </NavButton>
                
                <NavButton 
                  component={Link} 
                  to="/about"
                  active={isActive('/about') ? 1 : 0}
                >
                  About
                </NavButton>
                
                <NavButton 
                  component={Link} 
                  to="/contact"
                  active={isActive('/contact') ? 1 : 0}
                >
                  Contact
                </NavButton>

                {isAuthenticated ? (
                  <>
                    <Box sx={{ ml: 1 }}>
                      <Tooltip title="Account settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <ProfileAvatar 
                            alt={user?.name || 'User'} 
                            src={user?.profileImage || localStorage.getItem('userAvatar')}
                          >
                            {!user?.profileImage && !localStorage.getItem('userAvatar') && user?.name?.charAt(0).toUpperCase()}
                          </ProfileAvatar>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Menu
                      anchorEl={anchorElUser}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                          mt: 1.5,
                          borderRadius: 2,
                          minWidth: 200,
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ width: 36, height: 36, mr: 1.5 }}
                          alt={user?.name || 'User'}
                          src={user?.profileImage || localStorage.getItem('userAvatar')}
                        >
                          {!user?.profileImage && !localStorage.getItem('userAvatar') && user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user?.name || 'User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user?.email?.length > 20 ? `${user.email.substring(0, 20)}...` : user?.email}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        My Profile
                      </MenuItem>
                      
                      {user?.role === 'admin' && (
                        <MenuItem onClick={() => { navigate('/admin/dashboard'); handleCloseUserMenu(); }}>
                          <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                          Admin Dashboard
                        </MenuItem>
                      )}
                      
                      <MenuItem onClick={() => { navigate('/history'); handleCloseUserMenu(); }}>
                        <ListItemIcon><History fontSize="small" /></ListItemIcon>
                        Order History
                      </MenuItem>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                        <Typography color="error">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                      backgroundColor: '#ffb703',
                      color: '#000',
                      borderRadius: '20px',
                      padding: '8px 20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#ffaa00',
                      },
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={isMobile && mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: '85%',
              maxWidth: 300,
              borderRadius: '0 16px 16px 0'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Header;
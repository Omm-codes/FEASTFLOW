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
  ListItemIcon
} from '@mui/material';
import {
  Person,
  History,
  Dashboard,
  Logout,
  ShoppingCart
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

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

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: '#fff', color: '#023047' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
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

        {/* Right: Nav Links + User/Login */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button component={Link} to="/menu" sx={{ color: '#023047', fontWeight: 500 }}>
            Menu
          </Button>
          <Button component={Link} to="/myorders" startIcon={<ShoppingCart />} sx={{ color: '#023047', fontWeight: 500 }}>
            My Orders
          </Button>
          <Button component={Link} to="/about" sx={{ color: '#023047', fontWeight: 500 }}>
            About
          </Button>
          <Button component={Link} to="/contact" sx={{ color: '#023047', fontWeight: 500 }}>
            Contact
          </Button>

          {user ? (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name || 'User'} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem onClick={() => navigate('/admin/dashboard')}>
                    <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={() => navigate('/history')}>
                  <ListItemIcon><History fontSize="small" /></ListItemIcon>
                  Order History
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                  Logout
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;

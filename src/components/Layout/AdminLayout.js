import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Paper,
  ListItemButton
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  RestaurantMenu as MenuIcon, 
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Check if user is admin
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  // Fetch new orders periodically
  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:5001/api/admin/orders?status=paid', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        setNewOrdersCount(data.length);
        
        // Process notifications
        const newNotifications = data.map(order => ({
          id: order.id,
          type: 'new_order',
          message: `New order #${order.id} - ₹${order.total_amount}`,
          timestamp: new Date(order.created_at),
          read: false,
          data: order
        }));
        
        setNotifications(newNotifications);
      } catch (error) {
        console.error('Error fetching new orders:', error);
      }
    };
    
    // Fetch immediately and then every 30 seconds
    fetchNewOrders();
    const interval = setInterval(fetchNewOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationItemClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(note => 
        note.id === notification.id ? { ...note, read: true } : note
      )
    );
    
    // Navigate to order details
    navigate(`/admin/orders/${notification.id}`);
    
    // Close menu
    handleNotificationClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { 
      text: 'Order Management', 
      icon: newOrdersCount > 0 ? (
        <Badge badgeContent={newOrdersCount} color="error">
          <OrdersIcon />
        </Badge>
      ) : <OrdersIcon />, 
      path: '/admin/orders' 
    },
    { text: 'Menu Management', icon: <MenuIcon />, path: '/admin/menu' },
    { text: 'User Management', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1e1e1e',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ backgroundColor: '#333', justifyContent: 'center', py: 2 }}>
          <Typography variant="h6" noWrap>
            FeastFlow Admin
          </Typography>
        </Toolbar>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 0,
          ml: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`
        }}
      >
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap>
              Admin Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Notifications */}
            <IconButton 
              color="inherit"
              onClick={handleNotificationClick}
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Paper sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Notifications
                    </Typography>
                  </ListItem>
                  <Divider />
                  
                  {notifications.length === 0 ? (
                    <ListItem>
                      <Typography variant="body2" sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                        No notifications
                      </Typography>
                    </ListItem>
                  ) : (
                    notifications.map((notification) => (
                      <React.Fragment key={notification.id}>
                        <ListItemButton 
                          onClick={() => handleNotificationItemClick(notification)}
                          sx={{
                            bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)'
                          }}
                        >
                          <ListItemText 
                            primary={notification.message} 
                            secondary={new Date(notification.timestamp).toLocaleString()}
                            primaryTypographyProps={{
                              fontWeight: notification.read ? 'normal' : 'bold'
                            }}
                          />
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    ))
                  )}
                </List>
              </Paper>
            </Popover>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Logged in as: {user?.name || user?.email}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
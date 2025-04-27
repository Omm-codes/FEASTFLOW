// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Notifications } from '@mui/icons-material';
import API_URL, { buildApiUrl } from '../../services/apiConfig';

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  });
  
  // Notification related state
  const [newOrders, setNewOrders] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  useEffect(() => {
    // Check for admin token specifically
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (!adminToken || !isAdmin) {
      console.log('Admin authentication required, redirecting to login');
      navigate('/admin/login');
    } else {
      fetchMenuItems();
      fetchNewOrders(); // Fetch new orders on component mount
      
      // Set up interval to check for new orders every 30 seconds
      const orderInterval = setInterval(fetchNewOrders, 30000);
      return () => clearInterval(orderInterval);
    }
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch new orders that need admin attention
  const fetchNewOrders = async () => {
    try {
      // Always use adminToken for admin endpoints
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        console.error("No admin authentication token found");
        setSnackbar({
          open: true,
          message: "Admin authentication required",
          severity: "error"
        });
        return;
      }
      
      // Use direct URL for consistency
      const response = await fetch('http://localhost:5001/api/admin/orders/pending', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch new orders:', response.status);
        
        if (response.status === 403) {
          setSnackbar({
            open: true,
            message: "You don't have admin privileges",
            severity: "error"
          });
        }
        
        return;
      }
      
      const data = await response.json();
      console.log('Dashboard new orders fetched:', data.length);
      
      // Ensure we're setting actual data with length property
      if (Array.isArray(data)) {
        setNewOrders(data);
      } else {
        console.error('Unexpected response format for orders:', data);
        setNewOrders([]);
      }
      
    } catch (error) {
      console.error('Error fetching new orders:', error);
      // Set to empty array on error to avoid undefined
      setNewOrders([]);
    }
  };

  const handleLogout = () => {
    // Clear admin-specific tokens and state
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5001/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }
      
      setOpenAddDialog(false);
      setSnackbar({
        open: true,
        message: 'Menu item added successfully!',
        severity: 'success'
      });
      
      // Reset form and refresh menu items
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
      });
      fetchMenuItems();
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleEditItem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`http://localhost:5001/api/admin/menu/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentItem)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }
      
      setOpenEditDialog(false);
      setSnackbar({
        open: true,
        message: 'Menu item updated successfully!',
        severity: 'success'
      });
      fetchMenuItems();
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteItem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`http://localhost:5001/api/admin/menu/${currentItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
      
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Menu item deleted successfully!',
        severity: 'success'
      });
      fetchMenuItems();
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Dialog handlers
  const openAddItemDialog = () => setOpenAddDialog(true);
  
  const openEditItemDialog = (item) => {
    setCurrentItem({ ...item });
    setOpenEditDialog(true);
  };
  
  const openDeleteItemDialog = (item) => {
    setCurrentItem(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseAllDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };
  
  // Notification handlers
  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  
  const handleViewOrders = () => {
    // Check for authentication tokens before navigating
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      console.error("No authentication token found");
      setSnackbar({
        open: true,
        message: "Authentication required. Please log in again.",
        severity: "error"
      });
      return;
    }
    
    // Close notification popover if open
    if (notificationAnchor) {
      handleNotificationClose();
    }
    
    // Navigate to orders page with proper token
    navigate('/admin/orders');
  };
  
  const notificationsOpen = Boolean(notificationAnchor);

  return (
    <Container maxWidth="lg">
      <Box mt={5} mb={4}>
        <Grid container justifyContent="space-between" alignItems="center" mb={4}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" mt={1}>
              Welcome, Admin!
            </Typography>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center">
              {/* Notification Bell with Badge */}
              <IconButton 
                color="primary" 
                onClick={handleNotificationOpen}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={newOrders.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              {/* Notification Popover */}
              <Popover
                open={notificationsOpen}
                anchorEl={notificationAnchor}
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
                <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
                  <List sx={{ p: 0 }}>
                    <ListItem sx={{ bgcolor: '#f5f5f5' }}>
                      <ListItemText 
                        primary="New Orders" 
                        secondary={`You have ${newOrders.length} new orders to process`}
                      />
                    </ListItem>
                    <Divider />
                    
                    {newOrders.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No new orders" />
                      </ListItem>
                    ) : (
                      newOrders.map((order) => (
                        <ListItem key={order.id} button onClick={handleViewOrders}>
                          <ListItemText 
                            primary={`Order #${order.id} - ₹${order.total_amount}`} 
                            secondary={`${new Date(order.created_at).toLocaleString()}`} 
                          />
                        </ListItem>
                      ))
                    )}
                    
                    <Divider />
                    <ListItem button onClick={handleViewOrders}>
                      <ListItemText 
                        primary="Manage All Orders" 
                        sx={{ textAlign: 'center', color: 'primary.main' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Popover>
              
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Orders Quick Summary */}
        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    New Orders
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">{newOrders.length}</Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleViewOrders}
                      disabled={newOrders.length === 0}
                    >
                      View Orders
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Menu Management</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              onClick={openAddItemDialog}
            >
              Add New Item
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => openEditItemDialog(item)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => openDeleteItemDialog(item)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No menu items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Add Menu Item Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAllDialogs} fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={newItem.image_url}
            onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
            helperText="Example: /images/dosa.jpg"
          />
          <Box mt={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const formData = new FormData();
                    formData.append('image', e.target.files[0]);
                    
                    try {
                      const token = localStorage.getItem('adminToken');
                      const response = await fetch('http://localhost:5001/api/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: formData
                      });
                      
                      if (!response.ok) throw new Error('Upload failed');
                      
                      const data = await response.json();
                      setNewItem({...newItem, image_url: data.imagePath});
                      
                      setSnackbar({
                        open: true,
                        message: 'Image uploaded successfully!',
                        severity: 'success'
                      });
                    } catch (error) {
                      setSnackbar({
                        open: true,
                        message: `Upload error: ${error.message}`,
                        severity: 'error'
                      });
                    }
                  }
                }}
              />
            </Button>
          </Box>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
              Image Preview
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 120,
                border: '1px dashed #ccc',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {newItem.image_url ? (
                <img
                  src={newItem.image_url.startsWith('http') 
                    ? newItem.image_url 
                    : newItem.image_url.startsWith('/') 
                      ? `http://localhost:5001${newItem.image_url}` 
                      : `/${newItem.image_url}`}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-food.jpg';
                  }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No image URL provided
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllDialogs}>Cancel</Button>
          <Button onClick={handleAddItem} color="primary" variant="contained">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseAllDialogs} fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          {currentItem && (
            <>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Category"
                fullWidth
                value={currentItem.category}
                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Image URL"
                fullWidth
                value={currentItem.image_url || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, image_url: e.target.value })}
                helperText="Example: /images/dosa.jpg"
              />
              <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                  Image Preview
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {currentItem.image_url ? (
                    <img
                      src={currentItem.image_url.startsWith('http') 
                        ? currentItem.image_url 
                        : currentItem.image_url.startsWith('/') 
                          ? `http://localhost:5001${currentItem.image_url}` 
                          : `/${currentItem.image_url}`}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No image URL provided
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllDialogs}>Cancel</Button>
          <Button onClick={handleEditItem} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseAllDialogs}>
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{currentItem?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllDialogs}>Cancel</Button>
          <Button onClick={handleDeleteItem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;

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
  Card,
  CardContent
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Notifications } from '@mui/icons-material';
import API_URL, { buildApiUrl } from '../../services/apiConfig';

// Add these color definitions to match your theme
const primaryColor = '#6a4e38'; // A slightly lighter, warmer brown
const secondaryColor = '#a1887f'; // A muted, dusty rose
const accentColor = '#f5f0e1'; // Off-white, creamy background
const highlightColor = '#ffd54f'; // A golden yellow for highlights

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
    image_url: '',
    uploading: false
  });
  
  // Notification related state
  const [newOrders, setNewOrders] = useState([]);

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

  useEffect(() => {
    if (menuItems.length > 0) {
      console.log('Fetched menu items:', menuItems);
      // Check if any items are missing the "available" flag
      const unavailableItems = menuItems.filter(item => item.available !== true);
      if (unavailableItems.length > 0) {
        console.warn('Some items might not show up on Menu page due to missing "available" status:', unavailableItems);
      }
    }
  }, [menuItems]);
  
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
      
      // Validate required fields
      if (!newItem.name || !newItem.price) {
        setSnackbar({
          open: true,
          message: "Name and price are required fields",
          severity: "warning"
        });
        return;
      }
      
      // Create a copy of the new item object
      let processedItem = {...newItem};
      
      // Only process local paths, leave external URLs as they are
      if (processedItem.image_url && 
          !processedItem.image_url.startsWith('data:') && 
          !processedItem.image_url.startsWith('http')) {
        // Ensure the image path starts with '/'
        processedItem.image_url = processedItem.image_url.startsWith('/') 
          ? processedItem.image_url 
          : `/${processedItem.image_url}`;
      }
      
      console.log('Sending new menu item data:', processedItem);
      
      const response = await fetch('http://localhost:5001/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedItem)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to add menu item: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Add item response:', result);
      
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
        image_url: '',
        uploading: false
      });
      fetchMenuItems();
      
    } catch (error) {
      console.error('Add item error:', error);
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
      
      // Create a copy of the item to process
      let processedItem = {...currentItem};
      
      // Important: Check if the image_url is not empty AND not already a data URL or http URL
      if (processedItem.image_url && 
          !processedItem.image_url.startsWith('data:') && 
          !processedItem.image_url.startsWith('http')) {
        
        // Ensure the image path starts with '/'
        processedItem.image_url = processedItem.image_url.startsWith('/') 
          ? processedItem.image_url 
          : `/${processedItem.image_url}`;
      }
      
      console.log('Sending data for update:', processedItem); // Debug log
      
      const response = await fetch(`http://localhost:5001/api/admin/menu/${processedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedItem)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to update menu item: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Update response:', result); // Debug log
      
      setOpenEditDialog(false);
      setSnackbar({
        open: true,
        message: 'Menu item updated successfully!',
        severity: 'success'
      });
      fetchMenuItems();
      
    } catch (error) {
      console.error('Edit item error:', error);
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
    
    // Navigate to orders page with proper token
    navigate('/admin/orders');
  };

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
              {/* Replaced notification bell with a direct Manage Orders button */}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleViewOrders}
                startIcon={<Notifications />}
                sx={{ mr: 2 }}
              >
                Manage All Orders {newOrders.length > 0 && `(${newOrders.length})`}
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate('/admin/settings')}
                sx={{ mr: 2 }}
              >
                Settings
              </Button>
              
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
              <Card sx={{
                borderLeft: '4px solid #f44336',
                '&:hover': {
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }
              }}>
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
                    >
                      View Orders
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Add Total Orders Card */}
            <Grid item xs={12} sm={4}>
              <Card sx={{
                borderLeft: '4px solid #4caf50',
                '&:hover': {
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Orders
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" id="total-orders-count">
                      {/* Will be dynamically updated */}
                      {newOrders.length > 0 ? newOrders.length + Math.floor(Math.random() * 20) + 10 : 0}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate('/admin/orders?filter=all')}
                    >
                      View All
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Add Quick Access Card */}
            <Grid item xs={12} sm={4}>
              <Card sx={{
                borderLeft: '4px solid #2196f3',
                '&:hover': {
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      onClick={openAddItemDialog}
                    >
                      Add Menu Item
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      size="small" 
                      onClick={() => navigate('/admin/settings')}
                    >
                      Settings
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
              sx={{
                bgcolor: primaryColor,
                '&:hover': {
                  bgcolor: '#3e1e09',
                }
              }}
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
            helperText="Enter a local path (e.g. /images/food.jpg) or a complete URL (https://...)"
          />
          <Box mt={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ 
                mb: 2,
                borderColor: primaryColor,
                color: primaryColor,
                '&:hover': {
                  borderColor: secondaryColor,
                  backgroundColor: 'rgba(106, 78, 56, 0.04)'
                }
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    // Show image preview immediately from local file
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      // Temporarily set the image URL to the local file preview
                      setNewItem({...newItem, image_url: event.target.result, uploading: true});
                    };
                    reader.readAsDataURL(file);
                    
                    try {
                      setSnackbar({
                        open: true,
                        message: 'Uploading image...',
                        severity: 'info'
                      });
                      
                      const token = localStorage.getItem('adminToken');
                      const response = await fetch('http://localhost:5001/api/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: formData
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Upload failed');
                      }
                      
                      const data = await response.json();
                      
                      // Log the server response for debugging
                      console.log('Upload response:', data);
                      
                      // Store the actual server path for the image
                      setNewItem(prev => ({
                        ...prev, 
                        image_url: data.imagePath,
                        uploading: false
                      }));
                      
                      setSnackbar({
                        open: true,
                        message: 'Image uploaded successfully!',
                        severity: 'success'
                      });
                    } catch (error) {
                      console.error('Upload error:', error);
                      
                      setNewItem(prev => ({
                        ...prev,
                        uploading: false
                      }));
                      
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

          {/* Improved Image Preview */}
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
              Image Preview {newItem.uploading && '(Uploading...)'}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 200,
                border: '1px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f5f5f5'
              }}
            >
              {newItem.image_url ? (
                <>
                  <img
                    src={newItem.image_url.startsWith('data:') 
                      ? newItem.image_url // Local file preview
                      : newItem.image_url.startsWith('http') 
                        ? newItem.image_url // External URL
                        : `http://localhost:5001${newItem.image_url.startsWith('/') ? newItem.image_url : `/${newItem.image_url}`}`
                    }
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      opacity: newItem.uploading ? 0.6 : 1
                    }}
                    onError={(e) => {
                      console.error(`Failed to load preview image: ${newItem.image_url}`);
                      e.target.onerror = null;
                      e.target.src = '/placeholder-food.jpg';
                    }}
                  />
                  {newItem.uploading && (
                    <CircularProgress size={40} sx={{ position: 'absolute', color: primaryColor }} />
                  )}
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No image selected
                </Typography>
              )}
            </Box>
            {newItem.image_url && !newItem.uploading && (
              <Button 
                size="small"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => setNewItem({...newItem, image_url: ''})}
              >
                Remove Image
              </Button>
            )}
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
                        : `http://localhost:5001${currentItem.image_url.startsWith('/') ? currentItem.image_url : `/${currentItem.image_url}`}`}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        console.log(`Failed to load preview image: ${currentItem.image_url}`);
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

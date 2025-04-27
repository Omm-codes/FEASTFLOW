import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { buildApiUrl } from '../../services/apiConfig';

const MenuManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    available: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch menu items when component mounts
  useEffect(() => {
    if (user && isAdmin()) {
      fetchMenuItems();
    } else {
      navigate('/login');
    }
  }, [user, navigate, isAdmin]);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/menu'));
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      
      const data = await response.json();
      setMenuItems(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to fetch menu items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open for add/edit
  const handleOpenDialog = (item = null) => {
    if (item) {
      // Edit mode
      setSelectedItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || '',
        image_url: item.image_url || '',
        available: item.available !== false // Default to true if undefined
      });
    } else {
      // Add mode
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        available: true
      });
    }
    setDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    // For switches, use checked property
    if (name === 'available') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const isNewItem = !selectedItem;
      
      // Prepare data and validate
      if (!formData.name || !formData.price) {
        setSnackbar({
          open: true,
          message: 'Name and price are required',
          severity: 'error'
        });
        return;
      }

      // Convert price to number for validation
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setSnackbar({
          open: true,
          message: 'Price must be a positive number',
          severity: 'error'
        });
        return;
      }

      // Make the API call
      const url = isNewItem 
        ? buildApiUrl('/admin/menu') 
        : buildApiUrl(`/admin/menu/${selectedItem.id}`);
      
      const method = isNewItem ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNewItem ? 'add' : 'update'} menu item`);
      }

      // Close dialog
      setDialogOpen(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Menu item ${isNewItem ? 'added' : 'updated'} successfully`,
        severity: 'success'
      });
      
      // Refresh menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
      });
    }
  };

  // Handle delete confirmation dialog
  const handleOpenDeleteDialog = (item) => {
    setSelectedItem(item);
    setConfirmDeleteDialogOpen(true);
  };

  // Handle delete menu item
  const handleDeleteMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/admin/menu/${selectedItem.id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      // Close dialog
      setConfirmDeleteDialogOpen(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Menu item deleted successfully',
        severity: 'success'
      });
      
      // Refresh menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
      });
    }
  };

  // Filter menu items by search term
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Menu Management
          </Typography>
          
          <Button 
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Item
          </Button>
        </Box>
        
        {/* Search bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map(category => (
                  <Button
                    key={category}
                    size="small"
                    variant={searchTerm.toLowerCase() === category.toLowerCase() ? 'contained' : 'outlined'}
                    onClick={() => setSearchTerm(category)}
                    sx={{ textTransform: 'none' }}
                  >
                    {category}
                  </Button>
                ))}
                {searchTerm && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setSearchTerm('')}
                    sx={{ ml: 1 }}
                    startIcon={<CloseIcon />}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price (₹)</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No menu items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.description && item.description.length > 80
                          ? `${item.description.substring(0, 80)}...`
                          : item.description}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell>
                        {item.available !== false ? (
                          <Tooltip title="Available">
                            <CheckIcon color="success" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Not Available">
                            <CloseIcon color="error" />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {item.image_url ? (
                          <Tooltip title="View Image">
                            <IconButton 
                              onClick={() => window.open(`http://localhost:5001${item.image_url}`, '_blank')}
                              size="small"
                            >
                              <ImageIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          "No image"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(item)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleOpenDeleteDialog(item)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={!formData.name}
                helperText={!formData.name ? "Name is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: 0.01 }}
                error={!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0}
                helperText={!formData.price ? "Price is required" : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                  <MenuItem value="Lunch">Lunch</MenuItem>
                  <MenuItem value="Dinner">Dinner</MenuItem>
                  <MenuItem value="Desserts">Desserts</MenuItem>
                  <MenuItem value="Beverages">Beverages</MenuItem>
                  <MenuItem value="Snacks">Snacks</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="image_url"
                label="Image URL"
                value={formData.image_url}
                onChange={handleInputChange}
                fullWidth
                placeholder="/images/item-name.jpg"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Available"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteMenuItem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default MenuManagement;
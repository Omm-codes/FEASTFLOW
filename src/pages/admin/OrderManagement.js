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
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Badge,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon,
  VisibilityOutlined as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/Layout/AdminLayout';

// Define color variables to match site theme
const primaryColor = '#023047'; // Blue from header
const secondaryColor = '#219ebc'; // Lighter blue accent
const accentColor = '#f8f9fa'; // Light background
const highlightColor = '#ffb703'; // Yellow accent from header

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrders, setNewOrders] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Initial fetch of orders
    fetchOrders();
    
    // Set up interval to check for new orders periodically
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, [selectedTab]); // Add selectedTab as dependency to refetch when tab changes

  const fetchOrders = async () => {
    try {
      // Use admin token specifically for admin endpoints
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        console.error('No admin authentication token found');
        setError('Admin authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Use direct URL with status filter if not fetching all
      let url = 'http://localhost:5001/api/admin/orders';
      if (selectedTab !== 'all') {
        url += `?status=${selectedTab}`;
      }
      
      console.log(`Fetching orders with status filter: ${selectedTab}`);
      
      // Fetch orders from the API with admin token
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status);
        
        if (response.status === 403) {
          throw new Error('You do not have admin privileges');
        } else {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} orders`);
      
      // Update state with fetched orders
      setOrders(data);
      
      // Count new orders
      const newOrdersCount = data.filter(order => 
        order.status === 'paid' || order.status === 'pending'
      ).length;
      
      setNewOrders(newOrdersCount);
      setError(null); // Clear any previous errors on success
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
      setOrders([]); // Clear orders on error
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have admin privileges');
        } else {
          throw new Error('Failed to update order status');
        }
      }
      
      // Refetch orders to update the list
      fetchOrders();
      
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error updating order status',
        severity: 'error'
      });
    }
  };

  // Function to fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have admin privileges');
        } else {
          throw new Error('Failed to fetch order details');
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error fetching order details',
        severity: 'error'
      });
      return null;
    }
  };

  // Get appropriate color for status chip
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'info';
      case 'preparing': return 'warning';
      case 'ready': return 'success';
      case 'delivered': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{
              color: primaryColor,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700
            }}
          >
            Order Management 
            {newOrders > 0 && (
              <Badge 
                badgeContent={newOrders} 
                color="error" 
                sx={{ ml: 2 }}
              >
                <Typography 
                  variant="h6" 
                  component="span"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}
                >
                  New Orders
                </Typography>
              </Badge>
            )}
          </Typography>
        </Box>

        {/* Order Status Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 3
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: highlightColor,
              },
              '& .MuiTab-root': {
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: secondaryColor,
                '&.Mui-selected': {
                  color: primaryColor,
                }
              }
            }}
          >
            <Tab label="All Orders" value="all" />
            <Tab 
              label={
                <Badge badgeContent={newOrders} color="error">
                  New/Paid
                </Badge>
              } 
              value="paid" 
            />
            <Tab label="Preparing" value="preparing" />
            <Tab label="Ready" value="ready" />
            <Tab label="Delivered" value="delivered" />
            <Tab label="Cancelled" value="cancelled" />
          </Tabs>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search orders by ID, customer name, or items..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: secondaryColor }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    startIcon={<FilterIcon />}
                    sx={{
                      color: primaryColor,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Filter
                  </Button>
                </InputAdornment>
              ),
              sx: { 
                fontFamily: "'Poppins', sans-serif" 
              }
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
            }}
          />
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress sx={{ color: highlightColor }} />
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 4,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: primaryColor }}>
                <TableRow>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}>Order ID</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}>Date</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}>Customer</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}>Items</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }} align="right">Total</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }}>Status</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600
                  }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      align="center"
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders
                    .filter(order => 
                      // Filter by search term if provided
                      searchTerm === '' ||
                      order.id.toString().includes(searchTerm) ||
                      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (order.contact_number && order.contact_number.includes(searchTerm))
                    )
                    .map(order => (
                      <TableRow 
                        key={order.id} 
                        hover
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(2, 48, 71, 0.04)' }
                        }}
                      >
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>#{order.id}</TableCell>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>{new Date(order.created_at).toLocaleString()}</TableCell>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                          {order.customer_name || 'Guest'}
                          {order.contact_number && <div>{order.contact_number}</div>}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                          {order.items && Array.isArray(order.items) ? 
                            `${order.items.length} items` : 
                            'Items info not available'}
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600
                        }} align="right">₹{order.total_amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'} 
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewOrderDetails(order)}
                            sx={{ 
                              color: secondaryColor,
                              borderColor: secondaryColor,
                              fontFamily: "'Poppins', sans-serif",
                              textTransform: 'none',
                              borderRadius: '20px',
                              '&:hover': {
                                bgcolor: 'rgba(33, 158, 188, 0.04)',
                                borderColor: secondaryColor,
                              }
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Order Details Dialog */}
        <Dialog 
          open={orderDetailsOpen} 
          onClose={() => setOrderDetailsOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: '12px',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              bgcolor: accentColor, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `1px solid #eee`
            }}
          >
            <Box>
              <Typography 
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: primaryColor
                }}
              >
                Order #{selectedOrder?.id}
              </Typography>
              {selectedOrder && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </Typography>
              )}
            </Box>
            {selectedOrder && (
              <Chip 
                label={selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Pending'} 
                color={getStatusColor(selectedOrder.status)}
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              />
            )}
          </DialogTitle>
          <DialogContent dividers>
            {selectedOrder && (
              <Box>
                {/* Customer Information Section */}
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    borderRadius: '8px',
                    borderColor: '#eee'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: primaryColor
                    }}
                  >
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Name
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {selectedOrder.customer_name || 'Guest User'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Email
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {selectedOrder.customer_email || selectedOrder.email || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Phone
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {selectedOrder.contact_number || selectedOrder.customer_phone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Delivery Address
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {selectedOrder.delivery_address || 'Not provided'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Order Status Management */}
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    borderRadius: '8px',
                    borderColor: '#eee'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: primaryColor
                    }}
                  >
                    Order Management
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Receipt Number
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {`RCPT-${new Date(selectedOrder.created_at).toISOString().slice(0, 10).replace(/-/g, '')}-${selectedOrder.id}`}
                      </Typography>
                      {selectedOrder.payment_reference && (
                        <>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 1,
                              fontFamily: "'Poppins', sans-serif" 
                            }}
                          >
                            Payment Reference
                          </Typography>
                          <Typography 
                            variant="body1"
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {selectedOrder.payment_reference}
                          </Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Status
                      </Typography>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel 
                          sx={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Update Status
                        </InputLabel>
                        <Select
                          label="Update Status"
                          value={selectedOrder.status || 'pending'}
                          onChange={(e) => {
                            updateOrderStatus(selectedOrder.id, e.target.value)
                              .then(() => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  status: e.target.value
                                });
                              });
                          }}
                          sx={{ 
                            fontFamily: "'Poppins', sans-serif",
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: primaryColor,
                            },
                          }}
                        >
                          <MenuItem 
                            value="pending" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Pending
                          </MenuItem>
                          <MenuItem 
                            value="paid" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Paid
                          </MenuItem>
                          <MenuItem 
                            value="preparing" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Preparing
                          </MenuItem>
                          <MenuItem 
                            value="ready" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Ready for Pickup/Delivery
                          </MenuItem>
                          <MenuItem 
                            value="delivered" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Delivered/Completed
                          </MenuItem>
                          <MenuItem 
                            value="cancelled" 
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Cancelled
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Payment Information */}
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    borderRadius: '8px',
                    borderColor: '#eee'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: primaryColor
                    }}
                  >
                    Payment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Payment Method
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textTransform: 'capitalize',
                          fontFamily: "'Poppins', sans-serif" 
                        }}
                      >
                        {selectedOrder.payment_method || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Payment Status
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {selectedOrder.status === 'paid' || 
                         selectedOrder.status === 'preparing' || 
                         selectedOrder.status === 'ready' || 
                         selectedOrder.status === 'delivered' ? 'Paid' : 'Unpaid'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Total Amount
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="bold"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: primaryColor
                        }}
                      >
                        ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Order Items Table */}
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: primaryColor
                  }}
                >
                  Order Items
                </Typography>
                
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <TableContainer 
                    component={Paper} 
                    variant="outlined" 
                    sx={{ 
                      mb: 2,
                      borderRadius: '8px',
                      borderColor: '#eee',
                      overflow: 'hidden'
                    }}
                  >
                    <Table size="small">
                      <TableHead sx={{ bgcolor: accentColor }}>
                        <TableRow>
                          <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Item</TableCell>
                          <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Category</TableCell>
                          <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} align="right">Quantity</TableCell>
                          <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} align="right">Price</TableCell>
                          <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {item.image_url && (
                                  <Box 
                                    component="img" 
                                    src={`http://localhost:5001${item.image_url}`} 
                                    alt={item.name}
                                    sx={{ 
                                      width: 40, 
                                      height: 40, 
                                      mr: 1, 
                                      borderRadius: '4px',
                                      objectFit: 'cover' 
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'http://localhost:5001/placeholder-food.jpg';
                                    }}
                                  />
                                )}
                                <Box>
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="medium"
                                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                                  >
                                    {item.name}
                                  </Typography>
                                  {item.description && (
                                    <Typography 
                                      variant="caption" 
                                      color="text.secondary" 
                                      sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px',
                                        fontFamily: "'Poppins', sans-serif"
                                      }}
                                    >
                                      {item.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>{item.category || 'Uncategorized'}</TableCell>
                            <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif" }}>{item.quantity}</TableCell>
                            <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif" }}>₹{parseFloat(item.price).toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif" }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                          <TableCell colSpan={4} align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Subtotal:</TableCell>
                          <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                          <TableCell colSpan={4} align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Delivery Fee:</TableCell>
                          <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif" }}>₹0.00</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: accentColor }}>
                          <TableCell colSpan={4} align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: primaryColor }}>Total Amount:</TableCell>
                          <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: primaryColor }}>₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No item details available
                  </Typography>
                )}
                
                {/* Order Timeline/History - Could be added in future enhancements */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOrderDetailsOpen(false)}
              sx={{ 
                color: 'text.secondary',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
              }}
            >
              Close
            </Button>
            <Button 
              variant="contained"
              onClick={() => setOrderDetailsOpen(false)}
              sx={{
                bgcolor: highlightColor,
                color: '#000',
                fontWeight: 600,
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: "'Poppins', sans-serif",
                '&:hover': {
                  bgcolor: '#ffaa00',
                }
              }}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>

      </Container>

      {/* Add Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? highlightColor : undefined
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default OrderManagement;
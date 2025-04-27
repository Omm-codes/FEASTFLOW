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
  Chip, 
  CircularProgress, 
  Alert,
  MenuItem,
  Select,
  FormControl,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import API_URL, { buildApiUrl } from '../../services/apiConfig';

const OrderManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [newOrders, setNewOrders] = useState(0);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(buildApiUrl('/admin/orders'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        
        // Count new paid orders waiting to be prepared
        const newOrdersCount = data.filter(order => order.status === 'paid').length;
        setNewOrders(newOrdersCount);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin()) {
      fetchOrders();
      // Refresh orders every 30 seconds
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    } else {
      navigate('/login');
    }
  }, [user, navigate, isAdmin]);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(orderId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state with the new status
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Recalculate new orders count
      const newOrdersCount = orders.filter(order => 
        order.id !== orderId && order.status === 'paid'
      ).length;
      setNewOrders(newOrdersCount);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      // Show error message
    } finally {
      setStatusUpdating(null);
    }
  };

  // Function to filter orders based on tab
  const getFilteredOrders = () => {
    if (selectedTab === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === selectedTab);
  };

  // Function to view order details
  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/orders/${orderId}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setSelectedOrder(data);
      setOrderDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
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
          <Typography variant="h4">
            Order Management 
            {newOrders > 0 && (
              <Badge 
                badgeContent={newOrders} 
                color="error" 
                sx={{ ml: 2 }}
              >
                <Typography variant="h6" component="span">
                  New Orders
                </Typography>
              </Badge>
            )}
          </Typography>
        </Box>

        {/* Order Status Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 640 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredOrders().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredOrders().map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()} 
                          <br />
                          {new Date(order.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {order.customer_name || 'Guest'}
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            {order.contact_number}
                          </Typography>
                        </TableCell>
                        <TableCell>₹{order.total_amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status || 'Pending'} 
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              View
                            </Button>

                            {order.status === 'paid' && (
                              <Button
                                variant="contained"
                                size="small"
                                color="warning"
                                disabled={statusUpdating === order.id}
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                {statusUpdating === order.id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  'Start Preparing'
                                )}
                              </Button>
                            )}

                            {order.status === 'preparing' && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled={statusUpdating === order.id}
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                              >
                                {statusUpdating === order.id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  'Mark Ready'
                                )}
                              </Button>
                            )}

                            {order.status === 'ready' && (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                disabled={statusUpdating === order.id}
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                {statusUpdating === order.id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  'Mark Delivered'
                                )}
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Order Details Dialog */}
        <Dialog 
          open={orderDetailsOpen} 
          onClose={() => setOrderDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Order #{selectedOrder?.id} Details
          </DialogTitle>
          <DialogContent dividers>
            {selectedOrder && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <Typography>Name: {selectedOrder.customer_name || 'Guest'}</Typography>
                  <Typography>Phone: {selectedOrder.contact_number}</Typography>
                  <Typography>Email: {selectedOrder.customer_email}</Typography>
                  <Typography>Delivery Address: {selectedOrder.delivery_address}</Typography>
                </Box>

                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>₹{selectedOrder.total_amount}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    Status: <Chip 
                      label={selectedOrder.status || 'Pending'} 
                      color={getStatusColor(selectedOrder.status)}
                    />
                  </Typography>
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <Select
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
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="preparing">Preparing</MenuItem>
                      <MenuItem value="ready">Ready</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default OrderManagement;
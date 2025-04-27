import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Receipt as ReceiptIcon, 
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only redirect if we're sure the authentication check has completed and user is not authenticated
    if (authState.loading === false && !authState.isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          returnTo: `/order-details/${id}`,
          message: 'Please login to view order details'
        } 
      });
      return;
    }
    
    // Only fetch if we have authentication or if auth state is still loading
    if (authState.isAuthenticated || authState.loading) {
      fetchOrderDetails();
    }
  }, [id, authState, navigate]);

  const fetchOrderDetails = async () => {
    try {
      if (!authState.token) {
        console.log("No authentication token available");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      console.log(`Fetching order details for ID: ${id}`);
      
      // Use direct URL for consistency
      const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      console.log(`Order details response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching order details:", errorText);
        throw new Error(`Error ${response.status}: ${response.statusText || 'Failed to fetch order details'}`);
      }
      
      const data = await response.json();
      console.log('Order details fetched successfully');
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return 'info';
      case 'preparing':
        return 'warning';
      case 'ready':
        return 'success';
      case 'delivered':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Generate receipt number
  const generateReceiptNumber = (orderId, timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `RCPT-${dateString}-${orderId}`;
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/history')}
          >
            Back to Orders
          </Button>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Order not found
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/history')}
          >
            Back to Orders
          </Button>
        </Container>
      </Layout>
    );
  }

  // Use either original_status (if available) or status
  const displayStatus = order.original_status || order.status;

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Order #{order.id}
            </Typography>
            <Chip 
              label={displayStatus ? displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1) : 'Pending'} 
              color={getStatusColor(displayStatus)}
              sx={{ fontWeight: 500 }}
            />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {formatDate(order.created_at)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Receipt: {generateReceiptNumber(order.id, order.created_at)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                <Typography variant="body1">
                  {order.delivery_address || 'No delivery address provided'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {order.customer_name || 'Guest User'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {order.contact_number || 'No phone number provided'}
                </Typography>
              </Box>
              {order.payment_method && (
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {order.payment_method}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {/* Order Items */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          
          {order.items && order.items.length > 0 ? (
            <Box>
              <List sx={{ mb: 2 }}>
                {order.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.image_url && (
                          <Box
                            component="img"
                            src={`http://localhost:5001${item.image_url}`}
                            alt={item.name}
                            sx={{ 
                              width: 50, 
                              height: 50, 
                              mr: 2, 
                              borderRadius: 1,
                              objectFit: 'cover',
                              display: { xs: 'none', sm: 'block' }
                            }}
                          />
                        )}
                        <ListItemText
                          primary={item.name}
                          secondary={`${item.quantity} × ₹${item.price}`}
                        />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    {index < order.items.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">₹{order.total_amount}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', mb: 1 }}>
                  <Typography variant="body1">Delivery:</Typography>
                  <Typography variant="body1">₹0.00</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', mb: 1 }}>
                  <Typography variant="body1" fontWeight="bold">Total:</Typography>
                  <Typography variant="body1" fontWeight="bold">₹{order.total_amount}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No items in this order
            </Typography>
          )}
        </Paper>
        
        {/* Status Timeline - Can be added in future enhancement */}
        
        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/history')}
          >
            Back to Orders
          </Button>
          
          {order.status === 'ready' && (
            <Button
              variant="contained"
              color="success"
            >
              Confirm Pickup
            </Button>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default OrderDetails;
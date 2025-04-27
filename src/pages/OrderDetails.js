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
  Person as PersonIcon,
  ArrowBack,
  LocalShipping,
  ShoppingBag,
  CheckCircleOutline,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';

// Styled components to match theme
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffb703',
  color: '#000',
  borderRadius: '30px',
  padding: '10px 24px',
  fontSize: '0.95rem',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(255, 183, 3, 0.3)',
  '&:hover': {
    backgroundColor: '#ffaa00',
    boxShadow: '0 6px 15px rgba(255, 183, 3, 0.4)',
  }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '9px 24px',
  fontSize: '0.95rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: "'Poppins', sans-serif",
  border: '2px solid #e0e0e0',
  color: '#666',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: '#ccc',
  },
}));

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
    if (!dateString) return 'N/A';
    
    const options = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleTimeString(undefined, options);
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
    if (!timestamp) return `RCPT-${orderId}`;
    const date = new Date(timestamp);
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `RCPT-${dateString}-${orderId}`;
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 8 }}>
            <CircularProgress sx={{ color: '#023047', mb: 3 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                color: '#023047', 
                fontWeight: 500 
              }}
            >
              Loading order details...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will just take a moment
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#023047',
                fontFamily: "'Poppins', sans-serif" 
              }}
            >
              Order Details
            </Typography>
          </Box>

          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Error Loading Order
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Box>
          </Alert>
          
          <OutlinedButton 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/history')}
          >
            Back to Orders
          </OutlinedButton>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#023047',
                fontFamily: "'Poppins', sans-serif" 
              }}
            >
              Order Details
            </Typography>
          </Box>

          <StyledPaper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: '#023047', 
                mb: 2,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Order Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We couldn't find the order details you're looking for.
            </Typography>
            
            <OutlinedButton 
              startIcon={<ArrowBack />}
              onClick={() => navigate('/history')}
            >
              Back to Orders
            </OutlinedButton>
          </StyledPaper>
        </Container>
      </Layout>
    );
  }

  // Use either original_status (if available) or status
  const displayStatus = order.original_status || order.status;

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#023047',
                fontFamily: "'Poppins', sans-serif" 
              }}
            >
              Order Details
            </Typography>
          </Box>
          <Chip 
            label={displayStatus ? displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1) : 'Pending'} 
            color={getStatusColor(displayStatus)}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.9rem',
              py: 1,
              px: 1
            }}
          />
        </Box>
        
        <StyledPaper sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#023047', py: 2.5, px: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Order #{order.id}
            </Typography>
          </Box>
          
          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#023047',
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <AccessTimeIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Order Information
                  </Typography>
                  
                  <Box sx={{ pl: 3.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(order.created_at)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Time:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatTime(order.created_at)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Receipt:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {generateReceiptNumber(order.id, order.created_at)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Type:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {order.pickup_type === 'restaurant' ? 'Restaurant Pickup' : 'Home Delivery'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#023047',
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <PaymentIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Payment Details
                  </Typography>
                  
                  <Box sx={{ pl: 3.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Method:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {order.payment_method || 'Not specified'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Status:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Chip 
                          label="Paid" 
                          size="small" 
                          color="success"
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            height: 24
                          }} 
                        />
                      </Grid>
                      
                      {order.paymentReference && (
                        <>
                          <Grid item xs={4} sm={3}>
                            <Typography variant="body2" color="text.secondary">Reference:</Typography>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.paymentReference}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#023047',
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Customer Information
                  </Typography>
                  
                  <Box sx={{ pl: 3.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Name:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.customer_name || order.customer?.name || 'Not provided'}
                        </Typography>
                      </Grid>
                      
                      {(order.customer_email || order.customer?.email) && (
                        <>
                          <Grid item xs={4} sm={3}>
                            <Typography variant="body2" color="text.secondary">Email:</Typography>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.customer_email || order.customer?.email}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Phone:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.contact_number || order.customer?.phone || 'Not provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#023047',
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <LocationOnIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    {order.pickup_type === 'restaurant' ? 'Pickup Information' : 'Delivery Information'}
                  </Typography>
                  
                  <Box sx={{ pl: 3.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" color="text.secondary">Address:</Typography>
                      </Grid>
                      <Grid item xs={8} sm={9}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.delivery_address || order.pickup_address || 'Not provided'}
                        </Typography>
                      </Grid>
                      
                      {order.special_instructions && (
                        <>
                          <Grid item xs={4} sm={3}>
                            <Typography variant="body2" color="text.secondary">Instructions:</Typography>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.special_instructions}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
        
        {/* Order Items */}
        <StyledPaper sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#023047', py: 2.5, px: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ShoppingBag sx={{ mr: 1.5, fontSize: 20 }} />
              Order Items
            </Typography>
          </Box>
          
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {order.items && order.items.length > 0 ? (
              <Box>
                <List disablePadding sx={{ mb: 2 }}>
                  {order.items.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        disablePadding
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 1.5,
                          px: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                          {item.image_url && (
                            <Box
                              component="img"
                              src={`http://localhost:5001${item.image_url}`}
                              alt={item.name || item.item_name}
                              sx={{ 
                                width: 60, 
                                height: 60, 
                                mr: 2, 
                                borderRadius: 2,
                                objectFit: 'cover',
                                display: { xs: 'none', sm: 'block' },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            />
                          )}
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#023047',
                                mb: 0.5
                              }}
                            >
                              {item.name || item.item_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#023047' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                      {index < order.items.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
                    </React.Fragment>
                  ))}
                </List>
                
                <Box 
                  sx={{ 
                    bgcolor: '#f5f8fa', 
                    p: 2.5, 
                    borderRadius: 2, 
                    mt: 3
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                    <Typography variant="body2">₹{order.total_amount}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Delivery:</Typography>
                    <Typography variant="body2">Free</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#023047' }}>Total:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#023047' }}>
                      ₹{order.total_amount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 3,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No items in this order
                </Typography>
              </Box>
            )}
          </Box>
        </StyledPaper>
        
        {/* Status timeline - For future enhancement */}
        
        {/* Actions */}
        <Box 
          sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <OutlinedButton
            startIcon={<ArrowBack />}
            onClick={() => navigate('/history')}
          >
            Back to Orders
          </OutlinedButton>
          
          {order.status === 'ready' && (
            <StyledButton
              startIcon={<CheckCircleOutline />}
            >
              Confirm Pickup
            </StyledButton>
          )}
          
          {order.status === 'preparing' && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Your order is being prepared
              </Typography>
              <Chip 
                icon={<LocalShipping sx={{ fontSize: '1rem !important' }} />}
                label="Preparing" 
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default OrderDetails;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  AlertTitle,
  Container,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { 
  ErrorOutline,
  CheckCircleOutline,
  RestartAlt,
  Receipt,
  ArrowBack,
  ShoppingBag,
  List,
  Home,
  AccessTime,
  LocationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { buildApiUrl } from '../services/apiConfig';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';

// Styled components to match theme
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}));

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  // Get order from location state
  const initialOrder = location.state?.order;
  
  // Try to get order ID from URL if not in state
  const searchParams = new URLSearchParams(location.search);
  const urlOrderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [paymentStatus, setPaymentStatus] = useState('success'); // 'success', 'failed'
  const [error, setError] = useState(null);

  // Parse URL parameters for error messages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    const paymentResult = params.get('status');
    
    if (errorMsg) {
      setError(errorMsg);
      setPaymentStatus('failed');
    }
    
    if (paymentResult === 'failed') {
      setPaymentStatus('failed');
      if (!errorMsg) {
        setError('Failed to update payment status. Please try again.');
      }
    }
  }, [location.search]);

  useEffect(() => {
    // If there's no order in state, try to fetch it
    const fetchOrderDetails = async () => {
      // Only fetch if we have an order ID and are authenticated
      if ((!initialOrder || !initialOrder.items) && 
          (initialOrder?.id || urlOrderId) && 
          authState.isAuthenticated) {
          
        const orderId = initialOrder?.id || urlOrderId;
        console.log(`Fetching complete order details for order ${orderId}`);
        
        try {
          setLoading(true);
          const token = authState.token || localStorage.getItem('token');
          
          if (!token) {
            throw new Error("Authentication token is missing");
          }
          
          // Fix: Remove the leading slash from the endpoint to prevent duplicate /api/api path
          const response = await fetch(buildApiUrl(`orders/${orderId}`), {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText || 'Unknown error'}`);
          }
          
          const data = await response.json();
          console.log('Order fetched successfully:', data);
          setOrder(data);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError(err.message || 'Failed to load order details');
        } finally {
          setLoading(false);
        }
      } else if (!initialOrder && !urlOrderId) {
        setLoading(false);
        setError('No order information provided');
      }
    };

    fetchOrderDetails();
  }, [initialOrder, urlOrderId, authState.isAuthenticated, authState.token]);

  const handleRetryPayment = () => {
    if (order && order.id) {
      navigate(`/payment?orderId=${order.id}&amount=${order.total_amount || order.amount}`);
    } else if (urlOrderId) {
      navigate(`/payment?orderId=${urlOrderId}`);
    } else {
      navigate('/myorders'); // Return to orders if no order info
    }
  };

  const formatOrderTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 8 }}>
            <CircularProgress sx={{ color: '#023047', mb: 3 }} />
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#023047' }}>
              Loading your order details...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will just take a moment
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#023047',
                fontFamily: "'Poppins', sans-serif",
                textAlign: 'center'
              }}
            >
              Payment Status
            </Typography>
          </Box>
          
          <StyledCard sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ bgcolor: '#f44336', py: 3, px: 3, textAlign: 'center' }}>
              <ErrorOutline sx={{ fontSize: 60, color: 'white', mb: 1 }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Payment Failed
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Alert 
                severity="error" 
                sx={{ 
                  my: 3, 
                  textAlign: 'left',
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
                {error || 'Failed to update payment status'}
              </Alert>
              
              <Typography variant="body1" sx={{ mt: 2, mb: 4, color: '#555' }}>
                Your payment could not be processed. Please try again or choose a different payment method.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, justifyContent: 'center' }}>
                <StyledButton
                  startIcon={<RestartAlt />}
                  onClick={handleRetryPayment}
                  sx={{ minWidth: 150 }}
                >
                  Retry Payment
                </StyledButton>
                <OutlinedButton
                  startIcon={<ShoppingBag />}
                  onClick={() => navigate('/myorders')}
                  sx={{ minWidth: 150 }}
                >
                  My Orders
                </OutlinedButton>
              </Box>
              
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                <Typography variant="body2" color="textSecondary">
                  Need help with your payment? 
                  <Button 
                    sx={{ 
                      color: '#023047', 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      ml: 0.5 
                    }}
                    onClick={() => navigate('/contact')}
                  >
                    Contact Support
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#023047',
                fontFamily: "'Poppins', sans-serif",
                textAlign: 'center'
              }}
            >
              Order Not Found
            </Typography>
          </Box>
          
          <StyledCard sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center', p: 4 }}>
            <ErrorOutline sx={{ fontSize: 60, color: '#023047', opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#023047', mb: 2 }}>
              We couldn't find your order
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              This might be because the order doesn't exist or you don't have permission to view it.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, justifyContent: 'center' }}>
              <StyledButton
                startIcon={<ShoppingBag />}
                onClick={() => navigate('/menu')}
                sx={{ minWidth: 140 }}
              >
                Browse Menu
              </StyledButton>
              <OutlinedButton
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{ minWidth: 140 }}
              >
                Go to Home
              </OutlinedButton>
            </Box>
          </StyledCard>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#023047',
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center'
            }}
          >
            Order Confirmation
          </Typography>
        </Box>
        
        <StyledCard sx={{ maxWidth: 650, mx: 'auto', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#4caf50', py: 3, px: 3, textAlign: 'center' }}>
            <CheckCircleOutline sx={{ fontSize: 60, color: 'white', mb: 1 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Payment Successful!
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
                Thank you for your order with FeastFlow. Your payment has been processed successfully.
              </Typography>
              <Chip 
                label={`Order ID: ${order.id || urlOrderId}`} 
                sx={{ 
                  bgcolor: '#e8f5e9', 
                  color: '#2e7d32',
                  fontWeight: 600, 
                  px: 1,
                  my: 1
                }} 
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Receipt sx={{ color: '#023047', mr: 1.5, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#023047' }}>
                      Order Summary
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {order.items && order.items.length > 0 ? (
                    <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                      {order.items.map((item, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            mb: 1.5,
                            pb: idx < order.items.length - 1 ? 1 : 0,
                            borderBottom: idx < order.items.length - 1 ? '1px dashed #e0e0e0' : 'none'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.name || item.item_name} 
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                              x{item.quantity}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{item.price * item.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Item details not available
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <Typography variant="subtitle2" sx={{ color: '#023047' }}>Total</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#023047' }}>
                      ₹{order.total_amount || order.amount}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <AccessTime sx={{ color: '#023047', mr: 1.5, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#023047' }}>
                      Order Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Order Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatOrderTime(order.created_at)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Pickup Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {order.pickup_type === 'restaurant' ? 'Restaurant Pickup' : 'Home Delivery'}
                    </Typography>
                  </Box>
                  
                  {(order.delivery_address || order.pickup_address) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {order.pickup_type === 'restaurant' ? 'Pickup Location' : 'Delivery Address'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#666', mr: 1, mt: 0.25 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.delivery_address || order.pickup_address || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {order.payment_method || 'Online Payment'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Payment Status
                    </Typography>
                    <Chip 
                      label="Paid" 
                      size="small"
                      sx={{ 
                        bgcolor: '#e8f5e9', 
                        color: '#2e7d32',
                        fontWeight: 600,
                        mt: 0.5
                      }} 
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, justifyContent: 'center' }}>
              <StyledButton
                startIcon={<List />}
                onClick={() => navigate('/history')}
              >
                View Order History
              </StyledButton>
              <OutlinedButton
                startIcon={<Home />}
                onClick={() => navigate('/')}
              >
                Back to Home
              </OutlinedButton>
            </Box>
          </CardContent>
        </StyledCard>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="textSecondary">
            A confirmation email has been sent to your registered email address.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#023047', fontWeight: 500 }}>
            Thank you for choosing FeastFlow!
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default OrderConfirmation;
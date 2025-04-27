import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  CircularProgress, 
  Alert, 
  Container, 
  Card, 
  CardContent, 
  Grid,
  Chip
} from '@mui/material';
import { 
  PaymentOutlined, 
  CheckCircleOutline, 
  ErrorOutline,
  RestartAlt, 
  ArrowBack, 
  ShoppingBag,
  Receipt,
  LocationOn,
  CreditCard,
  AccessTime
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';

// Styled components to match theme
const PaymentButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffb703',
  color: '#000',
  borderRadius: '30px',
  padding: '12px 25px',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(255, 183, 3, 0.3)',
  '&:hover': {
    backgroundColor: '#ffaa00',
    boxShadow: '0 6px 15px rgba(255, 183, 3, 0.4)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f0f0f0',
    color: '#999',
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '11px 25px',
  fontSize: '1rem',
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

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 8,
  fontSize: '1rem',
}));

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get URL parameters more reliably
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  // Get order from location state if available
  const stateOrder = location.state?.order;
  
  // Initialize state
  const [order, setOrder] = useState(stateOrder || null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useAuth();

  // Enhanced fetchOrder function with better error handling
  const fetchOrder = async (id) => {
    try {
      if (!id) {
        throw new Error("Invalid order ID");
      }
      
      setIsLoading(true);
      
      if (!authState.isAuthenticated || !authState.token) {
        console.error("User not authenticated");
        throw new Error("You must be logged in to view order details");
      }
      
      console.log(`Fetching order details for ID: ${id}`);
      
      // Fix: Ensure we're using the correct endpoint path with proper prefixing
      const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Log the response status to debug
      console.log(`Order fetch response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        
        if (response.status === 401) {
          console.error("Unauthorized access - token may be invalid or expired");
          throw new Error(`Error 401: Authentication required. Please log in again.`);
        } else if (response.status === 500) {
          throw new Error(`Server error (500): The server encountered an internal error.`);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText || 'Unknown error'}`);
        }
      }
      
      const data = await response.json();
      console.log('Order data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error.message || 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    setError(null);
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!authState.isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        navigate('/login');
        return;
      }
      
      // Check if we have orderId directly from URL parameters
      let orderIdToFetch = orderId;
      
      // If no orderId in URL, check location state
      if (!orderIdToFetch && location.state?.orderId) {
        orderIdToFetch = location.state.orderId;
      }
      
      // If we already have the order from state, use it
      if (stateOrder) {
        setOrder(stateOrder);
        setIsLoading(false);
        return;
      }
      
      if (!orderIdToFetch) {
        setError("No order ID found in the URL.");
        setIsLoading(false);
        return;
      }
      
      console.log(`Fetching order details for ID: ${orderIdToFetch}`);
      const orderData = await fetchOrder(orderIdToFetch);
      
      if (orderData) {
        setOrder(orderData);
      }
    };
    
    getOrderDetails();
  }, [authState.isAuthenticated, authState.token, navigate, retryCount, location.state, orderId, stateOrder]);

  const handlePaid = async () => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required to process payment");
      }
      
      setIsPaid(true);
      setProcessing(true);
      setError(null);
      
      const token = localStorage.getItem('token') || authState.token;
      
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      
      console.log(`Updating order ${orderId} status to paid`);
      
      const paymentReference = `PAY-${orderId}-${Date.now().toString().slice(-6)}`;
      
      // Use consistent direct URL format
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'paid',
          paymentReference: paymentReference,
          payment_method: 'online' // Add payment method to update from default 'cash'
        })
      });

      console.log('Payment status update response:', response.status);
      
      let errorMessage;
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorData.details || 'Failed to update payment status';
        } else {
          const errorText = await response.text();
          errorMessage = errorText || 'Failed to update payment status';
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Payment status update successful:', data);

      // Make sure we have complete order data before navigating
      let orderToPass = order;
      if (!orderToPass || !orderToPass.items) {
        console.log("Fetching complete order data before navigation");
        orderToPass = await fetchOrder(orderId);
      }

      setTimeout(() => {
        navigate('/order-confirmation', {
          state: { 
            order: {
              ...orderToPass,
              status: 'paid',
              payment_method: 'online',
              paymentReference: paymentReference
            }
          }
        });
      }, 1500);
    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment failed: ${err.message || 'Unknown error'}`);
      setIsPaid(false);
      setProcessing(false);
    }
  };

  const renderErrorState = () => (
    <StyledCard sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <ErrorOutline color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography 
          variant="h5" 
          color="error" 
          gutterBottom
          sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
        >
          Unable to load order details
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          {error}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {error?.includes('Authentication required') ? (
            <PaymentButton 
              onClick={() => navigate('/login')}
              startIcon={<ArrowBack />}
            >
              Go to Login
            </PaymentButton>
          ) : (
            <PaymentButton 
              onClick={handleRetry}
              disabled={isLoading}
              startIcon={<RestartAlt />}
            >
              {isLoading ? 'Loading...' : 'Try Again'}
            </PaymentButton>
          )}
          <CancelButton 
            onClick={() => navigate('/myorders')}
            startIcon={<ShoppingBag />}
          >
            My Orders
          </CancelButton>
        </Box>
      </CardContent>
    </StyledCard>
  );

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

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <PaymentOutlined sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#023047',
              fontFamily: "'Poppins', sans-serif" 
            }}
          >
            Complete Payment
          </Typography>
        </Box>
        
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={8}>
            <CircularProgress sx={{ color: '#023047', mb: 2 }} />
            <Typography variant="body1" color="textSecondary">
              Loading order details...
            </Typography>
          </Box>
        )}
        
        {error && !isLoading && renderErrorState()}
        
        {!isLoading && !error && order && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <StyledCard>
                <Box sx={{ bgcolor: '#023047', py: 2.5, px: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Order Details
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Receipt sx={{ color: '#023047', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Order ID
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        #{orderId || order.id}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {order.created_at && (
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <AccessTime sx={{ color: '#666', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1">
                          {formatOrderTime(order.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {order.pickup_type && (
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <LocationOn sx={{ color: '#666', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Pickup Type
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {order.pickup_type === 'restaurant' ? 'Restaurant Pickup' : 'Home Delivery'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {(order.delivery_address || order.pickup_address) && (
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <LocationOn sx={{ color: '#666', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {order.pickup_type === 'restaurant' ? 'Pickup Location' : 'Delivery Address'}
                        </Typography>
                        <Typography variant="body1">
                          {order.delivery_address || order.pickup_address || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Order Items:
                  </Typography>
                  
                  {order.items ? (
                    <Box>
                      {order.items.map((item, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            py: 1,
                            borderBottom: index < order.items.length - 1 ? '1px dashed #e0e0e0' : 'none'
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <Typography variant="body1">
                              {item.name || item.item_name} 
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                              x{item.quantity}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
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
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <StyledCard>
                <Box sx={{ bgcolor: '#023047', py: 2.5, px: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Payment
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#023047' }}>
                      ₹{amount || order.total_amount}
                    </Typography>
                  </Box>
                  
                  {!isPaid ? (
                    <Box>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <CreditCard sx={{ fontSize: 28, color: '#023047', mr: 2 }} />
                          <Typography variant="h6" sx={{ 
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            color: '#023047'
                          }}>
                            Select Payment Method
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          border: '1px solid #e0e0e0', 
                          p: 2, 
                          borderRadius: 2, 
                          mb: 3,
                          backgroundColor: '#f9f9f9'
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                component="div"
                                sx={{ 
                                  width: 20, 
                                  height: 20, 
                                  borderRadius: '50%',
                                  border: '2px solid #023047',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}
                              >
                                <Box 
                                  component="div"
                                  sx={{ 
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: '#023047'
                                  }}
                                />
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Online Payment
                              </Typography>
                            </Box>
                            <Chip 
                              label="Recommended" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#ffb703',
                                color: '#000',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 5 }}>
                            Pay securely with credit/debit card or UPI
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 4 }}>
                        <PaymentButton 
                          fullWidth 
                          onClick={handlePaid}
                          disabled={processing}
                          sx={{ mb: 2 }}
                          startIcon={<CreditCard />}
                        >
                          {processing ? 'Processing...' : 'Complete Payment'}
                        </PaymentButton>
                        
                        <CancelButton 
                          fullWidth
                          onClick={() => navigate('/myorders')}
                          disabled={processing}
                          sx={{ mt: 1 }}
                        >
                          Cancel
                        </CancelButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      {processing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <CircularProgress sx={{ mb: 3, color: '#023047' }} />
                          <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            Processing payment...
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Please do not refresh or close this page
                          </Typography>
                        </Box>
                      ) : (
                        <StyledAlert 
                          icon={<CheckCircleOutline fontSize="large" />}
                          severity="success"
                          sx={{ 
                            '& .MuiAlert-icon': { 
                              alignItems: 'center' 
                            } 
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Payment successful!
                          </Typography>
                          <Typography variant="body2">
                            Redirecting to confirmation...
                          </Typography>
                        </StyledAlert>
                      )}
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Your payment is secure and encrypted.
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
              
              <Box sx={{ mt: 3, px: 1 }}>
                <Typography variant="body2" align="center" color="textSecondary">
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
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Payment;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Divider, CircularProgress, Alert, Container } from '@mui/material';
import Layout from '../components/Layout/Layout';
import API_URL, { buildApiUrl } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';

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
      // The API routes in the backend are mounted at /api/orders/...
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
      
      // Use consistent direct URL format like we did with fetchOrder
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
              payment_method: 'online', // Ensure this is reflected in the order object passed to next screen
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
    <Box sx={{ 
      p: 4, 
      textAlign: 'center', 
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      backgroundColor: '#fff8f8',
      mb: 4
    }}>
      <Typography variant="h6" color="error" gutterBottom>
        Unable to load order details
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {error}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {error?.includes('Authentication required') ? (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRetry}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Try Again'}
          </Button>
        )}
        <Button 
          variant="outlined" 
          onClick={() => navigate('/myorders')}
        >
          Go to My Orders
        </Button>
      </Box>
    </Box>
  );

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
        
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        
        {error && !isLoading && renderErrorState()}
        
        {!isLoading && !error && order && (
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom align="center">
                Payment Details
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Order ID: #{orderId || order.id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total Amount: ₹{amount || order.total_amount}
                </Typography>
                {order && (
                  <Typography variant="body1" gutterBottom>
                    Delivery Address: {order.delivery_address}
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {!isPaid ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Payment Options:
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      onClick={handlePaid}
                      disabled={processing}
                      sx={{ mb: 2 }}
                    >
                      Pay Now (UPI/Card)
                    </Button>
                    
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/myorders')}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  {processing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CircularProgress sx={{ mb: 2 }} />
                      <Typography>Processing payment...</Typography>
                    </Box>
                  ) : (
                    <Alert severity="success">
                      Payment successful! Redirecting to confirmation...
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Payment;
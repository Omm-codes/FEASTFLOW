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
  Container
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { buildApiUrl } from '../services/apiConfig';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';

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

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md">
          <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading your receipt...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Layout>
        <Container maxWidth="md">
          <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="error">
                Payment Failed
              </Typography>
              
              <Alert severity="error" sx={{ my: 2, textAlign: 'left' }}>
                <AlertTitle>Error</AlertTitle>
                {error || 'Failed to update payment status'}
              </Alert>
              
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                Your payment could not be processed. Please try again or choose a different payment method.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRetryPayment}
                >
                  Retry Payment
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/myorders')}
                >
                  Back to Orders
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <Container maxWidth="md">
          <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Order not found.</Typography>
              <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                We couldn't find the order details. This might be because the order doesn't exist 
                or you don't have permission to view it.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </Paper>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              🎉 Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Thank you for your order.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Receipt</Typography>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Item details not available
                </Typography>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Total</span>
                <span>₹{order.total_amount || order.amount}</span>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#888' }}>
              Order ID: {order.id || urlOrderId}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate('/history')}
            >
              View Order History
            </Button>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default OrderConfirmation;
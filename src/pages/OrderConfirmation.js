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
  AlertTitle
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import API_URL, { buildApiUrl } from '../services/apiConfig';
import Layout from '../components/Layout/Layout';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrder = location.state?.order;
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
  }, [location]);

  useEffect(() => {
    // If order is missing items, fetch full order details
    if ((!order || !order.items) && initialOrder?.id) {
      const token = localStorage.getItem('token');
      setLoading(true);
      fetch(buildApiUrl(`/orders/${initialOrder.id}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch order details');
          }
          return res.json();
        })
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || 'Failed to load order details');
        });
    }
  }, [initialOrder, order]);

  const handleRetryPayment = () => {
    if (order && order.id) {
      navigate(`/payment?orderId=${order.id}&amount=${order.total_amount || order.amount}`);
    } else {
      navigate('/myorders'); // Return to cart if no order info
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your receipt...</Typography>
      </Box>
    );
  }

  if (paymentStatus === 'failed') {
    return (
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
              Back to Cart
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!order || !order.items) {
    return (
      <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Order not found.</Typography>
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
    );
  }

  return (
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
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Total</span>
            <span>₹{order.total_amount || order.amount}</span>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mb: 2, color: '#888' }}>
          Order ID: {order.id || order.orderId}
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
  );
};

export default OrderConfirmation;
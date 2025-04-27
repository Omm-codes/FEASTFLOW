import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import Layout from '../components/Layout/Layout';
import API_URL, { buildApiUrl } from '../services/apiConfig';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const amount = params.get('amount');
  const [order, setOrder] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(buildApiUrl(`/orders/${orderId}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          setOrder(null);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(`Failed to load order: ${err.message}`);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePaid = async () => {
    try {
      setIsPaid(true);
      setProcessing(true);
      setError(null);
      
      // Update the order status to 'paid' in the backend
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'paid',
          paymentReference: `PAY-${orderId}-${Date.now().toString().slice(-6)}`
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.error || parsedError.message || 'Failed to update payment status';
        } catch (e) {
          errorMessage = errorData || 'Failed to update payment status';
        }
        throw new Error(errorMessage);
      }

      // After successful payment, navigate to order confirmation
      setTimeout(() => {
        navigate('/order-confirmation', {
          state: { 
            order: {
              ...order,
              status: 'paid' 
            }
          }
        });
      }, 1500);
    } catch (err) {
      console.error('Payment error:', err);
      const errorMsg = err.message || 'Failed to update payment status';
      setError(errorMsg);
      setIsPaid(false);
      setProcessing(false);
      
      // Navigate to order confirmation page with failure status and error message
      setTimeout(() => {
        navigate(`/order-confirmation?status=failed&error=${encodeURIComponent(errorMsg)}`, {
          state: { 
            order: order,
            paymentFailed: true
          }
        });
      }, 1000);
    }
  };

  if (loading) return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    </Layout>
  );

  if (error && !processing) return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/myorders')}
        >
          Return to Cart
        </Button>
      </Box>
    </Layout>
  );

  if (order === null) return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="warning">Order not found.</Alert>
        <Button 
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/menu')}
        >
          Return to Menu
        </Button>
      </Box>
    </Layout>
  );

  return (
    <Layout>
      <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Scan to Pay</Typography>
          <Box sx={{ fontSize: 64, my: 2 }}>📱</Box>
          <Typography variant="body2" sx={{ mt: 2, mb: 2, color: '#666' }}>
            Scan this QR code with any UPI app to pay
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Order Details</Typography>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            {order.items && order.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handlePaid}
            disabled={isPaid && !error}
          >
            {isPaid && !error ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Processing...
              </Box>
            ) : "I've Paid"}
          </Button>

          <Button
            variant="outlined"
            size="medium"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/myorders')}
          >
            Cancel Payment
          </Button>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Payment;
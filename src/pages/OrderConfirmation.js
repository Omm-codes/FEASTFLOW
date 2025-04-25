import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Divider, CircularProgress } from '@mui/material';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrder = location.state?.order;
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    // If order is missing items, fetch full order details
    if ((!order || !order.items) && initialOrder?.id) {
      const token = localStorage.getItem('token');
      setLoading(true);
      fetch(`http://localhost:5001/api/orders/${initialOrder.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [initialOrder, order]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your receipt...</Typography>
      </Box>
    );
  }

  if (!order || !order.items) {
    return <Typography>Order not found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
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
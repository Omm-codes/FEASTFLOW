import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const amount = params.get('amount');
  const [order, setOrder] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          setOrder(null);
          return;
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setOrder(null);
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePaid = async () => {
    setIsPaid(true);
    setTimeout(() => {
      navigate('/order-confirmation', {
        state: { order }
      });
    }, 1200);
  };

  if (order === null) return <Typography>Order not found.</Typography>;
  if (!order) return <Typography>Loading order...</Typography>;

  return (
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
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handlePaid}
          disabled={isPaid}
        >
          {isPaid ? "Processing..." : "I've Paid"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Payment;
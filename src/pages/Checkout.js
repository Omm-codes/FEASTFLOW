import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cartContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Divider,
  Box,
  Alert
} from '@mui/material';

const Checkout = () => {
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    notes: '',
    name: '',
    email: ''
  });
  const [error, setError] = useState('');

  const totalAmount = cart.reduce((total, item) => 
    total + (item.price * (item.quantity || 1)), 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity || 1,
            price: item.price
          })),
          total_amount: totalAmount,
          payment_method: 'UPI',
          status: 'pending',
          customer: {
            address: formData.address,
            phone: formData.phone,
            name: formData.name,
            email: formData.email
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const data = await response.json();
      console.log('Order creation response:', data); // Add this line
      navigate(`/payment?orderId=${data.id}&amount=${totalAmount}`);
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Error placing order');
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Your cart is empty</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Checkout</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Delivery Address"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      multiline
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ mb: 2 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.name} x {item.quantity || 1}</Typography>
                    <Typography variant="body2">₹{item.price * (item.quantity || 1)}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">₹{totalAmount}</Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
              >
                Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Checkout;


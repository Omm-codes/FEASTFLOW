import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cartContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Grid, 
  Button, 
  Divider, 
  Box, 
  Alert, 
  AlertTitle,
  CircularProgress, 
  Snackbar, 
  Link, 
  Checkbox, 
  FormControlLabel
} from '@mui/material';
import API_URL, { buildApiUrl } from '../services/apiConfig';

const Checkout = () => {
  const { cart, setCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    notes: '',
    name: user?.name || '',
    email: user?.email || '',
    guestCheckout: !isAuthenticated
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
        guestCheckout: false
      }));
    }
  }, [user]);
  
  // Check if we have cart items on component mount
  useEffect(() => {
    console.log('Checkout component mounted with cart:', cart);
    // Redirect to menu if cart is empty
    if (cart.length === 0) {
      console.log('Cart is empty, redirecting to menu');
      navigate('/menu');
    }
  }, [cart, navigate]);

  const totalAmount = cart.reduce((total, item) => 
    total + (item.price * (item.quantity || 1)), 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phone || !formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Current user role:', user?.role);
      console.log('Preparing to submit order with cart:', cart);
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      // Create order payload
      const orderPayload = {
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
          name: formData.name || 'Guest',
          email: formData.email || 'guest@example.com'
        }
      };

      console.log('Submitting order with payload:', orderPayload);
      
      // Set headers based on whether the user is authenticated
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token && !formData.guestCheckout) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(buildApiUrl('/orders'), {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      console.log('Order response status:', response.status);
      const responseText = await response.text();
      console.log('Order response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to place order');
      }

      console.log('Order creation response:', data);
      
      if (data && data.id) {
        // Clear cart after successful order
        setCart([]); // Clear cart first
        console.log('Order created successfully with ID:', data.id);
        console.log('Redirecting to payment page...');
        
        // Navigate to payment page with order ID and amount
        navigate(`/payment?orderId=${data.id}&amount=${totalAmount}`);
      } else {
        throw new Error('Order created but no order ID returned');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a toggle for guest checkout
  const handleGuestCheckoutToggle = (e) => {
    setFormData({...formData, guestCheckout: e.target.checked});
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Your cart is empty</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
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

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Checking out as a guest</AlertTitle>
            You can <Link href="/login" onClick={(e) => {
              e.preventDefault();
              navigate('/login', { state: { from: location.pathname } });
            }}>login</Link> to save your order history, or continue as guest below.
          </Alert>
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
                  
                  {isAuthenticated && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formData.guestCheckout} 
                            onChange={handleGuestCheckoutToggle}
                          />
                        }
                        label="Checkout as guest (don't link to my account)"
                      />
                    </Grid>
                  )}
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
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Checkout;


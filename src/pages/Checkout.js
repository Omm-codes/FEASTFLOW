import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
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

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { authState } = useAuth();
  
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    notes: '',
    name: '',
    email: '',
    city: '',
    postalCode: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Effect to check authentication state and load user data
  useEffect(() => {
    const checkAuthAndLoadUserData = async () => {
      if (authState.loading) {
        return; // Wait for auth state to be determined
      }
      
      console.log("Auth state in Checkout:", authState);
      
      if (authState.isAuthenticated && authState.user) {
        setIsLoadingUserData(true);
        setGuestCheckout(false);
        
        try {
          // If needed, fetch additional user details
          const response = await fetch('http://localhost:5001/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${authState.token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Pre-fill the form with user data
            setFormData({
              name: userData.name || authState.user.name || '',
              email: userData.email || authState.user.email || '',
              phone: userData.phone || authState.user.phone || '',
              address: userData.address || authState.user.address || '',
              city: userData.city || authState.user.city || '',
              postalCode: userData.postalCode || authState.user.postalCode || '',
            });
          } else {
            console.error('Failed to fetch user profile data');
            // Still use the basic data from auth state
            setFormData({
              name: authState.user.name || '',
              email: authState.user.email || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoadingUserData(false);
        }
      } else {
        setGuestCheckout(true);
      }
    };
    
    checkAuthAndLoadUserData();
  }, [authState.isAuthenticated, authState.loading, authState.user, authState.token]);
  
  // Effect to check if cart is empty and redirect
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phone || !formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cart,
        total_amount: total,
        customerInfo: formData,
        userId: authState.isAuthenticated ? authState.user.id : null,
      };
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authState.isAuthenticated && authState.token) {
        headers['Authorization'] = `Bearer ${authState.token}`;
      }
      
      console.log('Submitting order data:', orderData);
      
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order created successfully:', data);
        clearCart();
        
        // Use navigate with state to ensure order ID is available even after page refresh
        navigate(`/payment?orderId=${data.id}&amount=${total}`, { 
          state: { orderId: data.id, amount: total } 
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      setError('Network error, please try again');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        
        {isLoadingUserData ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {guestCheckout ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                Checking out as a guest. 
                You can checkout as a guest, but your order won't be saved to any account. 
                <Button 
                  color="primary" 
                  size="small" 
                  onClick={() => navigate('/login', { state: { returnTo: '/checkout' } })}
                  sx={{ ml: 1 }}
                >
                  Log in
                </Button>
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mb: 3 }}>
                Logged in as {authState.user?.name || authState.user?.email || 'User'}
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
                    <Typography variant="h6">₹{total}</Typography>
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
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Checkout;


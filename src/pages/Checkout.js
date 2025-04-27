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
  CircularProgress, 
  Tabs,
  Tab
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
    postalCode: '',
    pickupAddress: '',
    pickupTime: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
            console.log('User profile data loaded:', userData);
            
            // Pre-fill the form with user data - ensure correct field mapping
            setFormData({
              name: userData.name || authState.user.name || '',
              email: userData.email || authState.user.email || '',
              phone: userData.phone || '', // Properly set phone separately from email
              address: userData.address || '',
              city: userData.city || '',
              postalCode: userData.postalCode || '',
              pickupAddress: userData.pickupAddress || '',
              pickupTime: '',
              notes: ''
            });
          } else {
            console.error('Failed to fetch user profile data');
            // Still use the basic data from auth state
            setFormData({
              name: authState.user.name || '',
              email: authState.user.email || '',
              phone: '', // Clear phone to avoid using email as phone
              pickupAddress: '',
              pickupTime: '',
              address: '',
              city: '',
              postalCode: '',
              notes: ''
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Even if profile fetch fails, still use auth data
          setFormData(prevData => ({
            ...prevData,
            name: authState.user.name || '',
            email: authState.user.email || ''
          }));
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields based on active tab (pickup information)
    if (activeTab === 0) {
      // Pickup at restaurant
      if (!formData.name || !formData.email || !formData.phone || !formData.pickupTime) {
        setError('Please fill in all required fields for pickup');
        return;
      }
    } else {
      // Home pickup
      if (!formData.address || !formData.phone || !formData.name || !formData.email) {
        setError('Please fill in all required fields for home pickup');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Determine pickup type based on active tab
      const pickupType = activeTab === 0 ? 'restaurant' : 'home';
      
      // Format the pickup address based on pickup type
      const pickupAddress = activeTab === 0 
        ? "Restaurant Pickup" 
        : formData.address;
      
      // Format order items correctly (menu_item_id is the expected field)
      const orderItems = cart.map(item => ({
        menu_item_id: item.id, // Use the item's ID as menu_item_id
        quantity: item.quantity || 1,
        price: item.price
      }));
      
      // Prepare special instructions with pickup time if provided
      const pickupNotes = formData.pickupTime ? `Pickup Time: ${formData.pickupTime}` : '';
      const customerNotes = formData.notes ? `Notes: ${formData.notes}` : '';
      const specialInstructions = [pickupNotes, customerNotes].filter(Boolean).join(' | ');

      const orderData = {
        items: orderItems,
        total_amount: total,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        pickup_type: pickupType,
        pickup_address: pickupAddress,
        delivery_address: activeTab === 1 ? formData.address : "",
        contact_number: formData.phone,
        customer_name: formData.name,
        customer_email: formData.email,
        special_instructions: specialInstructions,
        payment_method: "cash", // Default payment method
        status: 'pending',
        userId: authState.isAuthenticated ? authState.user.id : null
      };
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Only add the auth token if user is authenticated
      if (authState.isAuthenticated && authState.token) {
        headers['Authorization'] = `Bearer ${authState.token}`;
      } else {
        // If user is not authenticated, show a message that they need to log in
        setError('You must be logged in to place an order. Please log in or register.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Submitting order data:', orderData);
      
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        // Enhanced error handling
        let errorMessage = 'Failed to create order';
        try {
          const errorData = await response.json();
          console.error('Order creation failed:', errorData);
          // Log the full error object for debugging
          console.log('Error response details:', JSON.stringify(errorData, null, 2));
          
          // More detailed error extraction
          if (typeof errorData === 'object') {
            errorMessage = errorData.error || errorData.message || errorData.details || 
                          (errorData.errors && JSON.stringify(errorData.errors)) || errorMessage;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch (e) {
          // If response isn't valid JSON, try to get the text
          try {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            errorMessage = errorText || `Server error (${response.status}): ${response.statusText}`;
          } catch (textErr) {
            console.error('Could not parse error response:', e, 'Status:', response.status, 'Status Text:', response.statusText);
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
          }
        }
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      const data = await response.json();
      console.log('Order created successfully:', data);
      clearCart();
      
      // Use navigate with state to ensure order ID is available even after page refresh
      navigate(`/payment?orderId=${data.id}&amount=${total}`, { 
        state: { orderId: data.id, amount: total } 
      });
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Network error or server issue. Please try again.');
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
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                      <Tab label="Pickup at Restaurant" />
                      <Tab label="Home Pickup" />
                    </Tabs>
                    
                    {activeTab === 0 ? (
                      // Restaurant pickup form
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Please provide your details for restaurant pickup
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Preferred Pickup Time"
                            value={formData.pickupTime}
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
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
                      </Grid>
                    ) : (
                      // Home pickup form
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Please provide your address for home pickup
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Pickup Address"
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Postal Code"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
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
                      </Grid>
                    )}
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
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
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


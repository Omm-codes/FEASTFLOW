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
  Tab,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ShoppingBag, 
  LocationOn, 
  RestaurantMenu, 
  AccessTime, 
  LocalShipping, 
  Person, 
  Email, 
  Phone, 
  Note 
} from '@mui/icons-material';

// Styled components to match theme
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#ffb703',
    height: 3,
  },
  '& .MuiTab-root': {
    fontWeight: 600,
    textTransform: 'none',
    fontFamily: "'Poppins', sans-serif",
    '&.Mui-selected': {
      color: '#023047',
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    color: '#023047',
  },
  '&:hover': {
    color: '#023047',
    opacity: 0.8,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#023047',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#023047',
  },
}));

const OrderButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffb703',
  color: '#000',
  borderRadius: '30px',
  padding: '12px 25px',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(255, 183, 3, 0.3)',
  '&:hover': {
    backgroundColor: '#ffaa00',
    boxShadow: '0 6px 15px rgba(255, 183, 3, 0.4)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f5f5f5',
    color: '#9e9e9e',
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  color: '#023047',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(2, 48, 71, 0.08)',
  },
}));

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
            
            // Pre-fill the form with user data - ensure correct field mapping
            setFormData({
              name: userData.name || authState.user.name || '',
              email: userData.email || authState.user.email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              postalCode: userData.postalCode || '',
              pickupAddress: userData.pickupAddress || '',
              pickupTime: '',
              notes: ''
            });
          } else {
            // Still use the basic data from auth state
            setFormData({
              name: authState.user.name || '',
              email: authState.user.email || '',
              phone: '',
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
            errorMessage = errorText || `Server error (${response.status}): ${response.statusText}`;
          } catch (textErr) {
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
          }
        }
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      const data = await response.json();
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <ShoppingBag sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#023047',
              fontFamily: "'Poppins', sans-serif" 
            }}
          >
            Checkout
          </Typography>
        </Box>
        
        {isLoadingUserData ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress sx={{ color: '#023047' }} />
          </Box>
        ) : (
          <>
            {guestCheckout ? (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 4, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { color: '#023047' }
                }}
                icon={<Person />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Checking out as a guest
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      You can checkout as a guest, but your order won't be saved to any account.
                    </Typography>
                  </Box>
                  <LoginButton 
                    variant="outlined"
                    size="medium" 
                    onClick={() => navigate('/login', { state: { returnTo: '/checkout' } })}
                    sx={{ mt: { xs: 2, sm: 0 } }}
                  >
                    Log in
                  </LoginButton>
                </Box>
              </Alert>
            ) : (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 4, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { color: '#023047' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, bgcolor: '#023047', width: 32, height: 32 }}>
                    {authState.user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Logged in as {authState.user?.name || authState.user?.email || 'User'}
                  </Typography>
                </Box>
              </Alert>
            )}
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                >
                  <form onSubmit={handleSubmit}>
                    <StyledTabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
                      <StyledTab 
                        label="Pickup at Restaurant" 
                        icon={<RestaurantMenu />} 
                        iconPosition="start"
                      />
                      <StyledTab 
                        label="Home Pickup" 
                        icon={<LocalShipping />} 
                        iconPosition="start"
                      />
                    </StyledTabs>
                    
                    {activeTab === 0 ? (
                      // Restaurant pickup form
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTime sx={{ color: '#023047', mr: 1.5 }} />
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#023047',
                                fontFamily: "'Poppins', sans-serif"
                              }}
                            >
                              Restaurant Pickup Details
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, ml: 0.5 }}>
                            Please provide your details for restaurant pickup
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Preferred Pickup Time"
                            value={formData.pickupTime}
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                            sx={{ mb: 1 }}
                            InputProps={{
                              startAdornment: <AccessTime sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            InputProps={{
                              startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            InputProps={{
                              startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            InputProps={{
                              startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            label="Additional Notes"
                            multiline
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            InputProps={{
                              startAdornment: <Note sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                            }}
                            placeholder="Any special requests or dietary requirements?"
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      // Home pickup form
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOn sx={{ color: '#023047', mr: 1.5 }} />
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#023047',
                                fontFamily: "'Poppins', sans-serif"
                              }}
                            >
                              Home Pickup Details
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, ml: 0.5 }}>
                            Please provide your complete address for home pickup
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Pickup Address"
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            InputProps={{
                              startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                            }}
                            placeholder="Enter your complete address"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            label="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            label="Postal Code"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            InputProps={{
                              startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            InputProps={{
                              startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            InputProps={{
                              startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            label="Additional Notes"
                            multiline
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            InputProps={{
                              startAdornment: <Note sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                            }}
                            placeholder="Any special requests or dietary requirements?"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </form>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <Box sx={{ bgcolor: '#023047', py: 2, px: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      Order Summary
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                      {cart.map((item) => (
                        <Box 
                          key={item.id} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2,
                            pb: 1.5,
                            borderBottom: '1px dashed #e0e0e0',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.image_url && (
                              <Box
                                component="img"
                                src={`http://localhost:5001${item.image_url}`}
                                sx={{ 
                                  width: 45, 
                                  height: 45, 
                                  borderRadius: 1.5, 
                                  mr: 2,
                                  objectFit: 'cover'
                                }}
                                alt={item.name}
                              />
                            )}
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Qty: {item.quantity || 1}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#023047' }}>
                            ₹{item.price * (item.quantity || 1)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                      <Typography variant="body2">₹{total}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Delivery</Typography>
                      <Typography variant="body2">Free</Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid #e0e0e0' 
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#023047' }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#023047' }}>
                        ₹{total}
                      </Typography>
                    </Box>
                    
                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mt: 3, 
                          borderRadius: 2,
                        }}
                      >
                        {error}
                      </Alert>
                    )}
                    
                    <OrderButton
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      sx={{ mt: 3 }}
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order'}
                    </OrderButton>
                  </CardContent>
                </Card>
                
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    mt: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                    border: '1px solid #e0e0e0' 
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="body2" align="center" color="text.secondary">
                      By placing an order, you agree to our
                      <Box component="span" sx={{ fontWeight: 500, display: 'block', color: '#023047', mt: 0.5 }}>
                        Terms & Conditions
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Checkout;
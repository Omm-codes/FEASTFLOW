import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { 
  Container, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  ShoppingBag,
  RestaurantMenu,
  RoomService
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Styled components to match theme
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0',
  }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme, status }) => ({
  borderLeft: `4px solid ${
    status === 'success' ? '#4caf50' : 
    status === 'warning' ? '#ff9800' : 
    status === 'info' ? '#2196f3' : 
    status === 'primary' ? '#023047' : 
    status === 'error' ? '#f44336' : '#9e9e9e'
  }`,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.02)'
  },
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffb703',
  color: '#000',
  borderRadius: '30px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  '&:hover': {
    backgroundColor: '#ffaa00',
  }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderColor: '#023047',
  color: '#023047',
  borderRadius: '30px',
  padding: '7px 20px',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  '&:hover': {
    backgroundColor: 'rgba(2, 48, 71, 0.08)',
    borderColor: '#023047',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  '& .MuiTableHead-root': {
    backgroundColor: '#f5f8fa',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    fontWeight: 600,
    color: '#023047',
  }
}));

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated, token, user } = authState;

  useEffect(() => {
    const fetchOrders = async () => {
      // If not authenticated, save current path and redirect to login
      if (!isAuthenticated || !token) {
        console.log("User not authenticated, redirecting to login");
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', '/history');
        navigate('/login', { 
          state: { 
            returnTo: '/history',
            message: 'Please login to view your order history'
          } 
        });
        return;
      }

      setLoading(true);
      try {
        // Use direct URL for consistency and to avoid any path issues
        console.log("Fetching orders with token:", token.substring(0, 15) + "...");
        const response = await fetch('http://localhost:5001/api/orders/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Log response status for debugging
        console.log('Orders API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from orders/me endpoint:", errorText);
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Orders fetched:', data);
        
        // If we have orders, fetch details for each one
        if (data && Array.isArray(data) && data.length > 0) {
          const ordersWithDetails = await Promise.all(data.map(async (order) => {
            try {
              // Use direct URL for consistency
              const detailsResponse = await fetch(`http://localhost:5001/api/orders/${order.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (!detailsResponse.ok) {
                console.warn(`Could not fetch details for order ${order.id}: ${detailsResponse.status}`);
                return order;
              }
              
              const orderDetails = await detailsResponse.json();
              return { ...order, items: orderDetails.items || [] };
            } catch (err) {
              console.error(`Error fetching details for order ${order.id}:`, err);
              return order;
            }
          }));
          
          // Sort orders by date (newest first)
          const sortedOrders = ordersWithDetails.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          setOrders(sortedOrders);
        } else {
          setOrders([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(`Failed to load orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token, navigate, user]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'preparing':
        return 'warning';
      case 'ready':
        return 'info';
      case 'delivered':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const generateReceiptNumber = (orderId, timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `RCPT-${dateString}-${orderId}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HistoryIcon sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#023047',
              fontFamily: "'Poppins', sans-serif" 
            }}
          >
            Order History
          </Typography>
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#023047', mb: 3 }} />
            <Typography variant="body1" color="textSecondary">
              Loading your order history...
            </Typography>
          </Box>
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        {!loading && !error && orders.length === 0 && (
          <Box 
            sx={{
              textAlign: 'center', 
              py: 8, 
              px: 3, 
              borderRadius: 4,
              backgroundColor: '#f8f9fa', 
              border: '1px dashed #dee2e6'
            }}
          >
            <ShoppingBag sx={{ fontSize: 70, color: '#ccc', mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#666',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              You haven't placed any orders yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Your order history will appear here once you've made a purchase
            </Typography>
            <StyledButton 
              onClick={() => navigate('/menu')}
              startIcon={<RestaurantMenu />}
              sx={{ px: 4 }}
            >
              Browse Menu
            </StyledButton>
          </Box>
        )}
        
        {!loading && !error && orders.length > 0 && (
          <Box>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <RoomService sx={{ color: '#023047', mr: 1.5, fontSize: 20 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#023047',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Your Orders
                </Typography>
              </Box>

              {orders.map((order) => (
                <StyledAccordion key={order.id}>
                  <StyledAccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    status={getStatusColor(order.status)}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      flexGrow: 1, 
                      flexWrap: 'wrap',
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Box sx={{ minWidth: '180px', mr: { xs: 0, sm: 3 }, flex: { xs: '1 0 100%', sm: 'none' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#023047' }}>
                          Order #{order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(order.created_at)} at {formatTime(order.created_at)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flexGrow: 1,
                        justifyContent: { xs: 'space-between', sm: 'flex-start' },
                        mt: { xs: 1, sm: 0 }
                      }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mr: 3, 
                            fontWeight: 600, 
                            color: '#023047' 
                          }}
                        >
                          ₹{parseFloat(order.total_amount).toFixed(2)}
                        </Typography>
                        
                        <Chip 
                          label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'} 
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ 
                            minWidth: '90px', 
                            fontWeight: 500,
                            ml: { xs: 0, sm: 'auto' }
                          }}
                        />
                      </Box>
                    </Box>
                  </StyledAccordionSummary>
                  
                  <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#f8f9fa', 
                        p: 2.5, 
                        borderRadius: 2, 
                        mb: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3
                      }}
                    >
                      <Box sx={{ minWidth: '200px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ReceiptIcon sx={{ mr: 1, color: '#023047', fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#023047' }}>
                            Receipt Number
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5 }}>
                          {generateReceiptNumber(order.id, order.created_at)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#023047' }}>
                          Pickup Type
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {order.pickup_type === 'restaurant' ? 'Restaurant Pickup' : 'Home Delivery'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#023047' }}>
                          {order.pickup_type === 'restaurant' ? 'Pickup Location' : 'Delivery Address'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.delivery_address || order.pickup_address || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600, 
                        color: '#023047',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ShoppingBag sx={{ mr: 1, fontSize: 18 }} />
                      Order Items
                    </Typography>
                    
                    {order.items && order.items.length > 0 ? (
                      <StyledTableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Price</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ fontWeight: 500 }}>{item.name || item.item_name}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">₹{parseFloat(item.price).toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} align="right" sx={{ fontWeight: 700, color: '#023047' }}>
                                Total:
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#023047' }}>
                                ₹{parseFloat(order.total_amount).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                    ) : (
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: '#f8f9fa',
                          borderRadius: 2,
                          textAlign: 'center',
                          mb: 3
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Item details are not available for this order
                        </Typography>
                      </Box>
                    )}
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                      }}
                    >
                      <OutlinedButton
                        size="small"
                        onClick={() => navigate(`/order-details/${order.id}`)}
                      >
                        View Full Details
                      </OutlinedButton>
                      
                      {order.status === 'ready' && (
                        <StyledButton
                          size="small"
                        >
                          Confirm Pickup
                        </StyledButton>
                      )}
                    </Box>
                  </AccordionDetails>
                </StyledAccordion>
              ))}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <OutlinedButton
                startIcon={<RestaurantMenu />}
                onClick={() => navigate('/menu')}
                sx={{ mx: 1 }}
              >
                Browse Menu
              </OutlinedButton>
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default History;
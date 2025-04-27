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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import API_URL, { buildApiUrl } from '../services/apiConfig';

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
          
          setOrders(ordersWithDetails);
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

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Order History
          </Typography>
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <CircularProgress />
            </div>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Typography variant="body1" gutterBottom>You have no orders yet.</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/menu')}
                sx={{ mt: 2 }}
              >
                Browse Menu
              </Button>
            </div>
          )}
          
          {!loading && !error && orders.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {orders.map((order) => (
                <Accordion key={order.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      borderLeft: `4px solid ${
                        getStatusColor(order.status) === 'success' ? '#4caf50' : 
                        getStatusColor(order.status) === 'warning' ? '#ff9800' : 
                        getStatusColor(order.status) === 'info' ? '#2196f3' : 
                        getStatusColor(order.status) === 'primary' ? '#3f51b5' : 
                        getStatusColor(order.status) === 'error' ? '#f44336' : '#9e9e9e'
                      }`,
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ minWidth: '180px', mr: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Order #{order.id}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(order.created_at).toLocaleDateString()} 
                          {" "}
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mr: 3, fontWeight: 500, flexGrow: 0 }}>
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </Typography>
                      <Chip 
                        label={order.status || 'Pending'} 
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ minWidth: '80px', ml: 'auto' }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2">
                          Receipt: {generateReceiptNumber(order.id, order.created_at)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Pickup Address: {order.delivery_address || 'Not specified'}
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Order Items:
                    </Typography>
                    {order.items && order.items.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
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
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">₹{parseFloat(item.price).toFixed(2)}</TableCell>
                                <TableCell align="right">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                                Total:
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                ₹{parseFloat(order.total_amount).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Item details not available
                      </Typography>
                    )}
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/order-details/${order.id}`)}
                      >
                        View Full Details
                      </Button>
                      {order.status === 'ready' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Confirm Pickup
                        </Button>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default History;
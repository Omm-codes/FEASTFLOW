import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Typography, Box, Container, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, Button, Paper, Divider
} from "@mui/material";
import { 
  Delete, ShoppingCart, Add, Remove, ShoppingBasket
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components with updated theme colors
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
  border: '1px solid #f0f0f0',
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#023047',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(2, 48, 71, 0.08)',
  },
  '&.Mui-disabled': {
    color: '#bdbdbd',
  }
}));

const OrderButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffb703',
  color: '#000',
  borderRadius: '30px',
  padding: '10px 25px',
  fontSize: '0.95rem',
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

const MyOrders = () => {
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState(() => cart.map(() => 1));
  const navigate = useNavigate();
  const { authState } = useAuth(); 
  const user = authState?.user;

  const calculateItemTotal = (price, index) => {
    return (price * quantities[index]).toFixed(2);
  };

  const totalPrice = () => {
    let total = 0;
    cart.forEach((item, index) => (total += item.price * quantities[index]));
    return total.toFixed(2);
  };

  const handleQuantityChange = (index, delta) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(1, newQuantities[index] + delta);
    setQuantities(newQuantities);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    const updatedQuantities = [...quantities];
    updatedCart.splice(index, 1);
    updatedQuantities.splice(index, 1);
    setCart(updatedCart);
    setQuantities(updatedQuantities);
  };

  const handleCheckout = () => {
    // Update cart items with quantities
    const updatedCart = cart.map((item, index) => ({
      ...item, 
      quantity: quantities[index]
    }));
    
    // Update cart with quantities before navigation
    setCart(updatedCart);
    navigate('/checkout');
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <ShoppingBasket sx={{ fontSize: 32, color: '#023047', mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#023047',
              fontFamily: "'Poppins', sans-serif" 
            }}
          >
            My Cart
          </Typography>
        </Box>
        
        {cart.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 4,
            border: '1px dashed #dee2e6'
          }}>
            <ShoppingCart sx={{ fontSize: 70, color: '#ccc', mb: 2 }} />
            <Typography 
              variant="h6" 
              color="textSecondary" 
              gutterBottom
              sx={{ fontFamily: "'Poppins', sans-serif", mb: 2 }}
            >
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/menu"
              variant="contained"
              sx={{ 
                mt: 2,
                backgroundColor: '#ffb703',
                color: '#000',
                borderRadius: '20px',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: '#ffaa00',
                },
              }}
            >
              Browse Menu
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f4f8fb' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#023047' }}>Item</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#023047' }}>Price</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#023047' }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#023047' }}>Total</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#023047' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img 
                              src={`http://localhost:5001${item.image_url}`}
                              alt={item.name}
                              style={{ 
                                width: 60, 
                                height: 60, 
                                objectFit: 'cover', 
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">₹{item.price}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QuantityButton onClick={() => handleQuantityChange(index, -1)}>
                              <Remove />
                            </QuantityButton>
                            <Typography sx={{ mx: 2, fontWeight: 600 }}>{quantities[index]}</Typography>
                            <QuantityButton onClick={() => handleQuantityChange(index, 1)}>
                              <Add />
                            </QuantityButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#023047' }}>
                          ₹{calculateItemTotal(item.price, index)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            onClick={() => handleRemoveItem(index)} 
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.08)'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#023047',
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2
                    }}
                  >
                    Order Summary
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#666' }}>Subtotal</Typography>
                      <Typography sx={{ fontWeight: 500 }}>₹{totalPrice()}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#023047' }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#023047' }}>
                        ₹{totalPrice()}
                      </Typography>
                    </Box>
                  </Box>
                  <OrderButton
                    fullWidth
                    onClick={handleCheckout}
                    sx={{ mt: 2 }}
                  >
                    Proceed to Checkout
                  </OrderButton>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                mt: 3, 
                border: '1px solid #e0e0e0' 
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Need help with your order?
                    <Button 
                      component={Link} 
                      to="/contact"
                      sx={{ 
                        display: 'block', 
                        color: '#023047',
                        fontWeight: 600, 
                        mt: 1,
                        textTransform: 'none'
                      }}
                    >
                      Contact Support
                    </Button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default MyOrders;
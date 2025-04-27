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
  Delete, ShoppingCart, Add, Remove 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
  border: '1px solid #f0f0f0',
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#552a0f',
  border: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(85, 42, 15, 0.08)',
  },
  '&.Mui-disabled': {
    color: '#bdbdbd',
  }
}));

const OrderButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#552a0f',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 25px',
  fontSize: '0.95rem',
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(85, 42, 15, 0.2)',
  '&:hover': {
    backgroundColor: '#3e1e09',
    boxShadow: '0 6px 15px rgba(85, 42, 15, 0.3)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d7ccc8',
    color: '#9e9e9e',
  }
}));

const MyOrders = () => {
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState(() => cart.map(() => 1));
  const navigate = useNavigate(); // Use navigate for programmatic navigation
  const { user } = useAuth(); // Get authentication status

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

  // Updated function to handle checkout navigation with auth check
  const handleCheckout = () => {
    // Update cart items with quantities
    const updatedCart = cart.map((item, index) => ({
      ...item, 
      quantity: quantities[index]
    }));
    
    // Update cart with quantities before navigation
    setCart(updatedCart);
    
    // Check if user is logged in
    if (!user) {
      // If not logged in, navigate to login with return path set to checkout
      navigate('/login', { state: { returnTo: '/checkout' } });
    } else {
      // If logged in, navigate directly to checkout
      navigate('/checkout');
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>My Orders</Typography>
        
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/menu"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
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
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img 
                              src={`http://localhost:5001${item.image_url}`}
                              alt={item.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                            {item.name}
                          </Box>
                        </TableCell>
                        <TableCell align="center">₹{item.price}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QuantityButton onClick={() => handleQuantityChange(index, -1)}>
                              <Remove />
                            </QuantityButton>
                            <Typography sx={{ mx: 2 }}>{quantities[index]}</Typography>
                            <QuantityButton onClick={() => handleQuantityChange(index, 1)}>
                              <Add />
                            </QuantityButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">₹{calculateItemTotal(item.price, index)}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleRemoveItem(index)} color="error">
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
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Order Summary</Typography>
                  <Box sx={{ my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal</Typography>
                      <Typography>₹{totalPrice()}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">₹{totalPrice()}</Typography>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
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
import React, { useContext } from "react";
import Layout from "../components/Layout/Layout";
import { CartContext } from "../context/cartContext";
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { Delete, ShoppingCart } from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 15,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#333',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(218, 165, 32, 0.05)',
  },
  '&:hover': {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    transition: 'all 0.3s ease',
  },
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #DAA520 30%, #FFD700 90%)',
  border: 0,
  borderRadius: 8,
  boxShadow: '0 3px 5px 2px rgba(218, 165, 32, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(45deg, #FFD700 30%, #DAA520 90%)',
  },
}));

const MyOrders = () => {
  const { cart, setCart } = useContext(CartContext);

  const totalPrice = () => {
    let total = 0;
    cart.forEach((item) => (total += item.price));
    return total.toFixed(2);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleConfirmOrder = () => {
    alert("Order Confirmed! Thank you for your order.");
    setCart([]);
  };

  return (
    <Layout>
      <Box sx={{ 
        m: { xs: 2, md: 6 }, 
        fontFamily: "'Poppins', sans-serif",
        maxWidth: 1200,
        mx: 'auto',
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#2C3E50',
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            My Orders
          </Typography>
          <Divider sx={{ maxWidth: 100, mx: 'auto', borderColor: 'goldenrod', borderWidth: 2 }} />
        </Box>

        {cart.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'rgba(218, 165, 32, 0.05)',
            borderRadius: 2
          }}>
            <ShoppingCart sx={{ fontSize: 60, color: 'goldenrod', mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                color: '#666'
              }}
            >
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(218, 165, 32, 0.1)' }}>
                  <StyledTableCell>Item Name</StyledTableCell>
                  <StyledTableCell align="center">Price</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => (
                  <StyledTableRow key={index}>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.name}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                      ₹{item.price}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleRemoveItem(index)}
                        sx={{ 
                          '&:hover': { 
                            color: 'red',
                            transform: 'scale(1.1)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}

        <Box sx={{ 
          mt: 4, 
          textAlign: 'right',
          p: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#2C3E50'
            }}
          >
            Total: ₹{totalPrice()}
          </Typography>
          <ConfirmButton
            onClick={handleConfirmOrder}
            disabled={cart.length === 0}
            sx={{ mt: 2 }}
          >
            Confirm Order
          </ConfirmButton>
        </Box>
      </Box>
    </Layout>
  );
};

export default MyOrders;
import React, { useContext, useState } from "react";
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
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { 
  Delete, 
  ShoppingCart, 
  Add, 
  Remove,
  LocalShipping,
  Payment,
  CheckCircleOutline,
  NavigateNext
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
  border: '1px solid #f0f0f0',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#333',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(85, 42, 15, 0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(85, 42, 15, 0.05)',
    transition: 'all 0.2s ease',
  },
  '& td': {
    borderColor: '#f0f0f0',
  }
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

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#552a0f',
  border: '1px solid #552a0f',
  borderRadius: '30px',
  padding: '9px 20px',
  fontSize: '0.95rem',
  fontWeight: 500,
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(85, 42, 15, 0.05)',
  },
}));

const MyOrders = () => {
  const { cart, setCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState(() => {
    // Check if cart already has items (from previous page visits)
    if (cart && cart.length > 0) {
      // Initialize all quantities to 1 (or you could store quantities in localStorage)
      return cart.map(() => 1);
    }
    return [];
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [activeStep, setActiveStep] = useState(0);
  const [orderCompleteOpen, setOrderCompleteOpen] = useState(false);
  
  const steps = ['Cart', 'Delivery Details', 'Payment', 'Complete'];

  const calculateItemTotal = (price, index) => {
    return (price * quantities[index]).toFixed(2);
  };

  const totalPrice = () => {
    let total = 0;
    cart.forEach((item, index) => (total += item.price * quantities[index]));
    return total.toFixed(2);
  };
  
  const grandTotal = () => {
    return parseFloat(totalPrice()).toFixed(2);
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
    
    showSnackbar("Item removed from cart", "info");
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // Complete order
      handleConfirmOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConfirmOrder = () => {
    // Show order complete dialog
    setActiveStep(steps.length - 1);
    setOrderCompleteOpen(true);
    
    // Clear cart
    setCart([]);
    setQuantities([]);
  };
  
  const handleCloseOrderComplete = () => {
    setOrderCompleteOpen(false);
  };

  const renderCartStep = () => (
    <>
      {cart.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px dashed #e0e0e0',
        }}>
          <ShoppingCart sx={{ fontSize: 60, color: '#552a0f', opacity: 0.3, mb: 2 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Poppins', sans-serif",
              color: '#666',
              mb: 3
            }}
          >
            Your cart is empty
          </Typography>
          <Button
            component={Link}
            to="/menu"
            variant="contained"
            sx={{
              backgroundColor: '#552a0f',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              textTransform: 'none',
              borderRadius: '30px',
              px: 3,
              '&:hover': {
                backgroundColor: '#3e1e09',
              }
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
                  <TableRow sx={{ backgroundColor: 'rgba(85, 42, 15, 0.05)' }}>
                    <StyledTableCell>Item</StyledTableCell>
                    <StyledTableCell align="center">Price</StyledTableCell>
                    <StyledTableCell align="center">Quantity</StyledTableCell>
                    <StyledTableCell align="right">Total</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item, index) => (
                    <StyledTableRow key={index}>
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        ₹{item.price}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <QuantityButton 
                            size="small" 
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={quantities[index] <= 1}
                          >
                            <Remove fontSize="small" />
                          </QuantityButton>
                          <Typography sx={{ mx: 1, minWidth: '30px', textAlign: 'center' }}>
                            {quantities[index]}
                          </Typography>
                          <QuantityButton 
                            size="small" 
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <Add fontSize="small" />
                          </QuantityButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                        ₹{calculateItemTotal(item.price, index)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          onClick={() => handleRemoveItem(index)}
                          sx={{ 
                            color: '#d32f2f',
                            '&:hover': { 
                              backgroundColor: 'rgba(211, 47, 47, 0.04)',
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <SecondaryButton 
                component={Link} 
                to="/menu"
                startIcon={<ShoppingCart />}
              >
                Continue Shopping
              </SecondaryButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#333',
                    mb: 2
                  }}
                >
                  Order Summary
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1,
                  color: '#666'
                }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2" fontWeight={500}>₹{totalPrice()}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 3
                }}>
                  <Typography variant="subtitle1" fontWeight={600}>Total Amount</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#552a0f">₹{grandTotal()}</Typography>
                </Box>
                
                <OrderButton
                  fullWidth
                  endIcon={<NavigateNext />}
                  onClick={handleNext}
                >
                  Proceed to Checkout
                </OrderButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
  
  const renderDeliveryStep = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              mb: 3
            }}
          >
            Delivery Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#552a0f' }
                  },
                  '& .MuiFormLabel-root.Mui-focused': { color: '#552a0f' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#552a0f' }
                  },
                  '& .MuiFormLabel-root.Mui-focused': { color: '#552a0f' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#552a0f' }
                  },
                  '& .MuiFormLabel-root.Mui-focused': { color: '#552a0f' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Time"
                variant="outlined"
                required
                placeholder="e.g., Today at 1:00 PM"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#552a0f' }
                  },
                  '& .MuiFormLabel-root.Mui-focused': { color: '#552a0f' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions (Optional)"
                variant="outlined"
                multiline
                rows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#552a0f' }
                  },
                  '& .MuiFormLabel-root.Mui-focused': { color: '#552a0f' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <SecondaryButton onClick={handleBack}>
            Back to Cart
          </SecondaryButton>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid #f0f0f0',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: '#333',
                mb: 2
              }}
            >
              Order Summary
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 1,
              color: '#666'
            }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2" fontWeight={500}>₹{totalPrice()}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 3
            }}>
              <Typography variant="subtitle1" fontWeight={600}>Total Amount</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="#552a0f">₹{grandTotal()}</Typography>
            </Box>
            
            <OrderButton
              fullWidth
              endIcon={<NavigateNext />}
              onClick={handleNext}
            >
              Proceed to Payment
            </OrderButton>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderPaymentStep = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              mb: 3
            }}
          >
            Payment Method
          </Typography>
          
          {/* Just a simple form for demonstration */}
          <Box sx={{ 
            p: 2, 
            border: '2px solid #552a0f',
            borderRadius: 2,
            mb: 3
          }}>
            <Typography fontWeight={500}>Cash on Delivery</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Pay when your order arrives
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            mb: 2,
            opacity: 0.6
          }}>
            <Typography fontWeight={500}>Credit/Debit Card</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Coming soon
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            opacity: 0.6
          }}>
            <Typography fontWeight={500}>UPI</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Coming soon
            </Typography>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <SecondaryButton onClick={handleBack}>
            Back to Delivery
          </SecondaryButton>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid #f0f0f0',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: '#333',
                mb: 2
              }}
            >
              Order Summary
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 1,
              color: '#666'
            }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2" fontWeight={500}>₹{totalPrice()}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 3
            }}>
              <Typography variant="subtitle1" fontWeight={600}>Total Amount</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="#552a0f">₹{grandTotal()}</Typography>
            </Box>
            
            <OrderButton
              fullWidth
              endIcon={<CheckCircleOutline />}
              onClick={handleNext}
            >
              Place Order
            </OrderButton>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return renderCartStep();
      case 1:
        return renderDeliveryStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return null; // Order complete is shown in a dialog
      default:
        return renderCartStep();
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#333',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            My Order
          </Typography>
          <Divider sx={{ maxWidth: 100, mx: 'auto', borderColor: '#552a0f', borderWidth: 2, mb: 4 }} />
          
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: 4,
              '& .MuiStepIcon-root.Mui-active': { 
                color: '#552a0f'
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#552a0f'
              },
              display: cart.length === 0 && activeStep === 0 ? 'none' : 'flex'
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderCurrentStep()}
        
        {/* Order Complete Dialog */}
        <Dialog
          open={orderCompleteOpen}
          onClose={handleCloseOrderComplete}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
            }
          }}
        >
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: '#66bb6a', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Thank you for your order. It will be delivered to you shortly.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              component={Link}
              to="/menu"
              variant="contained"
              sx={{
                backgroundColor: '#552a0f',
                color: 'white',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                borderRadius: '30px',
                px: 3,
                '&:hover': {
                  backgroundColor: '#3e1e09',
                }
              }}
            >
              Continue Shopping
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default MyOrders;
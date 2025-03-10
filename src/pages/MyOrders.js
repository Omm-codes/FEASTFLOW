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
  TextField,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { 
  Delete, 
  ShoppingCart, 
  Add, 
  Remove,
  CheckCircleOutline,
  NavigateNext,
  ExpandMore,
  Cancel,
  DeleteOutlined
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";

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
  const [orderData, setOrderData] = useState({
    orderId: '',
    orderDate: '',
    deliveryTime: '',
    name: '',
    phone: '',
    email: '',
    specialInstructions: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryTime: '',
    specialInstructions: ''
  });
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

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
    if (activeStep === 1) {
      // Validate delivery details
      if (!formData.name || !formData.phone || !formData.email) {
        showSnackbar("Please fill in all required fields", "error");
        return;
      }
      // Save form data to order data
      setOrderData({
        ...orderData,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        deliveryTime: formData.deliveryTime,
        specialInstructions: formData.specialInstructions
      });
    }
    
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
    // Generate random order ID
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const newOrder = {
      orderId,
      orderDate,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      deliveryTime: formData.deliveryTime || "As soon as possible",
      specialInstructions: formData.specialInstructions || "",
      items: [...cart.map((item, index) => ({
        ...item,
        quantity: quantities[index],
        total: (item.price * quantities[index]).toFixed(2)
      }))],
      status: "Processing",
      total: grandTotal()
    };
    
    // Save order details for display in dialog
    setOrderData(newOrder);
    
    // Add to order history
    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    
    // Show order complete dialog
    setActiveStep(steps.length - 1);
    setOrderCompleteOpen(true);
    
    // Clear cart
    setCart([]);
    setQuantities([]);
  };
  
  // Update the handleCancelOrder function
  const handleCancelOrder = () => {
    // Update the order status in history
    const updatedHistory = orderHistory.map(order => {
      if (order.orderId === orderData.orderId) {
        return {...order, status: "Cancelled"};
      }
      return order;
    });
    
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    
    showSnackbar("Order has been cancelled", "info");
    setOrderCompleteOpen(false);
  };

  // Add this function with your other handlers
  const handleClearOrderHistory = () => {
    // Show confirmation dialog before clearing
    if (window.confirm("Are you sure you want to clear your order history? This action cannot be undone.")) {
      // Clear order history
      setOrderHistory([]);
      localStorage.removeItem('orderHistory');
      showSnackbar("Order history cleared successfully", "success");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();
  
  const handleCloseOrderComplete = () => {
    setOrderCompleteOpen(false);
    navigate('/menu');
  };

  const handleCancelHistoryOrder = (orderId) => {
    const updatedHistory = orderHistory.map(order => {
      if (order.orderId === orderId) {
        return {...order, status: "Cancelled"};
      }
      return order;
    });
    
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    showSnackbar("Order has been cancelled", "info");
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
                name="name"
                label="Full Name"
                variant="outlined"
                required
                value={formData.name}
                onChange={handleFormChange}
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
                name="phone"
                label="Phone Number"
                variant="outlined"
                required
                value={formData.phone}
                onChange={handleFormChange}
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
                name="email"
                label="Email Address"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleFormChange}
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
                name="deliveryTime"
                label="Delivery Time"
                variant="outlined"
                required
                placeholder="e.g., Today at 1:00 PM"
                value={formData.deliveryTime}
                onChange={handleFormChange}
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
                name="specialInstructions"
                label="Special Instructions (Optional)"
                variant="outlined"
                multiline
                rows={2}
                value={formData.specialInstructions}
                onChange={handleFormChange}
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
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pt: 3, 
            pb: 2,
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <CheckCircleOutline sx={{ color: '#66bb6a', fontSize: 30 }} />
            Order Placed Successfully!
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      #{orderData.orderId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1">
                      {orderData.orderDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Time
                    </Typography>
                    <Typography variant="body1">
                      {orderData.deliveryTime || "As soon as possible"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h6" sx={{ mt: 1, fontSize: '1rem', fontWeight: 600 }}>
                Order Items
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #f0f0f0' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(85, 42, 15, 0.05)' }}>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">₹{item.price}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">₹{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                p: 2, 
                backgroundColor: 'rgba(85, 42, 15, 0.05)', 
                borderRadius: 2 
              }}>
                <Typography variant="subtitle1" fontWeight={700} color="#552a0f">
                  Total Amount: ₹{grandTotal()}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Your order has been placed successfully. You can track your order status or cancel if needed.
                </Typography>
                <Typography variant="body2" sx={{ color: '#d32f2f', fontStyle: 'italic' }}>
                  * Cancellation is available within 5 minutes of placing the order
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
            <Button
              onClick={handleCancelOrder}
              variant="outlined"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: '30px',
              }}
            >
              Cancel Order
            </Button>
            <Button
              onClick={handleCloseOrderComplete}
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

        {/* Order History Section */}
        {orderHistory.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: '#333'
                }}
              >
                Your Order History
              </Typography>
              
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClearOrderHistory}
                startIcon={<DeleteOutlined />}
                sx={{
                  borderRadius: 30,
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.85rem',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                    borderColor: '#b71c1c'
                  }
                }}
              >
                Clear History
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {orderHistory.map((order) => (
                <Grid item xs={12} key={order.orderId}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid #f0f0f0',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Status badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: order.status === "Cancelled" ? '#ffcdd2' : 
                                          order.status === "Delivered" ? '#c8e6c9' : '#fff9c4',
                        color: order.status === "Cancelled" ? '#c62828' : 
                                order.status === "Delivered" ? '#2e7d32' : '#f57f17',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        px: 3,
                        py: 0.5
                      }}
                    >
                      {order.status}
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Order ID
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              #{order.orderId}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Order Date
                            </Typography>
                            <Typography variant="body1">
                              {order.orderDate}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Delivery Time
                            </Typography>
                            <Typography variant="body1">
                              {order.deliveryTime}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Total
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              ₹{order.total}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Accordion sx={{ 
                          '&:before': { display: 'none' },
                          boxShadow: 'none',
                          border: '1px solid #f0f0f0',
                          borderRadius: '8px !important',
                          mb: 2,
                          overflow: 'hidden'
                        }}>
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{ backgroundColor: 'rgba(85, 42, 15, 0.02)' }}
                          >
                            <Typography fontWeight={500}>
                              View Order Details
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: 'rgba(85, 42, 15, 0.02)' }}>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                          component="img"
                                          src={item.image}
                                          alt={item.name}
                                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                                        />
                                        <Typography variant="body2" fontWeight={500}>
                                          {item.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">₹{item.price}</TableCell>
                                      <TableCell align="center">{item.quantity}</TableCell>
                                      <TableCell align="right">₹{item.total}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            
                            {order.specialInstructions && (
                              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Special Instructions:
                                </Typography>
                                <Typography variant="body2">
                                  {order.specialInstructions}
                                </Typography>
                              </Box>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                      
                      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ 
                          p: 2,
                          backgroundColor: 'rgba(85, 42, 15, 0.02)', 
                          borderRadius: 2,
                          border: '1px solid #f0f0f0' 
                        }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Delivery Address
                          </Typography>
                          <Typography variant="body2">
                            <strong>{order.name}</strong><br />
                            Phone: {order.phone}<br />
                            Email: {order.email}
                          </Typography>
                        </Box>
                        
                        {/* Only show cancel button if order is not cancelled or delivered */}
                        {order.status === "Processing" && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancelHistoryOrder(order.orderId)}
                            startIcon={<Cancel />}
                            sx={{
                              borderRadius: 30,
                              textTransform: 'none'
                            }}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default MyOrders;
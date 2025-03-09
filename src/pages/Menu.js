import React, { useContext, useState } from "react";
import { MenuList } from "../data/data";
import Layout from "./../components/Layout/Layout";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  Divider,
  Chip,
  Tab,
  Tabs,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { CartContext } from "../context/cartContext";
import { styled } from "@mui/system";
import { AddShoppingCart } from "@mui/icons-material";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  borderRadius: '24px',
  padding: '6px 16px',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.85rem',
  backgroundColor: '#552a0f',
  color: 'white',
  '&:hover': {
    backgroundColor: '#3e1e09',
  },
}));

// Function to get unique categories
const getCategories = (menuItems) => {
  const categorySet = new Set(menuItems.map(item => item.category));
  return ['All', ...Array.from(categorySet)];
};

const Menu = () => {
  const { cart, setCart } = useContext(CartContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = getCategories(MenuList);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddToCart = (item) => {
    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex >= 0) {
      // Item exists, update quantities array
      const newQuantities = [...quantities];
      newQuantities[existingItemIndex] += 1;
      setQuantities(newQuantities);
      
      // Show notification
      showSnackbar(`Increased ${item.name} quantity`, "success");
    } else {
      // Item doesn't exist, add it to cart and initialize quantity to 1
      setCart([...cart, item]);
      setQuantities([...quantities, 1]);
      
      // Show notification
      showSnackbar(`Added ${item.name} to cart`, "success");
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  const filteredMenu = activeCategory === 'All' 
    ? MenuList 
    : MenuList.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <Box sx={{ 
        backgroundColor: '#f9f7f4', // Light cream background color
        minHeight: '100vh',
        pt: 4,
        pb: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: '#333',
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Our Menu
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: '#666',
                maxWidth: '500px',
                mx: 'auto',
                fontSize: '0.95rem',
                mb: 4
              }}
            >
              Explore our delicious offerings
            </Typography>
          </Box>

          {/* Category Tabs */}
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%', 
              mb: 5, 
              display: 'flex', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '12px',
              py: 1.5
            }}
          >
            <Tabs
              value={activeCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#555',
                  minWidth: 'auto',
                  mx: 1
                },
                '& .Mui-selected': {
                  color: '#552a0f',
                  fontWeight: 600
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#552a0f'
                }
              }}
            >
              {categories.map((category) => (
                <Tab key={category} label={category} value={category} />
              ))}
            </Tabs>
          </Paper>

          <Grid container spacing={3}>
            {filteredMenu.map((menu) => (
              <Grid item xs={12} sm={6} md={4} key={menu.name}>
                <StyledCard>
                  <CardActionArea>
                    <CardMedia
                      sx={{ 
                        height: 180,
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      component="img"
                      image={menu.image}
                      alt={menu.name}
                      loading="lazy"
                    />
                  </CardActionArea>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 600,
                          color: '#333',
                          fontSize: '1.1rem'
                        }}
                      >
                        {menu.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: '#552a0f'
                        }}
                      >
                        ₹{menu.price}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        color: '#666',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        height: '60px',
                        overflow: 'hidden'
                      }}
                    >
                      {menu.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={menu.category} 
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          backgroundColor: 'rgba(85, 42, 15, 0.08)',
                          color: '#552a0f',
                          fontWeight: 500,
                          borderRadius: '16px'
                        }} 
                      />
                      <MenuButton
                        startIcon={<AddShoppingCart fontSize="small" />}
                        onClick={() => handleAddToCart(menu)}
                      >
                        Add
                      </MenuButton>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
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
    </Layout>
  );
};

export default Menu;
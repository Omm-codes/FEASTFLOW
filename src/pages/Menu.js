import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cartContext';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

const Menu = () => {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log('Menu component mounted'); // Debug log
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items...'); 
        const response = await fetch('http://localhost:5001/api/menu');
        console.log('Response:', response); // Full response log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched menu items:', data);
        if (Array.isArray(data)) {
          setMenuItems(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setSnackbar({
          open: true,
          message: `Error loading menu items: ${error.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  console.log('Rendering Menu component', { loading, menuItems }); // Debug render

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (menuItems.length === 0 && !loading) {
    return (
      <Layout>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6">No menu items available</Typography>
        </Container>
      </Layout>
    );
  }

  const handleAddToCart = (item) => {
    addToCart(item);
    setSnackbar({
      open: true,
      message: 'Item added to cart!',
      severity: 'success'
    });
  };

  return (
    <Layout>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    item.image_url 
                      ? (item.image_url.startsWith('http') 
                          ? item.image_url 
                          : item.image_url.startsWith('/') 
                              ? `http://localhost:5001${item.image_url}` 
                              : `/${item.image_url}`)
                      : '/placeholder-food.jpg'
                  }
                  alt={item.name}
                  onError={(e) => {
                    console.log(`Failed to load image: ${item.image_url}`);
                    e.target.src = '/placeholder-food.jpg';
                    e.target.onerror = null;
                  }}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹{item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCart />}
                    onClick={() => handleAddToCart(item)}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default Menu;
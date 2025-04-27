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
    Box,
    Chip,
    Divider
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const primaryColor = '#6a4e38'; // A slightly lighter, warmer brown
const secondaryColor = '#a1887f'; // A muted, dusty rose
const accentColor = '#f5f0e1'; // Off-white, creamy background

const Menu = () => {
    const { addToCart } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fallback image for when menu item images fail to load
    const fallbackImage = '/placeholder-food.jpg';

    useEffect(() => {
        console.log('Menu component mounted'); // Debug log
        const fetchMenuItems = async () => {
            try {
                console.log('Fetching menu items...'); 
                const response = await fetch('http://localhost:5001/api/menu');
                console.log('Response:', response); // Response log for debugging
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched menu items:', data);
                if (Array.isArray(data)) {
                    setMenuItems(data);
                } else {
                    console.error('Data is not an array:', data);
                    setSnackbar({
                        open: true,
                        message: 'Error: Received invalid menu data',
                        severity: 'error'
                    });
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
            <Container sx={{ mt: 3, mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        color: primaryColor, // Use primary color
                        mb: 3,
                        textAlign: 'center',
                        letterSpacing: 1,
                    }}
                >
                    Our Menu
                </Typography>
                <Grid container spacing={2}>
                    {menuItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    background: accentColor, // Use accent color for background
                                    boxShadow: '0 4px 16px rgba(85,42,15,0.07)',
                                    transition: 'transform 0.25s, box-shadow 0.25s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 8px 32px rgba(85,42,15,0.18)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={
                                            item.image_url
                                                ? item.image_url.startsWith('http') 
                                                    ? item.image_url // External URL
                                                    : `http://localhost:5001${item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`}` // Local path
                                                : fallbackImage // Fallback image
                                        }
                                        alt={item.name}
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${item.image_url}`);
                                            e.target.src = fallbackImage;
                                            e.target.onerror = null;
                                        }}
                                        sx={{
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s',
                                            '&:hover': { transform: 'scale(1.04)' },
                                        }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    {item.category && (
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderColor: primaryColor, // Use primary color
                                                color: primaryColor, // Use primary color
                                                fontWeight: 500,
                                                mb: 1,
                                                fontSize: 13,
                                                background: 'rgba(85,42,15,0.04)',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            fontFamily: "'Playfair Display', serif",
                                            mb: 0.5,
                                            color: primaryColor, // Use primary color
                                            fontSize: 18,
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 1.2,
                                            fontFamily: 'Roboto, sans-serif',
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {item.description ||
                                            'A delicious dish crafted with premium ingredients, bringing authentic flavors to your table.'}
                                    </Typography>
                                    <Divider sx={{ mb: 1 }} />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: primaryColor, // Use primary color
                                            fontWeight: 600,
                                            fontSize: 16,
                                        }}
                                    >
                                        ₹{item.price}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ px: 2, pb: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddShoppingCart />}
                                        onClick={() => handleAddToCart(item)}
                                        fullWidth
                                        sx={{
                                            bgcolor: primaryColor, // Use primary color
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 1,
                                            borderRadius: '22px',
                                            fontSize: 15,
                                            letterSpacing: 0.5,
                                            boxShadow: '0 2px 8px rgba(85,42,15,0.08)',
                                            '&:hover': { bgcolor: '#3e1e09' },
                                        }}
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
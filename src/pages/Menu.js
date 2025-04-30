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
    Divider,
    Tab,
    Tabs
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Update colors to match the site theme
const primaryColor = '#023047'; // Blue from header
const secondaryColor = '#219ebc'; // Lighter blue accent
const accentColor = '#f8f9fa'; // Light background
const highlightColor = '#ffb703'; // Yellow accent from header

const groupItemsByCategory = (items) => {
    const grouped = items.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
    return grouped;
};

const Menu = () => {
    const { addToCart } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

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
                    // Extract unique categories
                    const uniqueCategories = ['all', ...new Set(data.map(item => item.category).filter(Boolean))];
                    setCategories(uniqueCategories);
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
                    <CircularProgress sx={{ color: highlightColor }} />
                </Box>
            </Layout>
        );
    }

    if (menuItems.length === 0 && !loading) {
        return (
            <Layout>
                <Container sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        No menu items available
                    </Typography>
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

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };

    const filteredItems = selectedCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <Layout>
            <Container sx={{ mt: 3, mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        color: primaryColor, // Updated to blue
                        mb: 3,
                        textAlign: 'center',
                        letterSpacing: 1,
                    }}
                >
                    Our Menu
                </Typography>

                {/* Add Category Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: highlightColor, // Yellow indicator
                            },
                            '& .MuiTab-root': {
                                color: secondaryColor, // Light blue for inactive tabs
                                '&.Mui-selected': {
                                    color: primaryColor, // Dark blue for active tab
                                },
                            },
                        }}
                    >
                        {categories.map((category) => (
                            <Tab 
                                key={category}
                                label={category.charAt(0).toUpperCase() + category.slice(1)}
                                value={category}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: 600,
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                <Grid container spacing={2}>
                    {filteredItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    background: accentColor, // Light background
                                    boxShadow: '0 4px 16px rgba(2,48,71,0.07)', // Updated shadow color
                                    transition: 'transform 0.25s, box-shadow 0.25s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 8px 32px rgba(2,48,71,0.18)', // Updated shadow color
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
                                                borderColor: primaryColor, // Updated to blue
                                                color: primaryColor, // Updated to blue
                                                fontWeight: 500,
                                                mb: 1,
                                                fontSize: 13,
                                                background: 'rgba(2,48,71,0.04)', // Updated background
                                                fontFamily: "'Poppins', sans-serif",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            fontFamily: "'Poppins', sans-serif", // Updated font
                                            mb: 0.5,
                                            color: primaryColor, // Updated to blue
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
                                            fontFamily: "'Poppins', sans-serif", // Updated font
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
                                            color: primaryColor, // Updated to blue
                                            fontWeight: 600,
                                            fontSize: 16,
                                            fontFamily: "'Poppins', sans-serif",
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
                                            bgcolor: highlightColor, // Updated to yellow
                                            color: '#000', // Black text on yellow background
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 1,
                                            borderRadius: '20px', // Making consistent with other buttons
                                            fontSize: 15,
                                            letterSpacing: 0.5,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            '&:hover': { 
                                                bgcolor: '#ffaa00' // Darker yellow on hover
                                            },
                                            fontFamily: "'Poppins', sans-serif",
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
                    <Alert 
                        severity={snackbar.severity} 
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            '& .MuiAlert-icon': {
                                color: snackbar.severity === 'success' ? highlightColor : undefined
                            }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
};

export default Menu;
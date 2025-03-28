import React, { useContext, useState, useEffect } from "react";
import { MenuList } from "../data/data";
import Layout from "./../components/Layout/Layout";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Add Link here
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
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Skeleton,
  Rating,
  Tooltip,
  Stack
} from "@mui/material";
import { CartContext } from "../context/cartContext";
import { styled, alpha } from "@mui/system";
import { 
  AddShoppingCart, 
  Favorite, 
  FavoriteBorder,
  LocalOffer,
  RestaurantMenu,
  KeyboardArrowUp,
  FilterList // Add this import
} from "@mui/icons-material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
  position: 'relative',
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

const PopularBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: '#ff6b6b',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontFamily: "'Poppins', sans-serif",
}));

// Add this new styled component for category buttons
const CategoryButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '30px',
  padding: '8px 16px',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.85rem',
  backgroundColor: active ? '#552a0f' : 'white',
  color: active ? 'white' : '#552a0f',
  border: active ? 'none' : '1px solid #552a0f',
  margin: '0 8px 8px 0',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: active ? '#3e1e09' : 'rgba(85, 42, 15, 0.08)',
  },
}));

const Menu = () => {
  const { cart, setCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add this
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  // Get category from URL if present
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  
  // Add these new states for category filtering
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [filteredMenu, setFilteredMenu] = useState(MenuList);
  
  // Extract unique categories from MenuList
  const categories = ["All", ...Array.from(new Set(MenuList.map(item => item.category)))];

  // Filter menu items when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredMenu(MenuList);
    } else {
      setFilteredMenu(MenuList.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  // Set initial category from URL parameter when page loads
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddToCart = (item) => {
    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex >= 0) {
      // Item exists, update cart with incremented quantity
      const newCart = [...cart];
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: (newCart[existingItemIndex].quantity || 1) + 1
      };
      setCart(newCart);
      
      // Show notification
      showSnackbar(`Increased ${item.name} quantity`, "success");
    } else {
      // Item doesn't exist, add it to cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
      
      // Show notification
      showSnackbar(`Added ${item.name} to cart`, "success");
    }
    
    // Show the "View Order" button
    setShowViewOrder(true);
  };

  const toggleFavorite = (itemName) => {
    if (favorites.includes(itemName)) {
      setFavorites(favorites.filter(name => name !== itemName));
      showSnackbar(`Removed ${itemName} from favorites`, "info");
    } else {
      setFavorites([...favorites, itemName]);
      showSnackbar(`Added ${itemName} to favorites`, "success");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add a function to update URL when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // Update URL without full page reload
    if (category === "All") {
      navigate("/menu", { replace: true });
    } else {
      navigate(`/menu?category=${category}`, { replace: true });
    }
  };

  // Add this state to track if we should show the "View Order" button
  const [showViewOrder, setShowViewOrder] = useState(false);

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // Show view order button if cart has items
    if (cart.length > 0) {
      setShowViewOrder(true);
    }
  }, []);

  return (
    <Layout>
      <Box sx={{ 
        backgroundImage: 'linear-gradient(to bottom, #f9f7f4, #ffffff)',
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
                fontWeight: 700,
                color: '#333',
                mb: 1.5,
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
                maxWidth: '600px',
                mx: 'auto',
                fontSize: '0.95rem',
                mb: 3
              }}
            >
              Explore our delicious offerings crafted with fresh ingredients and culinary passion
            </Typography>
            
            {/* Category Filter Bar */}
            {!loading && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 4, 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(249, 247, 244, 0.8)',
                  border: '1px solid #eaeaea',
                  display: 'inline-flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  maxWidth: '100%',
                  position: 'relative'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mr: 1.5,
                    mb: 1
                  }}>
                    <FilterList sx={{ fontSize: '1rem', mr: 0.5, color: '#552a0f' }}/>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: "'Poppins', sans-serif", 
                        color: '#552a0f',
                        fontWeight: 600
                      }}
                    >
                      Filter by:
                    </Typography>
                  </Box>
                  
                  {categories.map((category) => (
                    <CategoryButton
                      key={category}
                      active={selectedCategory === category}
                      onClick={() => handleCategoryChange(category)} // Changed this line
                      startIcon={category === "All" ? <RestaurantMenu fontSize="small" /> : null}
                    >
                      {category}
                    </CategoryButton>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>

          {loading ? (
            // Loading skeletons
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', borderRadius: '12px' }}>
                    <Skeleton variant="rectangular" height={180} />
                    <CardContent>
                      <Skeleton variant="text" width="70%" height={30} />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="100%" height={60} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Skeleton variant="rectangular" width={60} height={24} />
                        <Skeleton variant="rectangular" width={80} height={36} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {filteredMenu.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center',
                  py: 6
                }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    No items found in this category
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={() => handleCategoryChange("All")} // Changed this line
                    sx={{
                      color: '#552a0f',
                      borderColor: '#552a0f',
                      '&:hover': {
                        borderColor: '#3e1e09',
                        backgroundColor: 'rgba(85, 42, 15, 0.04)'
                      }
                    }}
                  >
                    View All Menu Items
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredMenu.map((menu) => (
                    <Grid item xs={12} sm={6} md={4} key={menu.name}>
                      <StyledCard>
                        {menu.popular && <PopularBadge>Popular</PopularBadge>}
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
                        
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                                color: '#552a0f',
                                ml: 1
                              }}
                            >
                              ₹{menu.price}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Rating 
                              value={menu.rating || 4.5} 
                              precision={0.5} 
                              size="small" 
                              readOnly 
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#ffc107'
                                }
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ml: 0.5, 
                                color: '#666',
                                fontSize: '0.75rem'
                              }}
                            >
                              ({menu.ratingCount || Math.floor(Math.random() * 50) + 10})
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
                              flexGrow: 1
                            }}
                          >
                            {menu.description}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 'auto'
                          }}>
                            <Stack direction="row" spacing={1}>
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
                              {menu.spicy && (
                                <Tooltip title="Spicy">
                                  <Chip 
                                    icon={<LocalOffer sx={{ fontSize: '0.9rem', color: '#f44336' }} />}
                                    label="Spicy" 
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.7rem', 
                                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                      color: '#f44336',
                                      fontWeight: 500,
                                      borderRadius: '16px'
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title={favorites.includes(menu.name) ? "Remove from favorites" : "Add to favorites"}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => toggleFavorite(menu.name)}
                                  sx={{ 
                                    color: favorites.includes(menu.name) ? '#f44336' : '#bdbdbd',
                                    '&:hover': { color: favorites.includes(menu.name) ? '#e53935' : '#f44336' }
                                  }}
                                >
                                  {favorites.includes(menu.name) ? <Favorite /> : <FavoriteBorder />}
                                </IconButton>
                              </Tooltip>
                              <MenuButton
                                startIcon={<AddShoppingCart fontSize="small" />}
                                onClick={() => handleAddToCart(menu)}
                              >
                                Add
                              </MenuButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {/* Show result count when filtering */}
              {selectedCategory !== "All" && filteredMenu.length > 0 && (
                <Box sx={{ 
                  mt: 4, 
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1 
                }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Showing {filteredMenu.length} {filteredMenu.length === 1 ? 'item' : 'items'} in {selectedCategory}
                  </Typography>
                  <Button 
                    size="small"
                    onClick={() => handleCategoryChange("All")} // Changed this line
                    sx={{
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      color: '#552a0f',
                      '&:hover': {
                        backgroundColor: 'rgba(85, 42, 15, 0.04)'
                      }
                    }}
                  >
                    Clear Filter
                  </Button>
                </Box>
              )}
            </>
          )}
          
          {/* Scroll to top button */}
          {showScrollTop && (
            <IconButton
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                backgroundColor: 'rgba(85, 42, 15, 0.8)',
                color: 'white',
                zIndex: 99,
                '&:hover': {
                  backgroundColor: 'rgba(85, 42, 15, 0.95)',
                },
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
              onClick={scrollToTop}
              aria-label="scroll to top"
            >
              <KeyboardArrowUp />
            </IconButton>
          )}
          
          {/* Updated View Order button - bottom left, links to orders page */}
          {showViewOrder && (
            <Box sx={{
              position: 'fixed',
              bottom: { xs: 20, md: 30 },
              left: { xs: 20, md: 40 }, // Changed from center to left
              transform: 'none', // Removed transform that was centering it
              zIndex: 99,
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)', // Only Y translation now
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}>
              <Button
                component={Link}
                to="/MyOrders" // Changed from "/cart" to "/orders"
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  backgroundColor: '#552a0f',
                  color: 'white',
                  py: 1.5,
                  px: 3,
                  borderRadius: '30px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#3e1e09',
                  },
                  fontFamily: "'Poppins', sans-serif",
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                View My Order ({cart.reduce((total, item) => total + (item.quantity || 1), 0)} items)
              </Button>
            </Box>
          )}
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
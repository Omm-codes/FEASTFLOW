import React, { useContext, useState, useEffect } from "react";
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
  IconButton,
  InputBase,
  Badge,
  Skeleton,
  Rating,
  Tooltip,
  Stack,
  FormGroup,
  FormControlLabel,
  Switch
} from "@mui/material";
import { CartContext } from "../context/cartContext";
import { styled, alpha } from "@mui/system";
import { 
  AddShoppingCart, 
  Search as SearchIcon, 
  Favorite, 
  FavoriteBorder,
  LocalOffer,
  RestaurantMenu,
  FilterList,
  Sort,
  KeyboardArrowUp
} from "@mui/icons-material";

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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: alpha('#ffffff', 0.9),
  '&:hover': {
    backgroundColor: alpha('#ffffff', 1),
  },
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  border: '1px solid #f0f0f0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#552a0f',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '10px 16px 10px 48px',
    width: '100%',
    fontFamily: "'Poppins', sans-serif",
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

const VegBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontFamily: "'Poppins', sans-serif",
}));

const NonVegBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: '#ff7043',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontFamily: "'Poppins', sans-serif",
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
  const [quantities, setQuantities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
  };

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
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

  // Filter menu based on category, search term and veg preference
  const filteredMenu = MenuList
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <Box sx={{ 
        backgroundImage: 'linear-gradient(to bottom, #f9f7f4, #ffffff)',
        minHeight: '100vh',
        pt: 4,
        pb: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            
            {/* Search Box */}
            <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search for dishes, categories or ingredients..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Search>
            </Box>
          </Box>

          {/* Controls Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 1, 
                  fontFamily: "'Poppins', sans-serif",
                  color: '#666'
                }}
              >
                {filteredMenu.length} items found
              </Typography>
              <Chip 
                label={activeCategory} 
                onDelete={activeCategory !== 'All' ? () => setActiveCategory('All') : undefined}
                sx={{ 
                  backgroundColor: 'rgba(85, 42, 15, 0.08)',
                  color: '#552a0f',
                  display: activeCategory !== 'All' ? 'inline-flex' : 'none'
                }} 
              />
            </Box>
          </Box>

          {/* Category Tabs */}
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%', 
              mb: 4, 
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
                  py: 5,
                  backgroundColor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px dashed #e0e0e0',
                }}>
                  <RestaurantMenu sx={{ fontSize: 60, color: '#552a0f', opacity: 0.3, mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: "'Poppins', sans-serif",
                      color: '#666',
                      mb: 3
                    }}
                  >
                    No dishes found matching your criteria
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchTerm('');
                    }}
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
                    Clear Filters
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
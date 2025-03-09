import React, { useMemo, useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";
import Banner from "../images/mm.jpg";
import "../styles/HomeStyles.css";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography, Grid, Paper, Container, Button, Chip, Divider } from "@mui/material";
import { MenuList } from "../data/data";
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Function to get unique random items
const getRandomSpecials = (menu, count) => {
  const shuffled = [...menu].sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, Math.min(count, menu.length)); // Get 'count' unique items
};

const Home = () => {
  // Memoize today's specials to prevent unnecessary recalculations
  const todaysSpecials = useMemo(() => getRandomSpecials(MenuList, 3), []);
  
  // Updated offers for canteen-style promotions
  const offers = [
    "🍱 Today's Special: Combo meal at ₹149 only!",
    "☕ Coffee & Snack Combo: Any coffee with sandwich for ₹99",
    "🥗 Student Special: Show ID for 15% off on all meals",
    "🍲 Bulk Order: 10% off when you order 5+ meals"
  ];
  
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex(prevIndex => (prevIndex + 1) % offers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [offers.length]);

  // Featured quick categories (smaller version for hero section)
  const quickCategories = [
    { name: "Breakfast", icon: "🍳" },
    { name: "Fastfood", icon: "🍔" },
    { name: "Snacks", icon: "🍿" },
    { name: "Desserts", icon: "🍨" },
    { name: "Lunch", icon: "🍛" }
  ];

  return (
    <Layout>
      {/* Updated scroll banner with golden theme */}
      <div className="offers-scroll-container" style={{
        backgroundColor: "#d4af37", // Changed to gold from green
        color: "white",
        padding: "10px 0",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        borderBottom: "2px solid #f5e7b3" // Light gold border
      }}>
        <div className="offers-scroll-content" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 15px"
        }}>
          <Box 
            component="span" 
            sx={{ 
              mr: 2, 
              backgroundColor: "#fff8e1", // Light gold background
              color: "#b8860b", // Golden text
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              fontWeight: "bold",
              borderRadius: "4px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            TODAY
          </Box>
          <Typography 
            component="p" 
            sx={{ 
              fontSize: "0.95rem", 
              fontWeight: "500",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.3px"
            }}
          >
            {offers[currentOfferIndex]}
          </Typography>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="home" style={{ 
        backgroundImage: `url(${Banner})`, 
        height: '65vh', 
        position: 'relative',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1
        }}></div>
        <div className="headerContainer" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Effortless Ordering</h1>
          <h1>Quick Service</h1>
          <h1>Delicious Bites!</h1>
          <p>Your Food Is Waiting For You</p>
          <Link to="/menu">
            <button aria-label="Order Now">ORDER NOW</button>
          </Link>
        </div>
      </div>

      {/* Enhanced Quick Categories with golden theme */}
      <Container maxWidth="lg" sx={{ mt: -5, mb: 5, position: 'relative', zIndex: 3 }}>
        <Paper elevation={3} sx={{ 
          borderRadius: '16px', 
          py: 3,
          px: 4,
          background: 'linear-gradient(to right, #fff8e1, #fffde7)', // Light gold gradient
          border: '1px solid #f5e7b3',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  color: '#b8860b', // Dark gold
                  position: 'relative',
                  "&:after": {
                    content: '""',
                    position: 'absolute',
                    width: '40%',
                    height: '3px',
                    backgroundColor: '#d4af37', // Medium gold
                    bottom: '-8px',
                    left: '0'
                  }
                }}
              >
                Browse Categories
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                flexWrap: 'wrap', 
                mt: { xs: 2, sm: 0 },
                ml: { xs: 0, md: 2 }
              }}>
                {quickCategories.map((cat) => (
                  <Chip 
                    key={cat.name}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Box>}
                    component={Link}
                    to="/menu"
                    clickable
                    sx={{ 
                      borderRadius: '50px', // More rounded
                      padding: '20px 10px',
                      backgroundColor: 'white',
                      border: '1px solid #c8e6c9', // Light green border
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#d4af37', // Gold background on hover
                        color: 'white', // White text on hover
                        boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)', // Golden shadow
                        transform: 'translateY(-3px)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Button 
              component={Link}
              to="/menu"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                textTransform: 'none',
                color: '#b8860b', // Gold text
                border: '2px solid #b8860b', // Gold border
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '8px 20px',
                '&:hover': { 
                  backgroundColor: '#d4af37', // Gold background on hover
                  color: 'white', // White text on hover
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' // Gold shadow
                }
              }}
            >
              Full Menu
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Minimalist Today's Special Section */}
      <Box sx={{ 
        py: 5, 
        textAlign: "center", 
        bgcolor: "#f5f7fa",  /* Changed background color */
        borderTop: '1px solidrgb(136, 139, 146)',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: "600", 
              mb: 4,
              fontFamily: "'Playfair Display', serif",
              position: 'relative',
              display: 'inline-block',
              color: '#333'
            }}
          >
            Today's Specials
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {todaysSpecials.map((item) => (
              <Grid item xs={12} sm={4} key={item.name}>
                <Card sx={{ 
                  maxWidth: 300, 
                  mx: "auto", 
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardActionArea component={Link} to="/menu">
                    <CardMedia
                      component="img"
                      height="150"
                      image={item.image}
                      alt={item.name}
                      loading="lazy"
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: '#333',
                            textAlign: 'left'
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'goldenrod',
                            fontWeight: 600,
                          }}
                        >
                          ₹{item.price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Button
            component={Link}
            to="/menu"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 4,
              color: '#555',
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.9rem',
              '&:hover': { 
                backgroundColor: 'transparent',
                color: '#000',
                textDecoration: 'underline'
              }
            }}
          >
            View full menu
          </Button>
        </Container>
      </Box>

      {/* Enhanced Testimonials Section */}
      <Box sx={{ 
        py: 8, 
        textAlign: "center", 
        background: "linear-gradient(to bottom,rgb(201, 207, 175),rgb(215, 221, 182))",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative quotes in background */}
        <Box sx={{ 
          position: 'absolute', 
          top: 40, 
          left: 40, 
          fontSize: '120px', 
          opacity: 0.05,
          fontFamily: 'serif',
          color: '#000'
        }}>
          "
        </Box>
        <Box sx={{ 
          position: 'absolute', 
          bottom: 40, 
          right: 40, 
          fontSize: '120px', 
          opacity: 0.05,
          fontFamily: 'serif',
          color: '#000'
        }}>
          "
        </Box>
        
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              mb: 2,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.3rem" },
              position: 'relative',
              color: '#553C10'
            }}
          >
            What Our Customers Say
          </Typography>
          
          <Divider sx={{ 
            width: '80px', 
            mx: 'auto', 
            borderColor: 'goldenrod', 
            borderWidth: 2, 
            mb: 5
          }} />
          
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                name: "Om Chavan",
                comment: "The food was amazing and arrived quickly! I'll definitely order again.",
                rating: 5
              },
              {
                name: "Vedika Bane",
                comment: "Best of breakfast! The online ordering was super easy to use.",
                rating: 5
              },
              {
                name: "Swapnil dhivare",
                comment: "Great value for money and excellent customer service!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ 
                  p: 3, 
                  borderRadius: '10px', 
                  background: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '5px',
                    height: '100%',
                    backgroundColor: 'goldenrod'
                  },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ display: 'flex', mb: 2, mt: 0.5 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} fontSize="small" sx={{ color: 'goldenrod', mr: 0.5 }} />
                    ))}
                  </Box>
                  <Typography 
                    sx={{ 
                      my: 2, 
                      fontStyle: "italic", 
                      color: '#555', 
                      textAlign: 'left',
                      lineHeight: 1.6,
                      flex: 1
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Divider sx={{ width: '30%', my: 1.5 }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: "bold", 
                      textAlign: 'left',
                      color: '#333'
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
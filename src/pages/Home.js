import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import Banner from "../images/mm.jpg";
import "../styles/HomeStyles.css";
import { 
    Box, 
    Card, 
    CardActionArea, 
    CardContent, 
    CardMedia, 
    Typography, 
    Grid, 
    Paper, 
    Container, 
    Button, 
    Chip, 
    Divider 
} from "@mui/material";
import { MenuList } from "../data/data";
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Function to get unique random items from an array
const getRandomSpecials = (menu, count) => {
  const shuffled = [...menu].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, menu.length));
};

const offers = [
  "🍱 Today's Special: Combo meal at ₹149 only!",
  "☕ Coffee & Snack Combo: Any coffee with sandwich for ₹99",
  "🥗 Student Special: Show ID for 15% off on all meals",
  "🍲 Bulk Order: 10% off when you order 5+ meals"
];

const quickCategories = [
  { name: "Breakfast", icon: "🍳" },
  { name: "Fastfood", icon: "🍔" },
  { name: "Snacks", icon: "🍿" },
  { name: "Desserts", icon: "🍨" },
  { name: "Lunch", icon: "🍛" }
];

// Style objects
const scrollContainerStyle = {
  backgroundColor: "#552a0f",
  color: "white",
  padding: "10px 0",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  borderBottom: "2px solid #ffd54f"
};

const scrollContentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 15px"
};

const heroStyle = {
  backgroundImage: `url(${Banner})`,
  height: "65vh",
  position: "relative",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundAttachment: "fixed" // This line enables the parallax effect
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 1
};

const headerContainerStyle = {
  position: "relative",
  zIndex: 2
};

const Home = () => {
  // Use memoized values to prevent unnecessary recalculations
  const todaysSpecials = useMemo(() => getRandomSpecials(MenuList, 6), []);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Offers Scroll Bar */}
      <div className="offers-scroll-container" style={scrollContainerStyle}>
        <div className="offers-scroll-content" style={scrollContentStyle}>
          <Box 
            component="span" 
            sx={{ 
              mr: 2, 
              backgroundColor: "#ffd54f",
              color: "#552a0f",
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
      <div className="home" style={heroStyle}>
        <div className="overlay" style={overlayStyle}></div>
        <div className="headerContainer" style={headerContainerStyle}>
          <h1>Effortless Ordering</h1>
          <h1>Quick Service</h1>
          <h1>Delicious Bites!</h1>
          <p>Your Food Is Waiting For You</p>
          <Link to="/menu">
            <button 
              aria-label="Order Now" 
              style={{
                backgroundColor: "#552a0f",
                color: "white",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(85, 42, 15, 0.3)",
                transition: "all 0.3s ease",
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#3e1e09"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#552a0f"}
            >
              ORDER NOW
            </button>
          </Link>
        </div>
      </div>
      
      {/* Quick Categories Section */}
      <Container maxWidth="lg" sx={{ mt: -5, mb: 5, position: 'relative', zIndex: 3 }}>
        <Paper elevation={3} sx={{ 
          borderRadius: '16px', 
          py: 3,
          px: 4,
          background: '#f9f7f4',
          border: '1px solid #eaeaea',
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
                  fontFamily: "'Playfair Display', serif",
                  color: '#552a0f',
                  position: 'relative',
                  "&:after": {
                    content: '""',
                    position: 'absolute',
                    width: '40%',
                    height: '3px',
                    backgroundColor: '#ffd54f',
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
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Box>}
                    component={Link}
                    to={`/menu?category=${cat.name}`}
                    clickable
                    sx={{ 
                      borderRadius: '50px', 
                      padding: '20px 10px',
                      backgroundColor: 'white',
                      border: '1px solid #eaeaea', 
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#552a0f',
                        color: 'white', 
                        boxShadow: '0 4px 12px rgba(85, 42, 15, 0.2)', 
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
                color: '#552a0f',
                border: '2px solid #552a0f',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '8px 20px',
                '&:hover': { 
                  backgroundColor: '#552a0f',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(85, 42, 15, 0.2)'
                }
              }}
            >
              Full Menu
            </Button>
          </Box>
        </Paper>
      </Container>
      
      {/* Today's Specials Section */}
      <Box sx={{
                py: 6,
                textAlign: "center",
                bgcolor: "#f9f7f4",
                borderTop: '1px solid #eaeaea',
                position: 'relative'
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "700",
                            mb: 4,
                            fontFamily: "'Playfair Display', serif",
                            position: 'relative',
                            display: 'inline-block',
                            color: '#552a0f',
                            "&:after": {
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                borderBottom: "3px solid #ffd54f"
                            }
                        }}
                    >
                        Today's Specials
                    </Typography>
                    {/* Carousel Implementation (Requires react-slick) */}
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={1}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                    infinite: true,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]}
                    >
                        {todaysSpecials.map((item) => (
                            <Card
                                key={item.name}
                                sx={{
                                    mx: 2,
                                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    height: '100%',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <CardActionArea
                                    component={Link}
                                    to={`/menu?category=${item.category}`}
                                    sx={{ height: '100%' }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="240" // Increased height for better visuals
                                        image={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: '#ffd54f',
                                        color: '#552a0f',
                                        padding: '6px 12px',
                                        fontWeight: 'bold',
                                        borderRadius: '0 0 0 12px',
                                        fontSize: '0.85rem',
                                        fontFamily: "'Poppins', sans-serif"
                                    }}>
                                        ₹{item.price}
                                    </Box>
                                    {/* Dynamic Badge (Example - needs actual data) */}
                                    {item.isBestSeller && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            backgroundColor: '#552a0f',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            fontFamily: "'Poppins', sans-serif",
                                            textTransform: 'uppercase'
                                        }}>
                                            Best Seller
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '1.2rem', // Increased font size
                                                color: '#333',
                                                fontFamily: "'Playfair Display', serif",
                                                mb: 1
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            {item.description} {/* Add description here */}
                                        </Typography>
                                        <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'center' }}>
                                            {[...Array(Math.floor(Math.random() > 0.7 ? 5 : 4))].map((_, i) => (
                                                <StarIcon key={i} fontSize="small" sx={{ color: '#ffd54f', mr: 0.5 }} />
                                            ))}
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2,
                                            borderTop: '1px dashed #e0e0e0',
                                            pt: 2
                                        }}>
                                            <Button
                                                startIcon={<ShoppingBasketIcon />}
                                                component={Link}
                                                to="/menu"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#552a0f',
                                                    fontSize: '0.9rem',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(85, 42, 15, 0.1)'
                                                    }
                                                }}
                                            >
                                                Order Now
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Slider>
                    <Button
                        component={Link}
                        to="/menu"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            mt: 5,
                            bgcolor: "#552a0f",
                            color: "white",
                            borderRadius: "30px",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1rem",
                            py: 1.5,
                            px: 4,
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: "0 4px 15px rgba(85, 42, 15, 0.3)",
                            '&:hover': {
                                bgcolor: '#3e1e09',
                                boxShadow: '0 6px 20px rgba(85, 42, 15, 0.4)',
                            }
                        }}
                    >
                        Explore Full Menu
                    </Button>
                </Container>
            </Box>
                  
      {/* Testimonials Section */}
      <Box 
        sx={{ 
          py: 8, 
          textAlign: "center", 
          background: "linear-gradient(to bottom,rgb(201, 207, 175),rgb(215, 221, 182))",
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2, sm: 4 } // Add padding for smaller screens
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 40, 
            left: 40, 
            fontSize: { xs: '60px', md: '120px' }, // Adjust font size for smaller screens
            opacity: 0.05,
            fontFamily: 'serif',
            color: '#000'
          }}
        >
          "
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 40, 
            right: 40, 
            fontSize: { xs: '60px', md: '120px' }, // Adjust font size for smaller screens
            opacity: 0.05,
            fontFamily: 'serif',
            color: '#000'
          }}
        >
          "
        </Box>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              mb: 2,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.5rem", md: "2.3rem" }, // Adjust font size for smaller screens
              position: 'relative',
              color: '#553C10'
            }}
          >
            What Our Customers Say
          </Typography>
          <Divider 
            sx={{ 
              width: '80px', 
              mx: 'auto', 
              borderColor: 'goldenrod', 
              borderWidth: 2, 
              mb: 5 
            }} 
          />
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
                name: "Swapnil Dhivare",
                comment: "Great value for money and excellent customer service!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center' 
                }} // Center items on smaller screens
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
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
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      mb: 2, 
                      mt: 0.5, 
                      justifyContent: { xs: 'center', md: 'flex-start' } // Center stars on smaller screens
                    }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        fontSize="small" 
                        sx={{ color: 'goldenrod', mr: 0.5 }} 
                      />
                    ))}
                  </Box>
                  <Typography 
                    sx={{ 
                      my: 2, 
                      fontStyle: "italic", 
                      color: '#555', 
                      textAlign: { xs: 'center', md: 'left' }, // Center text on smaller screens
                      lineHeight: 1.6,
                      flex: 1
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Divider sx={{ width: '30%', my: 1.5, mx: { xs: 'auto', md: 0 } }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: "bold", 
                      textAlign: { xs: 'center', md: 'left' }, // Center text on smaller screens
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
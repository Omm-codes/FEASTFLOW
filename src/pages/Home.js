import React, { useMemo, useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";
import Banner from "../images/mm.jpg";
import "../styles/HomeStyles.css";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography, Grid, Paper, Container, Button } from "@mui/material";
import { MenuList } from "../data/data";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarIcon from '@mui/icons-material/Star';

// Function to get unique random items
const getRandomSpecials = (menu, count) => {
  const shuffled = [...menu].sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, Math.min(count, menu.length)); // Get 'count' unique items
};

const Home = () => {
  // Memoize today's specials to prevent unnecessary recalculations
  const todaysSpecials = useMemo(() => getRandomSpecials(MenuList, 3), []);
  
  // Offers for scrolling banner
  const offers = [
    "🔥 Special Offer: 20% off on your first order with code WELCOME20",
    "🚚 Free delivery on orders above $30",
    "🎁 Buy one get one free on selected items this weekend",
    "⏰ Limited time offer: Order within 30 minutes for express delivery"
  ];
  
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex(prevIndex => (prevIndex + 1) % offers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [offers.length]);

  // Popular categories
  const categories = [
    { name: "Lunch", image: "http://localhost:3000/static/media/paneer.f04d2c563fe596463e47.jpg" },
    { name: "Breakfast", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCBz6HYNpKyms3IzOB9uOYfGaOrcfATBWmVw&s" },
    { name: "Salads", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Desserts", image: "https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  return (
    <Layout>
      {/* Scrolling Offers Banner */}
      <div className="offers-scroll-container">
        <div className="offers-scroll-content">
          <p>{offers[currentOfferIndex]}</p>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="home" style={{ backgroundImage: `url(${Banner})` }}>
        <div className="headerContainer">
          <h1>Effortless Ordering</h1>
          <h1>Quick Service</h1>
          <h1>Delicious Bites!</h1>
          <p>Your Food Is Waiting For You</p>
          <Link to="/menu">
            <button aria-label="Order Now">ORDER NOW</button>
          </Link>
        </div>
      </div>

      {/* Today's Special Section - MOVED TO TOP */}
      <Box sx={{ py: 8, textAlign: "center", bgcolor: "#f9f9f9" }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold", 
            mb: 4,
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "2rem", md: "2.5rem" }
          }}
        >
          Today's Specials
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {todaysSpecials.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.name}>
              <Card sx={{ maxWidth: 345, mx: "auto" }} className="special-card">
                <CardActionArea component={Link} to="/menu" aria-label={`View details of ${item.name}`}>
                  <div className="card-badge">Special</div>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      component="div"
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "0.95rem",
                        lineHeight: 1.6
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button 
          component={Link} 
          to="/menu" 
          variant="contained" 
          className="view-all-btn" 
          sx={{ mt: 5 }}
        >
          View Full Menu
        </Button>
      </Box>

      {/* Categories Section - MOVED TO TOP */}
      <Container maxWidth="lg">
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              mb: 4,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.3rem" }
            }}
          >
            Popular Categories
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={6} sm={3} key={category.name}>
                <Link to="/menu" className="category-link">
                  <div className="category-card">
                    <img src={category.image} alt={category.name} />
                    <h3>{category.name}</h3>
                  </div>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* How It Works Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              mb: 5,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.3rem" }
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <div className="how-it-works-step">
                <div className="step-icon">
                  <RestaurantIcon fontSize="large" />
                </div>
                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>1. Choose Your Food</Typography>
                <Typography>Browse our menu and select your favorite dishes</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="how-it-works-step">
                <div className="step-icon">
                  <AccessTimeIcon fontSize="large" />
                </div>
                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>2. Quick Preparation</Typography>
                <Typography>Our chefs prepare your order with fresh ingredients</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="how-it-works-step">
                <div className="step-icon">
                  <LocalShippingIcon fontSize="large" />
                </div>
                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>3. Fast Delivery</Typography>
                <Typography>Enjoy your meal at home or pick up from our restaurant</Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, textAlign: "center", bgcolor: "#f9f9f9" }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              mb: 5,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.3rem" }
            }}
          >
            What Our Customers Say
          </Typography>
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
                <Paper className="testimonial-card">
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} fontSize="small" />
                    ))}
                  </div>
                  <Typography sx={{ my: 2, fontStyle: "italic" }}>"{testimonial.comment}"</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>- {testimonial.name}</Typography>
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
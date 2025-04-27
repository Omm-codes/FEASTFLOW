import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import "../styles/HomeStyles.css";
import Banner from "../images/mm.jpg";
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

const bannerImagePath = Banner;

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
  padding: "0 15px",
  animation: "smoothScroll 15s linear infinite"
};

const heroStyle = {
  backgroundImage: `url(${bannerImagePath})`,
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
      {/* Offers Scroll Section */}
      <div className="offers-scroll-container" style={{
        background: "linear-gradient(135deg, #f9f7f4 0%, #fff5e6 100%)",
        color: "#552a0f",
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        borderBottom: "2px solid #ffd54f",
        position: "relative",
        borderRadius: "0 0 8px 8px"
      }}>
        {/* Decorative food icons */}
        <div style={{
          position: "absolute",
          left: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.1,
          fontSize: "24px",
          display: { xs: "none", md: "block" }
        }}>
          🍽️
        </div>
        <div style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.1,
          fontSize: "24px",
          display: { xs: "none", md: "block" }
        }}>
          🍴
        </div>
        
        <div className="offers-scroll-content" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 15px",
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <Box 
            component="span" 
            sx={{ 
              mr: 2.5, 
              backgroundColor: "#ffd54f",
              color: "#552a0f",
              px: 1.8,
              py: 0.6,
              fontSize: "0.8rem",
              fontWeight: "bold",
              borderRadius: "4px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                right: "-8px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid #ffd54f"
              }
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
              letterSpacing: "0.3px",
              animation: "fadeInOut 1s ease-in-out",
              display: "flex",
              alignItems: "center",
              "@keyframes fadeInOut": {
                "0%": { opacity: 0.5, transform: "translateY(5px)" },
                "100%": { opacity: 1, transform: "translateY(0)" }
              }
            }}
          >
            {offers[currentOfferIndex]}
          </Typography>
        </div>
        
        {/* Animated gradient accent line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: "100%",
          background: "linear-gradient(90deg, transparent, #ffd54f, transparent)",
          backgroundSize: "200% 100%",
          animation: "movingGradient 8s linear infinite",
        }}></div>
        
        <style>{`
          @keyframes movingGradient {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>
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
              backgroundColor: "#ffd54f",
              color: "#552a0f",
              padding: "12px 24px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
              fontFamily: "'Poppins', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#ffca28"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#ffd54f"}
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
    position: 'relative',
    background: "linear-gradient(135deg, #f9f7f4 0%, #fff5e6 100%)",
    borderTop: '1px solid #eaeaea',
    overflow: 'hidden'
}}>
    {/* Decorative elements */}
    <Box sx={{
        position: 'absolute',
        top: -20,
        left: -20,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'rgba(255, 213, 79, 0.15)',
        zIndex: 0
    }}/>
    <Box sx={{
        position: 'absolute',
        bottom: 30,
        right: '10%',
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(85, 42, 15, 0.08)',
        zIndex: 0
    }}/>
    
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
            <Box sx={{
                background: '#552a0f',
                color: 'white',
                transform: 'rotate(-2deg)',
                px: 3,
                py: 1.5,
                mb: 3,
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #552a0f'
                }
            }}>
                <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: 2 }}>
                    CHEF'S SELECTION
                </Typography>
            </Box>
            
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "800",
                    fontFamily: "'Playfair Display', serif",
                    color: '#552a0f',
                    position: 'relative',
                    display: 'inline-block',
                    mb: 1,
                    textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
                }}
            >
                Today's Specials
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" sx={{ 
                maxWidth: '700px',
                mb: 4
            }}>
                Handcrafted with fresh ingredients and culinary expertise. 
                Our chef recommends these delightful dishes for your perfect meal.
            </Typography>
        </Box>
        
        {/* Carousel Implementation */}
        <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={4000}
            pauseOnHover={true}
            className="specials-slider"
            responsive={[
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]}
        >
            {todaysSpecials.map((item) => (
                <Box key={item.name} sx={{ px: 2, pb: 3 }}>
                    <Card
                        sx={{
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease',
                            transform: 'perspective(1000px)',
                            height: '100%',
                            position: 'relative',
                            '&:hover': {
                                transform: 'perspective(1000px) translateY(-10px)',
                                boxShadow: '0 20px 40px rgba(85, 42, 15, 0.2)'
                            },
                            '&:hover .dish-image': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <CardMedia
                                className="dish-image"
                                component="img"
                                height="260"
                                image={item.image}
                                alt={item.name}
                                loading="lazy"
                                sx={{
                                    transition: 'transform 0.7s ease',
                                }}
                            />
                            <Box sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: '50%',
                                width: 60,
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                border: '2px solid #ffd54f'
                            }}>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>only</Typography>
                                <Typography sx={{ fontWeight: 800, color: '#552a0f' }}>₹{item.price}</Typography>
                            </Box>
                            {item.isBestSeller && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 0,
                                    backgroundColor: '#552a0f',
                                    color: 'white',
                                    padding: '5px 15px 5px 10px',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}>
                                    BEST SELLER
                                </Box>
                            )}
                        </Box>
                        
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ mb: 2 }}>
                                <Chip 
                                    size="small" 
                                    label={item.category} 
                                    sx={{ 
                                        background: 'rgba(85, 42, 15, 0.08)', 
                                        fontWeight: 500,
                                        color: '#552a0f',
                                        mb: 1
                                    }} 
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.3rem',
                                        color: '#333',
                                        fontFamily: "'Playfair Display', serif",
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                {item.description || "A delicious dish crafted with premium ingredients, bringing authentic flavors to your table."}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
                                {[...Array(Math.floor(Math.random() > 0.7 ? 5 : 4))].map((_, i) => (
                                    <StarIcon key={i} fontSize="small" sx={{ color: '#ffd54f' }} />
                                ))}
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({Math.floor(Math.random() * 150) + 50})
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Button
                                component={Link}
                                to="/menu"
                                variant="contained"
                                fullWidth
                                startIcon={<ShoppingBasketIcon />}
                                sx={{
                                    mt: 1,
                                    bgcolor: '#552a0f',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    py: 1.2,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: '#3e1e09',
                                    }
                                }}
                            >
                                Order Now
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Slider>
        
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Button
                component={Link}
                to="/menu"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{
                    color: "#552a0f",
                    borderColor: "#552a0f",
                    borderWidth: 2,
                    borderRadius: "30px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    py: 1,
                    px: 4,
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                        bgcolor: '#552a0f',
                        color: 'white',
                        borderColor: "#552a0f",
                        borderWidth: 2,
                    }
                }}
            >
                Explore Full Menu
            </Button>
        </Box>
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
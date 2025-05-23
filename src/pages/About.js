import React from "react";
import Layout from "./../components/Layout/Layout";
// Add Link import at the top
import { Link } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Container,
  Divider,
  Button
} from "@mui/material";
import { 
  FastfoodOutlined, 
  AccessTime, 
  Payment, 
  People, 
  Restaurant, 
  CleanHands, 
  EmojiEvents,
  LocalCafe
} from "@mui/icons-material";
import "../styles/AboutStyles.css";

// Define color variables to match site theme
const primaryColor = '#023047'; // Blue from header
const secondaryColor = '#219ebc'; // Lighter blue accent
const accentColor = '#f8f9fa'; // Light background
const highlightColor = '#ffb703'; // Yellow accent from header

const About = () => {
  const features = [
    {
      icon: <FastfoodOutlined sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Fresh Food",
      description: "We serve fresh, high-quality meals prepared daily by our expert chefs"
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Quick Service",
      description: "Pre-order your meals and skip the queue with our efficient service"
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Easy Payments",
      description: "Hassle-free digital payments for a seamless dining experience"
    },
    {
      icon: <People sx={{ fontSize: 40, color: primaryColor }} />,
      title: "User Friendly",
      description: "Simple and intuitive interface for students and faculty"
    }
  ];

  const values = [
    {
      icon: <Restaurant color="white"/>,
      title: "Quality",
      description: "We never compromise on the quality of ingredients or preparation methods."
    },
    {
      icon: <CleanHands color="white"/>,
      title: "Cleanliness",
      description: "Maintaining the highest standards of hygiene in our food service areas."
    },
    {
      icon: <EmojiEvents color="white"/>,
      title: "Excellence",
      description: "Striving to exceed expectations in every aspect of our service."
    },
    {
      icon: <LocalCafe color="white"/>,
      title: "Community",
      description: "Creating a welcoming environment for everyone on campus."
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <Box
        className="about-hero"
        sx={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1542181961-9590d0c79dab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80")',
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: "bold",
              color: "white",
              mb: 2,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              letterSpacing: "0.02em",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            About <span style={{ color: highlightColor }}>FeastFlow</span>
          </Typography>
          
          <Divider sx={{ 
            width: 100, 
            mx: "auto", 
            mb: 3, 
            borderColor: highlightColor, 
            borderWidth: 2 
          }} />
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: "white", 
              maxWidth: "800px", 
              mx: "auto", 
              px: 3,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
              textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
            }}
          >
            Your Digital Canteen Management Solution
          </Typography>
        </Box>
      </Box>

      {/* Mission Statement Banner */}
      <Box sx={{ 
        bgcolor: primaryColor, 
        py: 4,
        borderBottom: "5px solid "+ highlightColor
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              color: "white",
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.6
            }}
          >
            "Our mission is to revolutionize campus dining with technology that prioritizes 
            efficiency, quality, and community."
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: primaryColor,
                position: "relative",
                mb: 4,
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: 0,
                  width: "60px",
                  borderBottom: "3px solid "+ highlightColor
                }
              }}
            >
              Our Story
            </Typography>
            
            <Typography 
              paragraph
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "#555"
              }}
            >
              FeastFlow was born from a simple idea: make campus dining smarter and more efficient. 
              We understand the challenges of traditional canteen systems - long queues, 
              payment hassles, and limited menu visibility.
            </Typography>
            
            <Typography 
              paragraph
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "#555"
              }}
            >
              Our digital solution transforms the campus dining experience with real-time 
              menu updates, pre-ordering capabilities, and seamless digital payments. 
              We're committed to making your dining experience as enjoyable as the food itself.
            </Typography>
            
            <Typography 
              paragraph
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "#555"
              }}
            >
              Since our founding, we've been focused on solving the everyday challenges of 
              campus dining while maintaining the highest standards of food quality and service.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1542181961-9590d0c79dab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
              alt="Modern canteen" 
              sx={{ 
                width: "100%", 
                borderRadius: "12px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                transform: "rotate(2deg)",
                maxHeight: "400px",
                objectFit: "cover"
              }} 
            />
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Box sx={{ 
          mt: 10,
          mb: 6,
          py: 6,
          borderRadius: "16px", 
          backgroundColor: accentColor,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}>
          <Container>
            <Grid container spacing={3} justifyContent="center">
              {[
                { number: "1000+", label: "Daily Orders" },
                { number: "50+", label: "Menu Items" },
                { number: "99%", label: "Satisfied Users" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        color: primaryColor, 
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: "#666",
                        fontFamily: "'Poppins', sans-serif" 
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 10 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: primaryColor,
              mb: 5,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                borderBottom: "3px solid "+ highlightColor
              }
            }}
          >
            Why Choose FeastFlow?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: "100%", 
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    background: "white",
                    border: "1px solid #eaeaea",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(2, 48, 71, 0.15)"
                    }
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: "center", 
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        backgroundColor: "rgba(2, 48, 71, 0.08)",
                        borderRadius: "50%",
                        width: "80px",
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto"
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: primaryColor
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: "#666",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        flex: 1
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Our Values Section */}
        <Box sx={{ 
          mt: 8, 
          mb: 6, 
          py: 8,
          bgcolor: primaryColor,
          borderRadius: "16px",
          color: "white"
        }}>
          <Container>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: "white",
                mb: 5,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  borderBottom: "3px solid "+ highlightColor
                }
              }}
            >
              Our Core Values
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ 
                    textAlign: "center",
                    height: "100%"
                  }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: highlightColor, 
                        color: primaryColor,
                        width: 60,
                        height: 60,
                        mx: "auto",
                        mb: 2
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1.5,
                        color: highlightColor,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        
        {/* Call to Action */}
        <Box 
          sx={{ 
            mt: 10, 
            textAlign: "center",
            p: 6,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/images/banner.jpeg")',
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            borderRadius: "16px"
          }}
        >
          <Typography 
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              mb: 3,
              color: accentColor
            }}
          >
            Ready to Revolutionize Your Dining Experience?
          </Typography>
          <Typography 
            sx={{ 
              maxWidth: "700px", 
              mx: "auto", 
              mb: 4,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.1rem",
              color: accentColor
            }}
          >
            Join thousands of satisfied users who have transformed their campus dining experience with FeastFlow.
          </Typography>
          <Button 
            variant="contained"
            component={Link}
            to="/menu"
            sx={{ 
              bgcolor: highlightColor,
              color: "#000",
              py: 1.5,
              px: 4,
              borderRadius: "20px",
              fontSize: "1rem",
              textTransform: "none",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                bgcolor: "#ffaa00",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              }
            }}
          >
            Explore Our Menu
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default About;
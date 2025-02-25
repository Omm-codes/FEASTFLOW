import React from "react";
import Layout from "./../components/Layout/Layout";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { FastfoodOutlined, AccessTime, Payment, People } from "@mui/icons-material";
import "../styles/AboutStyles.css";

const About = () => {
  const features = [
    {
      icon: <FastfoodOutlined sx={{ fontSize: 40, color: "goldenrod" }} />,
      title: "Fresh Food",
      description: "We serve fresh, high-quality meals prepared daily by our expert chefs"
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: "goldenrod" }} />,
      title: "Quick Service",
      description: "Pre-order your meals and skip the queue with our efficient service"
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: "goldenrod" }} />,
      title: "Easy Payments",
      description: "Hassle-free digital payments for a seamless dining experience"
    },
    {
      icon: <People sx={{ fontSize: 40, color: "goldenrod" }} />,
      title: "User Friendly",
      description: "Simple and intuitive interface for students and faculty"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        className="about-hero"
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: "bold",
            color: "goldenrod",
            mb: 2 
          }}
        >
          About FeastFlow
        </Typography>
        <Typography variant="h6" sx={{ color: "white", maxWidth: "800px", mx: "auto", px: 3 }}>
          Your Digital Canteen Management Solution
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, px: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography className="section-title" variant="h4" gutterBottom>
              Our Story
            </Typography>
            <Typography paragraph>
              FeastFlow was born from a simple idea: make campus dining smarter and more efficient. 
              We understand the challenges of traditional canteen systems - long queues, 
              payment hassles, and limited menu visibility.
            </Typography>
            <Typography paragraph>
              Our digital solution transforms the campus dining experience with real-time 
              menu updates, pre-ordering capabilities, and seamless digital payments. 
              We're committed to making your dining experience as enjoyable as the food itself.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="src\images\logo.png"
              alt="Canteen"
              className="about-image"
              sx={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: 2
              }}
            />
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Typography 
            className="section-title"
            variant="h4" 
            textAlign="center" 
            gutterBottom 
          >
            Why Choose FeastFlow?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card">
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box className="feature-icon">
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ my: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default About;
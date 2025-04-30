import React from "react";
import { Box, Typography, Link, IconButton, Container, Divider, Grid } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#023047", // Updated to match Header theme
        color: "white",
        padding: { xs: 3, md: 4 },
        marginTop: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" sx={{ pb: 3 }}>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '40%',
                  height: '3px',
                  backgroundColor: '#ffb703',
                  bottom: '-8px',
                  left: { xs: '30%', md: 0 },
                }
              }}
            >
              FeastFlow
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>
              Delivering delicious meals with effortless ordering and quick service. Your favorite food is just a click away.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                mt: 2,
              }}
            >
              <IconButton 
                color="inherit" 
                aria-label="facebook" 
                href="https://www.facebook.com"
                sx={{
                  mr: 1,
                  transition: 'transform 0.2s',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffb703',
                    color: '#023047',
                    transform: 'scale(1.1)'
                  }
                }}
                size="small"
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="instagram" 
                href="https://www.instagram.com/om_chavan_003?igsh=OXM0dHdzb3Zya3Vq"
                sx={{
                  mr: 1,
                  transition: 'transform 0.2s',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffb703',
                    color: '#023047',
                    transform: 'scale(1.1)'
                  }
                }}
                size="small"
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="twitter" 
                href="https://www.twitter.com"
                sx={{
                  mr: 1,
                  transition: 'transform 0.2s',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffb703',
                    color: '#023047',
                    transform: 'scale(1.1)'
                  }
                }}
                size="small"
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="linkedin" 
                href="https://www.linkedin.com/in/om-chavan003/"
                sx={{
                  mr: 1,
                  transition: 'transform 0.2s',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffb703',
                    color: '#023047',
                    transform: 'scale(1.1)'
                  }
                }}
                size="small"
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '40%',
                  height: '3px',
                  backgroundColor: '#ffb703',
                  bottom: '-8px',
                  left: { xs: '30%', md: 0 },
                }
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Link 
                href="/menu" 
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.2s',
                  '&:hover': { 
                    color: '#ffb703',
                    textDecoration: 'none' 
                  }
                }}
              >
                Menu
              </Link>
              <Link 
                href="/about" 
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.2s',
                  '&:hover': { 
                    color: '#ffb703',
                    textDecoration: 'none' 
                  }
                }}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.2s',
                  '&:hover': { 
                    color: '#ffb703',
                    textDecoration: 'none' 
                  }
                }}
              >
                Contact
              </Link>
              <Link 
                href="/profile" 
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.2s',
                  '&:hover': { 
                    color: '#ffb703',
                    textDecoration: 'none' 
                  }
                }}
              >
                My Profile
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '40%',
                  height: '3px',
                  backgroundColor: '#ffb703',
                  bottom: '-8px',
                  left: { xs: '30%', md: 0 },
                }
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              justifyContent: { xs: 'center', md: 'flex-start' } 
            }}>
              <LocationOn fontSize="small" sx={{ mr: 1, color: '#ffb703' }}/>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                123 Main Street, Mumbai, Maharashtra
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              justifyContent: { xs: 'center', md: 'flex-start' } 
            }}>
              <Phone fontSize="small" sx={{ mr: 1, color: '#ffb703' }}/>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                +91 98765 43210
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' } 
            }}>
              <Email fontSize="small" sx={{ mr: 1, color: '#ffb703' }}/>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                info@feastflow.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 'auto', my: 2 }} />
        
        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
            &copy; {new Date().getFullYear()} FeastFlow. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            <Link 
              href="/privacy-policy" 
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { 
                  color: '#ffb703',
                  textDecoration: 'none' 
                }
              }}
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link 
              href="/terms-of-service" 
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { 
                  color: '#ffb703',
                  textDecoration: 'none' 
                }
              }}
            >
              Terms of Service
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
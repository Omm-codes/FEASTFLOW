import React from "react";
import { Box, Typography, Link, IconButton, Container, Divider } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#552a0f",
        color: "white",
        textAlign: "center",
        padding: { xs: 3, md: 4 },
        marginTop: 5,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <IconButton 
            color="inherit" 
            aria-label="facebook" 
            href="https://www.facebook.com"
            sx={{
              mx: 0.5,
              transition: 'transform 0.2s',
              '&:hover': {
                color: '#f9f7f4',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton 
            color="inherit" 
            aria-label="instagram" 
            href="https://www.instagram.com/om_chavan_003?igsh=OXM0dHdzb3Zya3Vq"
            sx={{
              mx: 0.5,
              transition: 'transform 0.2s',
              '&:hover': {
                color: '#f9f7f4',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton 
            color="inherit" 
            aria-label="twitter" 
            href="https://www.twitter.com"
            sx={{
              mx: 0.5,
              transition: 'transform 0.2s',
              '&:hover': {
                color: '#f9f7f4',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Twitter />
          </IconButton>
          <IconButton 
            color="inherit" 
            aria-label="linkedin" 
            href="https://www.linkedin.com/in/om-chavan003/"
            sx={{
              mx: 0.5,
              transition: 'transform 0.2s',
              '&:hover': {
                color: '#f9f7f4',
                transform: 'scale(1.1)'
              }
            }}
          >
            <LinkedIn />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', width: '50%', mx: 'auto', my: 2 }} />
        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
          &copy; {new Date().getFullYear()} FeastFlow. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
          <Link 
            href="/privacy-policy" 
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
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
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
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
        backgroundColor: "#232F3E",
        color: "white",
        textAlign: "center",
        padding: 3,
        marginTop: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <IconButton color="inherit" aria-label="facebook" href="https://www.facebook.com">
          <Facebook />
        </IconButton>
        <IconButton color="inherit" aria-label="instagram" href="https://www.instagram.com/om_chavan_003?igsh=OXM0dHdzb3Zya3Vq">
          <Instagram />
        </IconButton>
        <IconButton color="inherit" aria-label="twitter" href="https://www.twitter.com">
          <Twitter />
        </IconButton>
        <IconButton color="inherit" aria-label="linkedin" href="https://www.linkedin.com/in/om-chavan003/">
          <LinkedIn />
        </IconButton>
      </Box>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} FeastFlow. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/privacy-policy" color="inherit">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="/terms-of-service" color="inherit">
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;

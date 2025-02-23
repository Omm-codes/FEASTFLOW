import React from "react";
import Layout from "./../components/Layout/Layout";
import { Box, Typography } from "@mui/material";

const About = () => {
  return (
    <Layout>
      <Box
        sx={{
          my: 15,
          textAlign: "center",
          p: 2,
          "& h4": {
            fontWeight: "bold",
            my: 2,
            fontSize: "2rem",
          },
          "& p": {
            textAlign: "justify",
          },
        }}
      >
        <Typography variant="h4">About FeastFlow</Typography>
        <p>
          FeastFlow is a digital canteen management system that allows students
          and faculty to pre-order meals, track orders, and make hassle-free
          digital payments. We aim to streamline the canteen experience with
          real-time menu updates and seamless transactions.
        </p>
      </Box>
    </Layout>
  );
};

export default About;
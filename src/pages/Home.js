import React from "react";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";
import Banner from "../images/n.jpg";
import "../styles/HomeStyles.css";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { MenuList } from "../data/data";
import { styled } from "@mui/system";

const Home = () => {
  // Get 3 random items for today's special
  const todaysSpecials = [];
  const menuListCopy = [...MenuList]; // Create a copy to avoid modifying the original
  for (let i = 0; i < Math.min(3, MenuList.length); i++) {
    const randomIndex = Math.floor(Math.random() * menuListCopy.length);
    todaysSpecials.push(menuListCopy[randomIndex]);
    menuListCopy.splice(randomIndex, 1); // Remove the selected item to avoid duplicates
  }

  return (
    <Layout>
      <div className="home" style={{ backgroundImage: `url(${Banner})` }}>
        <div className="headerContainer">
          <h1>Effortless Ordering</h1>
          <h1>Quick Service</h1>
          <h1>Delicious Bites!</h1>
          <p>Your Food Is Waiting For You</p>
          <Link to="/menu">
            <button>ORDER NOW</button>
          </Link>
        </div>
      </div>

      {/* Today's Special Section */}
      <Box sx={{ py: 8, textAlign: "center" }}>
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
              <Card sx={{ maxWidth: "345px", mx: "auto" }}>
                <CardActionArea component={Link} to="/menu">
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
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
      </Box>
    </Layout>
  );
};

export default Home;

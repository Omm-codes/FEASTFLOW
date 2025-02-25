import React, { useContext } from "react";
import { MenuList } from "../data/data";
import Layout from "./../components/Layout/Layout";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  Divider,
} from "@mui/material";
import { CartContext } from "../context/cartContext";
import { styled } from "@mui/system";
import { AddShoppingCart } from "@mui/icons-material";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 20px rgba(218, 165, 32, 0.2)',
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #DAA520 30%, #FFD700 90%)',
  border: 0,
  borderRadius: 8,
  boxShadow: '0 3px 5px 2px rgba(218, 165, 32, .3)',
  color: 'white',
  padding: '8px 16px',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(45deg, #FFD700 30%, #DAA520 90%)',
  },
}));

const Menu = () => {
  const { cart, setCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#2C3E50',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Today's Menu
          </Typography>
          <Divider sx={{ maxWidth: 100, mx: 'auto', borderColor: 'goldenrod', borderWidth: 2, mb: 4 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: '#666',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Explore our delicious selection of dishes prepared with care
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {MenuList.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu.name}>
              <StyledCard>
                <CardActionArea>
                  <CardMedia
                    sx={{ 
                      height: 240,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '30%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                      }
                    }}
                    component="img"
                    image={menu.image}
                    alt={menu.name}
                  />
                </CardActionArea>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      color: '#2C3E50'
                    }}
                  >
                    {menu.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                      color: '#666',
                      lineHeight: 1.6
                    }}
                  >
                    {menu.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: 'goldenrod'
                      }}
                    >
                      ₹{menu.price}
                    </Typography>
                    <MenuButton
                      startIcon={<AddShoppingCart />}
                      onClick={() => handleAddToCart(menu)}
                    >
                      Add to Cart
                    </MenuButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Menu;
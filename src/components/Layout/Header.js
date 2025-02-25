import React, { useState, useContext } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  ContactMail as ContactMailIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import Logo from "../../images/logo.png";
import "../../styles/HeaderStyles.css";
import { CartContext } from "../../context/cartContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart } = useContext(CartContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      link: "/",
      name: "Home",
      icon: <HomeIcon />,
    },
    {
      link: "/menu",
      name: "Menu",
      icon: <MenuBookIcon />,
    },
    {
      link: "/myorders",
      name: "My Orders",
      icon: (
        <Badge badgeContent={cart.length} color="primary">
          <ShoppingCartIcon />
        </Badge>
      ),
    },
    {
      link: "/about",
      name: "About",
      icon: <InfoIcon />,
    },
    {
      link: "/contact",
      name: "Contact",
      icon: <ContactMailIcon />,
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, my: 2, color: "goldenrod" }}
      >
        <RestaurantIcon sx={{ mr: 1 }} />
        
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.link}
              sx={{
                "&.active": {
                  color: "goldenrod",
                  backgroundColor: "rgba(218, 165, 32, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "goldenrod" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} sx={{ color: "black" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box>
        <AppBar
          component="nav"
          sx={{
            bgcolor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: "none" }, color: "black" }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              src={Logo}
              alt="logo"
              height="50px"
              sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: "goldenrod",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <RestaurantIcon sx={{ mr: 1, display: { xs: "block", sm: "none" } }} />
              
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {menuItems.map((item) => (
                <NavLink key={item.name} to={item.link} className="navigation-link">
                  {item.name}
                </NavLink>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
                bgcolor: "white",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box>
          <Toolbar />
        </Box>
      </Box>
    </>
  );
};

export default Header;
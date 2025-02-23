import React, { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Logo from "../../images/logo.png";

import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import "../../styles/HeaderStyles.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle menu click
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Menu drawer
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", bgcolor: "white" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, my: 2 }}>
        <img src={Logo} alt="logo" height="70" width="200" />
      </Typography>
      <Divider />
      <ul className="mobile-navigation">
        <li>
          <NavLink activeClassName="active" to={"/"} style={{ color: "black" }}>
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink to={"/menu"} style={{ color: "black" }}>
            MENU
          </NavLink>
        </li>
        <li>
          <NavLink to={"/about"} style={{ color: "black" }}>
            ABOUT
          </NavLink>
        </li>
        <li>
          <NavLink to={"/contact"} style={{ color: "black" }}>
            CONTACT
          </NavLink>
        </li>
      </ul>
    </Box>
  );

  return (
    <>
      <Box>
        <AppBar component={"nav"} sx={{ bgcolor: "white", boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              color="black"
              aria-label="open drawer"
              edge="start"
              sx={{
                mr: 2,
                display: { sm: "none" },
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src={Logo} alt="logo" height="70" width="250" />
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ul className="navigation-menu">
                <li>
                  <NavLink activeClassName="active" to={"/"} style={{ color: "black" }}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/menu"} style={{ color: "black" }}>
                    Menu
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/about"} style={{ color: "black" }}>
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/contact"} style={{ color: "black" }}>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "240px",
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
